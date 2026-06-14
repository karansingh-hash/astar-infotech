#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="postgresql://neondb_owner:npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export ADMIN_PASSWORD="astar@2024"

while true; do
  echo "$(date): Starting server..." >> /home/z/my-project/server-monitor.log
  node node_modules/.bin/next start --port 3000 >> /home/z/my-project/dev.log 2>&1
  EXIT_CODE=$?
  echo "$(date): Server exited with code $EXIT_CODE, restarting in 3s..." >> /home/z/my-project/server-monitor.log
  sleep 3
done
