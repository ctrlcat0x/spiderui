"use client";

import { RichButton } from "@workspace/ui/components/rich-button";

export function RichButtonPreview() {
  return (
    <div className="flex min-h-[360px] w-full items-center justify-center px-6 py-16">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <RichButton>Default</RichButton>
        <RichButton color="orange">Button</RichButton>
        <RichButton color="purple">Button</RichButton>
      </div>
    </div>
  );
}
