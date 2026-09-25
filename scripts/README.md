# MySQL scripts

| File                        | What it does                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `sql/01_schema.sql`         | Tables, indexes, foreign keys and the hourly event that purges expired refresh tokens.                                |
| `sql/02_data.sql`           | Data exported from MongoDB (users, profiles, live refresh tokens).                                                    |
| `migrate-mongo-to-mysql.ts` | Copies the data straight from MongoDB to MySQL. Applies the schema first and upserts by id, so re-running it is safe. |

Ids stay the original 24-char Mongo ids, so existing share links, sessions and client URLs keep working.

## Option A: Docker (easiest)

```sh
docker compose up -d        # mysql:8.4 on localhost:3306, db/user/password: zodiya
```

On first boot (empty volume) MySQL runs everything in `sql/` in name order, so the schema and data load automatically. To load it again from scratch:

```sh
docker compose down -v && docker compose up -d
```

## Option B: your own MySQL 8

```sh
mysql -u <user> -p <database> < scripts/sql/01_schema.sql
mysql -u <user> -p <database> < scripts/sql/02_data.sql
```

## Option C: migrate live from MongoDB

Set `MONGO_URI` and `DATABASE_URL` in `.env.development` (or export them), then:

```sh
npm run db:migrate-from-mongo
```

`MONGO_DB` picks the Mongo database when the URI has none (default `test`, where mongoose stored it).

## Re-exporting `02_data.sql`

```sh
docker exec zodiya-mysql mysqldump -uroot -proot --no-create-info --skip-triggers \
  --complete-insert --skip-extended-insert --skip-dump-date --no-tablespaces \
  --set-gtid-purged=OFF --skip-lock-tables zodiya users profiles refresh_tokens \
  > scripts/sql/02_data.sql
```

## Running the app against MySQL

`DATABASE_URL=mysql://zodiya:zodiya@localhost:3306/zodiya` in `.env.development`, then `npm run dev`.
Tests use `DATABASE_URL` from `.env.test` (e.g. `mysql://root:root@localhost:3306/zodiya_test`); jest recreates that database on every run.
