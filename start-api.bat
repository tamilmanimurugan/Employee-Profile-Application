@echo off
echo Killing any process on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000 " 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo Starting Employee Profile API...
cd /d "%~dp0api\EmployeeProfile.Api"
dotnet run
