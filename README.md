# Baby Sign app

## Initial setup

Install dependencies:

```bash
pnpm install
```

Create dotenv file and add database connection:

```bash
cp .env.example .env
sed -i '' 's/DATABASE_URL=/DATABASE_URL={YOUR_DB_CONNECTION_URL}/' .env
```

Connect to database and run migrations:

```bash
pnpm db:migrate
```

## Developing

- `/src/lib` contains the database schema and components

- `/src/routes` contains the application files

Start development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

Start Drizzle Studio server:

```bash
pnpm db:studio
```

## Building

Create production version of app:

```bash
pnpm run build

# or start the server and open the app in a new browser tab
pnpm run preview
```
