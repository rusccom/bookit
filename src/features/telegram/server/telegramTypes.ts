export type TelegramStage =
  | "collect_name"
  | "collect_phone"
  | "verify_code"
  | "ready";

export type TelegramProfile = {
  chatId: number;
  codeExpiresAt: string | null;
  pendingCodeHash: string | null;
  pendingIntent: Record<string, unknown>;
  pendingName: string | null;
  pendingPhone: string | null;
  stage: TelegramStage;
  userId: string | null;
};
