"use client";

import { useState } from "react";

import { PromptInputBox } from "@workspace/ui/components/ai-prompt-box";

export function AIPromptBoxPreview() {
  const [lastMessage, setLastMessage] = useState("");

  return (
    <div className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[14%] bottom-[-20%] h-[58%] rounded-[50%] bg-[radial-gradient(circle_at_center,#f97316_0%,#ec4899_38%,#818cf8_68%,transparent_100%)] opacity-35 blur-3xl dark:opacity-15"
      />
      <div className="relative z-10 w-full max-w-[560px]">
        <PromptInputBox onSend={(message) => setLastMessage(message)} />
        <p aria-live="polite" className="sr-only">
          {lastMessage ? `Sent: ${lastMessage}` : ""}
        </p>
      </div>
    </div>
  );
}
