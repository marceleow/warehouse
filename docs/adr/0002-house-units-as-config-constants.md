# 0002: House Units as config constants

3 document tables instead of a polymorphic `transactions` table. Each document type (Material Receipt, Material Issue, Stock Adjustment) gets its own header table and line item table. Every foreign key is enforced at the database level.

House Units are defined as a TypeScript constant array, not stored in the database. Material Issues store the House Unit name as a plain string. No referential integrity for House Units — a name change does not retroactively update historical issues.

## Status

Accepted

## Context

House Units have a single field (name) and no CRUD in the application. They are selected from a fixed list when creating Material Issues. Two approaches were considered: a database table seeded at setup, or a config file.

## Decision

House Units live as a config constant in `lib/houseUnits.ts`. Material Issues reference them by string value, not foreign key.

## Consequences

- Simpler deployment — no seed step for House Units
- No referential integrity — a renamed House Unit won't update old Material Issues
- Historical issues preserve whatever name was current at creation time, which is actually desired behavior
- Adding/removing/renaming House Units requires a code change and redeploy
