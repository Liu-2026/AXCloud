// 品牌配置集中在这里，替换为正式品牌时只需修改此文件。
export const site = {
  name: { zh: "安信云", en: "AXCloud" },
  short: "AX",
  hotline: "400-820-0000",
  email: "service@axcloud.example",
  icp: "京ICP备00000000号-1（示例）",
  police: "京公网安备 00000000000000号（示例）",
};

export type L = { zh: string; en: string };
export type Loc = "zh" | "en";

export const pick = (l: L, locale: string) => (locale === "en" ? l.en : l.zh);
