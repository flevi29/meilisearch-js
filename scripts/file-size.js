import { createRequire } from 'node:module'
import { basename, normalize } from 'node:path'
import { readFile } from 'node:fs/promises'

const require = createRequire(import.meta.url)

const kleur = require('kleur')
const prettyBytes = require('pretty-bytes')
const brotliSize = require('brotli-size')
const gzipSize = require('gzip-size')
const pkg = require('../package.json')

/**
 * @param {string} pkgName
 * @param {string[]} filesOutput
 */
function getFormattedOutput(pkgName, filesOutput) {
  const MAGIC_INDENTATION = 3
  const WHITE_SPACE = ' '.repeat(MAGIC_INDENTATION)

  return (
    kleur.blue(`${pkgName} bundle sizes: 📦`) +
    `\n${WHITE_SPACE}` +
    readFile.name +
    filesOutput.join(`\n${WHITE_SPACE}`)
  )
}

/**
 * @param {number} size
 * @param {string} filename
 * @param {'br' | 'gz'} type
 * @param {boolean} raw
 */
function formatSize(size, filename, type, raw) {
  const pretty = raw ? `${size} B` : prettyBytes(size)
  const color = size < 5000 ? 'green' : size > 40000 ? 'red' : 'yellow'
  const MAGIC_INDENTATION = type === 'br' ? 13 : 10

  return `${' '.repeat(MAGIC_INDENTATION - pretty.length)}${kleur[color](
    pretty
  )}: ${kleur.white(basename(filename))}.${type}`
}

/**
 * @param {string} code
 * @param {string} filename
 * @param {boolean} [raw=false] Default is `false`
 */
async function getSizeInfo(code, filename, raw = false) {
  const isRaw = raw || code.length < 5000
  const gzip = formatSize(await gzipSize(code), filename, 'gz', isRaw)
  const brotli = formatSize(brotliSize.sync(code), filename, 'br', isRaw)
  return gzip + '\n' + brotli
}

const args = process.argv.splice(2)
const filePaths = [...args.map(normalize)]
const fileMetadata = await Promise.all(
  filePaths.map(async (filePath) => {
    return {
      path: filePath,
      blob: await readFile(filePath, { encoding: 'utf8' }),
    }
  })
)

const output = await Promise.all(
  fileMetadata.map((metadata) => getSizeInfo(metadata.blob, metadata.path))
)

console.log(getFormattedOutput(pkg.name, output))
