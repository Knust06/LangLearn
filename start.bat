@echo off
setlocal

cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm was not found in PATH.
    echo Install Node.js or reopen the terminal after installing it.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
)

if not exist "data.db" (
    echo Seeding database...
    call npm run db:seed
    if errorlevel 1 (
        echo ERROR: Failed to seed database.
        pause
        exit /b 1
    )
)

echo.
echo   Lang Learning
echo   Frontend + API: http://localhost:5173
echo.

call npm run dev

endlocal