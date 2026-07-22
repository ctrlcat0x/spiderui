"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Tooltip } from "radix-ui";
import { cn } from "@workspace/ui/lib/utils";

export interface ActivityEntry {
  date: string;
  count: number;
}

export type ContributionTheme =
  | "green"
  | "orange"
  | "sakura"
  | "autumn"
  | "winter"
  | "forest"
  | "grayscale";

export const CONTRIBUTION_THEMES = [
  "green",
  "sakura",
  "autumn",
  "winter",
  "forest",
  "grayscale",
  "orange",
] as const satisfies readonly ContributionTheme[];

export type ContributionVariant = "default" | "city-lights" | "minimal";
export type ContributionShape = "square" | "rounded" | "circle" | "squircle";
export type ContributionAnimation =
  | "left-to-right"
  | "top-to-bottom"
  | "random"
  | "none";
export type ContributionAmbientEffect = "none" | "tide" | "drift" | "twinkle";

type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

interface ApiContributionDay {
  contributionCount: number;
  contributionLevel: ContributionLevel;
  date: string;
}

interface ApiContributionData {
  contributions: ApiContributionDay[][];
  totalContributions: number;
}

interface GraphDay {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  key: string;
}

export interface ContributionGraphProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  data?: ActivityEntry[];
  username?: string;
  theme?: ContributionTheme;
  variant?: ContributionVariant;
  shape?: ContributionShape;
  glowIntensity?: number;
  animation?: ContributionAnimation;
  animationStagger?: number;
  animationSpeed?: number;
  ambientEffect?: ContributionAmbientEffect;
  ambientIntensity?: number;
  blockSize?: number;
  blockGap?: number;
  blockRadius?: number;
  weeks?: number;
  showHeader?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
  className?: string;
}

const DAY_LABEL_WIDTH = 28;
const MONTH_LABEL_HEIGHT = 16;
const MONTH_LABEL_RESERVE = 24;
const DAY_LABELS = ["Mon", "Wed", "Fri"] as const;
const DAY_LABEL_INDICES = [1, 3, 5] as const;

const THEME_SCALES: Record<
  ContributionTheme,
  [string, string, string, string, string]
> = {
  green: [
    "bg-muted",
    "bg-emerald-300/60 dark:bg-emerald-900/80",
    "bg-emerald-400/70 dark:bg-emerald-700",
    "bg-emerald-500 dark:bg-emerald-600",
    "bg-emerald-600 dark:bg-emerald-400",
  ],
  orange: [
    "bg-muted",
    "bg-orange-300/60 dark:bg-orange-900/80",
    "bg-orange-400/70 dark:bg-orange-700",
    "bg-orange-500 dark:bg-orange-600",
    "bg-orange-600 dark:bg-orange-400",
  ],
  sakura: [
    "bg-muted",
    "bg-pink-200/70 dark:bg-pink-950/90",
    "bg-pink-300/80 dark:bg-pink-800",
    "bg-pink-400 dark:bg-pink-600",
    "bg-pink-500 dark:bg-pink-400",
  ],
  autumn: [
    "bg-muted",
    "bg-amber-200/70 dark:bg-amber-950/90",
    "bg-orange-300/80 dark:bg-orange-900",
    "bg-orange-500 dark:bg-orange-700",
    "bg-amber-600 dark:bg-amber-400",
  ],
  winter: [
    "bg-muted",
    "bg-sky-100/80 dark:bg-sky-950/90",
    "bg-sky-200 dark:bg-sky-800",
    "bg-sky-300 dark:bg-sky-600",
    "bg-sky-400 dark:bg-sky-300",
  ],
  forest: [
    "bg-muted",
    "bg-green-800/40 dark:bg-green-950/90",
    "bg-green-700 dark:bg-green-900",
    "bg-green-600 dark:bg-green-700",
    "bg-green-500 dark:bg-green-500",
  ],
  grayscale: [
    "bg-muted",
    "bg-zinc-300 dark:bg-zinc-800",
    "bg-zinc-400 dark:bg-zinc-700",
    "bg-zinc-500 dark:bg-zinc-500",
    "bg-zinc-700 dark:bg-zinc-300",
  ],
};

const GLOW_COLORS: Record<ContributionTheme, string> = {
  green: "#10b981",
  orange: "#f97316",
  sakura: "#f472b6",
  autumn: "#ea580c",
  winter: "#38bdf8",
  forest: "#16a34a",
  grayscale: "#a1a1aa",
};

