const core = require('@actions/core')
//import {core, platform} from '@actions/core'
const path = require('node:path')
//import {path} from 'path'
const { exec } = require('node:child_process')
//import {exec} from 'child_process'
const os = require('node:os')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    core.debug(new Date().toTimeString())
    // Get the inputs from the workflow file
    //const rhinoToken = core.getInput('rhino-token', { required: true })
    const emailAddress = core.getInput('email-address', { required: true })
    const rhinoVersion = core.getInput('rhino-version', { required: false })

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    if (!rhinoVersion) {
      core.debug('No Rhino version provided, defaulting to 8.9')
      rhinoVersion = '8.9'
    } else {
      core.debug(`Installing Rhino ${rhinoVersion}`)
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
        commandArgs = ' -EmailAddress ' + emailAddress //+ ' -RhinoToken ' + rhinoToken
        shell = { shell: 'powershell.exe' }
        break
      case 'darwin':
        scriptName += '.sh'
        shell = { shell: '/bin/sh' }
        core.setFailed('macOS is not supported')
        break
      case 'linux':
        scriptName += '.sh'
        shell = { shell: '/bin/sh' }
        core.setFailed('Linux is not supported')
        break
      default:
        core.setFailed('Unsupported platform')
    }

    let command = path.join(__dirname, scriptName)
    command = core.toPlatformPath(command)
    command += commandArgs

    core.debug(` command: ${command}`)

    const res = await runScript(command, shell)
    if (res.hasOwnProperty('err') || res.hasOwnProperty('stderr')) {
      core.setFailed(res)
    } else {
      console.log(res.stdout)
    }

    core.debug(new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

const runScript = async (command, shell) => {
  return new Promise((resolve, reject) => {
    exec(command, shell, (err, stdout, stderr) => {
      if (err || stderr) {
        reject({ err, stderr })
      } else {
        resolve({ stdout })
      }
    })
  })
}

module.exports = {
  run
}
