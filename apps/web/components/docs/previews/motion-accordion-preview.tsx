"use client";

import { MotionAccordion } from "@workspace/ui/components/motion-accordion";

const items = [
  {
    question: "Can I use Spider UI in commercial projects?",
    answer:
      "Yes. Copy the component into your project, customize it, and ship it in personal or commercial work.",
  },
  {
    question: "Does it support dynamic content?",
    answer:
      "Yes. Every answer is measured with ResizeObserver, so the spring animation follows content changes without fixed heights.",
  },
  {
    question: "Is reduced motion supported?",
    answer:
      "Yes. Motion transitions become immediate when the visitor prefers reduced motion.",
  },
];

export function MotionAccordionPreview() {
  return (
    <div className="flex size-full items-center justify-center bg-muted/30 p-4 sm:p-10">
      <MotionAccordion className="max-w-2xl" items={items} />
    </div>
  );
}
