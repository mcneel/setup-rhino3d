/**
 * Unit tests for the action's main functionality, src/main.js
 */
jest.mock('../src/utilities')
jest.mock('node:child_process', () => {
  const { promisify } = require('node:util')
  const exec = jest.fn()
  // Mirror real child_process.exec's promisify hook so util.promisify(exec) resolves
  // to {stdout, stderr} the same way (keeps the existing execAsync test working).
  exec[promisify.custom] = async () => ({
    stdout: '/Applications/Rhino 8.app',
    stderr: ''
  })
  return { exec }
})

const core = require('@actions/core')
const main = require('../src/main')
const os = require('node:os')
const { download } = require('../src/utilities')

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

  test('installs on macOS', async () => {
    getInputMock.mockImplementation(name =>
      name === 'email-address' ? 'bozo@mcneel.com' : ''
    )
    platformMock.mockImplementation(() => 'darwin')
    download.mockResolvedValue()

    await main.run()

    expect(runMock).toHaveReturned()
    expect(download).toHaveBeenCalled()
    expect(download.mock.calls[0][0]).toContain('rhino-for-mac')
    expect(setFailedMock).not.toHaveBeenCalled()
  }, 180000)

  test('fails when download-url has no inferable version', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'email-address':
          return 'bozo@mcneel.com'
        case 'download-url':
          return 'https://files.mcneel.com/dujour/exe/20260609/setup.exe'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
    expect(setFailedMock).toHaveBeenCalledWith(
      'Could not determine the Rhino major version from download-url: https://files.mcneel.com/dujour/exe/20260609/setup.exe'
    )
  }, 180000)

  test('execAsync is called', async () => {
    execMock.mockImplementation('', '')
    await main.execAsync()
    expect(execMock).toHaveBeenCalledTimes(1)
    expect(execMock).toHaveReturned()
  })

  // TODO: Add tests related to validating email address
})
