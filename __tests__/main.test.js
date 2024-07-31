/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const main = require('../src/main')
const os = require('node:os')

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
// const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
const platformMock = jest.spyOn(os, 'platform').mockImplementation()

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the action's runScript function
//const runScriptMock = jest.spyOn(main, 'runScript').mockImplementation()

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the input values', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'email-address':
          return 'bozo@mcneel.com'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
  })

  it('fails on Linux', async () => {
    platformMock.mockImplementation(() => 'linux')
    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith('Linux is not supported')
  })

  it('fails on macOS', async () => {
    platformMock.mockImplementation(() => 'darwin')
    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith('macOS is not supported')
  })

  it('output script name on Windows', async () => {
    platformMock.mockImplementation(() => 'win32')
    await main.run()
    expect(runMock).toHaveReturned()
    expect(debugMock).toHaveBeenCalledWith('Script name is setup-rhino.ps1')
  })

  // TODO: Add tests related to validating email address
})
