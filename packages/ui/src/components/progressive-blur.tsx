import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@workspace/ui/lib/utils";

export const PROGRESSIVE_BLUR_LEVELS = [0.5, 1, 2, 4, 8, 16, 32, 64] as const;

export type ProgressiveBlurPosition = "top" | "bottom" | "both";

export interface ProgressiveBlurProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** Background color blended into the blurred edge. */
  backgroundColor?: string;
  /** Height of each blurred edge. */
  height?: string;
  /** Which edge receives the progressive blur. */
  position?: ProgressiveBlurPosition;
  /** Blur radii, in pixels, from the content edge to the pinned edge. */
  blurLevels?: readonly number[];
}

type BlurEdgeProps = {
  backgroundColor: string;
  blurLevels: readonly number[];
  height: string;
  edge: "top" | "bottom";
};

function getMaskGradient(edge: "top" | "bottom", index: number, total: number) {
  const step = 100 / total;
  const fadeStart = Math.max(0, (index - 1) * step);
  const fadeEnd = Math.min(100, (index + 1) * step);
  const direction = edge === "top" ? "top" : "bottom";

  return `linear-gradient(to ${direction}, transparent ${fadeStart}%, black ${fadeEnd}%)`;
}

function BlurEdge({
  backgroundColor,
  blurLevels,
  edge,
  height,
}: BlurEdgeProps) {
  const direction = edge === "top" ? "top" : "bottom";
  const positionClassName = edge === "top" ? "top-0" : "bottom-0";
  const background = `linear-gradient(to ${direction}, transparent, ${backgroundColor})`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0",
        positionClassName,
      )}
      style={{ height }}
    >
      <div className="absolute inset-0" style={{ background }} />
      {blurLevels.map((blurAmount, index) => {
        const previousBlurAmount = blurLevels[index - 1] ?? 0;
        const blurDelta = Math.max(0, blurAmount - previousBlurAmount);
        const maskImage = getMaskGradient(edge, index, blurLevels.length);
        const style: CSSProperties = {
          backdropFilter: `blur(${blurDelta}px)`,
          WebkitBackdropFilter: `blur(${blurDelta}px)`,
          maskImage,
          WebkitMaskImage: maskImage,
        };

        return (
          <div
            key={`${edge}-${blurAmount}-${index}`}
            className="absolute inset-0"
            style={style}
          />
        );
      })}
    </div>
  );
}

export function ProgressiveBlur({
  backgroundColor = "transparent",
  height = "30%",
  position = "bottom",
  blurLevels = PROGRESSIVE_BLUR_LEVELS,
  className,
  style,
  ...props
}: ProgressiveBlurProps) {
  const resolvedBlurLevels = blurLevels.length
    ? blurLevels
    : PROGRESSIVE_BLUR_LEVELS;
  const isBoth = position === "both";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 select-none",
        isBoth ? "inset-y-0" : position === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={isBoth ? style : { height, ...style }}
      {...props}
    >
      {isBoth ? (
        <>
          <BlurEdge
            edge="top"
            height={height}
            backgroundColor={backgroundColor}
            blurLevels={resolvedBlurLevels}
          />
          <BlurEdge
            edge="bottom"
            height={height}
            backgroundColor={backgroundColor}
            blurLevels={resolvedBlurLevels}
          />
        </>
      ) : (
        <BlurEdge
          edge={position}
          height="100%"
          backgroundColor={backgroundColor}
          blurLevels={resolvedBlurLevels}
        />
      )}
    </div>
  );
}
