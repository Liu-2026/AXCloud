import type { L } from "./site";

export type CategoryId =
  | "ai" | "compute" | "container" | "storage" | "network" | "security" | "database"
  | "middleware" | "bigdata" | "media" | "enterprise" | "iot" | "devops";

export type Product = {
  slug: string;
  category: CategoryId;
  name: L;
  desc: L;
  tag?: "hot" | "new" | "free";
  /** 起步价，单位元/月；无则为按量或询价 */
  from?: number;
  unit?: L;
};

export type Category = { id: CategoryId; name: L; blurb: L };

export const categories: Category[] = [
  { id: "ai", name: { zh: "人工智能与大模型", en: "AI & Models" }, blurb: { zh: "模型调用、智能体构建、训练与推理算力", en: "Model APIs, agent building, training and inference compute" } },
  { id: "compute", name: { zh: "计算", en: "Compute" }, blurb: { zh: "从轻量实例到裸金属，按业务选择算力形态", en: "From lightweight instances to bare metal" } },
  { id: "container", name: { zh: "容器与 Serverless", en: "Containers & Serverless" }, blurb: { zh: "托管 Kubernetes、函数与应用引擎", en: "Managed Kubernetes, functions and app engines" } },
  { id: "storage", name: { zh: "存储", en: "Storage" }, blurb: { zh: "对象、块、文件存储与数据备份", en: "Object, block, file storage and backup" } },
  { id: "network", name: { zh: "网络与 CDN", en: "Networking & CDN" }, blurb: { zh: "私有网络、负载均衡、加速与互联", en: "Private networks, load balancing, acceleration" } },
  { id: "security", name: { zh: "安全", en: "Security" }, blurb: { zh: "防护、检测、证书与密钥管理", en: "Protection, detection, certificates, keys" } },
  { id: "database", name: { zh: "数据库", en: "Databases" }, blurb: { zh: "关系型、缓存、文档与分布式数据库", en: "Relational, cache, document and distributed" } },
  { id: "middleware", name: { zh: "中间件", en: "Middleware" }, blurb: { zh: "消息队列、API 网关与微服务治理", en: "Messaging, API gateway, microservices" } },
  { id: "bigdata", name: { zh: "大数据", en: "Big Data" }, blurb: { zh: "数据仓库、实时计算、日志与 BI", en: "Warehousing, streaming, logs and BI" } },
  { id: "media", name: { zh: "视频与媒体", en: "Media" }, blurb: { zh: "点播、直播、实时音视频与媒体处理", en: "VOD, live, RTC and media processing" } },
  { id: "enterprise", name: { zh: "企业应用与通信", en: "Business & Messaging" }, blurb: { zh: "域名、建站、备案、短信与邮件", en: "Domains, sites, ICP filing, SMS and email" } },
  { id: "iot", name: { zh: "物联网", en: "IoT" }, blurb: { zh: "设备接入、边缘计算与数据流转", en: "Device access, edge computing, data flow" } },
  { id: "devops", name: { zh: "开发与运维", en: "DevOps & Management" }, blurb: { zh: "流水线、监控、权限与资源编排", en: "Pipelines, monitoring, IAM, orchestration" } },
];

type Row = [slug: string, cat: CategoryId, zh: string, en: string, dzh: string, den: string, tag?: Product["tag"], from?: number];

