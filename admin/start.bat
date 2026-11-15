@echo off
start "Server" cmd /k "cd /d %~dp0server && nodemon server.js"
start "Bot" cmd /k "cd /d %~dp0server && nodemon serverBot.js"
start "Tunnel3000" cmd /k "cd /d C:\Users\HcH\Desktop && cloudflared.exe tunnel --protocol http2 --edge-ip-version 4 --url http://localhost:3000"
start "Tunnel3001" cmd /k "cd /d C:\Users\HcH\Desktop && cloudflared.exe tunnel --protocol http2 --edge-ip-version 4 --url http://localhost:3001"