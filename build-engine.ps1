# Builds core/sentinai_engine on Windows.
# 1) If WinLibs MinGW is installed (winget), uses Ninja + GCC -> core/build_mingw
# 2) Else tries Visual Studio generators -> core/build
#
# Run from repo root:
#   powershell -ExecutionPolicy Bypass -File .\build-engine.ps1

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
$CoreDir = Join-Path $RepoRoot "core"
$BuildDirVs = Join-Path $CoreDir "build"
$BuildDirMingw = Join-Path $CoreDir "build_mingw"

$cmakeCandidates = @(
    "${env:ProgramFiles}\Microsoft Visual Studio\18\Insiders\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Community\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Professional\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe",
    "${env:ProgramFiles}\Microsoft Visual Studio\2022\Enterprise\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin\cmake.exe",
    "${env:ProgramFiles}\CMake\bin\cmake.exe",
    "${env:ProgramFiles(x86)}\CMake\bin\cmake.exe"
)

$cmake = $null
foreach ($candidate in $cmakeCandidates) {
    if (Test-Path -LiteralPath $candidate) {
        $cmake = $candidate
        break
    }
}

if (-not $cmake) {
    Write-Host "CMake was not found. Install Visual Studio component 'CMake tools for Windows' or Kitware CMake." -ForegroundColor Red
    exit 1
}

Write-Host "Using CMake: $cmake" -ForegroundColor Cyan

function Find-WinLibsMingwBin {
    $root = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Packages"
    if (-not (Test-Path -LiteralPath $root)) {
        return $null
    }
    $dirs = Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "BrechtSanders.WinLibs.*" }
    foreach ($d in $dirs) {
        $bin = Join-Path $d.FullName "mingw64\bin"
        $gpp = Join-Path $bin "g++.exe"
        if (Test-Path -LiteralPath $gpp) {
            return $bin
        }
    }
    return $null
}

$mingwBin = Find-WinLibsMingwBin
if ($mingwBin) {
    Write-Host "Using MinGW from: $mingwBin" -ForegroundColor Cyan
    $env:PATH = "$mingwBin;$env:PATH"
    if (Test-Path -LiteralPath $BuildDirMingw) {
        Remove-Item -LiteralPath $BuildDirMingw -Recurse -Force
    }
    & $cmake --fresh -S $CoreDir -B $BuildDirMingw -G Ninja -DCMAKE_BUILD_TYPE=Release
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
    & $cmake --build $BuildDirMingw
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
    Write-Host ""
    Write-Host "Done (MinGW). Binary:" -ForegroundColor Green
    Write-Host "  $BuildDirMingw\sentinai_engine.exe" -ForegroundColor Green
    exit 0
}

Write-Host "WinLibs MinGW not found. Trying Visual Studio generators..." -ForegroundColor Yellow
Write-Host "Tip: winget install BrechtSanders.WinLibs.POSIX.UCRT" -ForegroundColor Yellow

$generators = @(
    @{ Name = "Visual Studio 18 2026"; Arch = "x64" },
    @{ Name = "Visual Studio 17 2022"; Arch = "x64" }
)

$configured = $false
foreach ($gen in $generators) {
    Write-Host "Trying generator: $($gen.Name) ($($gen.Arch))..." -ForegroundColor Yellow
    if (Test-Path -LiteralPath $BuildDirVs) {
        Remove-Item -LiteralPath $BuildDirVs -Recurse -Force
    }
    & $cmake --fresh -S $CoreDir -B $BuildDirVs -G $gen.Name -A $gen.Arch
    if ($LASTEXITCODE -eq 0) {
        $configured = $true
        break
    }
}

if (-not $configured) {
    Write-Host ""
    Write-Host "CMake could not find a Visual Studio C++ toolchain." -ForegroundColor Red
    Write-Host "Either install workload 'Desktop development with C++', or run:" -ForegroundColor Yellow
    Write-Host "  winget install BrechtSanders.WinLibs.POSIX.UCRT" -ForegroundColor Yellow
    exit 1
}

& $cmake --build $BuildDirVs --config Release
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Done (Visual Studio). Binary is typically at:" -ForegroundColor Green
Write-Host "  $BuildDirVs\Release\sentinai_engine.exe" -ForegroundColor Green
Write-Host "  or $BuildDirVs\sentinai_engine.exe" -ForegroundColor Green
