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
    const apiKey = core.getInput('api-key', { required: true })
    const emailAddress = core.getInput('email-address', { required: true })
    const rhinoVersion = core.getInput('rhino-version', { required: false })

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    if (!rhinoVersion) {
      core.debug('No Rhino version provided, defaulting to 8.9')
      rhinoVersion = '8.9'
    } else {
      core.debug(`Installing Rhino ${rhinoVersion}`)
    }

    let scriptPath = path.join(__dirname, 'setup-rhino.ps1')
    scriptPath += ' -EmailAddress ' + emailAddress + ' -RhinoToken ' + apiKey

    await runScript(scriptPath)

    core.debug(new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

const runScript = async scriptPath => {
  return new Promise(resolve => {
    const ps = scriptPath
    exec(ps, { shell: 'powershell.exe' }, (err, stdout, stderr) => {
      console.log(err)
      console.log(stderr)
      //console.log(stdout)

      if (err || stderr) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

module.exports = {
  run
}
