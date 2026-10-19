import { NextResponse } from "next/server";
import { validPasswordHash } from "@/lib/contact-core";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      SUPABASE_URL: Boolean(
        process.env.SUPABASE_URL
      ),

      SUPABASE_SECRET_KEY: Boolean(
        process.env.SUPABASE_SECRET_KEY
      ),

      ADMIN_PASSWORD_HASH: validPasswordHash(
        process.env.ADMIN_PASSWORD_HASH || ""
      ),

      ADMIN_SESSION_SECRET:
        (process.env.ADMIN_SESSION_SECRET || "")
          .length >= 32,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}