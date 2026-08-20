"use client";

import { useState } from "react";
import { ExpandingButton } from "@workspace/ui/components/expanding-button";

export function ExpandingButtonPreview() {
  const [selection, setSelection] = useState("No view selected");

  return (
    <div className="flex min-h-[520px] w-full flex-col items-center justify-center gap-6 overflow-hidden px-4 py-16">
      <div className="w-full max-w-xl">
        <ExpandingButton
          onSelect={(option) => setSelection(`${option} selected`)}
        />
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {selection}
      </p>
    </div>
  );
}
