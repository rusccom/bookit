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
    return healthyResponse();
  } catch (error) {
    return unhealthyResponse(error);
  }
}

function healthyResponse() {
  return NextResponse.json({
    aiConfigured: isAiConfigured(), smsConfigured: isSmsConfigured(),
    status: "ok", telegramConfigured: isTelegramConfigured()
  });
}

function unhealthyResponse(error: unknown) {
  console.error("Health check failed", error);
  return NextResponse.json({ status: "error" }, { status: 500 });
}
