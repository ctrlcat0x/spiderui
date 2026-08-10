"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "@workspace/ui/lib/utils";

export type DiaFooterColorProps = {
  text?: string;
  gradient?: string[];
};

export type DiaFooterThemePreset = {
  text: string;
  gradient: string[];
};

export const DIA_FOOTER_THEME_PRESETS = {
  "dia-browser": {
    text: "#A1A1AA",
    gradient: [
      "#340B05",
      "#0358F7",
      "#5092C7",
      "#E1ECFE",
      "#FFD400",
      "#FA3D1D",
      "#FD02F5",
      "#FFC0FD00",
    ],
  },
  ocean: {
    text: "#CBD5E1",
    gradient: [
      "#020617",
      "#172554",
      "#1E40AF",
      "#0284C7",
      "#38BDF8",
      "#BAE6FD",
      "#E0F2FE",
      "#F0F9FF00",
    ],
  },
  amber: {
    text: "#D6D3D1",
    gradient: [
      "#1C0A00",
      "#7C2D12",
      "#C2410C",
      "#EA580C",
      "#F59E0B",
      "#FCD34D",
      "#FEF3C7",
      "#FFFBEB00",
    ],
  },
  emerald: {
    text: "#D1FAE5",
    gradient: [
      "#022C22",
      "#064E3B",
      "#047857",
      "#059669",
      "#10B981",
      "#6EE7B7",
      "#A7F3D0",
      "#ECFDF500",
    ],
  },
  violet: {
    text: "#EDE9FE",
    gradient: [
      "#1E1B4B",
      "#312E81",
      "#4C1D95",
      "#6D28D9",
      "#8B5CF6",
      "#C4B5FD",
      "#DDD6FE",
      "#F5F3FF00",
    ],
  },
  rose: {
    text: "#FFE4E6",
    gradient: [
      "#4C0519",
      "#881337",
      "#BE123C",
      "#E11D48",
      "#F43F5E",
      "#FB7185",
      "#FDA4AF",
      "#FFF1F200",
    ],
  },
} satisfies Record<string, DiaFooterThemePreset>;

export type DiaFooterTheme = keyof typeof DIA_FOOTER_THEME_PRESETS;

export const DIA_FOOTER_THEMES = Object.keys(
  DIA_FOOTER_THEME_PRESETS,
) as DiaFooterTheme[];

export type DiaFooterProps = {
  children?: ReactNode;
  colors?: DiaFooterColorProps;
  theme?: DiaFooterTheme;
  copyrightText?: string;
  scrollContainer?: RefObject<HTMLElement | null>;
  gradientHeight?: string;
  minReveal?: number;
  bars?: number;
  blur?: number;
  peak?: number;
  valley?: number;
  className?: string;
  contentClassName?: string;
  surfaceColor?: string;
  style?: CSSProperties;
};

const VIEWBOX_WIDTH = 1271;
const VIEWBOX_HEIGHT = 599;
const DEFAULT_THEME: DiaFooterTheme = "dia-browser";
const DEFAULT_YEAR = new Date().getFullYear();
const OFFSETS = [0, 0.1827, 0.2837, 0.4135, 0.5866, 0.6827, 0.8029, 1];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getBarHeights(count: number, peak: number, valley: number) {
  const middle = (count - 1) / 2;
  return Array.from({ length: count }, (_, index) => {
    const distance = middle === 0 ? 0 : Math.abs(index - middle) / middle;
    const curve = 1 - Math.pow(distance, 1.24);
    return peak * VIEWBOX_HEIGHT * (valley + (1 - valley) * curve);
  });
}

