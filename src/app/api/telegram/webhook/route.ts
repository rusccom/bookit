import { NextResponse } from "next/server";

import { handleTelegramWebhook } from "@/features/telegram/server/webhookService";

export async function POST(request: Request) {
  try {
    const update = await request.json();
    await handleTelegramWebhook({
      headers: request.headers,
      update
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message, ok: false }, { status: 500 });
  }
}
