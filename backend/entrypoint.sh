#!/bin/sh

echo "⏳ Waiting for Postgres at $DATABASE_URL..."

# Wait for Postgres to be ready (simple loop with nc)
until nc -z -v -w30 db 5432; do
    echo "🔁 Waiting for database connection..."
    sleep 2
done

echo "✅ Database is up! Running migrations..."
pnpm run migrate-up

echo "🚀 Starting the app..."
pnpm start
