import type { L } from "./site";

export type Region = {
  id: string;
  name: L;
  area: "cn" | "apac" | "emea" | "americas";
  loc: [number, number];
  zones: number;
  /** 示例：从上海出发的参考延迟，毫秒 */
  rtt: number;
};

export const regions: Region[] = [
  { id: "cn-beijing", name: { zh: "华北 · 北京", en: "Beijing" }, area: "cn", loc: [39.9, 116.4], zones: 5, rtt: 28 },
  { id: "cn-ulanqab", name: { zh: "华北 · 乌兰察布", en: "Ulanqab" }, area: "cn", loc: [41.0, 113.1], zones: 3, rtt: 34 },
  { id: "cn-shanghai", name: { zh: "华东 · 上海", en: "Shanghai" }, area: "cn", loc: [31.23, 121.47], zones: 5, rtt: 3 },
  { id: "cn-hangzhou", name: { zh: "华东 · 杭州", en: "Hangzhou" }, area: "cn", loc: [30.27, 120.15], zones: 4, rtt: 6 },
  { id: "cn-shenzhen", name: { zh: "华南 · 深圳", en: "Shenzhen" }, area: "cn", loc: [22.54, 114.06], zones: 4, rtt: 31 },
  { id: "cn-chengdu", name: { zh: "西南 · 成都", en: "Chengdu" }, area: "cn", loc: [30.57, 104.07], zones: 2, rtt: 38 },
  { id: "cn-hongkong", name: { zh: "中国香港", en: "Hong Kong" }, area: "apac", loc: [22.32, 114.17], zones: 3, rtt: 33 },
  { id: "ap-singapore", name: { zh: "新加坡", en: "Singapore" }, area: "apac", loc: [1.35, 103.82], zones: 3, rtt: 68 },
  { id: "ap-tokyo", name: { zh: "日本 · 东京", en: "Tokyo" }, area: "apac", loc: [35.68, 139.69], zones: 3, rtt: 52 },
  { id: "ap-seoul", name: { zh: "韩国 · 首尔", en: "Seoul" }, area: "apac", loc: [37.57, 126.98], zones: 2, rtt: 44 },
  { id: "ap-jakarta", name: { zh: "印尼 · 雅加达", en: "Jakarta" }, area: "apac", loc: [-6.2, 106.85], zones: 2, rtt: 82 },
  { id: "me-dubai", name: { zh: "阿联酋 · 迪拜", en: "Dubai" }, area: "emea", loc: [25.2, 55.27], zones: 2, rtt: 168 },
  { id: "eu-frankfurt", name: { zh: "德国 · 法兰克福", en: "Frankfurt" }, area: "emea", loc: [50.11, 8.68], zones: 3, rtt: 205 },
  { id: "us-virginia", name: { zh: "美国 · 弗吉尼亚", en: "Virginia" }, area: "americas", loc: [38.9, -77.0], zones: 3, rtt: 228 },
  { id: "us-siliconvalley", name: { zh: "美国 · 硅谷", en: "Silicon Valley" }, area: "americas", loc: [37.39, -122.08], zones: 2, rtt: 162 },
];

export const areaName: Record<Region["area"], L> = {
  cn: { zh: "中国内地", en: "Mainland China" },
  apac: { zh: "亚太", en: "Asia Pacific" },
  emea: { zh: "欧洲与中东", en: "Europe & Middle East" },
  americas: { zh: "美洲", en: "Americas" },
};

export const totalZones = regions.reduce((n, r) => n + r.zones, 0);
