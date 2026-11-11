import { categories, products } from "./catalog";
import { regions } from "./regions";
import { solutions } from "./solutions";
import { site } from "./site";

const specTable = [
  ["2 vCPU / 4 GB", 68],
  ["4 vCPU / 8 GB", 136],
  ["8 vCPU / 16 GB", 272],
  ["16 vCPU / 32 GB", 544],
] as const;

/** 稳定不变的系统提示词，放在缓存前缀里。 */
export function buildSystemPrompt() {
  const catalog = categories
    .map(c => {
      const items = products
        .filter(p => p.category === c.id)
        .map(p => `- ${p.name.zh} (${p.name.en}) /products/${p.slug}: ${p.desc.zh}${p.from ? `；起价 ¥${p.from}/月` : ""}`)
        .join("\n");
      return `### ${c.name.zh} / ${c.name.en}\n${items}`;
    })
    .join("\n\n");

  const regionList = regions.map(r => `${r.name.zh} (${r.id}, ${r.zones} 个可用区)`).join("；");
  const sol = solutions.map(s => `- ${s.name.zh}: ${s.title.zh}（产品：${s.products.join(", ")}）`).join("\n");

  return `你是「${site.name.zh} ${site.name.en}」官网上的智能客服「安信小助」。你帮助访客了解产品、选择配置、估算价格，并解答账号、备案、计费和售后问题。

## 回答方式
- 使用访客所用的语言回答（简体中文或英文）。
- 先直接回答问题，再给出必要的理由。一般控制在 150 字以内，复杂选型可适当展开，用简短的列表呈现配置。
- 推荐产品时，用 Markdown 链接指向官网产品页，例如 [云服务器 ECS](/products/ecs)。只链接下方目录里存在的路径。
- 只依据下方资料回答价格和规格。资料里没有的数字，不要编造，请说明需要以下单页或销售报价为准。
- 涉及退款、合同、发票争议、账号安全或资料里没有的问题，建议访客「转人工」或拨打 ${site.hotline}。
- 不要求访客提供密码、验证码、身份证号或银行卡号。
- 这是演示站点：价格、地域与案例均为示例数据。被问到时如实说明。

## 云服务器 ECS 包月示例价（中国内地地域；香港及海外地域约为 1.25 倍；按量付费约为包月价 ÷ 720 × 1.3 每小时）
${specTable.map(([s, p]) => `- ${s}: ¥${p}/月`).join("\n")}
- 新用户活动：2 核 2G 3M 带宽 ¥99/年，续费同价。
- 系统盘默认 40 GB；带宽按固定带宽或按流量计费。

## 大模型服务（每百万输入 Tokens 示例价）
DeepSeek-V3 ¥2；Qwen3-235B-A22B ¥2；GLM-4.5 ¥2；Kimi-K2 ¥4；Qwen3-Coder ¥4；Qwen2.5-VL-72B ¥16；bge-m3 向量 ¥0.5。注册赠送 500 万 Tokens。兼容 OpenAI 接口格式。

## 地域（共 ${regions.length} 个）
${regionList}

## 行业方案
${sol}

## 账号与服务
- 注册免费，无需绑定信用卡；登录后进入控制台 /console。
- ICP 备案：在 [ICP 备案](/products/icp) 在线提交，需中国内地地域的服务器，审核一般 7–20 个工作日（以管局为准）。
- 工单 7×24 小时；紧急工单 15 分钟内响应。人工客服工作日 9:00–21:00。
- 售前电话 ${site.hotline}，邮箱 ${site.email}。

## 产品目录
${catalog}`;
}

