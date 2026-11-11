import type { CategoryId, Product } from "./catalog";
import type { L } from "./site";

type Feature = { title: L; body: L };

const f = (zt: string, et: string, zb: string, eb: string): Feature => ({ title: { zh: zt, en: et }, body: { zh: zb, en: eb } });

export const categoryFeatures: Record<CategoryId, Feature[]> = {
  ai: [
    f("多模型统一接入", "Many models, one API", "一个 API Key 调用多家模型，切换模型只需改一个参数。", "Call many models with one key; switching is a single parameter."),
    f("按量计费", "Pay per use", "按 Token 或调用次数计费，没有最低消费。", "Billed per token or call, no minimum spend."),
    f("数据不出域", "Data stays in region", "推理数据不用于模型训练，可选专属部署。", "Inference data is never used for training; dedicated deployment available."),
    f("开箱即用的工具链", "Ready-made tooling", "知识库、提示词管理、评测与监控一应俱全。", "Knowledge bases, prompt management, evaluation and monitoring included."),
  ],
  compute: [
    f("秒级交付", "Ready in seconds", "选好规格与镜像，几十秒内实例即可运行。", "Pick a size and image; your instance runs within seconds."),
    f("随时升降配", "Resize anytime", "业务变化时在线调整 CPU、内存与带宽。", "Adjust CPU, memory and bandwidth as needs change."),
    f("云盘三副本", "Triple-replica disks", "数据自动保存三份，单点故障不丢数据。", "Data is stored three times; no loss from a single failure."),
    f("默认安全防护", "Secure by default", "免费基础 DDoS 防护与主机安全检测。", "Free basic DDoS protection and host security scanning."),
  ],
  container: [
    f("兼容开源生态", "Upstream compatible", "与社区版本保持一致，迁移无需改造。", "Matches community releases, migrate without rewrites."),
    f("免运维控制面", "Managed control plane", "控制面高可用由我们负责，你只关注应用。", "We run the HA control plane; you focus on apps."),
    f("弹性到秒", "Scale in seconds", "Pod 与节点按负载自动扩缩。", "Pods and nodes scale with load automatically."),
    f("统一可观测", "Built-in observability", "日志、指标与链路追踪一站查看。", "Logs, metrics and traces in one place."),
  ],
  storage: [
    f("高持久性", "Highly durable", "多可用区冗余存储，数据设计持久性 12 个 9。", "Multi-zone redundancy designed for 12 nines durability."),
    f("分层降本", "Tier to save", "按访问频率自动转为低频或归档存储。", "Move data to infrequent or archive tiers automatically."),
    f("海量并发", "High throughput", "支持海量并发读写与大文件分片上传。", "Massive concurrent access and multipart uploads."),
    f("细粒度权限", "Fine-grained access", "桶策略、临时凭证与防盗链。", "Bucket policies, temporary credentials and hotlink protection."),
  ],
  network: [
    f("全球骨干网", "Global backbone", "地域间私网互联，跨境链路稳定。", "Private links between regions for stable cross-border traffic."),
    f("灵活组网", "Flexible topology", "自定义网段、路由与安全组。", "Custom CIDRs, routes and security groups."),
    f("高可用", "Highly available", "多可用区部署，单区故障自动切换。", "Multi-zone deployment with automatic failover."),
    f("按需计费", "Usage-based billing", "按带宽或流量计费，可随时调整。", "Pay by bandwidth or traffic, change anytime."),
  ],
  security: [
    f("纵深防御", "Defense in depth", "从网络边界到主机、应用与数据逐层防护。", "Layers from the network edge to hosts, apps and data."),
    f("实时告警", "Real-time alerts", "发现攻击与异常行为后立即通知。", "Immediate notice of attacks and anomalies."),
    f("合规支撑", "Compliance support", "提供等保合规所需的安全能力与报告。", "Security capabilities and reports for compliance audits."),
    f("专家服务", "Expert response", "安全专家 7×24 小时协助应急处置。", "Security experts on call 24/7 for incidents."),
  ],
  database: [
    f("高可用架构", "High availability", "主备实例跨可用区部署，故障自动切换。", "Primary and standby across zones with automatic failover."),
    f("自动备份", "Automated backups", "每日全量与实时日志备份，可恢复到任意时间点。", "Daily full plus log backups for point-in-time recovery."),
    f("性能洞察", "Performance insight", "慢查询分析与参数优化建议。", "Slow-query analysis and tuning advice."),
    f("弹性扩容", "Elastic scaling", "在线扩展规格与存储，业务无感知。", "Scale compute and storage online without disruption."),
  ],
  middleware: [
    f("开源兼容", "Open-source compatible", "兼容主流开源协议与客户端。", "Works with common open-source protocols and clients."),
    f("金融级可靠", "Financial-grade reliability", "消息多副本存储，不丢不重。", "Replicated messages, no loss or duplication."),
    f("免运维", "Fully managed", "集群部署、升级与扩容由平台完成。", "We handle deployment, upgrades and scaling."),
    f("全链路可观测", "End-to-end visibility", "消息轨迹与调用链可视化。", "Visualize message traces and call chains."),
  ],
  bigdata: [
    f("存算分离", "Separated storage and compute", "存储与计算独立扩展，降低成本。", "Scale storage and compute independently."),
    f("Serverless", "Serverless", "按实际计算量付费，无需预留集群。", "Pay for compute used, no reserved clusters."),
    f("开放生态", "Open ecosystem", "兼容 Spark、Flink、Hive 等开源引擎。", "Compatible with Spark, Flink, Hive and more."),
    f("统一治理", "Unified governance", "数据血缘、质量与权限一处管理。", "Lineage, quality and access in one place."),
  ],
  media: [
    f("全球加速", "Global delivery", "边缘节点覆盖主要国家与地区。", "Edge nodes across major countries and regions."),
    f("低延时", "Low latency", "互动直播延时可低至 1 秒以内。", "Interactive live latency under a second."),
    f("智能处理", "Smart processing", "自动转码、审核、封面与字幕。", "Automatic transcoding, moderation, covers and captions."),
    f("多端 SDK", "SDKs everywhere", "覆盖 iOS、Android、Web 与小程序。", "iOS, Android, Web and mini-program SDKs."),
  ],
  enterprise: [
    f("一站办理", "One-stop service", "域名、建站、备案与通信在同一账号完成。", "Domains, sites, filing and messaging in one account."),
    f("价格透明", "Transparent pricing", "注册与续费价格公开，无隐藏费用。", "Published registration and renewal prices."),
    f("专人协助", "Human assistance", "备案与认证全程有专人跟进。", "Dedicated help through filing and verification."),
    f("高送达率", "High deliverability", "短信与邮件多通道保障送达。", "Multi-channel delivery for SMS and email."),
  ],
  iot: [
    f("海量连接", "Massive connectivity", "支持千万级设备同时在线。", "Tens of millions of devices online at once."),
    f("多协议接入", "Multi-protocol", "MQTT、CoAP、HTTP 与工业协议。", "MQTT, CoAP, HTTP and industrial protocols."),
    f("边云协同", "Edge-cloud sync", "边缘侧离线运行，联网后自动同步。", "Run offline at the edge, sync when connected."),
    f("设备安全", "Device security", "一机一密认证与传输加密。", "Per-device credentials and encrypted transport."),
  ],
  devops: [
    f("开箱即用", "Ready to use", "基础功能免费，开通即可使用。", "Core features free and ready on activation."),
    f("统一权限", "Unified access", "与访问控制打通，细粒度授权。", "Integrated with IAM for fine-grained permissions."),
    f("自动化", "Automation", "模板化编排，减少手工操作。", "Template-driven automation reduces manual work."),
    f("全面审计", "Full audit", "所有操作留痕，便于追溯。", "Every action is recorded for traceability."),
  ],
};

