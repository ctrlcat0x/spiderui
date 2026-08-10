"use client";

import { useState } from "react";

import { SmoothInput } from "@workspace/ui/components/smooth-input";

export function SmoothInputPreview({ invalid = false }: { invalid?: boolean }) {
  const [title, setTitle] = useState("Designing better interfaces");
  const [subtitle, setSubtitle] = useState(
    "Small details make software feel considered.",
  );

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center px-6 py-14">
      <div className="w-full max-w-md space-y-6">
        <SmoothInput
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          errorMessage={invalid ? "A title is required." : undefined}
          invalid={invalid}
        />
        <SmoothInput
          label="Subtitle"
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          description="The caret follows edits, selections, and horizontal scrolling."
        />
      </div>
    </div>
  );
}
