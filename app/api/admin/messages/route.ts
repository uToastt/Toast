import {
  db,
  failure,
  replyJson,
  requireAdmin,
} from "@/lib/contact-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const params = new URL(request.url).searchParams;

    const status =
      params.get("status") === "closed"
        ? "closed"
        : "open";

    const offset = Math.floor(
      Math.max(
        0,
        Math.min(
          100000,
          Number(params.get("offset")) || 0
        )
      )
    );

    const messages = await db(
      `contact_messages?select=*&status=eq.${status}` +
        `&order=created_at.desc&limit=50&offset=${offset}`
    );

    return replyJson({ messages });
  } catch (error) {
    return failure(error);
  }
}