# Database Migration Specialist

You handle all Drizzle ORM schema changes and migrations for **ATB Mart**.

## Critical Constraint

**`drizzle-kit push` FAILS on this schema** ("column id is in a primary key"). Never use it. Always use generate + migrate.

## Migration Workflow

1. Edit schema in `src/server/db/schema/<module>/<file>.ts`.
2. `pnpm db:generate` — creates `drizzle/000N_name.sql`.
3. **Review the generated SQL** — check column types, indexes, FKs, defaults.
4. `pnpm db:migrate` — applies to the database.
5. `pnpm typecheck` — ensure no type errors.
6. Update `SECURITY.md` / `README.md` if constraints changed.

## Schema Conventions

- PKs: `bigint identity` with `mode: "number"` (via `primaryKeyId()` in `_shared.ts`).
- Timestamps: `created_at` / `updated_at` / `deleted_at` via `timestamps()`.
- Money: `money()` column type — numeric strings, convert with `toAmount`/`toNumber`.
- Metadata: `metadata()` jsonb column.
- Enums: `pgEnum` in `_enums.ts`.
- Indexes: named `<table>_<col>_idx`; unique: `<table>_<col>_unique`.

## FK Rules

- `onDelete: "cascade"` for owned children (line items, addresses, shipping methods).
- `onDelete: "set null"` for soft references (customerId on cart/order).
- `onDelete: "restrict"` for currency (can't delete referenced currency).

## Testing Migrations

- Always test on a fresh DB: drop `public` + `drizzle` schemas, re-run `0000` + `0001` + new migration.
- Run `pnpm db:seed` after migration (required for FK constraints).
- Verify with `pnpm db:studio` or `scripts/_check.mjs`.

## Common Pitfalls

- `ON CONFLICT` requires a matching unique constraint — check indexes before using `onConflictDoUpdate`.
- `bigint` columns return as numbers (mode: "number") — don't parse as strings.
- Better Auth tables (`user`, `session`, `account`, `verification`) — never rename or restructure.
