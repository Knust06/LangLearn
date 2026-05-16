#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Install deps if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Seed the DB explicitly on first run (hooks.server.ts also does this at runtime,
# but running it here gives immediate feedback before the server starts)
if [ ! -f "data.db" ]; then
  echo "Seeding database..."
  npm run db:seed
fi

echo ""
echo "  Lang Learning"
echo "  Frontend + API: http://localhost:5173"
echo ""

npm run dev
