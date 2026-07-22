"use client";

import * as React from "react";
import {
  WheelPicker,
  WheelPickerColumn,
  type WheelPickerProps,
} from "@workspace/ui/components/wheel-picker";
import { cn } from "@workspace/ui/lib/utils";

export interface WheelDatePickerProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange"
> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (value: Date) => void;
  minYear?: number;
  maxYear?: number;
  locale?: string;
  monthFormat?: "long" | "short" | "numeric";
  itemHeight?: number;
  visibleCount?: WheelPickerProps["visibleCount"];
  lens?: boolean;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function normalizeDate(date: Date, minYear: number, maxYear: number) {
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const year = clamp(safeDate.getFullYear(), minYear, maxYear);
  const month = safeDate.getMonth();
  const day = clamp(safeDate.getDate(), 1, daysInMonth(year, month));
  return new Date(year, month, day);
}

export function WheelDatePicker({
  value,
  defaultValue,
  onChange,
  minYear = 1900,
  maxYear = 2050,
  locale,
  monthFormat = "long",
  itemHeight = 44,
  visibleCount = 5,
  lens = true,
  disabled = false,
  className,
  ...props
}: WheelDatePickerProps) {
  const safeMinYear = Math.min(minYear, maxYear);
  const safeMaxYear = Math.max(minYear, maxYear);
  const [internalValue, setInternalValue] = React.useState(() =>
    normalizeDate(defaultValue ?? new Date(), safeMinYear, safeMaxYear),
  );
  const selectedDate = normalizeDate(
    value ?? internalValue,
    safeMinYear,
    safeMaxYear,
  );
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();
  const dayCount = daysInMonth(year, month);
  const selectedDateRef = React.useRef(selectedDate);
  const onChangeRef = React.useRef(onChange);

  React.useLayoutEffect(() => {
    selectedDateRef.current = selectedDate;
    onChangeRef.current = onChange;
  });

  const months = React.useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { month: monthFormat });
    return Array.from({ length: 12 }, (_, index) => ({
      value: String(index),
      label: formatter.format(new Date(2024, index, 1)),
    }));
  }, [locale, monthFormat]);
  const days = React.useMemo(
    () =>
      Array.from({ length: 31 }, (_, index) => ({
        value: String(index + 1),
        disabled: index + 1 > dayCount,
      })),
    [dayCount],
  );
  const years = React.useMemo(
    () =>
      Array.from({ length: safeMaxYear - safeMinYear + 1 }, (_, index) =>
        String(safeMinYear + index),
      ),
    [safeMaxYear, safeMinYear],
  );

  const updateDate = React.useCallback(
    (field: "year" | "month" | "day", nextFieldValue: number) => {
      const current = selectedDateRef.current;
      const nextYear =
        field === "year" ? nextFieldValue : current.getFullYear();
      const nextMonth = field === "month" ? nextFieldValue : current.getMonth();
      const requestedDay = field === "day" ? nextFieldValue : current.getDate();
      const nextDay = clamp(requestedDay, 1, daysInMonth(nextYear, nextMonth));
      const nextValue = new Date(nextYear, nextMonth, nextDay);
      selectedDateRef.current = nextValue;
      if (value === undefined) setInternalValue(nextValue);
      onChangeRef.current?.(nextValue);
    },
    [value],
  );

  return (
    <div
      data-slot="wheel-date-picker"
      className={cn(
        "w-full max-w-xl rounded-[2rem] border border-border/70 bg-card p-3 shadow-sm",
        className,
      )}
      {...props}
    >
      <WheelPicker
        aria-label="Choose date"
        itemHeight={itemHeight}
        visibleCount={visibleCount}
        lens={lens}
      >
        <WheelPickerColumn
          aria-label="Month"
          className="flex-[1.45]"
          disabled={disabled}
          loop
          options={months}
          value={String(month)}
          onChange={(nextMonth) => updateDate("month", Number(nextMonth))}
        />
        <WheelPickerColumn
          aria-label="Day"
          className="flex-[0.8]"
          disabled={disabled}
          loop
          options={days}
          value={String(day)}
          onChange={(nextDay) => updateDate("day", Number(nextDay))}
        />
        <WheelPickerColumn
          aria-label="Year"
          disabled={disabled}
          options={years}
          value={String(year)}
          onChange={(nextYear) => updateDate("year", Number(nextYear))}
        />
      </WheelPicker>
    </div>
  );
}
