/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

const upSql = `
ALTER TABLE bookable_units
  ADD COLUMN surface TEXT NOT NULL DEFAULT 'hard',
  ADD COLUMN description TEXT NOT NULL DEFAULT '',
  ADD COLUMN price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD CONSTRAINT bookable_units_price_check CHECK (price_per_hour >= 0),
  ADD CONSTRAINT bookable_units_surface_check CHECK (
    surface IN ('hard', 'clay', 'grass', 'artificial_grass', 'parquet', 'rubber', 'other')
  );

WITH duplicate_rules AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY unit_id, weekday
    ORDER BY created_at DESC, id DESC
  ) AS position
  FROM availability_rules
)
DELETE FROM availability_rules
WHERE id IN (SELECT id FROM duplicate_rules WHERE position > 1);

UPDATE availability_rules
SET start_minutes = ((start_minutes + 29) / 30) * 30,
    end_minutes = (end_minutes / 30) * 30;

DELETE FROM availability_rules
WHERE end_minutes - start_minutes < 30;

CREATE UNIQUE INDEX availability_rules_unit_weekday_idx
  ON availability_rules(unit_id, weekday);

ALTER TABLE availability_rules
  ADD CONSTRAINT availability_rules_half_hour_check
  CHECK (start_minutes % 30 = 0 AND end_minutes % 30 = 0);
`;

const downSql = `
ALTER TABLE availability_rules
  DROP CONSTRAINT IF EXISTS availability_rules_half_hour_check;

DROP INDEX IF EXISTS availability_rules_unit_weekday_idx;

ALTER TABLE bookable_units
  DROP CONSTRAINT IF EXISTS bookable_units_surface_check,
  DROP CONSTRAINT IF EXISTS bookable_units_price_check,
  DROP COLUMN IF EXISTS updated_at,
  DROP COLUMN IF EXISTS price_per_hour,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS surface;
`;

export const up = (pgm) => pgm.sql(upSql);

export const down = (pgm) => pgm.sql(downSql);
