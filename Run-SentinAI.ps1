# Start SentinAI: API in een nieuw venster + Next.js in dit venster (poort 3100).
# Dubbelklik of run vanuit de projectmap:
#   powershell -ExecutionPolicy Bypass -File .\Run-SentinAI.ps1

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$ApiScript = Join-Path $Root "start-server.ps1"

if (-not (Test-Path -LiteralPath $ApiScript)) {
    Write-Error "start-server.ps1 niet gevonden in: $Root"
}

Write-Host ""
Write-Host "=== SentinAI ===" -ForegroundColor Magenta
Write-Host "1) API start in een NIEUW PowerShell-venster (poort 9123)" -ForegroundColor Cyan
Write-Host "2) Daarna start hier de website op http://localhost:3100" -ForegroundColor Cyan
Write-Host ""

Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", $ApiScript
) | Out-Null

Start-Sleep -Seconds 3

$Frontend = Join-Path $Root "frontend"
if (-not (Test-Path -LiteralPath $Frontend)) {
    Write-Error "frontend map niet gevonden: $Frontend"
}

Set-Location -LiteralPath $Frontend

if (-not (Test-Path -LiteralPath "node_modules")) {
    Write-Host "Eerste keer: npm.cmd install..." -ForegroundColor Yellow
    npm.cmd install
}

if (Test-Path -LiteralPath ".next") {
    Remove-Item ".next" -Recurse -Force
}

Write-Host ""
Write-Host "Open nu in je browser: http://localhost:3100" -ForegroundColor Green
Write-Host ""

# Stable mode: production start is more reliable in OneDrive folders.
npm.cmd run build
npm.cmd run start