function levelFromApi(level: ContributionLevel): 0 | 1 | 2 | 3 | 4 {
  switch (level) {
    case "FIRST_QUARTILE":
      return 1;
    case "SECOND_QUARTILE":
      return 2;
    case "THIRD_QUARTILE":
      return 3;
    case "FOURTH_QUARTILE":
      return 4;
    default:
      return 0;
  }
}

function getIntensity(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function buildWeeksFromEntries(
  data: ActivityEntry[],
  weekCount: number,
): GraphDay[][] {
  const countMap = new Map<string, number>();
  for (const entry of data) {
    countMap.set(entry.date, (countMap.get(entry.date) ?? 0) + entry.count);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDay = today.getDay();

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - todayDay));

  const totalDays = weekCount * 7;
  const startDate = new Date(endOfWeek);
  startDate.setDate(endOfWeek.getDate() - totalDays + 1);

  const maxCount = Math.max(...data.map((d) => d.count), 0);
  const weeks: GraphDay[][] = [];
  let currentWeek: GraphDay[] = [];

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const count = countMap.get(key) ?? 0;
    currentWeek.push({
      date: d,
      count,
      level: getIntensity(count, maxCount),
      key,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function buildWeeksFromApi(
  contributions: ApiContributionDay[][],
): GraphDay[][] {
  return contributions.map((week) =>
    week.map((day) => ({
      date: new Date(day.date + "T00:00:00"),
      count: day.contributionCount,
      level: levelFromApi(day.contributionLevel),
      key: day.date,
    })),
  );
}

function gridWidthFor(
  weekCount: number,
  blockSize: number,
  blockGap: number,
): number {
  return weekCount * (blockSize + blockGap) - blockGap;
}

function computeBlockSize(
  containerWidth: number,
  weekCount: number,
  blockGap: number,
  extraReserve = 0,
): number {
  const maxGridWidth =
    containerWidth - DAY_LABEL_WIDTH - MONTH_LABEL_RESERVE - extraReserve;
  let size = Math.floor(
    (maxGridWidth - blockGap * (weekCount - 1)) / weekCount,
  );
  size = Math.max(4, size);

  while (size > 4 && gridWidthFor(weekCount, size, blockGap) > maxGridWidth) {
    size -= 1;
  }

  return size;
}

function getMonthLabels(
  weeks: GraphDay[][],
  blockSize: number,
  blockGap: number,
  gridWidth: number,
): { label: string; offset: number; anchorEnd: boolean }[] {
  const months: { label: string; offset: number; anchorEnd: boolean }[] = [];
  let lastKey = "";

  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w]![0]!;
    const key = `${firstDay.date.getFullYear()}-${firstDay.date.getMonth()}`;

    if (key !== lastKey) {
      const offset = w * (blockSize + blockGap);
      const anchorEnd = offset + MONTH_LABEL_RESERVE > gridWidth;
      months.push({
        label: firstDay.date.toLocaleString("en-US", { month: "short" }),
        offset,
        anchorEnd,
      });
      lastKey = key;
    }
  }

  return months;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getShapeRadius(
  shape: ContributionShape,
  blockRadius: number,
  blockSize: number,
): number | string {
  switch (shape) {
    case "circle":
      return "50%";
    case "square":
      return 0;
    case "squircle":
      return Math.max(2, blockSize * 0.22);
    case "rounded":
    default:
      return blockRadius;
  }
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function normalizeGithubUsername(username: string): string | null {
  const normalized = username.trim().replace(/^@+/, "");
  return /^(?!-)[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(normalized)
    ? normalized
    : null;
}

function getAnimationDelay(
  animation: ContributionAnimation,
  weekIndex: number,
  dayIndex: number,
  randomIndex: number,
  stagger: number,
): number {
  switch (animation) {
    case "left-to-right":
      return weekIndex * stagger + dayIndex * stagger * 0.08;
    case "top-to-bottom":
      return dayIndex * stagger + weekIndex * stagger * 0.08;
    case "random":
      return randomIndex * stagger * 0.35;
    case "none":
    default:
      return 0;
  }
}

function getAmbientMotion(
  effect: ContributionAmbientEffect,
  intensity: number,
  weekIndex: number,
  dayIndex: number,
  reducedMotion: boolean,
) {
  if (reducedMotion || effect === "none" || intensity <= 0) {
    return {
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0 },
    };
  }

  const strength = Math.min(1, Math.max(0, intensity));
  const seed = ((weekIndex * 17 + dayIndex * 31) % 11) / 10;
  const isTide = effect === "tide";
  const isDrift = effect === "drift";
  const duration = isTide ? 3.2 : isDrift ? 3.8 + seed : 2 + seed * 1.4;
  const delay = isTide ? (weekIndex + dayIndex * 1.8) * 0.055 : seed * 0.85;
  const lowOpacity = 1 - (isTide ? 0.24 : isDrift ? 0.16 : 0.34) * strength;
  const smallScale = 1 - (isTide ? 0.07 : isDrift ? 0.04 : 0.08) * strength;

  return {
    animate: {
      opacity: isDrift
        ? [1, lowOpacity, 1 - 0.06 * strength, 1]
        : [1, lowOpacity, 1],
      scale: isDrift
        ? [1, smallScale, 1 + 0.025 * strength, 1]
        : [1, smallScale, 1],
    },
    transition: {
      opacity: {
        duration,
        delay,
        ease: "easeInOut" as const,
        repeat: Infinity,
      },
      scale: { duration, delay, ease: "easeInOut" as const, repeat: Infinity },
    },
  };
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      height="16"
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="16"
      className={className}
    >
      <path
        fill="currentColor"
        d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
      />
    </svg>
  );
}

export function ContributionGraph({
  data,
  username,
  theme = "green",
  variant = "default",
  shape = "rounded",
  glowIntensity = 5,
  animation = "left-to-right",
  animationStagger = 0.012,
  animationSpeed = 1,
  ambientEffect = "twinkle",
  ambientIntensity = 0.65,
  blockSize: fixedBlockSize,
  blockGap = 2,
  blockRadius = 2,
  weeks: weekCount = 52,
  showHeader = true,
  showLegend = true,
  showLabels = true,
  className,
  ...props
}: ContributionGraphProps) {
  const graphMeasureRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const normalizedUsername = React.useMemo(
    () => (username ? normalizeGithubUsername(username) : null),
    [username],
  );
  const [autoSize, setAutoSize] = React.useState<number | null>(null);
  const [apiData, setApiData] = React.useState<ApiContributionData | null>(
    null,
  );
  const [loading, setLoading] = React.useState(Boolean(username && !data));
  const [error, setError] = React.useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = React.useState<{
    weekIndex: number;
    dayIndex: number;
  } | null>(null);

  React.useEffect(() => {
    if (data) {
      setLoading(false);
      setError(null);
      return;
    }

    if (!username) {
      setApiData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (!normalizedUsername) {
      setApiData(null);
      setLoading(false);
      setError("Enter a valid GitHub username");
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiData(null);
        const response = await fetch(
          `https://github-contributions-api.deno.dev/${normalizedUsername}.json`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub data");
        }
        const json = (await response.json()) as ApiContributionData;
        if (
          !Array.isArray(json.contributions) ||
          !Number.isFinite(json.totalContributions)
        ) {
          throw new Error("Invalid contribution data");
        }
        setApiData(json);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [username, normalizedUsername, data]);

  const colorScale = THEME_SCALES[theme];
  const glowColor = GLOW_COLORS[theme];
  const isMinimal = variant === "minimal";
  const isCityLights = variant === "city-lights";

  const weeks = React.useMemo(() => {
    if (apiData?.contributions?.length) {
      const safeWeekCount = Math.max(1, Math.min(53, Math.round(weekCount)));
      return buildWeeksFromApi(apiData.contributions).slice(-safeWeekCount);
    }
    if (data?.length) {
      return buildWeeksFromEntries(data, weekCount);
    }
    return [];
  }, [apiData, data, weekCount]);

  const glowReserve = isCityLights ? glowIntensity * 1.5 : 0;

  React.useLayoutEffect(() => {
    if (fixedBlockSize != null) return;

    const el = graphMeasureRef.current;
    if (!el || loading || weeks.length === 0) return;

    const measure = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) {
        setAutoSize(
          computeBlockSize(width, weeks.length, blockGap, glowReserve),
        );
      }
    };

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [fixedBlockSize, weekCount, loading, weeks.length, glowReserve, blockGap]);

  const totalContributions = React.useMemo(() => {
    if (apiData) return apiData.totalContributions;
    return weeks.flat().reduce((sum, day) => sum + day.count, 0);
  }, [apiData, weeks]);

  const randomOrder = React.useMemo(() => {
    const cells = weeks.flatMap((week, wi) =>
      week.map((day, di) => ({
        key: day.key,
        index: hashString(`${day.key}-${wi}-${di}`),
      })),
    );
    return new Map(
      [...cells]
        .sort((a, b) => a.index - b.index)
        .map((cell, order) => [cell.key, order]),
    );
  }, [weeks]);

  const blockSize = fixedBlockSize ?? autoSize ?? 10;
  const safeBlockGap = Math.max(0, blockGap);
  const safeAnimationSpeed = Math.max(0.1, animationSpeed);
  const gridWidth = gridWidthFor(weeks.length, blockSize, safeBlockGap);
  const monthLabels = getMonthLabels(weeks, blockSize, safeBlockGap, gridWidth);
  const gridHeight = 7 * (blockSize + safeBlockGap) - safeBlockGap;
  const totalWidth = showLabels ? DAY_LABEL_WIDTH + gridWidth : gridWidth;
  const isAutoFit = fixedBlockSize == null;
  const showGraph = weeks.length > 0;
  const effectiveShape = isMinimal ? "circle" : shape;
  const cellRadius = getShapeRadius(effectiveShape, blockRadius, blockSize);
  const cellScale = isMinimal ? 0.72 : 1;

  if (error) {
    return (
      <div
        className={cn(
          "rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
          className,
        )}
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          "h-36 w-full animate-pulse rounded-xl bg-muted",
          className,
        )}
        aria-busy="true"
        aria-label="Loading contribution graph"
      />
    );
  }

  if (!weeks.length) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        No contribution data available.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-4",
        isAutoFit ? "w-full" : "overflow-x-auto",
        className,
      )}
      role="group"
      aria-label={`Contribution graph${normalizedUsername ? ` for ${normalizedUsername}` : ""}`}
      data-slot="contribution-graph"
      {...props}
    >
      {showHeader && normalizedUsername && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GithubIcon className="text-muted-foreground" />
            <span className="text-sm font-semibold tracking-tight">
              @{normalizedUsername}
            </span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {totalContributions.toLocaleString()} contributions in the last year
          </span>
        </div>
      )}

      {showGraph && (
        <div
          className={cn(
            "isolate min-w-0 max-w-full overflow-x-clip rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm",
            isCityLights && "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
          )}
          style={{ minWidth: isAutoFit ? undefined : totalWidth + 32 }}
        >
          <div
            ref={graphMeasureRef}
            className="flex w-full min-w-0 max-w-full flex-col gap-2"
            style={{ minWidth: isAutoFit ? undefined : totalWidth }}
          >
            <div
              className="relative w-full min-w-0 max-w-full overflow-x-clip"
              style={{
                height: (showLabels ? MONTH_LABEL_HEIGHT : 0) + gridHeight,
              }}
            >
              {showLabels &&
                monthLabels.map((m, i) => (
                  <span
                    key={`${m.label}-${i}`}
                    className="absolute whitespace-nowrap text-[10px] leading-none text-muted-foreground"
                    style={{
                      left: m.anchorEnd
                        ? DAY_LABEL_WIDTH + gridWidth
                        : DAY_LABEL_WIDTH + m.offset,
                      top: 0,
                      transform: m.anchorEnd ? "translateX(-100%)" : undefined,
                    }}
                  >
                    {m.label}
                  </span>
                ))}

              {showLabels &&
                DAY_LABELS.map((label, i) => (
                  <span
                    key={label}
                    className="absolute text-[10px] leading-none text-muted-foreground"
                    style={{
                      left: 0,
                      top:
                        MONTH_LABEL_HEIGHT +
                        DAY_LABEL_INDICES[i]! * (blockSize + safeBlockGap) +
                        blockSize / 2 -
                        4,
                    }}
                  >
                    {label}
                  </span>
                ))}

              <div
                className="absolute max-w-full"
                style={{
                  left: showLabels ? DAY_LABEL_WIDTH : 0,
                  top: showLabels ? MONTH_LABEL_HEIGHT : 0,
                  width: gridWidth,
                  display: "flex",
                  gap: safeBlockGap,
                }}
                role="grid"
                aria-label="Daily GitHub contributions"
              >
                <Tooltip.Provider delayDuration={80}>
                  {weeks.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      role="row"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: safeBlockGap,
                        flexShrink: 0,
                        width: blockSize,
                      }}
                    >
                      {week.map((day, dayIndex) => {
                        const delay = getAnimationDelay(
                          animation,
                          weekIndex,
                          dayIndex,
                          randomOrder.get(day.key) ?? 0,
                          animationStagger / safeAnimationSpeed,
                        );
                        const isGlowing =
                          isCityLights && day.count > 0 && day.level > 0;
                        const glowSize =
                          day.count > 3 ? glowIntensity * 1.5 : glowIntensity;

                        const distance = hoveredCell
                          ? Math.hypot(
                              weekIndex - hoveredCell.weekIndex,
                              dayIndex - hoveredCell.dayIndex,
                            )
                          : Infinity;
                        const hoverStrength = Math.max(0, 1 - distance / 3);
                        const ambientMotion = getAmbientMotion(
                          ambientEffect,
                          day.count > 0 ? ambientIntensity : 0,
                          weekIndex,
                          dayIndex,
                          reducedMotion,
                        );

                        return (
                          <React.Fragment key={day.key}>
                            <Tooltip.Root
                              open={
                                hoveredCell?.weekIndex === weekIndex &&
                                hoveredCell?.dayIndex === dayIndex
                              }
                            >
                              <Tooltip.Trigger asChild>
                                <motion.button
                                  type="button"
                                  role="gridcell"
                                  initial={
                                    animation === "none" || reducedMotion
                                      ? false
                                      : { opacity: 0, scale: 0 }
                                  }
                                  animate={{
                                    opacity: 1,
                                    scale:
                                      cellScale *
                                      (reducedMotion
                                        ? 1
                                        : 1 + hoverStrength * 0.2),
                                    filter: `brightness(${1 + hoverStrength * 0.4}) saturate(${1 + hoverStrength * 0.2})`,
                                  }}
                                  transition={{
                                    ...(reducedMotion
                                      ? { duration: 0 }
                                      : {
                                          delay,
                                          type: "spring" as const,
                                          stiffness: 320,
                                          damping: 22,
                                        }),
                                  }}
                                  className={cn(
                                    "relative border-0 bg-transparent p-0 outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
                                    isGlowing && "z-10",
                                  )}
                                  style={{
                                    width: blockSize,
                                    height: blockSize,
                                    borderRadius: cellRadius,
                                  }}
                                  onPointerEnter={() =>
                                    setHoveredCell({ weekIndex, dayIndex })
                                  }
                                  onPointerLeave={() => setHoveredCell(null)}
                                  onFocus={() =>
                                    setHoveredCell({ weekIndex, dayIndex })
                                  }
                                  onClick={() =>
                                    setHoveredCell({ weekIndex, dayIndex })
                                  }
                                  onBlur={() => setHoveredCell(null)}
                                  aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
                                >
                                  <motion.span
                                    aria-hidden="true"
                                    className={cn(
                                      "pointer-events-none absolute inset-0",
                                      colorScale[day.level],
                                    )}
                                    style={{
                                      borderRadius: cellRadius,
                                      boxShadow: isGlowing
                                        ? `0 0 ${Math.min(glowSize, 6)}px ${glowColor}${day.level >= 3 ? "cc" : "88"}`
                                        : undefined,
                                    }}
                                    animate={ambientMotion.animate}
                                    transition={ambientMotion.transition}
                                  />
                                </motion.button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="top"
                                  sideOffset={6}
                                  className="z-50 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
                                >
                                  <p className="font-medium">
                                    {day.count} contribution
                                    {day.count === 1 ? "" : "s"}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {formatDate(day.date)}
                                  </p>
                                  <Tooltip.Arrow className="fill-popover" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </Tooltip.Provider>
              </div>
            </div>

            {showLegend && (
              <div className="flex min-w-0 items-center gap-1.5 self-end text-[10px] text-muted-foreground">
                <span>Less</span>
                {colorScale.map((cls, i) => (
                  <div
                    key={i}
                    className={cn(cls)}
                    style={{
                      width: blockSize,
                      height: blockSize,
                      borderRadius: cellRadius,
                    }}
                  />
                ))}
                <span>More</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
