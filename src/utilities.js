const fs = require('node:fs')
const { Readable } = require('node:stream')
const { finished } = require('node:stream/promises')

// from https://stackoverflow.com/a/74722818

const download = async (url, file) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Download failed with HTTP ${response.status} ${response.statusText}`
    )
  }
  const stream = fs.createWriteStream(file)
  await finished(Readable.fromWeb(response.body).pipe(stream))
}

module.exports = { download }
