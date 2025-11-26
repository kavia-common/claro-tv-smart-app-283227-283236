#!/bin/bash
cd /home/kavia/workspace/code-generation/claro-tv-smart-app-283227-283236/smart_tv_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

