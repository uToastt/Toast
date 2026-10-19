import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  rateKey,
  validPasswordHash,
  verifySession,
} from "./contact-core";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new HttpError(
      503,
      "This feature is waiting for site setup. Please try again later."
    );
  }

  return value;
}

export function adminConfig() {
  const secret = required("ADMIN_SESSION_SECRET");
  const hash = required("ADMIN_PASSWORD_HASH");

  if (secret.length < 32 || !validPasswordHash(hash)) {
    throw new HttpError(
      503,
      "Admin access is waiting for site setup."
    );
  }

  return {
    secret,
    hash,
    username: process.env.ADMIN_USERNAME || "Taostt",
  };
}

export const cookieName =
  process.env.NODE_ENV === "production"
    ? "__Host-toast_admin"
    : "toast_admin";

export async function requireAdmin() {
  const { secret, hash } = adminConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value || "";

  if (!verifySession(token, secret, hash)) {
    throw new HttpError(401, "Please sign in to continue.");
  }
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;

  if (origin !== expectedOrigin) {
    throw new HttpError(
      403,
      "Please submit this form from this website."
    );
  }
}

export async function jsonBody(
  request: Request,
  limit = 30000
): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new HttpError(
      415,
      "Please submit the website form."
    );
  }

  const contentLength = Number(
    request.headers.get("content-length") || 0
  );

  if (contentLength > limit) {
    throw new HttpError(413, "The message is too long.");
  }

  const reader = request.body?.getReader();

  if (!reader) {
    throw new HttpError(400, "Missing form data.");
  }

  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    size += value.length;

    if (size > limit) {
      await reader.cancel();

      throw new HttpError(
        413,
        "The message is too long."
      );
    }

    chunks.push(value);
  }

  try {
    const value = JSON.parse(
      Buffer.concat(chunks).toString("utf8")
    );

    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value)
    ) {
      throw new Error("Invalid data");
    }

    return value;
  } catch {
    throw new HttpError(400, "Invalid form data.");
  }
}

function mergeHeaders(
  base: Record<string, string>,
  extra?: HeadersInit
): Headers {
  const result = new Headers(base);

  new Headers(extra).forEach((value, key) => {
    result.set(key, value);
  });

  return result;
}

export async function db<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = required("SUPABASE_URL").replace(/\/$/, "");
  const key = required("SUPABASE_SECRET_KEY");

  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
  };

  // Supports older Supabase service-role keys too.
  if (!key.startsWith("sb_secret_")) {
    headers.Authorization = `Bearer ${key}`;
  }

  const response = await fetch(
    `${url}/rest/v1/${path}`,
    {
      ...options,
      headers: mergeHeaders(headers, options.headers),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!response.ok) {
    throw new HttpError(
      503,
      "The inbox is temporarily unavailable. Please try again later."
    );
  }

  const text = await response.text();

  return (text ? JSON.parse(text) : null) as T;
}

export async function rateLimit(
  request: Request,
  scope: string,
  max: number,
  seconds: number
) {
  const secret = required("ADMIN_SESSION_SECRET");

  // Vercel supplies the trusted client address.
  const ip = process.env.VERCEL
    ? request.headers
        .get("x-vercel-forwarded-for")
        ?.split(",")[0]
        ?.trim() || "unknown"
    : "local";

  const allowed = await db<boolean>(
    "rpc/toast_consume_limit",
    {
      method: "POST",
      body: JSON.stringify({
        p_key: rateKey(`${scope}:${ip}`, secret),
        p_limit: max,
        p_seconds: seconds,
      }),
    }
  );

  if (!allowed) {
    throw new HttpError(
      429,
      "Too many attempts. Please wait a while and try again."
    );
  }
}

export function replyJson(
  value: unknown,
  status = 200
) {
  return NextResponse.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function failure(error: unknown) {
  if (error instanceof HttpError) {
    return replyJson(
      { error: error.message },
      error.status
    );
  }

  return replyJson(
    {
      error:
        "Something went wrong. Please try again later.",
    },
    503
  );
}