import fs from 'node:fs'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'

// from https://stackoverflow.com/a/74722818

const download = async (url, file) => {
  const stream = fs.createWriteStream(file)
  const { body } = await fetch(url)
  await finished(Readable.fromWeb(body).pipe(stream))
}

export { download }
