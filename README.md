# 安信云 AXCloud 官网

云服务官网 + 用户控制台演示站。参考阿里云、华为云的业务结构，覆盖 13 大类、84 款产品，首页接入智能体客服，支持简体中文（默认）与英文切换。

## 技术栈

| 用途 | 选型 |
| --- | --- |
| 框架 | Next.js 16（App Router、Turbopack）+ React 19 + TypeScript |
| 样式 | Tailwind CSS 4（设计令牌见 `app/globals.css` 的 `@theme`） |
| 国际化 | next-intl 4：`/` 为简体中文，`/en` 为英文 |
| 智能客服 | `@anthropic-ai/sdk`，流式输出，模型 `claude-opus-5-5` |
| 开源组件 | motion（动效）、cobe（WebGL 地球）、recharts（控制台图表）、lucide-react（图标） |
| 字体 | 中文使用系统字体（苹方 / HarmonyOS Sans / 微软雅黑）；数字与英文使用本地托管的 Archivo 可变字体 |

## 本地运行

```bash
npm install
cp .env.example .env.local   # 可选：填入 ANTHROPIC_API_KEY 启用真实大模型回答
npm run dev                  # http://localhost:3100
```

生产构建：`npm run build && npm start`

## 页面

| 路径 | 内容 |
| --- | --- |
| `/` | 首页：开通演示主视觉、活动入口、大模型与智能体、全部产品、行业方案、全球基础设施、服务保障 |
| `/products` | 全部产品（分类筛选 + 搜索） |
| `/products/[slug]` | 产品详情：优势、规格与价格、适用场景、常见问题、相关产品（84 款自动生成） |
| `/login` | 登录 / 注册（`?mode=signup`），演示环境任意账号可进入控制台 |
| `/console` | 控制台概览：余额、消费趋势、资源、通知 |
| `/console/ecs` | 云服务器列表、启停、创建向导（可从首页主视觉带参数跳转） |
| `/console/storage` `database` `maas` `billing` `tickets` | 对象存储、数据库、大模型 API Key、费用中心、工单 |

所有页面在 `/en/...` 下提供英文版。

## 动效

- 共用动效组件在 `components/motion/primitives.tsx`：滚动进入（`Reveal`）、数字滚动（`CountUp`）、离屏暂停（`useActive`）。
- 主视觉：数据包沿机柜导轨流动的 Canvas 背景（`components/home/HeroBackdrop.tsx`）、标题逐行揭示、配置选择高亮滑动、开通进度条与价格滚动。
- 大模型区：循环播放的流式调用演示（`components/home/StreamDemo.tsx`）。
- 地球：骨干网连线、选中地域脉动，无人操作时自动巡览各地域。
- 系统开启“减少动态效果”时，位移与循环动画自动关闭；离开视口的循环动画会暂停。

## 智能体客服

- 前端：`components/agent/AgentWidget.tsx`，右下角悬浮入口；页面任意位置可通过 `openAgent(prompt)`（`lib/agent-bus.ts`）唤起并预填问题。
- 后端：`app/api/agent/route.ts`，系统提示词由 `lib/agent-knowledge.ts` 根据产品目录、地域、价格自动生成，并开启提示词缓存。
- 未配置 `ANTHROPIC_API_KEY` 或调用失败时，自动回退到内置知识库回答，界面会提示「演示模式」。
- 支持「转人工」、新对话、会话在本标签页内保留。

## 修改内容

- 品牌名称、热线、备案号：`lib/site.ts`
- 产品目录与价格：`lib/catalog.ts`、`lib/product-content.ts`
- 地域：`lib/regions.ts`；行业方案：`lib/solutions.ts`
- 界面文案：`messages/zh.json`、`messages/en.json`
- 控制台演示数据：`lib/console-data.ts`

## 说明

- 本站为演示样板：价格、地域、延迟与案例均为示例数据，控制台没有真实后端。
- 项目位于共享文件夹时 Turbopack 磁盘缓存会报错，已在 `next.config.ts` 中关闭。
- 在 Parallels 共享文件夹中执行 `npm run build` 偶尔会出现 `ENOENT` / `File exists` 写入错误，属于文件系统问题；在本机磁盘或 CI 中构建即可正常完成。
