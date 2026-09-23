import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "upcytech-digital-card",
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
