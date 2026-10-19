import {
  isUuid,
  textField,
} from "@/lib/contact-core";

import {
  db,
  failure,
  HttpError,
  jsonBody,
  replyJson,
  requireAdmin,
  required,
  sameOrigin,
} from "@/lib/contact-server";

export const runtime = "nodejs";

type Context = {
  params: Promise<{ id: string }>;
};

type Message = {
  id: string;
  email: string;
  subject: string;
  status: string;
};

type Reply = {
  id: string;
  message_id: string;
  body: string;
  status: string;
  created_at: string;
};

async function findMessage(id: string) {
  if (!isUuid(id)) {
    throw new HttpError(404, "Message not found.");
  }

  const rows = await db<Message[]>(
    `contact_messages?id=eq.${id}&select=*`
  );

  if (!rows[0]) {
    throw new HttpError(404, "Message not found.");
  }

  return rows[0];
}

export async function GET(
  _request: Request,
  context: Context
) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const message = await findMessage(id);

    const replies = await db<Reply[]>(
      `contact_replies?message_id=eq.${id}` +
        "&select=*&order=created_at.asc"
    );

    return replyJson({ message, replies });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(
  request: Request,
  context: Context
) {
  try {
    sameOrigin(request);
    await requireAdmin();

    const { id } = await context.params;

    await findMessage(id);

    const body = await jsonBody(request);

    if (
      body.status !== "open" &&
      body.status !== "closed"
    ) {
      throw new HttpError(
        400,
        "Choose open or closed."
      );
    }

    await db(`contact_messages?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: body.status,
      }),
    });

    return replyJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(
  request: Request,
  context: Context
) {
  try {
    sameOrigin(request);
    await requireAdmin();

    const { id } = await context.params;
    const message = await findMessage(id);

    if (message.status === "closed") {
      throw new HttpError(
        409,
        "Reopen this conversation before replying."
      );
    }

    const input = await jsonBody(request);

    let body: string;

    try {
      body = textField(
        input.body,
        "a reply",
        1,
        10000
      );
    } catch (error) {
      throw new HttpError(
        400,
        error instanceof Error
          ? error.message
          : "Please check your reply."
      );
    }

    if (!isUuid(input.requestId)) {
      throw new HttpError(
        400,
        "Invalid reply ID. Refresh the page and try again."
      );
    }

    const key = required("RESEND_API_KEY");
    const from = required("CONTACT_FROM_EMAIL");

    // Save before sending so retries reuse the same reply.
    await db("contact_replies?on_conflict=id", {
      method: "POST",
      headers: {
        Prefer: "resolution=ignore-duplicates",
      },
      body: JSON.stringify({
        id: input.requestId,
        message_id: id,
        body,
        status: "pending",
      }),
    });

    const records = await db<Reply[]>(
      `contact_replies?id=eq.${input.requestId}&select=*`
    );

    const record = records[0];

    if (
      !record ||
      record.message_id !== id ||
      record.body !== body
    ) {
      throw new HttpError(
        409,
        "This reply ID was already used. Refresh before composing a different reply."
      );
    }

    if (record.status === "sent") {
      return replyJson({ ok: true });
    }

    const age =
      Date.now() - Date.parse(record.created_at);

    if (age > 23 * 3600000) {
      throw new HttpError(
        409,
        "This earlier send needs checking in Resend before retrying."
      );
    }

    let response: Response;

    try {
      response = await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            "Idempotency-Key":
              `toast-reply-${record.id}`,
          },
          body: JSON.stringify({
            from,
            to: [message.email],
            subject: `Re: ${message.subject}`,
            text: body,
            ...(process.env.CONTACT_REPLY_TO_EMAIL
              ? {
                  reply_to:
                    process.env.CONTACT_REPLY_TO_EMAIL,
                }
              : {}),
          }),
          signal: AbortSignal.timeout(15000),
        }
      );
    } catch {
      throw new HttpError(
        503,
        "Delivery could not be confirmed. Retry this same reply to check it without sending a duplicate."
      );
    }

    if (!response.ok) {
      await db(
        `contact_replies?id=eq.${record.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "failed",
          }),
        }
      );

      throw new HttpError(
        503,
        "Email was not accepted. Check the Resend key and verified sender, then retry this reply."
      );
    }

    const sent = await response.json();

    await db(
      `contact_replies?id=eq.${record.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status: "sent",
          provider_id: sent.id,
        }),
      }
    );

    return replyJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}