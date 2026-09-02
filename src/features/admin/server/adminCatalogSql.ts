const CATALOG_SOURCE = `
  FROM bookable_units u
  JOIN venues v ON v.id = u.venue_id
  JOIN providers p ON p.id = v.provider_id
  JOIN app_users o ON o.id = p.owner_user_id
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::INT AS days FROM availability_rules r
    WHERE r.unit_id = u.id AND r.end_minutes - r.start_minutes >= u.slot_minutes
  ) schedule ON TRUE
`;

export const ADMIN_CATALOG_QUERY = `
  SELECT u.id AS unit_id, u.title AS unit_title, u.is_active AS is_unit_active,
    u.slot_minutes, u.price_per_hour::TEXT, schedule.days AS scheduled_days,
    v.id AS venue_id, v.title AS venue_title, v.city, v.address,
    v.is_active AS is_venue_active, o.full_name AS owner_name, o.id AS owner_id
  ${CATALOG_SOURCE}
  WHERE ($1 = '' OR v.city ILIKE $1)
    AND ($2 = '' OR ($2 = 'active' AND v.is_active AND u.is_active)
      OR ($2 = 'inactive' AND (NOT v.is_active OR NOT u.is_active))
      OR ($2 = 'no_schedule' AND v.is_active AND u.is_active AND schedule.days = 0)
      OR ($2 = 'no_price' AND v.is_active AND u.is_active AND u.price_per_hour = 0))
    AND ($3 = '' OR u.title ILIKE $4 OR v.title ILIKE $4 OR o.full_name ILIKE $4 OR v.address ILIKE $4)
  ORDER BY v.city, v.title, u.title, u.id LIMIT 300
`;

export const ADMIN_CATALOG_ATTENTION_QUERY = `
  SELECT COUNT(*) FILTER (WHERE schedule.days = 0)::INT AS no_schedule,
    COUNT(*) FILTER (WHERE u.price_per_hour = 0)::INT AS no_price
  ${CATALOG_SOURCE}
  WHERE u.is_active AND v.is_active
`;
