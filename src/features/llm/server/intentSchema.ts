import { z } from "zod";

export const bookingIntentSchema = z.object({
  action: z.enum(["availability", "book", "faq"]),
  city: z.string().nullable(),
  date: z.string().nullable(),
  durationMinutes: z.number().int().nullable(),
  endTime: z.string().nullable(),
  needsClarification: z.boolean(),
  clarificationQuestion: z.string().nullable(),
  responseText: z.string(),
  startTime: z.string().nullable(),
  venueQuery: z.string().nullable()
});

export type BookingIntent = z.infer<typeof bookingIntentSchema>;
