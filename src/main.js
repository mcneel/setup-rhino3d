const core = require('@actions/core')
//const { wait } = require('./wait')

const https = require('https')
const fs = require('fs')
const { exec } = require('child_process')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    //const ms = core.getInput('milliseconds', { required: true })

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

    const file = fs.createWriteStream('rhino.exe')
    const request = https.get(
      `https://files.mcneel.com/dujour/exe/20240712/rhino_en-us_8.9.24194.18121.exe`,
      function (response) {
        response.pipe(file)

        file.on('finish', () => {
          file.close()
          console.log('Download Completed')
          const stats = fs.statSync('rhino.exe')
          const fileSizeInMb = stats.size / 1024 ** 2
          console.log(`rhino.exe size: ${fileSizeInMb} MB`)
        })
      }
    )

    const ps =
      "Start-Process -FilePath rhino.exe -ArgumentList '-passive', '-norestart' -Wait"
    exec(ps, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
      // do whatever with stdout
      console.log(error)
      console.log(stdout)
      console.log(stderr)
    })

    /*
    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())
    */

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
