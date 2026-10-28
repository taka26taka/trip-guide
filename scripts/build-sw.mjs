import { createHash } from 'node:crypto'
import { relative, join, sep } from 'node:path'
import { readFile, readdir, writeFile } from 'node:fs/promises'

// publicのファイルも含めた成果物から、毎回同じ入力には同じSWを生成する。
const files = (await readdir('dist', { recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name !== 'sw.js')
  .map((entry) => `./${relative('dist', join(entry.parentPath, entry.name)).split(sep).join('/')}`)
  .sort()
const hash = createHash('sha256')
for (const file of files) hash.update(file).update(await readFile(`dist/${file}`))
const template = await readFile('public/sw.js', 'utf8')
await writeFile('dist/sw.js', template
  .replace('__BUILD_VERSION__', hash.digest('hex').slice(0, 16))
  .replace('/* __PRECACHE__ */ []', JSON.stringify(files)))
