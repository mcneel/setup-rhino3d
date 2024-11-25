/**
 * Unit tests for the action's main functionality, src/main.js
 */
const core = require('@actions/core')
const main = require('../src/main')
const os = require('node:os')

// Mock the GitHub Actions core library
// const debugMock = jest.spyOn(core, 'debug').mockImplementation()
const getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
const setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
// const setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
const platformMock = jest.spyOn(os, 'platform').mockImplementation()

// Mock the action's main functions
const runMock = jest.spyOn(main, 'run')
const execMock = jest.spyOn(main, 'execAsync')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('sets the input values', async () => {
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
  }, 180000)

  test('fails on Linux', async () => {
    platformMock.mockImplementation(() => 'linux')
    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith('Unsupported platform')
  }, 180000)

  test('fails on macOS', async () => {
    platformMock.mockImplementation(() => 'darwin')
    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith('Unsupported platform')
  }, 180000)

  test('execAsync is called', async () => {
    execMock.mockImplementation('', '')
    await main.execAsync()
    expect(execMock).toHaveBeenCalledTimes(1)
    expect(execMock).toHaveReturned()
  })

  // TODO: Add tests related to validating email address
})
