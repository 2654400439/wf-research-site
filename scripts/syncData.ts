import fs from 'node:fs'
import path from 'node:path'

const source = path.resolve(process.cwd(), '../data/papers.json')
const targetDir = path.resolve(process.cwd(), './public/data')
const target = path.join(targetDir, 'papers.json')

if (!fs.existsSync(source)) {
  throw new Error(`未找到数据文件：${source}`)
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

fs.copyFileSync(source, target)
console.log(`已同步数据到 ${target}`)

