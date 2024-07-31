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
    // const rhinoVersion = core.getInput('rhino-version', { required: false })

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
        commandArgs = ` -EmailAddress ${emailAddress}`
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

    // const res = await runScript(command, shell)

    // core.debug(res)

    /*
    if (
      Object.prototype.hasOwnProperty.call(res, 'message') &&
      (Object.prototype.hasOwnProperty.call(res.message, 'err') ||
        Object.prototype.hasOwnProperty.call(res.message, 'stderr'))
    ) {
      core.setFailed(res)
    } else {
      console.log(res.stdout)
    }

  */

    try {
      const { stdout, stderr } = await execAsync(command, shell)
      console.log(`stderr: ${stderr.trim()}`)
      console.log(`stderr length: ${stderr.length}`)
      console.log(`stdout: ${stdout.trim()}`)
      console.log(`stdout length: ${stdout.length}`)
    } catch (error) {
      core.setFailed(error)
    }

    core.debug(new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

/*
const runScript = async (command, shell) => {
  return new Promise((resolve, reject) => {
    if( !command ) {
      reject(new Error('command argument is empty, null, or undefined'))
    }
    if( !shell ) {
      reject(new Error('shell argument is empty, null, or undefined'))
    }
    exec(command, shell, (err, stdout, stderr) => {
      if (err || stderr) {
        reject(new Error({ err, stderr }))
      } else {
        resolve({ stdout })
      }
    })
  })
}
*/
module.exports = {
  run
}
