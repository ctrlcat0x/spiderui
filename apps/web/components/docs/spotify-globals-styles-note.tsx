import type React from "react"

export type SpotifyMusicStyleUsage = "seek" | "spin" | "seek-and-spin"

const usageLabels: Record<SpotifyMusicStyleUsage, string> = {
  seek: ".spotify-seek (seek bar)",
  spin: "@keyframes spin (vinyl rotation)",
  "seek-and-spin": ".spotify-seek and @keyframes spin",
}

type SpotifyGlobalsStylesNoteProps = {
  uses: SpotifyMusicStyleUsage
  className?: string
}

export function SpotifyGlobalsStylesNote({
  uses,
  className,
}: SpotifyGlobalsStylesNoteProps) {
  return (
    <div className={`space-y-3 text-sm leading-relaxed text-muted-foreground ${className ?? ""}`}>
      <p>
        Music component styles live in the UI package{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
          globals.css
        </code>{" "}
        (via <code className="text-foreground">spotify-music.css</code>). Import once in your
        app:
      </p>
      <pre className="overflow-x-auto rounded-md bg-zinc-950/90 p-3 text-xs text-zinc-100">
        {`import "@workspace/ui/globals.css"`}
      </pre>
      <p className="text-xs">
        When installing via the CLI, add{" "}
        <code className="text-foreground">@import &quot;./spotify-music.css&quot;;</code> to
        your <code className="text-foreground">app/globals.css</code> (installed as a registry
        dependency). This component uses {usageLabels[uses]}.
      </p>
    </div>
  )
}
