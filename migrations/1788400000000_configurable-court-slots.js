export const shorthands = undefined;

export const up = (pgm) => pgm.sql(`
  ALTER TABLE bookable_units
    DROP CONSTRAINT bookable_units_slot_minutes_check,
    ADD CONSTRAINT bookable_units_slot_minutes_check CHECK (slot_minutes IN (30, 60, 120));
`);

export const down = (pgm) => pgm.sql(`
  UPDATE bookable_units SET slot_minutes = 30;
  ALTER TABLE bookable_units
    DROP CONSTRAINT bookable_units_slot_minutes_check,
    ADD CONSTRAINT bookable_units_slot_minutes_check CHECK (slot_minutes = 30);
`);
