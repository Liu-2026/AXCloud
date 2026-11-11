"use client";

import { MessageCircleQuestion } from "lucide-react";
import { openAgent } from "@/lib/agent-bus";

export default function AskAgentButton({ prompt, label, className = "btn btn-ghost" }: { prompt: string; label: string; className?: string }) {
  return (
    <button type="button" onClick={() => openAgent(prompt)} className={className}>
      <MessageCircleQuestion size={16} aria-hidden="true" />
      {label}
    </button>
  );
}
