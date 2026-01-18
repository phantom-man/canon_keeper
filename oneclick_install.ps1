# One-shot installer for Canon Keeper MCP
# Usage: powershell -ExecutionPolicy Bypass -File .\oneclick_install.ps1 [-Workspace <path>] [-Version <semver>]

param(
    [string]$Workspace = (Get-Location),
    [string]$Version = "0.1.4"
)

function Get-PythonPath {
    param([string]$Root)
    $venvPy = Join-Path $Root ".venv/Scripts/python.exe"
    if (Test-Path $venvPy) { return $venvPy }
    return "python"
}

$python = Get-PythonPath -Root $Workspace

Write-Host "Using python: $python"
Write-Host "Workspace: $Workspace"
Write-Host "Installing canon-keeper-mcp $Version..."

& $python -m pip install --upgrade "canon-keeper-mcp==$Version"
if ($LASTEXITCODE -ne 0) { throw "pip install failed" }

Write-Host "Running workspace installer..."
& $python -m canon_keeper_mcp install --workspace $Workspace
if ($LASTEXITCODE -ne 0) { throw "workspace install failed" }

Write-Host "Done. Reload VS Code to activate the MCP server."