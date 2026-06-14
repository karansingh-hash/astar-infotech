#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="postgresql://neondb_owner:npg_Xuv8IFwdHAD9@ep-fancy-cherry-ao91sgv7-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
export ADMIN_PASSWORD="astar@2024"
while true; do
  if ! curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    echo "$(date): Server down, restarting..." >> /home/z/my-project/watchdog.log
    pkill -f "next dev" 2>/dev/null
    sleep 2
    nohup bun run dev > /home/z/my-project/dev.log 2>&1 &
    sleep 8
  fi
  sleep 10
done
