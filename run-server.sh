#!/bin/bash
# Persistent server runner for A-Star Infotech
# This script keeps the Next.js server running by automatically restarting it when it crashes

export DATABASE_URL="postgresql://neondb_owner:npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export ADMIN_PASSWORD="astar@2024"
cd /home/z/my-project

# Clean up any existing .next cache issues
rm -rf .next 2>/dev/null

RESTART_COUNT=0
MAX_RESTARTS=50

while [ $RESTART_COUNT -lt $MAX_RESTARTS ]; do
    echo "=== Starting Next.js server (attempt $((RESTART_COUNT+1))) ===" >> /tmp/nextjs-runner.log
    date >> /tmp/nextjs-runner.log
    
    node node_modules/.bin/next dev -p 3000 --webpack 2>&1 | tee -a /tmp/nextjs-runner.log
    
    EXIT_CODE=$?
    echo "=== Server exited with code $EXIT_CODE ===" >> /tmp/nextjs-runner.log
    date >> /tmp/nextjs-runner.log
    
    RESTART_COUNT=$((RESTART_COUNT+1))
    
    # Don't restart immediately if the server crashed quickly
    sleep 5
done

echo "=== Max restarts reached, stopping ===" >> /tmp/nextjs-runner.log
