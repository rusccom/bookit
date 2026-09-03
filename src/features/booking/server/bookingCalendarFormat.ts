export function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

export function foldCalendarLine(value: string) {
  const lines: string[] = [];
  let line = "";
  let size = 0;
  for (const char of value) {
    const bytes = Buffer.byteLength(char, "utf8");
    if (size + bytes > 75) {
      lines.push(line);
      line = " ";
      size = 1;
    }
    line += char;
    size += bytes;
  }
  return [...lines, line].join("\r\n");
}

export function formatCalendarTimestamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function bookingTimeToUtc(date: string, time: string) {
  return formatCalendarTimestamp(new Date(`${date}T${time}:00+03:00`));
}
