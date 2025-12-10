# 网站指纹攻击论文导航（静态站点）

## 目录
- `frontend/`：React + Vite 前端
- `data/`：离线解析产物 `papers.json` 与原始 `raw/` 文本
- `scripts/`：抽取、校验与同步脚本

## 开发
```bash
cd frontend
npm install
npm run dev
```

## 数据流程（离线）
1) 将 PDF 转为 `.txt` 放入 `data/raw/`
2) 生成占位/真实结构化数据  
   - 占位（默认 dry-run）：`npm run extract`  
   - 真实：`npm run extract -- --no-dry-run --model gpt-4o-mini`（需 `OPENAI_API_KEY`）
3) 校验并同步到前端：`npm run lint:data`

## 构建与部署
```bash
cd frontend
npm run build   # 产出 dist/
```

- `vite.config.ts` 已设置 `base: './'` 便于 GitHub Pages/静态托管  
- 可使用 GitHub Pages（构建 `dist` 推送到 `gh-pages` 分支或 Action 自动化）

