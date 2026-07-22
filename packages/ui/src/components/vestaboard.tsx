"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@workspace/ui/lib/utils";

const CHARACTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";
const MIN_ROWS = 1;
const MAX_ROWS = 10;
const MIN_COLUMNS = 4;
const MAX_COLUMNS = 32;

export const VESTABOARD_COLOR_TOKENS = {
  red: "#d94b3d",
  orange: "#ed7b2d",
  yellow: "#e8b33d",
  green: "#3f9b62",
  blue: "#3e78c7",
  violet: "#7d5ab5",
  white: "#f2f0e8",
} as const;

export interface VestaboardColors {
  board: string;
  flap: string;
  text: string;
}

export interface VestaboardProps extends Omit<
  React.ComponentProps<"div">,
  "children" | "color"
> {
  text?: string;
  rows?: number;
  columns?: number;
  flipSpeed?: number;
  colors?: Partial<VestaboardColors>;
  colorTokens?: Record<string, string>;
}

type VestaboardItem =
  | { type: "character"; value: string }
  | { type: "color"; name: string; value: string };

const BLANK_ITEM: VestaboardItem = { type: "character", value: " " };

const DEFAULT_COLORS: VestaboardColors = {
  board: "#171717",
  flap: "#262626",
  text: "#fafafa",
};

function clampInteger(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeCharacter(character: string): string {
  const normalized = character.toUpperCase();
  return CHARACTERS.includes(normalized) ? normalized : " ";
}

function getItemKey(item: VestaboardItem): string {
  return item.type === "color"
    ? `color:${item.name}:${item.value}`
    : `character:${item.value}`;
}

function getSeededWheelIndex(cellIndex: number, wheelLength: number): number {
  const mixedIndex = Math.imul(cellIndex + 1, 0x9e3779b1) >>> 0;
  return mixedIndex % wheelLength;
}

function wrapLine(line: string, columns: number): string[] {
  if (!line.trim()) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of line.trim().split(/\s+/)) {
    const chunks = Array.from(
      { length: Math.ceil(word.length / columns) },
      (_, index) => word.slice(index * columns, (index + 1) * columns),
    );

    for (const chunk of chunks) {
      if (!current) {
        current = chunk;
      } else if (current.length + chunk.length + 1 <= columns) {
        current += ` ${chunk}`;
      } else {
        lines.push(current);
        current = chunk;
      }
    }
  }

  if (current) lines.push(current);
  return lines;
}

export function formatVestaboardText(
  text: string,
  rows: number,
  columns: number,
): string[] {
  const safeRows = clampInteger(rows, MIN_ROWS, MAX_ROWS);
  const safeColumns = clampInteger(columns, MIN_COLUMNS, MAX_COLUMNS);
  const lines = text
    .split("\n")
    .flatMap((line) => wrapLine(line, safeColumns))
    .slice(0, safeRows);
  const startRow = Math.floor((safeRows - lines.length) / 2);
  const board = Array.from({ length: safeRows * safeColumns }, () => " ");

  lines.forEach((line, rowIndex) => {
    const characters = Array.from(line.toUpperCase()).map(normalizeCharacter);
    const startColumn = Math.max(
      0,
      Math.floor((safeColumns - characters.length) / 2),
    );

    characters.slice(0, safeColumns).forEach((character, columnIndex) => {
      board[(startRow + rowIndex) * safeColumns + startColumn + columnIndex] =
        character;
    });
  });

  return board;
}

function tokenizeWord(
  word: string,
  colorTokens: Record<string, string>,
): VestaboardItem[] {
  const items: VestaboardItem[] = [];
  let index = 0;

  while (index < word.length) {
    if (word[index] === "{") {
      const tokenEnd = word.indexOf("}", index + 1);

      if (tokenEnd > index) {
        const name = word.slice(index + 1, tokenEnd).toLowerCase();
        const color = colorTokens[name];

        if (color) {
          items.push({ type: "color", name, value: color });
          index = tokenEnd + 1;
          continue;
        }
      }
    }

    const [character] = Array.from(word.slice(index));
    items.push({
      type: "character",
      value: normalizeCharacter(character ?? " "),
    });
    index += character?.length ?? 1;
  }

  return items;
}

function wrapItems(
  paragraph: string,
  columns: number,
  colorTokens: Record<string, string>,
): VestaboardItem[][] {
  if (!paragraph.trim()) return [[]];

  const lines: VestaboardItem[][] = [];
  let current: VestaboardItem[] = [];

  for (const word of paragraph.trim().split(/\s+/)) {
    const wordItems = tokenizeWord(word, colorTokens);
    const chunks = Array.from(
      { length: Math.ceil(wordItems.length / columns) },
      (_, index) => wordItems.slice(index * columns, (index + 1) * columns),
    );

    for (const chunk of chunks) {
      if (current.length === 0) {
        current = chunk;
      } else if (current.length + chunk.length + 1 <= columns) {
        current = [...current, BLANK_ITEM, ...chunk];
      } else {
        lines.push(current);
        current = chunk;
      }
    }
  }

  if (current.length > 0) lines.push(current);
  return lines;
}

