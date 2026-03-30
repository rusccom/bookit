import { NextResponse } from "next/server";

import { getDb } from "@/features/database/server/client";
import {
  isAiConfigured,
  isSmsConfigured,
  isTelegramConfigured
} from "@/features/shared/server/env";

export async function GET() {
  try {
    const sql = getDb();
    await sql`SELECT 1`;

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
