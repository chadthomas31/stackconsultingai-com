# Migrations

These `.sql` files are **applied manually** via the Supabase SQL Editor. There is no migration runner (no Prisma, no Supabase CLI) wired up for this project.

## How to apply

1. Open https://supabase.com/dashboard → `stackconsultingai-com` project → **SQL Editor** → New query
2. Paste the contents of the migration file
3. Click **Run**

## Naming convention

`YYYYMMDD_short_description.sql` — sorted alphabetically, applied in order on a fresh DB.

Older files use a different prefix (`001_create_tools_tables.sql`); keep new ones on the date prefix.

## Symptoms of a forgotten migration

If the app throws `Could not find the 'X' column of 'Y' in the schema cache`, a migration was committed but not applied. Find the SQL file that adds column X to table Y, paste it into the SQL Editor, run it, retry.

## Workflow when adding a new migration

1. Write the SQL file in this directory
2. **Apply it to Supabase before pushing the code that depends on it** — otherwise the deploy works locally but breaks in production
3. Commit both the migration file and the dependent code together
