#!/bin/bash
if [ -d "server" ]; then
  echo "Found server folder, entering..."
  cd server
fi

npm install
npx tsc