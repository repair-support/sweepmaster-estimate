$ErrorActionPreference = "Stop"

$repoUrl = "https://github.com/repair-support/sweepmaster-estimate.git"
$publishDir = Join-Path $env:USERPROFILE ".sweepmaster-publish"
$files = @(
  "index.html",
  "settings.html",
  "template.html",
  "config.js",
  "price-template.csv",
  "publish.ps1",
  "publish.cmd"
)

function Run-Git {
  param([string[]]$GitArgs)

  & git @GitArgs
  if ($LASTEXITCODE -ne 0) {
    throw "git command failed: git $($GitArgs -join ' ')"
  }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not installed. Install Git for Windows first."
}

if (-not (Test-Path (Join-Path $publishDir ".git"))) {
  Write-Host "Preparing the GitHub publishing folder..."
  Run-Git @("clone", $repoUrl, $publishDir)
} else {
  Write-Host "Fetching the latest GitHub version..."
  Run-Git @("-C", $publishDir, "pull", "--ff-only", "origin", "main")
}

foreach ($file in $files) {
  $source = Join-Path $PSScriptRoot $file
  if (-not (Test-Path $source)) {
    throw "File not found: $source"
  }
  Copy-Item -LiteralPath $source -Destination (Join-Path $publishDir $file) -Force
}

Run-Git (@("-C", $publishDir, "add", "--") + $files)
$changes = & git -C $publishDir status --porcelain -- @files
if ($LASTEXITCODE -ne 0) {
  throw "Could not check Git status."
}

if (-not $changes) {
  Write-Host "No changes to publish."
  exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Run-Git @("-C", $publishDir, "commit", "-m", "Update estimate app $timestamp")
Run-Git @("-C", $publishDir, "push", "origin", "main")

Write-Host ""
Write-Host "Published successfully."
Write-Host "https://repair-support.github.io/sweepmaster-estimate/"
