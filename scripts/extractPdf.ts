import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { PaperSchema } from '../frontend/src/lib/schema'
import { ProxyAgent, setGlobalDispatcher } from 'undici'

// 确保解析依赖时优先使用 frontend/node_modules
const require = createRequire(new URL('../frontend/package.json', import.meta.url))

type Args = {
  input: string
  out: string
  model: string
  dryRun: boolean
  limit?: number
}

async function main() {
  const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY
  if (proxy) {
    setGlobalDispatcher(new ProxyAgent(proxy))
  }
  const args = parseArgs(process.argv.slice(2))
  const inputDir = path.resolve(process.cwd(), args.input || '../data/raw')
  const outputPath = path.resolve(process.cwd(), args.out || '../data/papers.json')
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey && !args.dryRun) throw new Error('缺少 OPENAI_API_KEY，可加 --dry-run 跳过调用。')

  const files = (await fs.readdir(inputDir)).filter((f) => f.toLowerCase().endsWith('.pdf'))
  if (!files.length) {
    console.warn('未找到 PDF 文件，已退出。')
    return
  }
  const limited = typeof args.limit === 'number' ? files.slice(0, args.limit) : files
  const results: any[] = []

  for (const file of limited) {
    const full = path.join(inputDir, file)
    console.log(`处理: ${file}`)
    let text = ''
    if (args.dryRun) {
      text = `占位内容 ${file}`
    } else {
      try {
        const pdfParse = require('pdf-parse')
        const buffer = await fs.readFile(full)
        const parsed = await pdfParse(buffer)
        text = parsed.text || ''
      } catch (err) {
        console.warn(`解析 PDF 失败，已跳过：${file}`, err instanceof Error ? err.message : err)
        continue
      }
    }

    const prompt = buildPrompt(text)
    if (args.dryRun) {
      results.push(
        PaperSchema.parse({
          id: path.basename(file, '.pdf'),
          title: `占位标题 - ${file}`,
          year: 2024,
          venue: 'TBD',
          authors: ['待提取'],
          keywords: [],
          subfields: [],
          tasks: [],
          features: [],
          models: [],
          datasets: [],
          metrics: [],
          summary: text.slice(0, 200) || '占位摘要',
          findings: '',
          limitations: '',
          future_work: '',
          tags: [],
          links: {},
        }),
      )
      continue
    }

    const completion = await callOpenAI(prompt, args.model, apiKey)
    const cleaned = normalizeCompletion(completion)
    results.push(PaperSchema.parse(cleaned))
  }

  await fs.writeFile(outputPath, JSON.stringify(results, null, 2))
  console.log(`已写入 ${results.length} 条记录到 ${outputPath}`)
}

function buildPrompt(text: string) {
  return `
你是资深安全研究助理，需要从网站指纹攻击相关论文中抽取结构化字段，输出 JSON：
{
  "id": "短标识，推荐用第一作者-年份-关键词",
  "title": "...",
  "year": 2024,
  "venue": "NDSS/USENIX/CCS...",
  "authors": ["..."],
  "paper_type": "攻击|防御|测量/评测|基准/数据集|综述/调研|方法学/工具|其他",
  "threat_model": "Tor|VPN|TLS/HTTPS|其他",
  "keywords": ["website fingerprinting", "..."],
  "subfields": ["小样本", "多标签", "鲁棒性", "对抗样本", "数据增强", "传输层特征", "深度学习", "细粒度网站指纹"],
  "tasks": ["封闭世界分类", "开放世界检测", "小样本", "多标签", "迁移/跨域"],
  "features": ["突发序列", "时延", "TLS 指纹", "包方向序列", "..."],
  "models": ["SVM", "kNN", "随机森林", "CNN", "RNN", "Transformer", "..."],
  "datasets": ["..."],
  "metrics": ["Accuracy", "F1", "TPR@1%FPR", "mAP", "..."],
  "summary": "100-150 字中文摘要，说明方法与贡献",
  "findings": "核心实验结论",
  "limitations": "主要局限",
  "future_work": "潜在改进方向",
  "tags": ["小样本", "多标签", "鲁棒性"],
  "links": { "pdf": "...", "code": "...", "dataset": "..." }
}

要求：
- paper_type 必须从列举值中选择；测量类文章选“测量/评测”；不匹配填“其他”并在 tags 补充。
- threat_model 选 Tor/VPN/TLS/HTTPS；不匹配填“其他”并在 tags 补充。
- “细粒度网站指纹”可写入 subfields，并在 tags 补充细节。
- 避免虚构，缺失字段以空字符串或空数组返回。

论文原文（已截断）：
${text.slice(0, 20000)}
`
}

async function callOpenAI(prompt: string, model: string, apiKey: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: '你是严格的信息抽取助手，只输出 JSON 对象。' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`OpenAI API 调用失败: ${res.status} ${msg}`)
  }
  const json = await res.json()
  const content = json?.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenAI 返回为空')
  return JSON.parse(content)
}

function parseArgs(argv: string[]): Args {
  const parsed: Args = {
    input: '../data/raw',
    out: '../data/papers.json',
    model: 'gpt-4o-mini',
    dryRun: false,
  }
  argv.forEach((arg, idx) => {
    if (arg === '--input') parsed.input = argv[idx + 1]
    if (arg === '--out') parsed.out = argv[idx + 1]
    if (arg === '--model') parsed.model = argv[idx + 1]
    if (arg === '--dry-run') parsed.dryRun = true
    if (arg === '--no-dry-run') parsed.dryRun = false
    if (arg === '--limit') parsed.limit = Number(argv[idx + 1])
  })
  return parsed
}

function normalizeCompletion(data: any) {
  const links = data?.links && typeof data.links === 'object' ? { ...data.links } : {}
  const normalizeUrl = (v: any) => (typeof v === 'string' && /^https?:\/\//i.test(v) ? v : undefined)
  ;['pdf', 'code', 'dataset', 'project'].forEach((k) => {
    const v = normalizeUrl(links[k])
    if (!v) delete links[k]
    else links[k] = v
  })
  return { ...data, links }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

