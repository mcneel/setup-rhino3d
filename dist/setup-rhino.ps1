# Setup/Install script for installing Rhino
#Requires -RunAsAdministrator

Write-Host $PWD

param (
    [Parameter(Mandatory=$true)][string] $EmailAddress,
    [Parameter(Mandatory=$true)][string] $RhinoToken,
    [switch] $install = $false
)

#Region funcs
function Write-Step { 
    Write-Host
    Write-Host "===> "$args[0] -ForegroundColor Green
    Write-Host
}
function Download {
    param (
        [Parameter(Mandatory=$true)][string] $url,
        [Parameter(Mandatory=$true)][string] $output
    )
    (New-Object System.Net.WebClient).DownloadFile($url, $output)
}

Write-Step 'Set environment variables'
SetEnvVar 'RHINO_TOKEN' $RhinoToken -secret

# Download and install Rhino
Write-Step 'Download latest Rhino 8'
$rhinoDownloadUrl = "https://www.rhino3d.com/www-api/download/direct/?slug=rhino-for-windows/8/latest/" 
$rhinoSetup = "c:\temp\rhino_setup.exe"
Download $rhinoDownloadUrl $rhinoSetup

# Set firewall rule to allow installation
New-NetFirewallRule -DisplayName "Rhino 8 Installer" -Direction Inbound -Program $rhinoSetup -Action Allow

Write-Step 'Installing Rhino'
# Automated install (https://wiki.mcneel.com/rhino/installingrhino/8)
Start-Process -FilePath $rhinoSetup -ArgumentList '-passive', '-norestart' -Wait
# delete installer
Remove-Item $rhinoSetup
# Print installed version number
$installedVersion = [Version] (get-itemproperty -Path HKLM:\SOFTWARE\McNeel\Rhinoceros\8.0\Install -name "version").Version
Write-Step "Successfully installed $installedVersion"