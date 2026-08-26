@echo off
setlocal EnableExtensions

cd /d "%~dp0"
title Agent Course Launcher

where npm >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js or npm was not found.
    echo Please install Node.js and try again.
    echo.
    pause
    exit /b 1
)

call :check_site
if not errorlevel 1 goto open_browser

echo Starting Agent Course...
start "Agent Course Dev Server" cmd /k "npm run dev"

echo Waiting for the website to be ready...
for /l %%I in (1,1,60) do (
    call :check_site
    if not errorlevel 1 goto open_browser
    timeout /t 1 /nobreak >nul
)

echo.
echo [ERROR] The website did not start within 60 seconds.
echo Check the Agent Course Dev Server window for details.
echo.
pause
exit /b 1

:open_browser
echo Opening Agent Course in your default browser...
start "" "http://localhost:3000/"
exit /b 0

:check_site
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/' -TimeoutSec 1; if ($response.StatusCode -eq 200) { exit 0 } } catch {}; exit 1" >nul 2>nul
exit /b %errorlevel%
