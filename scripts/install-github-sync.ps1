# Registers a Windows scheduled task that runs scripts/sync-github.js every 15 minutes
# while this user is signed in. Run again to update it. To remove it:
#   Unregister-ScheduledTask -TaskName 'AutomationSpace GitHub Sync' -Confirm:$false
$ErrorActionPreference = 'Stop'

$taskName = 'AutomationSpace GitHub Sync'
$root = Split-Path -Parent $PSScriptRoot
$node = (Get-Command node).Source
$script = Join-Path $root 'scripts\sync-github.js'

# conhost --headless stops a console window flashing up on each run.
$action = New-ScheduledTaskAction `
  -Execute 'conhost.exe' `
  -Argument "--headless `"$node`" `"$script`"" `
  -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 15)
$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 10)
# Interactive logon is needed so git can read the saved GitHub sign-in.
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null
Write-Output "Scheduled '$taskName' every 15 minutes. Log: .git\github-sync.log"
