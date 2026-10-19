import { cookies } from "next/headers";

import {
  issueSession,
  verifyPassword,
} from "@/lib/contact-core";

import {
  adminConfig,
  cookieName,
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

    const { secret, hash, username } = adminConfig();

    await rateLimit(request, "login", 10, 900);

    const body = await jsonBody(request, 4000);

    if (
      typeof body.username !== "string" ||
      typeof body.password !== "string" ||
      body.username.length > 100 ||
      body.password.length > 256
    ) {
      throw new HttpError(
        401,
        "Incorrect username or password."
      );
    }

    const passwordMatches = verifyPassword(
      body.password,
      hash
    );

    if (
      !passwordMatches ||
      body.username !== username
    ) {
      throw new HttpError(
        401,
        "Incorrect username or password."
      );
    }

    const cookieStore = await cookies();

    cookieStore.set(
      cookieName,
      issueSession(secret, hash),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 28800,
      }
    );

    return replyJson({ ok: true });
  } catch (error) {
    return failure(error);
  }
}