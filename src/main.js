const core = require('@actions/core')
//const { wait } = require('./wait')

const https = require('https')
const fs = require('fs')
const path = require('path')

const { exec } = require('child_process')
const { stdout, stderr } = require('process')

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

    // download Rhino
    /*
    const url =
      'https://files.mcneel.com/dujour/exe/20240712/rhino_en-us_8.9.24194.18121.exe' //`https://files.mcneel.com/dujour/exe/20240712/rhino_en-us_8.9.24194.18121.exe`
    const fileName = 'rhino_setup.exe'
    
    await downloadRhino(url, fileName)
    if(await installRhino(fileName)) {
      console.log('installed')
    } else {
      console-log('failed install')
    }
      */

    console.log(process.cwd())
    console.log(__filename)
    console.log(__dirname)

    let scriptPath = path.join(__dirname, 'setup-rhino.ps1')
    console.log(scriptPath)

    scriptPath += ' -EmailAddress ' + emailAddress + ' -RhinoToken ' + apiKey

    await runScript(scriptPath)

    // Log the current timestamp, wait, then log the new timestamp
    //core.debug(new Date().toTimeString())
    //await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

/*
const downloadRhino = async (url, fileName) => {
  return new Promise(resolve => {
    const file = fs.createWriteStream(fileName)
    let received_bytes = 0;
    let total_bytes = 0;
    const request = https.get(url, function (response) {
      response.pipe(file)

      file.on('finish', () => {
        file.close()
        console.log('Download Completed')
        const stats = fs.statSync(fileName)
        const fileSizeInMb = stats.size / 1024 ** 2
        console.log(`rhino.exe size: ${fileSizeInMb} MB`)
        resolve(true)
      })

      file.on('error', err => {
        fs.unlink(fileName)
        console.log(err)
        resolve(false)
      })

      response.on('error', err => {
        fs.unlink(fileName)
        console.log(err)
        resolve(false)
      })
    })
  })
}

const installRhino = async (rhinoPath) => {
  return new Promise(resolve => {
    const ps =
      "Start-Process -FilePath " +
      rhinoPath +
      " -ArgumentList '-passive', '-norestart' -Wait"

    exec(ps, { shell: 'powershell.exe' }, (err, stdout) => {
      if (err) {
        console.log(err)
        resolve(false)
      } else {
        console.log(stdout)
        resolve(true)
      }
    })
  })
}
*/

const runScript = async scriptPath => {
  return new Promise(resolve => {
    const ps = scriptPath
    exec(ps, { shell: 'powershell.exe' }, (err, stdout, stderr) => {
      console.log(err)
      console.log(stderr)
      console.log(stdout)

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
