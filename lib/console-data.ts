// 控制台演示数据（无真实后端）
export type Instance = {
  id: string;
  name: string;
  status: "running" | "stopped" | "starting";
  region: string;
  spec: string;
  ip: string;
  privateIp: string;
  expire: string;
  os: string;
};

export const initialInstances: Instance[] = [
  { id: "i-2ze8f3k1a9", name: "web-prod-01", status: "running", region: "cn-shanghai", spec: "4C8G", ip: "47.103.21.88", privateIp: "172.16.0.12", expire: "2027-03-14", os: "Ubuntu 24.04" },
  { id: "i-2ze8f3k1b2", name: "web-prod-02", status: "running", region: "cn-shanghai", spec: "4C8G", ip: "47.103.21.91", privateIp: "172.16.0.13", expire: "2027-03-14", os: "Ubuntu 24.04" },
  { id: "i-bp1a7c0d44", name: "api-gateway", status: "running", region: "cn-hangzhou", spec: "8C16G", ip: "120.55.80.17", privateIp: "172.18.4.2", expire: "2027-01-02", os: "Debian 12" },
  { id: "i-wz9k2m5n70", name: "worker-batch", status: "stopped", region: "cn-shenzhen", spec: "16C32G", ip: "—", privateIp: "172.20.1.40", expire: "2026-12-20", os: "Rocky Linux 9" },
  { id: "i-j6c4p8q2r1", name: "hk-edge-proxy", status: "running", region: "cn-hongkong", spec: "2C4G", ip: "8.210.44.3", privateIp: "10.0.2.8", expire: "2027-06-30", os: "Debian 12" },
  { id: "i-t4n1x6y3z5", name: "sg-staging", status: "running", region: "ap-singapore", spec: "2C4G", ip: "161.117.9.250", privateIp: "10.8.0.5", expire: "2026-11-28", os: "Ubuntu 24.04" },
];

/** 近 30 天每日消费，确定性生成 */
export const costTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 9, 13 + i);
  const base = 182 + Math.sin(i / 3.2) * 18 + i * 1.6;
  const spike = i === 21 ? 64 : i === 22 ? 38 : 0;
  return { date: `${d.getMonth() + 1}/${d.getDate()}`, cost: Math.round((base + spike) * 100) / 100 };
});

export const buckets = [
  { name: "axcloud-static-assets", region: "cn-shanghai", objects: 128_430, size: "312.4 GB", created: "2025-08-12" },
  { name: "user-uploads-prod", region: "cn-shanghai", objects: 2_884_102, size: "4.18 TB", created: "2025-03-02" },
  { name: "logs-archive", region: "cn-hangzhou", objects: 61_220, size: "1.02 TB", created: "2025-01-19" },
];

export const databases = [
  { name: "rm-prod-mysql", engine: "MySQL 8.0", spec: "4C16G · 500 GB", region: "cn-shanghai", status: "running" as const },
  { name: "r-session-cache", engine: "Redis 7.0", spec: "8 GB 主备", region: "cn-shanghai", status: "running" as const },
  { name: "pg-analytics", engine: "PostgreSQL 16", spec: "8C32G · 1 TB", region: "cn-hangzhou", status: "running" as const },
];

export const apiKeys = [
  { name: "prod-assistant", key: "sk-ax-••••••••3f9a", created: "2026-09-01", calls: 182_340, tokens: "41.2M" },
  { name: "dev-sandbox", key: "sk-ax-••••••••c21e", created: "2026-10-18", calls: 9_812, tokens: "2.4M" },
];

export const bills = [
  { period: "2026-10", product: { zh: "云服务器 ECS", en: "ECS" }, amount: 3184.2, paid: true },
  { period: "2026-10", product: { zh: "对象存储 OSS", en: "Object Storage" }, amount: 612.8, paid: true },
  { period: "2026-10", product: { zh: "云数据库 RDS", en: "RDS" }, amount: 1460.0, paid: true },
  { period: "2026-10", product: { zh: "大模型服务平台", en: "Model Service" }, amount: 268.55, paid: true },
  { period: "2026-11", product: { zh: "云服务器 ECS", en: "ECS" }, amount: 1098.4, paid: false },
  { period: "2026-11", product: { zh: "CDN 内容分发", en: "CDN" }, amount: 143.9, paid: false },
];

export const tickets = [
  { id: "T20261109-0182", title: { zh: "华东上海实例 web-prod-02 磁盘 IO 偏高", en: "High disk IO on web-prod-02 (Shanghai)" }, status: "processing" as const, updated: "2026-11-10 16:42" },
  { id: "T20261102-0071", title: { zh: "申请提升 GPU 实例配额", en: "Request higher GPU quota" }, status: "resolved" as const, updated: "2026-11-03 10:05" },
  { id: "T20261021-0233", title: { zh: "ICP 备案资料补充", en: "Additional ICP filing documents" }, status: "resolved" as const, updated: "2026-10-24 09:18" },
];

export const notices = [
  { zh: "实例 sg-staging 将于 17 天后到期", en: "sg-staging expires in 17 days", level: "warn" as const },
  { zh: "华东上海可用区 F 将于 11 月 20 日凌晨进行网络维护", en: "Shanghai zone F network maintenance on Nov 20, 02:00", level: "info" as const },
  { zh: "工单 T20261109-0182 有新的回复", en: "New reply on ticket T20261109-0182", level: "info" as const },
];
