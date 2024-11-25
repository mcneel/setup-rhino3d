# Setup/Install script for installing Rhino
#Requires -RunAsAdministrator

param (
    [Parameter(Mandatory=$true)][string] $URL,
    [Parameter(Mandatory=$true)][string] $VERSION,
    #[Parameter(Mandatory=$true)][string] $RhinoToken,
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

function SetEnvVar {
    param (
        [Parameter(Mandatory=$true)][string] $name,
        [Parameter(Mandatory=$true)][string] $value,
        [switch] $secret = $false
    )
    $print = if ($secret) {"***"} else {$value}
    Write-Host "Setting environment variable: $name=$print"
    [System.Environment]::SetEnvironmentVariable($name, $value, "Machine")
}
#EndRegion

#Write-Step 'Set environment variables'
#SetEnvVar 'RHINO_TOKEN' $RhinoToken -secret

# Download and install Rhino
#Write-Step 'Download latest Rhino 8'
$rhinoDownloadUrl = "$URL" 
$rhinoSetup = "c:\temp\rhino_setup.exe"
$rhinoVersion = "$VERSION"
Download $rhinoDownloadUrl $rhinoSetup

# Set firewall rule to allow installation, but suppress output
[void](New-NetFirewallRule -DisplayName "Rhino $rhinoVersion Installer" -Direction Inbound -Program $rhinoSetup -Action Allow)

#Write-Step 'Installing Rhino'
# Automated install (https://wiki.mcneel.com/rhino/installingrhino/8)
Start-Process -FilePath $rhinoSetup -ArgumentList '-passive', '-norestart' -Wait
# delete installer
Remove-Item $rhinoSetup
# Print installed version number
$installedVersion = [Version] (get-itemproperty -Path "HKLM:\SOFTWARE\McNeel\Rhinoceros\$rhinoVersion.0\Install" -name "version").Version
Write-Step "Successfully installed Rhino $installedVersion"