const fs = require('node:fs')
const { Readable } = require('node:stream')
const { finished } = require('node:stream/promises')

// from https://stackoverflow.com/a/74722818

async function download (url, file) {
  const stream = fs.createWriteStream(file)
  const { body } = await fetch(url)
  await finished(Readable.fromWeb(body).pipe(stream))
}

module.exports = { download }
