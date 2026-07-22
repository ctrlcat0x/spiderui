"use client";

import { CircleHelp, Palette, Sparkles } from "lucide-react";
import { BouncyAccordion } from "@workspace/ui/components/bouncy-accordion";

const items = [
  {
    id: "motion",
    title: "Why does this accordion feel bouncy?",
    description:
      "The rows use spring-based layout transitions, so the open item separates naturally while its neighbors reshape around it.",
    icon: <Sparkles />,
  },
  {
    id: "style",
    title: "Can I customize each part?",
    description:
      "Yes. The classNames prop exposes the root, item, trigger, icon, title, chevron, content, and description slots.",
    icon: <Palette />,
  },
  {
    id: "control",
    title: "Can it be controlled externally?",
    description:
      "Use value and onValueChange for controlled state, or defaultValue for local state.",
    icon: <CircleHelp />,
  },
];

export function BouncyAccordionPreview() {
  return (
    <div className="flex size-full items-center justify-center bg-muted/30 p-4 sm:p-10">
      <BouncyAccordion
        className="max-w-2xl"
        items={items}
        defaultValue="motion"
      />
    </div>
  );
}
