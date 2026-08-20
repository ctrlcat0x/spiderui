"use client";

import { useState } from "react";
import { ExpandingMenu } from "@workspace/ui/components/expanding-menu";

export function ExpandingMenuPreview() {
  const [selection, setSelection] = useState("Choose an item to add");

  return (
    <div className="flex min-h-[520px] w-full flex-col items-center justify-center gap-6 overflow-hidden px-4 py-16">
      <ExpandingMenu
        onItemSelect={(item) => setSelection(`${item.label} selected`)}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selection}
      </p>
    </div>
  );
}
