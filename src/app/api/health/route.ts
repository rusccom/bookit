import { NextResponse } from "next/server";

import { initDatabase } from "@/features/database/server/initDatabase";
import {
  isAiConfigured,
  isSmsConfigured,
  isTelegramConfigured
} from "@/features/shared/server/env";

export async function GET() {
  try {
    await initDatabase();
    return NextResponse.json({
      aiConfigured: isAiConfigured(),
      smsConfigured: isSmsConfigured(),
      status: "ok",
      telegramConfigured: isTelegramConfigured()
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json(
      {
        error: message,
        status: "error"
      },
      { status: 500 }
    );
  }
}
