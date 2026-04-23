# Start de FastAPI-server vanuit de juiste map.
# Run vanaf de projectroot:
#   powershell -ExecutionPolicy Bypass -File .\start-server.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
$ServerDir = Join-Path $RepoRoot "server"

if (-not (Test-Path -LiteralPath $ServerDir)) {
    Write-Error "Map 'server' niet gevonden naast dit script: $ServerDir"
}

Set-Location -LiteralPath $ServerDir

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    Write-Error "Python niet gevonden. Installeer Python en heropen de terminal."
}

$venvPython = Join-Path $ServerDir ".venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $venvPython)) {
    Write-Host "Virtuele omgeving aanmaken..." -ForegroundColor Cyan
    python -m venv .venv
}

Write-Host "Dependencies installeren..." -ForegroundColor Cyan
& $venvPython -m pip install -q -U pip
& $venvPython -m pip install -q -r requirements.txt

$envExample = Join-Path $ServerDir ".env.example"
$envFile = Join-Path $ServerDir ".env"
if (-not (Test-Path -LiteralPath $envFile) -and (Test-Path -LiteralPath $envExample)) {
    Write-Host "Geen server\.env: kopieer .env.example naar .env en vul OPENAI_API_KEY in." -ForegroundColor Yellow
}

# 8010/8000 are often blocked on Windows (WinError 10013). Override if needed:
#   $env:SENTINAI_API_PORT="9123"; powershell ... .\start-server.ps1
if ($env:SENTINAI_API_PORT) {
    $port = [int]$env:SENTINAI_API_PORT
} else {
    $port = 9123
}
Write-Host "API: http://127.0.0.1:$port/docs" -ForegroundColor Green
Write-Host "Zet frontend/.env.development op dezelfde poort (SENTINAI_API_ORIGIN)." -ForegroundColor DarkGray

# Clear any stale listener on the same port before starting.
$listenLine = netstat -ano | Select-String "LISTENING" | Select-String ":$port" | Select-Object -First 1
if ($listenLine) {
    $existingPid = (($listenLine -split "\s+") | Select-Object -Last 1)
    if ($existingPid -match "^\d+$") {
        Write-Host "Stopping stale API process on port $port (PID $existingPid)..." -ForegroundColor Yellow
        taskkill /PID $existingPid /F | Out-Null
        Start-Sleep -Seconds 1
    }
}

# Use stable mode on Windows: no reload watcher to avoid intermittent socket issues.
& $venvPython -m uvicorn main:app --host 127.0.0.1 --port $port

