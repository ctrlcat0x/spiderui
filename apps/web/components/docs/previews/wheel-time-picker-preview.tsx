"use client";

import * as React from "react";
import {
  WheelTimePicker,
  type WheelTimeValue,
} from "@workspace/ui/components/wheel-time-picker";
import { cn } from "@/lib/utils";

const defaultTime: WheelTimeValue = { hour: 14, minute: 35, second: 20 };

export function WheelTimePickerPreview() {
  const [time, setTime] = React.useState(defaultTime);
  const [hideMinutes, setHideMinutes] = React.useState(false);
  const [hideSeconds, setHideSeconds] = React.useState(false);

  return (
    <div className="flex min-h-[460px] w-full flex-col items-center justify-center gap-7 px-5 py-12 sm:px-8">
      <WheelTimePicker
        value={time}
        onChange={setTime}
        hideMinutes={hideMinutes}
        hideSeconds={hideSeconds}
      />
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-pressed={hideMinutes}
          onClick={() => setHideMinutes((current) => !current)}
          className={cn(
            "rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium transition-colors",
            hideMinutes
              ? "bg-foreground text-background"
              : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {hideMinutes ? "Show minutes" : "Hide minutes"}
        </button>
        <button
          type="button"
          aria-pressed={hideSeconds}
          onClick={() => setHideSeconds((current) => !current)}
          className={cn(
            "rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium transition-colors",
            hideSeconds
              ? "bg-foreground text-background"
              : "bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {hideSeconds ? "Show seconds" : "Hide seconds"}
        </button>
      </div>
    </div>
  );
}
