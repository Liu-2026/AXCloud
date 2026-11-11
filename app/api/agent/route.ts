import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, offlineAnswer } from "@/lib/agent-knowledge";

export const runtime = "nodejs";

const SYSTEM = buildSystemPrompt();
const MAX_TURNS = 20;
const MAX_CHARS = 2000;

type Incoming = { role: "user" | "assistant"; content: string };

let client: Anthropic | null = null;
function getClient() {
  // 凭据按 SDK 默认顺序解析：ANTHROPIC_API_KEY、ANTHROPIC_AUTH_TOKEN 或本机登录配置
  if (!client) client = new Anthropic();
  return client;
}

function textStream(text: string, mode: "offline" | "live") {
  return new Response(text, { headers: { "content-type": "text/plain; charset=utf-8", "x-agent-mode": mode } });
}

export async function POST(req: Request) {
  let body: { messages?: Incoming[]; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const locale = body.locale === "en" ? "en" : "zh";
  const messages: Anthropic.Beta.BetaMessageParam[] = (body.messages ?? [])
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-MAX_TURNS)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  // 对话必须以用户消息开头和结尾
  while (messages.length && messages[0].role !== "user") messages.shift();
  const last = messages.at(-1);
  if (!last || last.role !== "user") return new Response("Bad request", { status: 400 });
  const question = last.content as string;

  if (process.env.AGENT_OFFLINE === "1") return textStream(offlineAnswer(question, locale), "offline");

  let stream: ReturnType<Anthropic["beta"]["messages"]["stream"]>;
  try {
    stream = getClient().beta.messages.stream({
      model: "claude-opus-5-5",
      // 客服回复较短；公开页面上限制单次输出以控制成本
      max_tokens: 4096,
      output_config: { effort: "low" },
      cache_control: { type: "ephemeral" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages,
    });
    // 等到第一个事件，确认凭据与连接可用；失败则回退到内置回答
    const it = stream[Symbol.asyncIterator]();
    const first = await it.next();

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        const push = (ev: IteratorResult<Anthropic.Beta.BetaRawMessageStreamEvent>) => {
          if (!ev.done && ev.value.type === "content_block_delta" && ev.value.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(ev.value.delta.text));
          }
        };
        try {
          push(first);
          for (let ev = await it.next(); !ev.done; ev = await it.next()) push(ev);
          const final = await stream.finalMessage();
          if (final.stop_reason === "refusal") {
            controller.enqueue(encoder.encode(locale === "en" ? "\n\nI can't help with that one. Please choose \"Talk to a person\"." : "\n\n这个问题我无法回答，建议点击「转人工」。"));
          }
        } catch (err) {
          console.error("[agent] stream error", err);
          controller.enqueue(encoder.encode(locale === "en" ? "\n\n(Connection interrupted. Please try again.)" : "\n\n（连接中断，请重试。）"));
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort();
      },
    });
    return new Response(readable, { headers: { "content-type": "text/plain; charset=utf-8", "x-agent-mode": "live", "cache-control": "no-store" } });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      console.warn("[agent] no valid credentials, using offline answers");
    } else if (err instanceof Anthropic.RateLimitError) {
      console.warn("[agent] rate limited, using offline answers");
    } else if (err instanceof Anthropic.APIError) {
      console.error("[agent] API error", err.status, err.message);
    } else {
      console.warn("[agent] model unavailable:", (err as Error).message);
    }
    return textStream(offlineAnswer(question, locale), "offline");
  }
}
