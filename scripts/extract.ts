import fs from 'node:fs'
import path from 'node:path'
import { PaperSchema } from '../frontend/src/lib/schema'

interface Args {
  input: string
  out: string
  model?: string
  dryRun?: boolean
}

const args = parseArgs(process.argv.slice(2))
const inputDir = path.resolve(process.cwd(), args.input || '../data/raw')
const outputPath = path.resolve(process.cwd(), args.out || '../data/papers.json')
const model = args.model || 'gpt-4o-mini'
const dryRun = args.dryRun ?? true

async function main() {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`输入目录不存在: ${inputDir}`)
  }

  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.txt'))
  if (!files.length) {
    console.warn('未找到 .txt 论文文本，跳过。')
    return
  }

  const results = []
  for (const file of files) {
    const content = fs.readFileSync(path.join(inputDir, file), 'utf-8')
    const baseId = path.basename(file, '.txt')
  const prompt = buildPrompt(content)

    if (dryRun) {
      console.log(`[dry-run] 生成占位数据: ${baseId}`)
      results.push(
        PaperSchema.parse({
          id: baseId,
          title: `占位标题 - ${baseId}`,
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
          summary: content.slice(0, 240) + '...',
          findings: '',
          limitations: '',
          future_work: '',
          tags: [],
          links: {},
        }),
      )
      continue
    }

    const completion = await callOpenAI(prompt, model)
    results.push(PaperSchema.parse(completion))
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
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

async function callOpenAI(prompt: string, model: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('缺少 OPENAI_API_KEY，且未开启 dry-run')
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
  const parsed: Args = { input: '../data/raw', out: '../data/papers.json', dryRun: true }
  argv.forEach((arg, idx) => {
    if (arg === '--input') parsed.input = argv[idx + 1]
    if (arg === '--out') parsed.out = argv[idx + 1]
    if (arg === '--model') parsed.model = argv[idx + 1]
    if (arg === '--dry-run') parsed.dryRun = true
    if (arg === '--no-dry-run') parsed.dryRun = false
  })
  return parsed
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

