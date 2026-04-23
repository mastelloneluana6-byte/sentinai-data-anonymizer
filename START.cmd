@echo off
chcp 65001 >nul
title SentinAI — start
cd /d "%~dp0"

echo.
echo  === SentinAI ===
echo  Er openen TWEE zwarte vensters: API en website.
echo  Laat ze OPEN staan. Sluit ze niet.
echo.

REM Venster 1: API (poort 9123)
start "SentinAI-API" cmd /k powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"

REM Even wachten zodat de API kan starten
timeout /t 5 /nobreak >nul

REM Venster 2: Next.js (poort 3100)
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3100" ^| findstr "LISTENING"') do (
    taskkill /PID %%p /F >nul 2>&1
)

if not exist "%~dp0frontend\node_modules" (
    echo Eerste keer: npm install in frontend...
    pushd "%~dp0frontend"
    call npm.cmd install
    popd
)

if exist "%~dp0frontend\.next" (
    rmdir /s /q "%~dp0frontend\.next"
)

REM Stable mode: build + start is more reliable than dev on OneDrive
start "SentinAI-WEB" /D "%~dp0frontend" cmd /k "set NEXT_DISABLE_FS_CACHE=1 && npm.cmd run build && npm.cmd run start"

echo.
echo  Klaar. Open in je browser:
echo    http://localhost:3100
echo.
echo  API-testpagina:
echo    http://127.0.0.1:9123/docs
echo.
echo  Werkt het niet? Kijk in de twee vensters naar rode fouttekst.
echo.
pause