function formatVestaboardItems(
  text: string,
  rows: number,
  columns: number,
  colorTokens: Record<string, string>,
): VestaboardItem[] {
  const lines = text
    .split("\n")
    .flatMap((paragraph) => wrapItems(paragraph, columns, colorTokens))
    .slice(0, rows);
  const startRow = Math.floor((rows - lines.length) / 2);
  const board = Array.from({ length: rows * columns }, () => BLANK_ITEM);

  lines.forEach((line, rowIndex) => {
    const startColumn = Math.max(0, Math.floor((columns - line.length) / 2));

    line.slice(0, columns).forEach((item, columnIndex) => {
      board[(startRow + rowIndex) * columns + startColumn + columnIndex] = item;
    });
  });

  return board;
}

interface FlapFaceProps {
  half: "top" | "bottom";
  item: VestaboardItem;
  colors: VestaboardColors;
  className?: string;
}

function FlapFace({ half, item, colors, className }: FlapFaceProps) {
  const isTop = half === "top";
  const backgroundColor = item.type === "color" ? item.value : colors.flap;

  return (
    <div
      data-flap-item={item.type}
      data-flap-color={item.type === "color" ? item.name : undefined}
      className={cn(
        "absolute inset-0 overflow-hidden",
        isTop ? "rounded-t-[2px]" : "rounded-b-[2px]",
        className,
      )}
      style={{ backgroundColor }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.09] via-transparent to-black/20" />

      {item.type === "character" ? (
        <span
          className={cn(
            "absolute inset-x-0 flex h-[200%] select-none items-center justify-center font-mono font-medium leading-none tracking-[0.04em]",
            isTop ? "top-0" : "bottom-0",
          )}
          style={{
            color: colors.text,
            fontSize: "clamp(0.42rem, 2vw, 1.4rem)",
            textShadow: "0 1px 2px rgb(0 0 0 / 70%)",
          }}
        >
          {item.value === " " ? "\u00a0" : item.value}
        </span>
      ) : null}
    </div>
  );
}

interface VestaboardCellProps {
  target: VestaboardItem;
  wheel: VestaboardItem[];
  delay: number;
  flipSpeed: number;
  colors: VestaboardColors;
  startIndex: number;
}

const VestaboardCell = React.memo(function VestaboardCell({
  target,
  wheel,
  delay,
  flipSpeed,
  colors,
  startIndex,
}: VestaboardCellProps) {
  const prefersReducedMotion = useReducedMotion();
  const initialItem =
    target.type === "character" && target.value === " "
      ? BLANK_ITEM
      : (wheel[startIndex] ?? BLANK_ITEM);
  const [current, setCurrent] = React.useState<VestaboardItem>(initialItem);
  const [previous, setPrevious] = React.useState<VestaboardItem>(initialItem);
  const [settledBottom, setSettledBottom] =
    React.useState<VestaboardItem>(initialItem);
  const [flipKey, setFlipKey] = React.useState(0);
  const [isFlipping, setIsFlipping] = React.useState(false);
  const currentRef = React.useRef<VestaboardItem>(initialItem);
  const targetKey = getItemKey(target);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      currentRef.current = target;
      setCurrent(target);
      setPrevious(target);
      setSettledBottom(target);
      setIsFlipping(false);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const step = () => {
      if (cancelled || getItemKey(currentRef.current) === targetKey) return;

      const currentKey = getItemKey(currentRef.current);
      const currentIndex = Math.max(
        0,
        wheel.findIndex((item) => getItemKey(item) === currentKey),
      );
      const next = wheel[(currentIndex + 1) % wheel.length] ?? BLANK_ITEM;
      const oldItem = currentRef.current;

      setPrevious(oldItem);
      setSettledBottom(oldItem);
      currentRef.current = next;
      setCurrent(next);
      setIsFlipping(true);
      setFlipKey((key) => key + 1);

      if (getItemKey(next) !== targetKey) {
        timeoutId = setTimeout(step, flipSpeed);
      }
    };

    timeoutId = setTimeout(step, delay);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay, flipSpeed, prefersReducedMotion, target, targetKey, wheel]);

  const turnDuration = Math.max(0.04, Math.min(0.38, (flipSpeed / 1000) * 0.9));

  return (
    <div
      aria-hidden="true"
      data-flipping={isFlipping ? "" : undefined}
      className="relative aspect-[0.52] min-w-0 rounded-[3px] border border-black bg-[#090909] p-px shadow-[inset_0_2px_4px_rgb(0_0_0/95%),0_1px_0_rgb(255_255_255/5%)] [perspective:220px]"
    >
      <div className="relative size-full overflow-hidden rounded-[2px] shadow-[inset_0_0_0_1px_rgb(255_255_255/4%)] [transform-style:preserve-3d]">
        <div className="absolute inset-x-0 top-0 h-[calc(50%-1px)]">
          <FlapFace half="top" item={current} colors={colors} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[calc(50%-1px)]">
          <FlapFace half="bottom" item={settledBottom} colors={colors} />
        </div>

        {flipKey > 0 ? (
          <motion.div
            key={flipKey}
            data-flap-sheet=""
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -180 }}
            transition={{
              duration: turnDuration,
              ease: [0.45, 0.02, 0.22, 1],
            }}
            onAnimationComplete={() => {
              setSettledBottom(current);
              setIsFlipping(false);
            }}
            className="absolute inset-x-0 top-0 z-20 h-[calc(50%-1px)] origin-bottom [transform-style:preserve-3d] will-change-transform"
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <FlapFace half="top" item={previous} colors={colors} />
            </div>
            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
              <FlapFace half="bottom" item={current} colors={colors} />
            </div>
          </motion.div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 h-0.5 -translate-y-1/2 bg-black shadow-[0_-1px_0_rgb(255_255_255/4%),0_1px_1px_rgb(0_0_0/80%)]" />
        <div className="pointer-events-none absolute -left-px top-1/2 z-40 size-[3px] -translate-y-1/2 rounded-r-full bg-[#050505] shadow-[1px_0_0_rgb(255_255_255/8%)]" />
        <div className="pointer-events-none absolute -right-px top-1/2 z-40 size-[3px] -translate-y-1/2 rounded-l-full bg-[#050505] shadow-[-1px_0_0_rgb(255_255_255/8%)]" />
      </div>
    </div>
  );
});

