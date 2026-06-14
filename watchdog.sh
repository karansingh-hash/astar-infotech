#!/bin/bash
while true; do
  if ! curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    echo "$(date): Restarting server..." >> /home/z/my-project/watchdog.log
    pkill -f "next start" 2>/dev/null
    sleep 2
    cd /home/z/my-project
    export DATABASE_URL="postgresql://neondb_owner:npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    export ADMIN_PASSWORD="astar@2024"
    nohup node node_modules/.bin/next start --port 3000 > /home/z/my-project/dev.log 2>&1 &
    sleep 5
  fi
  sleep 5
done
