import fs from 'node:fs'
import path from 'node:path'
import { PaperCollectionSchema } from '../frontend/src/lib/schema'

const dataPath = path.resolve(process.cwd(), '../data/papers.json')

try {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const parsed = JSON.parse(raw)
  const result = PaperCollectionSchema.parse(parsed)
  console.log(`校验通过：${result.length} 条记录`)
} catch (err) {
  console.error('校验失败', err)
  process.exitCode = 1
}