export function Vestaboard({
  text = "WHAT DID YOU GET DONE\nTHIS WEEK?",
  rows = 6,
  columns = 22,
  flipSpeed = 160,
  colors,
  colorTokens,
  className,
  ...props
}: VestaboardProps) {
  const safeRows = clampInteger(rows, MIN_ROWS, MAX_ROWS);
  const safeColumns = clampInteger(columns, MIN_COLUMNS, MAX_COLUMNS);
  const safeFlipSpeed = Math.min(500, Math.max(80, flipSpeed));
  const resolvedColors = React.useMemo(
    () => ({ ...DEFAULT_COLORS, ...colors }),
    [colors],
  );
  const resolvedColorTokens = React.useMemo(
    () => colorTokens ?? {},
    [colorTokens],
  );
  const wheel = React.useMemo<VestaboardItem[]>(() => {
    const characterItems = Array.from(CHARACTERS, (value) => ({
      type: "character" as const,
      value,
    }));
    const colorItems = Object.entries(resolvedColorTokens).map(
      ([name, value]) => ({
        type: "color" as const,
        name: name.toLowerCase(),
        value,
      }),
    );

    if (colorItems.length === 0) return characterItems;

    const wheelItems: VestaboardItem[] = [];
    const colorInterval = Math.max(
      1,
      Math.floor(characterItems.length / colorItems.length),
    );
    let colorIndex = 0;

    characterItems.forEach((item, index) => {
      wheelItems.push(item);

      if ((index + 1) % colorInterval === 0 && colorIndex < colorItems.length) {
        wheelItems.push(colorItems[colorIndex] ?? BLANK_ITEM);
        colorIndex += 1;
      }
    });

    wheelItems.push(...colorItems.slice(colorIndex));
    return wheelItems;
  }, [resolvedColorTokens]);
  const board = React.useMemo(
    () =>
      formatVestaboardItems(text, safeRows, safeColumns, resolvedColorTokens),
    [text, safeRows, safeColumns, resolvedColorTokens],
  );
  const stagger = Math.min(24, safeFlipSpeed * 0.22);
  const accessibleText = text.replace(/\{[^}]+\}/g, "color tile");

  return (
    <div
      role="img"
      aria-label={`Vestaboard displaying: ${accessibleText}`}
      data-slot="vestaboard"
      className={cn(
        "w-full max-w-4xl rounded-[clamp(0.85rem,2.2vw,1.65rem)] border border-white/[0.06] p-[clamp(0.75rem,2.5vw,1.85rem)] shadow-[0_34px_90px_-34px_rgb(0_0_0/95%),inset_0_1px_0_rgb(255_255_255/5%),inset_0_-1px_0_rgb(0_0_0/80%)]",
        className,
      )}
      style={{ backgroundColor: resolvedColors.board }}
      {...props}
    >
      <div
        className="grid gap-[clamp(2px,0.42vw,5px)]"
        style={{
          gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))`,
        }}
      >
        {board.map((target, index) => {
          const row = Math.floor(index / safeColumns);
          const column = index % safeColumns;

          return (
            <VestaboardCell
              key={`${row}-${column}`}
              target={target}
              wheel={wheel}
              colors={resolvedColors}
              flipSpeed={safeFlipSpeed}
              delay={(row + column) * stagger}
              startIndex={getSeededWheelIndex(index, wheel.length)}
            />
          );
        })}
      </div>
    </div>
  );
}
