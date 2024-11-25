const core = require('@actions/core')
const path = require('node:path')
// const { exec } = require('node:child_process')
const os = require('node:os')
const util = require('node:util')
const execAsync = util.promisify(require('node:child_process').exec)

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
const run = async () => {
  try {
    console.log('Downloading and installing the latest Rhino 3d...')

    // Get the inputs from the workflow file
    const emailAddress = core.getInput('email-address', { required: true })
    const releaseVersion = core.getInput('release-version', { required: false }) // rc, wip, latest

    let url = 'https://www.rhino3d.com/download/rhino/'
    switch (releaseVersion) {
      case 'rc':
        url += `8/latest/rc/direct/?email=${emailAddress}`
        break
      case 'wip':
        url += `9/wip/direct/?email==${emailAddress}`
        break
      default:
        url += `8/latest/direct/?email==${emailAddress}`
    }

    /*
    let command = path.join(
      path.dirname(__dirname),
      'script',
      'setup-rhino.ps1'
    )
    command = core.toWin32Path(command)
    command += ' -EmailAddress ' + emailAddress //+ ' -RhinoToken ' + rhinoToken
    */

    let scriptName = 'setup-rhino'
    let commandArgs = ''
    let shell = null

    switch (os.platform()) {
      case 'win32':
        scriptName += '.ps1'
        commandArgs = ` -URL ${url}`
        shell = { shell: 'powershell.exe' }
        core.debug(`Script name is ${scriptName}`)
        break
      case 'darwin':
        // scriptName += '.sh'
        // shell = { shell: '/bin/sh' }
        core.setFailed('macOS is not supported')
        break
      case 'linux':
        // scriptName += '.sh'
        // shell = { shell: '/bin/sh' }
        core.setFailed('Linux is not supported')
        break
      default:
        core.setFailed('Unsupported platform')
    }

    let command = path.join(__dirname, scriptName)
    command = core.toPlatformPath(command)
    command += commandArgs

    core.debug(`command: ${command}`)

    try {
      const { stdout, stderr } = await execAsync(command, shell)
      if (stderr.trim().length > 0) {
        core.setFailed(stderr)
      }
      console.log(stdout.trim())
    } catch (error) {
      core.setFailed(error)
    }

    core.debug(new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run,
  execAsync
}
