"use client";

import { PhoneCarousel } from "@workspace/ui/components/phone-mockup";

const SCREENS = [
  {
    id: "home",
    alt: "Calm mobile home screen",
    content: (
      <div className="flex size-full flex-col bg-[#f2efe8] px-7 pb-10 pt-16 text-[#26231e]">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#817a6e]">
          Today
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight">
          Good morning.
        </h2>
        <div className="mt-9 rounded-[24px] bg-[#d7e4d5] p-5">
          <p className="text-xs text-[#657263]">Focus</p>
          <p className="mt-12 text-xl font-medium">Design review</p>
          <p className="mt-1 text-sm text-[#657263]">10:30 — Studio</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="h-28 rounded-[22px] bg-[#e9d7c8]" />
          <div className="h-28 rounded-[22px] bg-[#d8d9e8]" />
        </div>
        <div className="mt-auto flex justify-around rounded-full bg-white/80 px-4 py-3 text-xs text-[#817a6e]">
          <span className="text-[#26231e]">Home</span>
          <span>Plan</span>
          <span>Profile</span>
        </div>
      </div>
    ),
  },
  {
    id: "music",
    alt: "Minimal mobile music player",
    content: (
      <div className="flex size-full flex-col bg-[#16171a] px-7 pb-10 pt-16 text-white">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-white/45">
          Now playing
        </p>
        <div className="mt-12 aspect-square rounded-[28px] bg-[radial-gradient(circle_at_30%_30%,#f7b267,#63372c_42%,#16171a_72%)] shadow-2xl" />
        <div className="mt-10">
          <h2 className="text-2xl font-medium">Soft Current</h2>
          <p className="mt-1 text-sm text-white/45">Night Studies</p>
        </div>
        <div className="mt-7 h-1 rounded-full bg-white/15">
          <div className="h-full w-2/5 rounded-full bg-white" />
        </div>
        <div className="mt-8 flex items-center justify-center gap-10 text-2xl">
          <span>‹</span>
          <span className="grid size-14 place-items-center rounded-full bg-white text-black">
            ▶
          </span>
          <span>›</span>
        </div>
      </div>
    ),
  },
  {
    id: "weather",
    alt: "Blue mobile weather screen",
    content: (
      <div className="flex size-full flex-col bg-gradient-to-b from-[#8bb8d6] to-[#dce8ee] px-7 pb-10 pt-20 text-[#13232d]">
        <p className="text-center text-sm">San Francisco</p>
        <p className="mt-5 text-center text-7xl font-light tracking-tighter">
          18°
        </p>
        <p className="mt-2 text-center text-sm text-[#304a59]">Partly cloudy</p>
        <div className="mt-12 rounded-[24px] bg-white/35 p-5 backdrop-blur-sm">
          <div className="flex justify-between text-sm">
            <span>Now</span>
            <span>19°</span>
          </div>
          <div className="mt-5 flex justify-between text-sm">
            <span>2 PM</span>
            <span>20°</span>
          </div>
          <div className="mt-5 flex justify-between text-sm">
            <span>4 PM</span>
            <span>17°</span>
          </div>
        </div>
        <div className="mt-auto rounded-[22px] bg-white/25 p-5 text-sm">
          Gentle wind from the west
        </div>
      </div>
    ),
  },
] as const;

export function PhoneMockupPreview() {
  return (
    <div className="flex min-h-[620px] w-full items-center justify-center overflow-hidden bg-muted/35 px-4 py-8">
      <PhoneCarousel
        items={SCREENS}
        interval={3_500}
        className="max-w-[760px]"
      />
    </div>
  );
}
