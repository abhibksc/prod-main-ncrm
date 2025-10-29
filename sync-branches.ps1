# sync-branches.ps1
# This script syncs all branches from github-vibesmelody -> github-yuviabhishek

param(
    [string]$SrcRemote = "github-vibesmelody",
    [string]$DstRemote = "github-yuviabhishek",
    [switch]$Force,
    [switch]$DryRun
)

Write-Host "Source remote: $SrcRemote"
Write-Host "Destination remote: $DstRemote"
Write-Host "Force: $Force"
Write-Host "DryRun: $DryRun"
Write-Host ""

# Fetch all remotes
git fetch --all --prune

# Get list of branches from source remote
$branches = git ls-remote --heads $SrcRemote | ForEach-Object {
    ($_ -split "`t")[1] -replace "^refs/heads/",""
} | Sort-Object -Unique

if ($branches.Count -eq 0) {
    Write-Host "No branches found on $SrcRemote. Exiting."
    exit 0
}

Write-Host ("Found {0} branches on {1}`n" -f $branches.Count, $SrcRemote)

foreach ($br in $branches) {
    Write-Host -NoNewline ("{0,-30} : " -f $br)

    # Check if destination branch exists
    $dstExists = git ls-remote --heads $DstRemote $br | Select-String $br

    if (-not $dstExists) {
        if ($DryRun) { Write-Host "would create on $DstRemote"; continue }
        if ($Force) { git push $DstRemote "+$SrcRemote/$br":"refs/heads/$br" | Out-Null; Write-Host "CREATED (force)" }
        else { git push $DstRemote "$SrcRemote/$br":"refs/heads/$br" | Out-Null; Write-Host "CREATED" }
        continue
    }

    # Check if destination branch can fast-forward
    & git merge-base --is-ancestor "$DstRemote/$br" "$SrcRemote/$br"
    if ($LASTEXITCODE -eq 0) {
        if ($DryRun) { Write-Host "would fast-forward" }
        else {
            if ($Force) { git push --force-with-lease $DstRemote "$SrcRemote/$br":"refs/heads/$br" | Out-Null; Write-Host "FAST-FORWARDED (force)" }
            else { git push $DstRemote "$SrcRemote/$br":"refs/heads/$br" | Out-Null; Write-Host "FAST-FORWARDED" }
        }
    } else { Write-Host "DIVERGED - skipped" }
}

Write-Host "`nSync complete."
