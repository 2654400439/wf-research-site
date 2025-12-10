# 原始论文文本放置处

- 将下载的 PDF 先转为纯文本（例如 `pdftotext paper.pdf paper.txt`），放入本目录。
- 运行前端包里的命令：`npm run extract`（会调用 `../scripts/extract.ts`）批量生成结构化 JSON。
- 生成的 `../papers.json` 通过 `npm run sync:data` 复制到站点 `public/data/papers.json` 供前端读取。