export function DiaFooter({
  children,
  colors,
  theme = DEFAULT_THEME,
  copyrightText,
  scrollContainer,
  gradientHeight = "60vh",
  minReveal = 0.045,
  bars = 9,
  blur = 15,
  peak = 0.98,
  valley = 0.55,
  className,
  contentClassName,
  surfaceColor = "#090909",
  style,
}: DiaFooterProps) {
  const bandRef = useRef<HTMLDivElement>(null);
  const gradientId = useId().replace(/:/g, "");
  const activeTheme =
    DIA_FOOTER_THEME_PRESETS[theme] ?? DIA_FOOTER_THEME_PRESETS[DEFAULT_THEME];
  const resolvedColors = useMemo(
    () => ({
      text: colors?.text ?? activeTheme.text,
      gradient: Array.from(
        { length: OFFSETS.length },
        (_, index) =>
          colors?.gradient?.[index] ??
          activeTheme.gradient[index] ??
          "#00000000",
      ),
    }),
    [activeTheme, colors],
  );
  const safeBars = clamp(Math.round(bars), 1, 24);
  const columnWidth = VIEWBOX_WIDTH / safeBars;
  const barHeights = getBarHeights(
    safeBars,
    clamp(peak, 0.1, 1.25),
    clamp(valley, 0, 1),
  );
  const embedded = Boolean(scrollContainer);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    const doc = band.ownerDocument;
    const win = doc.defaultView ?? window;
    const scroller = scrollContainer?.current;
    const reduceMotion = win.matchMedia("(prefers-reduced-motion: reduce)");
    let previousProgress = -1;

    const measure = () => {
      const bandHeight = band.offsetHeight || 1;
      const remaining = scroller
        ? scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop
        : doc.documentElement.scrollHeight - win.innerHeight - win.scrollY;
      const reveal = clamp((bandHeight - remaining) / bandHeight, 0, 1);
      const minimum = clamp(minReveal, 0, 1);
      const progress = reduceMotion.matches
        ? 1
        : minimum + (1 - minimum) * reveal;
      if (Math.abs(progress - previousProgress) > 0.001) {
        band.style.transform = `scaleY(${progress})`;
        previousProgress = progress;
      }
    };

    const target: Window | HTMLElement = scroller ?? win;
    measure();
    target.addEventListener("scroll", measure, { passive: true });
    win.addEventListener("resize", measure, { passive: true });

    const observer = new ResizeObserver(measure);
    observer.observe(doc.documentElement);
    if (scroller) observer.observe(scroller);

    return () => {
      target.removeEventListener("scroll", measure);
      win.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [minReveal, scrollContainer]);

  return (
    <footer
      data-slot="dia-footer"
      className={cn("relative isolate overflow-hidden text-white", className)}
      style={{
        paddingBottom: gradientHeight,
        backgroundColor: surfaceColor,
        ...style,
      }}
    >
      <div
        className={cn("relative z-10", contentClassName)}
        style={{ color: resolvedColors.text }}
      >
        {children ?? (
          <p className="px-6 py-10 text-center font-mono text-sm uppercase tracking-[0.12em]">
            {copyrightText ?? `© ${DEFAULT_YEAR} Spider UI`}
          </p>
        )}
      </div>

      <div
        ref={bandRef}
        data-slot="dia-footer-spectrum"
        aria-hidden="true"
        className={cn(
          "pointer-events-none inset-x-0 bottom-0",
          embedded ? "absolute" : "fixed",
        )}
        style={{
          height: gradientHeight,
          transform: `scaleY(${clamp(minReveal, 0, 1)})`,
          transformOrigin: "bottom",
          willChange: "transform",
        }}
      >
        <svg
          className="block size-full"
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={`gradient-${gradientId}`}
              x1="0"
              y1={VIEWBOX_HEIGHT}
              x2="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              {OFFSETS.map((offset, index) => (
                <stop
                  key={offset}
                  offset={offset}
                  stopColor={resolvedColors.gradient[index]}
                />
              ))}
            </linearGradient>
            <filter
              id={`blur-${gradientId}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation={Math.max(0, blur)} />
            </filter>
          </defs>
          {barHeights.map((height, index) => (
            <g key={index} filter={`url(#blur-${gradientId})`}>
              <rect
                x={index * columnWidth}
                y={VIEWBOX_HEIGHT - height}
                width={columnWidth * 1.24}
                height={height}
                fill={`url(#gradient-${gradientId})`}
              />
            </g>
          ))}
        </svg>
      </div>
    </footer>
  );
}
