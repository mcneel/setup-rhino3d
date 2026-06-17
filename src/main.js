const core = require('@actions/core')
const os = require('node:os')
const util = require('node:util')

const execAsync = util.promisify(require('node:child_process').exec)

const download = require('./utilities').download

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
const run = async () => {
  try {
    switch (os.platform()) {
      case 'win32':
        break
      default:
        core.setFailed('Unsupported platform')
    }

    // Get the inputs from the workflow file
    const emailAddress = core.getInput('email-address', { required: true })
    const releaseVersion = core.getInput('release-version', { required: false }) // rc, wip, latest
    const downloadUrl = core.getInput('download-url', { required: false }) // direct URL to an installer, e.g. a dujour build

    // build URL
    let url
    let version

    if (downloadUrl) {
      // Use a direct download URL (e.g. a dujour build), bypassing
      // rhino3d.com. The major version is inferred from the installer
      // filename, e.g. .../rhino_9.0.26160.06305.exe -> 9
      const match = downloadUrl.match(/rhino_(\d+)\./i)
      if (!match) {
        core.setFailed(
          `Could not determine the Rhino major version from download-url: ${downloadUrl}`
        )
        return
      }
      url = downloadUrl
      version = match[1]
      console.log(
        `Downloading and installing Rhino 3d ${version} from ${downloadUrl} ...`
      )
    } else {
      url = 'https://www.rhino3d.com/download/rhino/'
      version = '8'
      switch (releaseVersion) {
        case 'rc':
          url += `8/latest/rc/direct/?email=${emailAddress}`
          console.log(
            'Downloading and installing the latest Rhino 3d Release Candidate...'
          )
          break
        case 'wip':
          url += `9/wip/direct/?email=${emailAddress}`
          console.log('Downloading and installing the Rhino 3d WIP...')
          version = '9'
          break
        default:
          url += `8/latest/direct/?email=${emailAddress}`
          console.log('Downloading and installing the latest Rhino 3d...')
      }
    }

    process.chdir('c:\\temp')

    // download file
    const rhinoExe = 'c:\\temp\\rhino_setup.exe'
    await download(url, rhinoExe)

    // install Rhino

    let command = `Start-Process -FilePath ${rhinoExe} -ArgumentList '-passive', '-norestart' -Wait`
    const shell = { shell: 'powershell.exe' }

    try {
      const { stdout, stderr } = await execAsync(command, shell)

      if (stderr.trim().length > 0) {
        core.setFailed(stderr)
      }
      console.log(stdout.trim())
    } catch (error) {
      core.setFailed(error)
    }

    // check if Rhino has been installed. Specific to win32

    const registryPath = `HKLM:\\SOFTWARE\\McNeel\\Rhinoceros\\${version}.0\\Install`
    command = `$installedVersion = [Version] (get-itemproperty -Path ${registryPath} -name "version").Version ; $installPath = (get-itemproperty -Path ${registryPath} -name "InstallPath").InstallPath ; Write-Output "Successfully installed Rhino $installedVersion" ; Write-Output "Install location: $installPath"`

    try {
      const { stdout, stderr } = await execAsync(command, shell)

      if (stderr.trim().length > 0) {
        core.setFailed(stderr)
      }
      console.log(stdout.trim())
    } catch (error) {
      core.setFailed(error)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run,
  execAsync
}
