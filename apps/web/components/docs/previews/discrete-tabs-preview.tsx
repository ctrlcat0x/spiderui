"use client";

import { Bell, CalendarDays, Mail } from "lucide-react";

import { DiscreteTabs } from "@workspace/ui/components/discrete-tabs";

const items = [
  { value: "inbox", label: "Inbox", icon: Mail, content: "Inbox" },
  {
    value: "planner",
    label: "Planner",
    icon: CalendarDays,
    content: "Planner",
  },
  { value: "alerts", label: "Alerts", icon: Bell, content: "Alerts" },
] as const;

export function DiscreteTabsPreview() {
  return (
    <div className="flex min-h-[380px] w-full items-center justify-center px-6 py-16">
      <DiscreteTabs
        items={items}
        defaultValue="alerts"
        size="lg"
        contentClassName="sr-only"
      />
    </div>
  );
}
