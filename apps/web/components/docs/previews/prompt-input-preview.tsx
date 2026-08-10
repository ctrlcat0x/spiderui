"use client";

import { useState } from "react";

import { PromptInput } from "@workspace/ui/components/prompt-input";

export function PromptInputPreview() {
  const [submitted, setSubmitted] = useState("");

  return (
    <div className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[16%] bottom-[-18%] h-[56%] rounded-[50%] bg-[radial-gradient(circle_at_center,#fb923c_0%,#f472b6_40%,#818cf8_72%,transparent_100%)] opacity-30 blur-3xl dark:opacity-15"
      />
      <PromptInput
        onSubmit={(value) => setSubmitted(value)}
        className="relative z-10"
      />
      <p aria-live="polite" className="sr-only">
        {submitted ? `Submitted: ${submitted}` : ""}
      </p>
    </div>
  );
}
