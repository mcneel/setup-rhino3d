const core = require('@actions/core')
const os = require('node:os')
const path = require('node:path')
const util = require('node:util')

const execAsync = util.promisify(require('node:child_process').exec)

const download = require('./utilities').download

const installMacOS = async url => {
  const dmg = path.join(os.tmpdir(), 'rhino_setup.dmg')
  await download(url, dmg)

  const mountPoint = path.join(os.tmpdir(), 'rhino_mount')
  const command =
    `hdiutil attach "${dmg}" -nobrowse -mountpoint "${mountPoint}" && ` +
    `sudo cp -R "${mountPoint}"/*.app /Applications/ && ` +
    `hdiutil detach "${mountPoint}"`

  try {
    const { stdout } = await execAsync(command)
    console.log(stdout.trim())
  } catch (error) {
    core.setFailed(error)
    return
  }

  try {
    const { stdout } = await execAsync('ls -d /Applications/Rhino*.app')
    console.log(`Successfully installed Rhino to ${stdout.trim()}`)
  } catch (error) {
    core.setFailed(`Rhino was not installed: ${error}`)
  }
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
const run = async () => {
  try {
    switch (os.platform()) {
      case 'win32':
      case 'darwin':
        break
      default:
        core.setFailed('Unsupported platform')
        return
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
      version = '8'
      let channelPath
      switch (releaseVersion) {
        case 'rc':
          channelPath = '8/latest/rc'
          console.log(
            'Downloading and installing the latest Rhino 3d Release Candidate...'
          )
          break
        case 'wip':
          channelPath = '9/wip'
          version = '9'
          console.log('Downloading and installing the Rhino 3d WIP...')
          break
        default:
          channelPath = '8/latest'
          console.log('Downloading and installing the latest Rhino 3d...')
      }

      url =
        os.platform() === 'darwin'
          ? `https://www.rhino3d.com/www-api/download/direct?slug=rhino-for-mac/${channelPath}&email=${emailAddress}`
          : `https://www.rhino3d.com/download/rhino/${channelPath}/direct/?email=${emailAddress}`
    }

    if (os.platform() === 'darwin') {
      await installMacOS(url)
      return
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
