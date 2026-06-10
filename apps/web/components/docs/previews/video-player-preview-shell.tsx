import type { ReactNode } from "react"

export function VideoPlayerPreviewShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 p-8 sm:p-14">
      <div className="w-full max-w-4xl">{children}</div>
    </div>
  )
}
