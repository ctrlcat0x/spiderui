"use client";

import * as React from "react";
import { WheelDatePicker } from "@workspace/ui/components/wheel-date-picker";

export function WheelDatePickerPreview() {
  const [date, setDate] = React.useState(() => new Date(1963, 9, 3));

  return (
    <div className="flex min-h-[460px] w-full flex-col items-center justify-center gap-6 px-5 py-12 sm:px-8">
      <WheelDatePicker
        value={date}
        onChange={setDate}
        minYear={1900}
        maxYear={2050}
      />
      <p className="text-sm text-muted-foreground tabular-nums">
        {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date)}
      </p>
    </div>
  );
}
