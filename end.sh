#!/bin/bash

# WOI On-Prem Mockup - End/Stop Script
# This script stops the development server running on port 5173

PORT=5175

echo "🛑 Stopping WOI On-Prem Mockup..."

# Find process running on port 5173
PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
    echo "ℹ️  No process found running on port $PORT"
    echo "✅ Environment is clean"
else
    echo "🔍 Found process $PID running on port $PORT"
    echo "qh  Killing process..."
    kill -9 $PID
    
    # Wait a moment and verify
    sleep 1
    
    # Check if process is still running
    if lsof -ti:$PORT > /dev/null 2>&1; then
        echo "❌ Failed to stop the server"
        exit 1
    else
        echo "✅ Server stopped successfully"
        echo "🧹 Cleanup complete"
    fi
fi
