import { NextResponse } from "next/server";

import { syncYoutubeSessionStatuses } from "@/lib/services/youtube/session-status-sync";

export const dynamic = "force-dynamic";

const CRON_SECRET_ENV = "YOUTUBE_SYNC_CRON_SECRET";

function isAuthorized(request: Request): boolean {
  const expectedSecret = process.env[CRON_SECRET_ENV]?.trim();

  if (!expectedSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  return authorization === `Bearer ${expectedSecret}`;
}

async function handleSync(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        error: "No autorizado.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const summary = await syncYoutubeSessionStatuses();

    return NextResponse.json(
      {
        ok: true,
        summary,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("[youtube-sync][CRON]", error);

    return NextResponse.json(
      {
        error: "No se ha podido sincronizar el estado de YouTube.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}
