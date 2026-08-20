"use client";

import { useState } from "react";
import {
  FeedbackInput,
  type FeedbackOption,
} from "@workspace/ui/components/feedback-input";

export function FeedbackInputPreview() {
  const [selection, setSelection] = useState<FeedbackOption | null>(null);

  return (
    <div className="flex min-h-[520px] w-full flex-col items-center justify-center gap-6 overflow-hidden px-5 py-16">
      <FeedbackInput onValueChange={(_, option) => setSelection(option)} />
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {selection
          ? selection.label
          : "How satisfied are you with your experience?"}
      </p>
    </div>
  );
}