export type SpecRow = { name: string; cpu: number; mem: number; extra: string; month: number };

const computeSpecs: Record<string, SpecRow[]> = {
  ecs: [
    { name: "ecs.g8.large", cpu: 2, mem: 4, extra: "1–5 Mbps", month: 68 },
    { name: "ecs.g8.xlarge", cpu: 4, mem: 8, extra: "1–10 Mbps", month: 136 },
    { name: "ecs.g8.2xlarge", cpu: 8, mem: 16, extra: "1–20 Mbps", month: 272 },
    { name: "ecs.g8.4xlarge", cpu: 16, mem: 32, extra: "1–50 Mbps", month: 544 },
    { name: "ecs.r8.2xlarge", cpu: 8, mem: 64, extra: "1–20 Mbps", month: 498 },
  ],
  lighthouse: [
    { name: "Starter", cpu: 2, mem: 2, extra: "3 Mbps · 40 GB", month: 24 },
    { name: "Basic", cpu: 2, mem: 4, extra: "5 Mbps · 60 GB", month: 48 },
    { name: "Standard", cpu: 4, mem: 8, extra: "8 Mbps · 100 GB", month: 98 },
  ],
  hcs: [
    { name: "hfc8.large", cpu: 2, mem: 4, extra: "4.2 GHz", month: 168 },
    { name: "hfc8.xlarge", cpu: 4, mem: 8, extra: "4.2 GHz", month: 336 },
    { name: "hfc8.2xlarge", cpu: 8, mem: 16, extra: "4.2 GHz", month: 672 },
  ],
  gpu: [
    { name: "gn8.xlarge · 1 GPU", cpu: 16, mem: 64, extra: "24 GB VRAM", month: 1980 },
    { name: "gn8.4xlarge · 4 GPU", cpu: 64, mem: 256, extra: "4 × 24 GB", month: 7680 },
    { name: "gn8t.8xlarge · 8 GPU", cpu: 128, mem: 1024, extra: "8 × 80 GB", month: 49800 },
  ],
  bms: [
    { name: "ebm.g8.16xlarge", cpu: 64, mem: 256, extra: "2 × 25 Gbps", month: 2680 },
    { name: "ebm.r8.32xlarge", cpu: 128, mem: 1024, extra: "2 × 25 Gbps", month: 6980 },
  ],
};

