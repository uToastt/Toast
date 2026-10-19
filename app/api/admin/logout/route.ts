import { cookies } from "next/headers";

import {
  cookieName,
  failure,
  replyJson,
  sameOrigin,
} from "@/lib/contact-server";

export async function POST(request: Request) {
  try {
    sameOrigin(request);

    const cookieStore = await cookies();

    cookieStore.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return replyJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}