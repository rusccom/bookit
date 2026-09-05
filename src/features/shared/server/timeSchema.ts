import { z } from "zod";

export const halfHourTimeSchema = z.string().regex(
  /^(?:[01]\d|2[0-3]):(?:00|30)$/,
  "Время должно быть кратно 30 минутам"
);