/** 未配置模型密钥时的内置回答，保证演示可用。 */
export function offlineAnswer(question: string, locale: string): string {
  const q = question.toLowerCase();
  const en = locale === "en";
  const has = (...k: string[]) => k.some(x => q.includes(x));

  if (has("官网", "网站", "建站", "website", "site", "博客", "blog")) {
    return en
      ? "For a company website, start with a [Lightweight Server](/products/lighthouse) (from ¥24/mo) or a 2 vCPU / 4 GB [ECS](/products/ecs) instance at ¥68/mo. Add an [SSL certificate](/products/ssl) for HTTPS, and if you serve users in mainland China, complete [ICP filing](/products/icp) first."
      : "企业官网建议先从 [轻量应用服务器](/products/lighthouse)（¥24/月起）或 2 核 4G 的 [云服务器 ECS](/products/ecs)（¥68/月）开始：\n- 配一张 [SSL 证书](/products/ssl) 开启 HTTPS\n- 面向内地用户需先完成 [ICP 备案](/products/icp)\n- 图片多的话加上 [CDN](/products/cdn)\n访问量上来后可以随时升级规格。";
  }
  if (has("gpu", "显卡", "训练", "推理")) {
    return en
      ? "[GPU instances](/products/gpu) start at ¥1,980/mo and range from a single card for inference to multi-card nodes for training. Tell me the model size and expected traffic and I can suggest a size, or talk to a person for cluster pricing."
      : "[GPU 云服务器](/products/gpu) 包月 ¥1980 起，从单卡推理到多卡训练节点都有。告诉我模型参数量和预期并发，我可以帮你估算规格；千卡集群需要销售单独报价，可以点「转人工」。";
  }
  if (has("token", "大模型", "模型", "model", "计费", "billing", "收费")) {
    return en
      ? "The [Model Service Platform](/products/maas) bills per token. Sample input prices per million tokens: DeepSeek-V3 ¥2, Qwen3-235B ¥2, Kimi-K2 ¥4, Qwen3-Coder ¥4. New accounts get 5M free tokens, and the API is OpenAI-compatible."
      : "[大模型服务平台](/products/maas) 按 Token 计费，每百万输入 Tokens 示例价：\n- DeepSeek-V3、Qwen3-235B、GLM-4.5：¥2\n- Kimi-K2、Qwen3-Coder：¥4\n- bge-m3 向量：¥0.5\n注册即送 500 万 Tokens，接口兼容 OpenAI 格式。";
  }
  if (has("备案", "icp")) {
    return en
      ? "Submit your [ICP filing](/products/icp) online. You need a server in a mainland China region. Review usually takes 7–20 business days depending on the provincial authority."
      : "在 [ICP 备案](/products/icp) 页面在线提交资料即可，前提是有一台中国内地地域的服务器。审核一般需要 7–20 个工作日，以各省管局为准，期间有专人协助。";
  }
  if (has("价格", "多少钱", "price", "cost", "便宜", "优惠", "99")) {
    return en
      ? "ECS monthly sample prices in mainland regions: 2C4G ¥68, 4C8G ¥136, 8C16G ¥272, 16C32G ¥544. Hong Kong and overseas cost about 1.25×. New customers can get 2C2G for ¥99/year."
      : "云服务器 ECS 内地地域包月示例价：2 核 4G ¥68，4 核 8G ¥136，8 核 16G ¥272，16 核 32G ¥544；香港和海外约 1.25 倍。新用户 2 核 2G 首购 ¥99/年，续费同价。";
  }
  if (has("数据库", "mysql", "database", "redis")) {
    return en
      ? "[RDS for MySQL](/products/rds-mysql) starts at ¥56/mo with HA and automated backups. Add [Redis](/products/redis) (from ¥25/mo) for caching."
      : "[云数据库 MySQL](/products/rds-mysql) ¥56/月起，默认主备高可用和自动备份；需要缓存可搭配 [云数据库 Redis](/products/redis)（¥25/月起）。";
  }
  return en
    ? "I can help with picking a configuration, pricing, ICP filing and account questions. Try asking about websites, GPU sizes or model pricing — or choose \"Talk to a person\" for anything account-specific."
    : "我可以帮你选配置、估算价格，解答备案和账号问题。可以问我“建站选什么配置”“GPU 有哪些规格”“大模型怎么计费”；账号相关的具体问题，建议点「转人工」。";
}
