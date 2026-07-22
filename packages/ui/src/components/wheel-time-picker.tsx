"use client";

import * as React from "react";
import {
  WheelPicker,
  WheelPickerColumn,
  type WheelPickerProps,
} from "@workspace/ui/components/wheel-picker";
import { cn } from "@workspace/ui/lib/utils";

export interface WheelTimeValue {
  hour: number;
  minute: number;
  second: number;
}

export interface WheelTimePickerProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  value?: WheelTimeValue;
  defaultValue?: WheelTimeValue;
  onChange?: (value: WheelTimeValue) => void;
  hideMinutes?: boolean;
  hideSeconds?: boolean;
  itemHeight?: number;
  visibleCount?: WheelPickerProps["visibleCount"];
  lens?: boolean;
  disabled?: boolean;
}

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const SECONDS = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const MERIDIEMS = ["AM", "PM"];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(Math.round(value), min), max);
}

function normalizeTime(value: WheelTimeValue): WheelTimeValue {
  return {
    hour: clamp(value.hour, 0, 23),
    minute: clamp(value.minute, 0, 59),
    second: clamp(value.second, 0, 59),
  };
}

export function WheelTimePicker({
  value,
  defaultValue = { hour: 9, minute: 30, second: 0 },
  onChange,
  hideMinutes = false,
  hideSeconds = false,
  itemHeight = 44,
  visibleCount = 5,
  lens = true,
  disabled = false,
  className,
  style,
  ...props
}: WheelTimePickerProps) {
  const [internalValue, setInternalValue] = React.useState(() =>
    normalizeTime(defaultValue),
  );
  const selectedTime = normalizeTime(value ?? internalValue);
  const meridiem = selectedTime.hour >= 12 ? "PM" : "AM";
  const displayHour = selectedTime.hour % 12 || 12;
  const visibleColumns = 2 + Number(!hideMinutes) + Number(!hideSeconds);

  const updateTime = (nextValue: WheelTimeValue) => {
    const normalizedValue = normalizeTime(nextValue);
    if (value === undefined) setInternalValue(normalizedValue);
    onChange?.(normalizedValue);
  };

  return (
    <div
      data-slot="wheel-time-picker"
      className={cn(
        "rounded-[2rem] border border-border/70 bg-card p-3 shadow-sm transition-[width] duration-300 motion-reduce:transition-none",
        className,
      )}
      style={{
        width: `${visibleColumns * 5.25 + 1.5}rem`,
        maxWidth: "100%",
        ...style,
      }}
      {...props}
    >
      <WheelPicker
        aria-label="Choose time"
        itemHeight={itemHeight}
        visibleCount={visibleCount}
        lens={lens}
      >
        <WheelPickerColumn
          aria-label="Hour"
          disabled={disabled}
          loop
          options={HOURS}
          value={String(displayHour)}
          onChange={(nextHour) => {
            const hour12 = Number(nextHour) % 12;
            updateTime({
              ...selectedTime,
              hour: hour12 + (meridiem === "PM" ? 12 : 0),
            });
          }}
        />
        {!hideMinutes ? (
          <WheelPickerColumn
            aria-label="Minute"
            disabled={disabled}
            loop
            options={MINUTES}
            value={String(selectedTime.minute).padStart(2, "0")}
            onChange={(nextMinute) =>
              updateTime({ ...selectedTime, minute: Number(nextMinute) })
            }
          />
        ) : null}
        {!hideSeconds ? (
          <WheelPickerColumn
            aria-label="Second"
            disabled={disabled}
            loop
            options={SECONDS}
            value={String(selectedTime.second).padStart(2, "0")}
            onChange={(nextSecond) =>
              updateTime({ ...selectedTime, second: Number(nextSecond) })
            }
          />
        ) : null}
        <WheelPickerColumn
          aria-label="AM or PM"
          className="flex-[0.9]"
          disabled={disabled}
          options={MERIDIEMS}
          value={meridiem}
          onChange={(nextMeridiem) =>
            updateTime({
              ...selectedTime,
              hour: (selectedTime.hour % 12) + (nextMeridiem === "PM" ? 12 : 0),
            })
          }
        />
      </WheelPicker>
    </div>
  );
}
