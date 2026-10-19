import { validateContact } from "@/lib/contact-core";

import {
  db,
  failure,
  HttpError,
  jsonBody,
  rateLimit,
  replyJson,
  sameOrigin,
} from "@/lib/contact-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    sameOrigin(request);

    const body = await jsonBody(request);

    // Ignore submissions caught by the hidden spam field.
    if (
      typeof body.website === "string" &&
      body.website.trim()
    ) {
      return replyJson({ ok: true });
    }

    let input;

    try {
      input = validateContact(body);
    } catch (error) {
      throw new HttpError(
        400,
        error instanceof Error
          ? error.message
          : "Please check your message."
      );
    }

    // Allow five submissions per hour per client address.
    await rateLimit(request, "contact", 5, 3600);

    await db("contact_messages", {
      method: "POST",
      body: JSON.stringify(input),
    });

    return replyJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}