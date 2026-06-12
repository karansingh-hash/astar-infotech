#!/bin/bash
while true; do
  cd /home/z/my-project
  npx next dev -p 3000 2>&1 | tee -a dev.log
  echo "Server died, restarting in 3s..." >> dev.log
  sleep 3
done
