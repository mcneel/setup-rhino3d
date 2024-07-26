const core = require('@actions/core')
const path = require('path')
const { exec } = require('child_process')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
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

    let res
    try {
      res = await runScript(command, { shell: 'powershell.exe' })
      console.log(res.stdout)
    } catch (error) {
      core.debug(`error in running script: ${res}`)
      core.setFailed(error.message)
    }

    core.debug(new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

const runScript = async (command, shell) => {
  return new Promise((resolve, reject) => {
    exec(command, shell, (error, stdout, stderr) => {
      if (error || stderr) {
        reject({ error, stderr })
      } else {
        resolve({ stdout })
      }
    })
  })
}

module.exports = {
  run
}
