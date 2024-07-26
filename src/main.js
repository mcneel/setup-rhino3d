const core = require('@actions/core')
const path = require('path')
const { exec } = require('child_process')

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

    let command = path.join(
      path.dirname(__dirname),
      'script',
      'setup-rhino.ps1'
    )
    command = core.toWin32Path(command)
    command += ' -EmailAddress ' + emailAddress //+ ' -RhinoToken ' + rhinoToken

    core.debug(`ps command: ${command}`)

    await runScript(command)

    core.debug(new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

const runScript = async command => {
  return new Promise(resolve => {
    exec(command, { shell: 'powershell.exe' }, (err, stdout, stderr) => {
      if (err || stderr) {
        console.error(err)
        console.error(stderr)
        resolve(false)
      } else {
        console.log(stdout)
        resolve(true)
      }
    })
  })
}

module.exports = {
  run
}
