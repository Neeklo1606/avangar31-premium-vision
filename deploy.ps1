# PowerShell deploy script for Live Grid project
# Usage: .\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== Building project ===" -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "=== Committing changes ===" -ForegroundColor Cyan
git add -A

$status = git status --porcelain
if ($status) {
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Deploy: $date"
    Write-Host "Changes committed" -ForegroundColor Green
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Pushing to GitHub ===" -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "=== Triggering server update ===" -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "https://bot.siteaccess.ru/deploy.php?token=Lg2026_Deploy_SecureToken_98ba9f" -UseBasicParsing
Write-Host $response.Content

Write-Host ""
Write-Host "Deploy completed! Site updated: https://bot.siteaccess.ru/" -ForegroundColor Green