const rows: Row[] = [
  // AI
  ["maas", "ai", "大模型服务平台", "Model Service Platform", "一个 API 调用主流开源与商用大模型，按 Token 计费", "One API for leading open and commercial models, billed per token", "hot"],
  ["agent-studio", "ai", "智能体开发平台", "Agent Studio", "低代码编排知识库、工具与工作流，发布到网站或企业微信", "Compose knowledge, tools and workflows; publish to web or IM", "new"],
  ["gpu", "ai", "GPU 云服务器", "GPU Instances", "面向训练与推理的高性能 GPU 实例，支持多卡互联", "High-performance GPU instances for training and inference", "hot", 1980],
  ["ml-platform", "ai", "机器学习平台", "ML Platform", "数据标注、分布式训练、模型评测与在线推理一站完成", "Labeling, distributed training, evaluation and serving"],
  ["vector", "ai", "向量检索服务", "Vector Search", "毫秒级向量相似度检索，为 RAG 应用提供语义召回", "Millisecond vector similarity search for RAG"],
  ["speech", "ai", "智能语音交互", "Speech AI", "实时语音识别、语音合成与声音复刻", "Real-time ASR, TTS and voice cloning"],
  ["vision", "ai", "图像与视觉智能", "Vision AI", "OCR、图像审核、商品识别与图像生成", "OCR, moderation, product recognition, image generation"],
  ["ai-service-bot", "ai", "智能客服机器人", "AI Service Bot", "基于企业知识库的多轮对话客服，可转接人工", "Knowledge-grounded multi-turn support with human handoff", "new"],
  // compute
  ["ecs", "compute", "云服务器 ECS", "Elastic Compute Service", "安全稳定、弹性伸缩的云计算服务，秒级交付", "Secure, elastic virtual servers delivered in seconds", "hot", 38],
  ["lighthouse", "compute", "轻量应用服务器", "Lightweight Server", "内置应用镜像，开箱即用，适合建站与开发测试", "Pre-built app images for websites and dev/test", "hot", 24],
  ["bms", "compute", "裸金属服务器", "Bare Metal Server", "独享物理机性能，兼具云的弹性与运维便利", "Dedicated physical performance with cloud elasticity", undefined, 2680],
  ["hcs", "compute", "高频计算实例", "High-Frequency Instances", "高主频处理器，适合游戏服、量化交易与实时业务", "High clock-speed CPUs for game servers and trading", undefined, 168],
  ["autoscaling", "compute", "弹性伸缩", "Auto Scaling", "按负载或定时策略自动增减实例数量", "Scale instances on load or schedule", "free"],
  ["ddh", "compute", "专属宿主机", "Dedicated Host", "独占物理服务器资源，满足合规与许可要求", "Single-tenant hosts for compliance and licensing"],
  ["batch", "compute", "批量计算", "Batch Compute", "大规模并行任务调度，适合渲染与基因分析", "Massively parallel job scheduling"],
  ["cloud-desktop", "compute", "云电脑", "Cloud Desktop", "随时随地接入的安全云桌面，数据不落地", "Secure desktops from anywhere, data stays in cloud", undefined, 59],
  // container
  ["kubernetes", "container", "容器服务 Kubernetes 版", "Kubernetes Service", "托管控制面，兼容社区 Kubernetes，自动运维节点", "Managed control plane, upstream-compatible", "hot"],
  ["registry", "container", "容器镜像服务", "Container Registry", "企业级镜像托管、安全扫描与全球分发", "Enterprise image hosting, scanning, global sync"],
  ["functions", "container", "函数计算", "Function Compute", "事件驱动、按调用计费，无需管理服务器", "Event-driven, pay-per-invocation functions", "free"],
  ["sae", "container", "Serverless 应用引擎", "Serverless App Engine", "直接部署 Web 与微服务应用，按实际用量计费", "Deploy web apps and microservices, pay for usage"],
  ["mesh", "container", "服务网格", "Service Mesh", "托管 Istio，统一流量治理与可观测", "Managed Istio for traffic and observability"],
  // storage
  ["oss", "storage", "对象存储 OSS", "Object Storage", "海量、安全、低成本的数据存储，支持多种存储类型", "Massive, durable, low-cost object storage", "hot", 9],
  ["ebs", "storage", "块存储 云盘", "Block Storage", "高可靠云盘，最高百万级 IOPS", "Durable cloud disks up to millions of IOPS"],
  ["nas", "storage", "文件存储 NAS", "File Storage", "可共享访问、弹性扩展的分布式文件系统", "Shared, elastic distributed file system"],
  ["backup", "storage", "云备份", "Cloud Backup", "统一备份服务器、数据库与文件，按需恢复", "Unified backup for servers, databases, files"],
  ["storage-gateway", "storage", "存储网关", "Storage Gateway", "本地数据中心与云存储无缝对接", "Bridge on-premises data centers to cloud storage"],
  ["archive", "storage", "归档存储", "Archive Storage", "长期保存冷数据，单价低至每 GB 几分钱", "Long-term cold data at a fraction of the cost"],
  // network
  ["vpc", "network", "专有网络 VPC", "Virtual Private Cloud", "自定义网段与路由，构建隔离的云上网络", "Isolated networks with custom CIDR and routes", "free"],
  ["slb", "network", "负载均衡", "Load Balancer", "四层与七层流量分发，自动剔除异常节点", "L4/L7 traffic distribution with health checks", undefined, 12],
  ["eip", "network", "弹性公网 IP", "Elastic IP", "独立购买、随时绑定的公网 IP 地址", "Public IPs you can bind and rebind anytime"],
  ["nat", "network", "NAT 网关", "NAT Gateway", "为私网实例提供安全的公网访问出口", "Secure outbound internet for private instances"],
  ["cdn", "network", "CDN 内容分发", "CDN", "全球加速节点，降低静态资源访问延迟", "Global edge nodes for faster static content", "hot"],
  ["dcdn", "network", "全站加速", "Dynamic Acceleration", "动静态内容统一加速，智能选路", "Accelerate both static and dynamic content"],
  ["cen", "network", "云企业网", "Cloud Enterprise Network", "跨地域、跨账号的私网互联", "Private interconnect across regions and accounts"],
  ["vpn", "network", "VPN 网关", "VPN Gateway", "IPsec 与 SSL 加密隧道连接本地与云", "IPsec and SSL tunnels to on-premises"],
  ["dns", "network", "云解析 DNS", "Cloud DNS", "权威解析、智能线路与内网解析", "Authoritative, geo-routing and private DNS"],
  // security
  ["anti-ddos", "security", "DDoS 高防", "Anti-DDoS Pro", "T 级防护带宽，清洗大流量攻击", "Terabit-scale scrubbing for volumetric attacks", "hot"],
  ["waf", "security", "Web 应用防火墙", "Web Application Firewall", "拦截注入、爬虫与 0day 漏洞攻击", "Block injection, bots and zero-day exploits"],
  ["cfw", "security", "云防火墙", "Cloud Firewall", "统一管理互联网边界与 VPC 间访问控制", "Unified edge and inter-VPC access control"],
  ["security-center", "security", "云安全中心", "Security Center", "主机入侵检测、漏洞管理与基线检查", "Intrusion detection, vulnerabilities, baselines", "free"],
  ["ssl", "security", "SSL 证书", "SSL Certificates", "DV、OV、EV 证书申请、部署与到期提醒", "DV/OV/EV certificates with auto-renewal reminders", undefined, 0],
  ["bastion", "security", "运维堡垒机", "Bastion Host", "统一运维入口，操作审计全程留痕", "Single ops entry with full session audit"],
  ["kms", "security", "密钥管理服务", "Key Management", "托管加密密钥与凭据，支持硬件安全模块", "Managed keys and secrets, HSM-backed"],
  ["dsc", "security", "数据安全中心", "Data Security Center", "敏感数据识别、分级分类与脱敏", "Sensitive data discovery, classification, masking"],
  // database
  ["rds-mysql", "database", "云数据库 MySQL", "RDS for MySQL", "高可用主备架构，自动备份与秒级监控", "HA primary/standby with automated backups", "hot", 56],
  ["rds-pg", "database", "云数据库 PostgreSQL", "RDS for PostgreSQL", "支持 pgvector 等常用插件", "Popular extensions incl. pgvector", undefined, 56],
  ["sqlserver", "database", "云数据库 SQL Server", "RDS for SQL Server", "正版授权，多版本可选", "Licensed, multiple editions"],
  ["redis", "database", "云数据库 Redis", "Redis", "兼容开源 Redis，内存级读写性能", "Open-source compatible in-memory store", undefined, 25],
  ["mongodb", "database", "云数据库 MongoDB", "MongoDB", "副本集与分片集群，弹性扩容", "Replica sets and sharded clusters"],
  ["polar", "database", "云原生分布式数据库", "Cloud-Native Distributed DB", "存算分离，单库容量可达百 TB", "Disaggregated storage, up to 100 TB", "new"],
  ["dts", "database", "数据传输服务", "Data Transmission", "数据库迁移、同步与订阅，业务不停机", "Zero-downtime migration and sync"],
  ["das", "database", "数据库自治服务", "Database Autonomy", "慢 SQL 诊断与自动优化建议", "Slow-query diagnosis and tuning advice"],
  // middleware
  ["kafka", "middleware", "消息队列 Kafka 版", "Message Queue for Kafka", "100% 兼容开源 Kafka，免运维", "Fully Kafka-compatible, no ops"],
  ["rocketmq", "middleware", "消息队列 RocketMQ 版", "Message Queue for RocketMQ", "金融级可靠消息，支持事务与定时消息", "Financial-grade messaging with transactions"],
  ["rabbitmq", "middleware", "消息队列 RabbitMQ 版", "Message Queue for RabbitMQ", "兼容 AMQP 协议的托管消息服务", "Managed AMQP messaging"],
  ["apigw", "middleware", "API 网关", "API Gateway", "API 发布、鉴权、限流与监控", "Publish, secure, throttle and monitor APIs"],
  ["mse", "middleware", "微服务引擎", "Microservices Engine", "注册配置中心与云原生网关", "Service registry, config and gateway"],
  ["arms", "middleware", "应用实时监控", "Application Monitoring", "调用链追踪、前端监控与告警", "Tracing, RUM and alerting"],
  // bigdata
  ["warehouse", "bigdata", "云数据仓库", "Cloud Data Warehouse", "PB 级离线数据分析，按量付费", "Petabyte-scale analytics, pay as you go"],
  ["emr", "bigdata", "开源大数据平台 E-MapReduce", "E-MapReduce", "托管 Spark、Hive、StarRocks 等组件", "Managed Spark, Hive, StarRocks and more"],
  ["flink", "bigdata", "实时计算 Flink 版", "Realtime Compute for Flink", "毫秒级流式计算，Serverless 形态", "Millisecond stream processing, serverless"],
  ["dataworks", "bigdata", "数据开发与治理", "Data Development & Governance", "数据集成、开发调度与资产治理", "Integration, scheduling and data governance"],
  ["sls", "bigdata", "日志服务", "Log Service", "日志采集、查询分析与可视化", "Collect, query and visualize logs", "hot"],
  ["es", "bigdata", "检索分析服务 Elasticsearch", "Elasticsearch Service", "托管 Elasticsearch 与 Kibana", "Managed Elasticsearch and Kibana"],
  ["bi", "bigdata", "智能 BI", "Smart BI", "拖拽式报表与对话式数据分析", "Drag-and-drop dashboards and chat analytics", "new"],
  // media
  ["vod", "media", "视频点播", "Video on Demand", "上传、转码、加密与播放一体化", "Upload, transcode, encrypt and play"],
  ["live", "media", "视频直播", "Live Streaming", "低延时直播与录制、截图、审核", "Low-latency live with recording and moderation"],
  ["rtc", "media", "实时音视频", "Real-Time Communication", "全球低延时音视频通话 SDK", "Global low-latency audio/video SDK"],
  ["mps", "media", "媒体处理", "Media Processing", "批量转码、水印与智能封面", "Batch transcoding, watermarks, smart covers"],
  // enterprise
  ["domain", "enterprise", "域名注册", "Domain Registration", "数百种后缀，注册与续费价格透明", "Hundreds of TLDs with transparent pricing", "hot"],
  ["sitebuilder", "enterprise", "智能建站", "Site Builder", "描述需求即可生成企业官网与小程序", "Describe your business, get a site and mini-program", "new"],
  ["icp", "enterprise", "ICP 备案", "ICP Filing", "在线提交资料，专人协助审核", "Online filing with dedicated assistance", "free"],
  ["sms", "enterprise", "短信服务", "SMS", "验证码与通知短信，秒级触达", "Verification and notification SMS in seconds"],
  ["mail-push", "enterprise", "邮件推送", "Email Delivery", "事务邮件与批量邮件发送", "Transactional and bulk email"],
  ["enterprise-mail", "enterprise", "企业邮箱", "Business Email", "使用自有域名的安全企业邮箱", "Secure email on your own domain"],
  // iot
  ["iot-platform", "iot", "物联网平台", "IoT Platform", "海量设备安全接入与消息流转", "Secure connectivity for massive device fleets"],
  ["edge", "iot", "边缘计算节点", "Edge Nodes", "将计算下沉到离用户更近的边缘", "Move compute closer to users"],
  ["device-mgmt", "iot", "设备管理", "Device Management", "OTA 升级、远程配置与状态监控", "OTA, remote config and health monitoring"],
  ["iot-video", "iot", "视频物联网", "IoT Video", "摄像头接入、云存储与智能分析", "Camera access, cloud recording and analytics"],
  // devops
  ["devops", "devops", "代码托管与流水线", "Repos & Pipelines", "Git 托管、构建、测试与自动部署", "Git hosting, CI and automated deployment", "free"],
  ["monitor", "devops", "云监控", "Cloud Monitor", "资源指标监控、站点拨测与告警", "Metrics, uptime probes and alerts", "free"],
  ["ros", "devops", "资源编排", "Resource Orchestration", "用模板一键创建整套云资源", "Provision whole stacks from templates"],
  ["ram", "devops", "访问控制 RAM", "Access Management", "子账号、角色与细粒度权限", "Sub-users, roles and fine-grained policies", "free"],
  ["actiontrail", "devops", "操作审计", "Action Trail", "记录账号下所有 API 操作", "Record every API action on your account"],
  ["migration", "devops", "云迁移中心", "Migration Hub", "评估、规划并迁移本地或其他云的业务", "Assess, plan and migrate workloads"],
];

export const products: Product[] = rows.map(([slug, category, zh, en, dzh, den, tag, from]) => ({
  slug,
  category,
  name: { zh, en },
  desc: { zh: dzh, en: den },
  tag,
  from,
}));

export const featuredSlugs = ["ecs", "lighthouse", "maas", "gpu", "oss", "rds-mysql", "cdn", "anti-ddos", "kubernetes", "domain", "agent-studio", "sms"];

export const productBySlug = (slug: string) => products.find(p => p.slug === slug);
export const productsIn = (cat: CategoryId) => products.filter(p => p.category === cat);
export const categoryById = (id: CategoryId) => categories.find(c => c.id === id)!;
