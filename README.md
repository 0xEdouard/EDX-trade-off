## Prerequisites

- Docker & Docker Compose (for local containers)
- Node.js 20+

## Configuration

The application expects the following environment variables:

- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_SSL` (optional, set to `true` when your Postgres instance requires SSL)

Docker Compose provides these automatically. When running the app outside of Docker, export them in your shell before starting Next.js.

## Bootstrapping the Database

1. Start the services (the schema is applied automatically on the first run):

   ```bash
   docker compose up -d
   ```

2. If you need to re-run the schema manually (for example after dropping the database), use:

   ```bash
   cat db/schema.sql | docker compose exec -T db psql -U postgres -d edx
   ```

3. Insert your trader API credentials into the `"User"` table. Example snippet (replace the values):

   ```sql
   INSERT INTO "User" (id, name, api_key, api_secret, avatar)
   VALUES ('00000000-0000-0000-0000-000000000001', 'Trader One', 'BYBIT_KEY', 'BYBIT_SECRET', NULL);
   ```

   Records in `balenciaga` are created automatically by the balance updater script.

## Running the App

### Development (host machine)

Install dependencies and start Next.js:

```bash
npm install
npm run dev
```

### Production via Docker Compose

Docker Compose builds and serves the production build:

```bash
docker compose up --build
```

Traefik routing labels are already present; adjust hostnames to match your environment.

## Scheduled Balance Updates

`app/scripts/update-balances.ts` records the balance snapshot for every user. Run it with the same environment variables as the app, for example:

```bash
npx tsx app/scripts/update-balances.ts
```

The script closes the shared Postgres pool automatically when it completes.