export function specsFor(p: Product): SpecRow[] | null {
  return computeSpecs[p.slug] ?? null;
}

export type Tier = { name: L; price: number | null; points: L[] };

export function tiersFor(p: Product): Tier[] {
  const base = p.from ?? null;
  return [
    {
      name: { zh: "基础版", en: "Basic" },
      price: base === null ? null : base,
      points: [{ zh: "适合开发测试与小规模业务", en: "For dev/test and small workloads" }, { zh: "单可用区部署", en: "Single-zone" }, { zh: "工单支持", en: "Ticket support" }],
    },
    {
      name: { zh: "标准版", en: "Standard" },
      price: base === null ? null : Math.round(base * 2.6),
      points: [{ zh: "适合生产环境", en: "For production" }, { zh: "多可用区高可用", en: "Multi-zone HA" }, { zh: "监控告警与自动备份", en: "Monitoring and backups" }],
    },
    {
      name: { zh: "企业版", en: "Enterprise" },
      price: null,
      points: [{ zh: "专属资源与网络隔离", en: "Dedicated resources and isolation" }, { zh: "专属架构师", en: "Dedicated architect" }, { zh: "定制 SLA", en: "Custom SLA" }],
    },
  ];
}

export function faqsFor(p: Product): { q: L; a: L }[] {
  const n = p.name;
  return [
    {
      q: { zh: `${n.zh} 如何计费？`, en: `How is ${n.en} billed?` },
      a: { zh: "支持包年包月与按量付费两种方式。包年包月价格更低，按量付费可随时释放、按秒结算。", en: "Choose subscription or pay-as-you-go. Subscriptions cost less; pay-as-you-go is billed per second and can be released anytime." },
    },
    {
      q: { zh: "可以先免费试用吗？", en: "Is there a free trial?" },
      a: { zh: "新用户注册后可领取试用额度，部分产品提供最长 3 个月的免费试用。", en: "New accounts get trial credits, and some products offer up to 3 months free." },
    },
    {
      q: { zh: "购买后能否调整配置？", en: "Can I change the configuration later?" },
      a: { zh: "可以。在控制台在线升降配，费用按剩余时长自动补差或退还。", en: "Yes. Resize online in the console; charges are prorated automatically." },
    },
    {
      q: { zh: "遇到问题如何获得帮助？", en: "How do I get help?" },
      a: { zh: "可随时咨询页面右下角的智能客服，或在控制台提交工单，紧急问题 15 分钟内响应。", en: "Ask the assistant at the bottom right, or open a ticket in the console. Urgent tickets get a response within 15 minutes." },
    },
  ];
}
