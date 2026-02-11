#!/bin/bash

# WOI On-Prem Mockup - Start Script
# This script installs dependencies if needed and starts the dev server

PORT=5173
LOG_FILE="mockup.log"

echo "🚀 Starting WOI On-Prem Mockup Setup..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed."
        exit 1
    fi
    echo "✅ Dependencies installed."
fi

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port $PORT is already in use."
    echo "ℹ️  Server might be already running."
    exit 0
fi

echo "▶️  Starting development server..."
nohup npm run dev -- --port $PORT > "$LOG_FILE" 2>&1 &

echo "⏳ Waiting for server to initialize (this may take a few seconds)..."

# Wait loop (up to 20 seconds)
MAX_RETRIES=20
COUNT=0
SERVER_STARTED=false

while [ $COUNT -lt $MAX_RETRIES ]; do
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
        SERVER_STARTED=true
        break
    fi
    sleep 1
    COUNT=$((COUNT+1))
done

if [ "$SERVER_STARTED" = true ]; then
    PID=$(lsof -ti:$PORT)
    echo "✅ Server started successfully! (PID: $PID)"
    echo "📄 Output is being logged to $LOG_FILE"
    echo "🌐 Access the app at: http://localhost:$PORT"
else
    echo "❌ Failed to start server after $MAX_RETRIES seconds."
    echo "📄 Check $LOG_FILE for details."
    exit 1
fi
