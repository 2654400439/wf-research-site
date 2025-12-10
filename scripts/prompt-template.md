# 论文信息抽取提示模板（用于离线 LLM 批处理）

```
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
- paper_type 必须从列举值中选择；测量类文章选择“测量/评测”；如不匹配填“其他”并在 tags 中补充。
- threat_model 选 Tor/VPN/TLS/HTTPS 之一；不匹配填“其他”并在 tags 补充。
- 对“细粒度网站指纹”可在 subfields 写“细粒度网站指纹”并在 tags 补充细节。
- 避免虚构，缺失字段以空字符串或空数组返回。

论文原文（已截断）：
{{paper_text}}
```

