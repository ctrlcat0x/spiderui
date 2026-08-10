"use client";

import { useState } from "react";

import { ElasticSlider } from "@workspace/ui/components/elastic-slider";

export function ElasticSliderPreview({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [noise, setNoise] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [opacity, setOpacity] = useState(0.72);

  return (
    <div className="flex min-h-[420px] w-full items-center justify-center px-6 py-14">
      <div className="w-full max-w-md space-y-8">
        {compact ? (
          <ElasticSlider
            label="Opacity"
            value={opacity}
            onValueChange={setOpacity}
            min={0}
            max={1}
            step={0.01}
            formatValue={(value) => value.toFixed(2)}
          />
        ) : (
          <>
            <ElasticSlider
              label="Noise"
              value={noise}
              onValueChange={setNoise}
              min={0}
              max={100}
              step={1}
              formatValue={(value) => `${value}%`}
            />
            <ElasticSlider
              label="Saturation"
              value={saturation}
              onValueChange={setSaturation}
              min={0}
              max={100}
              step={1}
              formatValue={(value) => `${value}%`}
            />
            <ElasticSlider
              label="Background blur"
              value={blur}
              onValueChange={setBlur}
              min={0}
              max={40}
              step={1}
              formatValue={(value) => `${value}px`}
            />
          </>
        )}
      </div>
    </div>
  );
}
