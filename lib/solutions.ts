import type { L } from "./site";

export type Solution = {
  id: string;
  name: L;
  title: L;
  desc: L;
  flow: L[];
  products: string[];
  points: L[];
};

export const solutions: Solution[] = [
  {
    id: "ai-app",
    name: { zh: "AI 应用", en: "AI apps" },
    title: { zh: "把企业知识接进大模型，十天上线一个智能助手", en: "Connect company knowledge to a model and ship an assistant in days" },
    desc: { zh: "用向量检索为大模型提供企业文档上下文，在智能体开发平台编排工具调用，最后发布到官网、App 或企业微信。", en: "Ground models in your documents with vector search, orchestrate tools in Agent Studio, then publish to your site, app or workplace chat." },
    flow: [{ zh: "企业文档", en: "Documents" }, { zh: "向量检索", en: "Vector search" }, { zh: "大模型", en: "Model" }, { zh: "智能体", en: "Agent" }],
    products: ["maas", "agent-studio", "vector", "gpu"],
    points: [
      { zh: "文档自动切分与向量化，支持权限隔离", en: "Automatic chunking and embedding with access control" },
      { zh: "模型可随时切换，按调用量计费", en: "Swap models anytime, pay per call" },
      { zh: "对话记录留存，便于质检与优化", en: "Conversation logs for QA and tuning" },
    ],
  },
  {
    id: "internet",
    name: { zh: "互联网", en: "Internet" },
    title: { zh: "流量涨十倍的那天，架构不用重写", en: "When traffic grows tenfold, the architecture holds" },
    desc: { zh: "容器化部署应用，负载均衡配合弹性伸缩应对高峰，数据库读写分离，静态资源交给 CDN。", en: "Containerized apps behind load balancers with auto scaling, read/write-split databases and CDN for static assets." },
    flow: [{ zh: "用户请求", en: "Users" }, { zh: "CDN / 负载均衡", en: "CDN / LB" }, { zh: "容器集群", en: "Containers" }, { zh: "数据库与缓存", en: "DB & cache" }],
    products: ["kubernetes", "slb", "cdn", "redis"],
    points: [
      { zh: "分钟级扩容，高峰后自动回收", en: "Scale out in minutes, scale back after peaks" },
      { zh: "灰度发布与一键回滚", en: "Canary releases and one-click rollback" },
      { zh: "全链路监控定位慢请求", en: "End-to-end tracing for slow requests" },
    ],
  },
  {
    id: "gaming",
    name: { zh: "游戏", en: "Gaming" },
    title: { zh: "把游戏服部署在离玩家最近的地方", en: "Run game servers close to your players" },
    desc: { zh: "高频计算实例承载战斗服，全球多地域就近部署，DDoS 高防保护登录与支付入口。", en: "High-frequency instances for battle servers, multi-region placement near players, and Anti-DDoS on login and payments." },
    flow: [{ zh: "玩家", en: "Players" }, { zh: "高防入口", en: "DDoS shield" }, { zh: "游戏服", en: "Game servers" }, { zh: "状态存储", en: "State store" }],
    products: ["hcs", "anti-ddos", "redis", "rtc"],
    points: [
      { zh: "开服前压测，按开服节奏批量交付", en: "Load test before launch, bulk delivery on schedule" },
      { zh: "跨地域私网同步玩家数据", en: "Private cross-region sync of player data" },
      { zh: "攻击时业务不中断", en: "Stay online during attacks" },
    ],
  },
  {
    id: "retail",
    name: { zh: "电商零售", en: "Retail" },
    title: { zh: "大促零点，下单链路依然顺畅", en: "Checkout stays smooth at midnight sales" },
    desc: { zh: "商品、订单、支付拆分为独立服务，消息队列削峰填谷，缓存承接热点商品访问。", en: "Split catalog, orders and payments into services, smooth spikes with queues, and cache hot items." },
    flow: [{ zh: "商城前端", en: "Storefront" }, { zh: "API 网关", en: "API gateway" }, { zh: "订单服务", en: "Orders" }, { zh: "消息队列", en: "Queue" }],
    products: ["apigw", "rocketmq", "rds-mysql", "waf"],
    points: [
      { zh: "提前演练容量，实时查看水位", en: "Capacity drills and live headroom view" },
      { zh: "防刷单与爬虫拦截", en: "Bot and fraud traffic filtering" },
      { zh: "会员数据加密存储", en: "Encrypted customer data" },
    ],
  },
  {
    id: "finance",
    name: { zh: "金融", en: "Finance" },
    title: { zh: "满足监管要求，同时保持迭代速度", en: "Meet regulation without slowing delivery" },
    desc: { zh: "专属宿主机与独立网络隔离核心系统，全量操作审计，两地三中心容灾。", en: "Dedicated hosts and isolated networks for core systems, full audit trails and multi-site disaster recovery." },
    flow: [{ zh: "业务终端", en: "Channels" }, { zh: "安全边界", en: "Perimeter" }, { zh: "核心系统", en: "Core systems" }, { zh: "容灾中心", en: "DR site" }],
    products: ["ddh", "kms", "actiontrail", "polar"],
    points: [
      { zh: "支持等保三级合规建设", en: "Supports MLPS Level 3 compliance builds" },
      { zh: "密钥由硬件安全模块托管", en: "HSM-backed key custody" },
      { zh: "同城双活，异地备份", en: "Active-active in-city, remote backup" },
    ],
  },
  {
    id: "manufacturing",
    name: { zh: "制造", en: "Manufacturing" },
    title: { zh: "让车间设备的数据流进决策", en: "Turn factory data into decisions" },
    desc: { zh: "物联网平台接入产线设备，边缘节点就地处理，云端数据仓库汇总分析质量与产能。", en: "Connect production lines to the IoT platform, process at the edge, and analyze quality and output in the warehouse." },
    flow: [{ zh: "产线设备", en: "Machines" }, { zh: "边缘节点", en: "Edge" }, { zh: "物联网平台", en: "IoT platform" }, { zh: "数据仓库", en: "Warehouse" }],
    products: ["iot-platform", "edge", "warehouse", "bi"],
    points: [
      { zh: "兼容主流工业协议", en: "Works with common industrial protocols" },
      { zh: "断网时边缘侧继续运行", en: "Edge keeps running when offline" },
      { zh: "设备异常实时告警", en: "Real-time equipment alerts" },
    ],
  },
  {
    id: "media",
    name: { zh: "音视频", en: "Media" },
    title: { zh: "从开播到回放，一套服务完成", en: "From going live to replay, in one stack" },
    desc: { zh: "直播推流、实时转码、内容审核与点播回放，播放质量可按地区与运营商查看。", en: "Ingest, transcode, moderate and replay, with playback quality by region and carrier." },
    flow: [{ zh: "主播推流", en: "Ingest" }, { zh: "转码审核", en: "Transcode" }, { zh: "CDN 分发", en: "CDN" }, { zh: "观众播放", en: "Playback" }],
    products: ["live", "vod", "mps", "cdn"],
    points: [
      { zh: "超低延时互动直播", en: "Ultra-low-latency interactive live" },
      { zh: "智能审核降低人工成本", en: "AI moderation cuts manual review" },
      { zh: "按需录制与剪辑", en: "On-demand recording and clipping" },
    ],
  },
];
