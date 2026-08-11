@echo off
setlocal

cd /d "%~dp0"

where python >nul 2>&1
if not errorlevel 1 (
    set "TIME_GLITCH_PYTHON=python"
    goto :start_game
)

where py >nul 2>&1
if not errorlevel 1 (
    set "TIME_GLITCH_PYTHON=py"
    goto :start_game
)

echo.
echo Python was not found on this computer.
echo Install Python and enable "Add Python to PATH", then try again.
echo.
pause
exit /b 1

:start_game
echo Starting TIME GLITCH...
start "TIME GLITCH Server" /min %TIME_GLITCH_PYTHON% -m http.server 4173 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "http://localhost:4173/"
exit /b 0
