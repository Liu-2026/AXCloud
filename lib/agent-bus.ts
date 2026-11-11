// 页面任意位置唤起智能客服，可附带一个预填问题。
export const AGENT_EVENT = "ax:agent-open";

export function openAgent(prompt?: string) {
  window.dispatchEvent(new CustomEvent(AGENT_EVENT, { detail: { prompt } }));
}
