"use client";

import { EmojiReaction } from "@workspace/ui/components/emoji-reaction";

export function EmojiReactionPreview() {
  return (
    <div className="flex min-h-[520px] w-full items-center justify-center overflow-hidden px-5 py-16">
      <EmojiReaction />
    </div>
  );
}
