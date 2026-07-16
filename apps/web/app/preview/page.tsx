"use client"

import React from "react"
import { SpiderLogo } from "@/components/logos/spider-logo"

export default function PreviewPage() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#080808] text-zinc-100 selection:bg-white/20">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.12),transparent_50%),#080808]" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,#080808_90%)] opacity-80" />

      <div className="relative z-20 flex flex-col items-center gap-2 p-12 text-center">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md mb-2 shadow-lg shadow-black/20">
          <span className="mr-2.5 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-zinc-300 uppercase">
            Premium UI Library
          </span>
        </div>

        <div className="flex flex-row items-center justify-center gap-10 md:gap-16">
          <div className="relative h-32 w-32 md:h-48 md:w-48 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <SpiderLogo variant="transparent" size={192} className="size-full" priority />
          </div>
          <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-[8rem] leading-none pb-2 pr-2">
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent block pb-4 pr-2">
              Spider UI
            </span>
          </h1>
        </div>

        <p className="max-w-3xl text-2xl font-medium text-zinc-400 md:text-3xl leading-relaxed tracking-tight">
          A collection of refined, animated React primitives for building premium product interfaces.
        </p>
      </div>
    </div>
  )
}
