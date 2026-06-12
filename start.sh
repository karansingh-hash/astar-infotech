#!/bin/sh
set -e

echo "🚀 Starting A-Star Infotech Website..."

# Set default DATABASE_URL if not set
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="file:/app/data/production.db"
  echo "📦 Using default SQLite database: /app/data/production.db"
fi

# Run Prisma migrations (push schema to DB)
echo "📦 Running database migrations..."
npx prisma db push --skip-generate 2>/dev/null || echo "⚠️  Migration warning (may already be up to date)"

# Seed database if empty (first run only)
echo "🌱 Checking if database needs seeding..."
node /app/scripts/seed.js

# Start the Next.js server
echo "🌐 Starting server on port 3000..."
exec node server.js
