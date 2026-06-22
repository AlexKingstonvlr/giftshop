#!/bin/bash
cd "$(dirname "$0")"
echo "Killing existing servers on port 5173..."
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
echo "Starting Vite server..."
npm run dev -- --open
