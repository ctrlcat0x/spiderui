export function SpotifyGlobalsUsageNote() {
  return (
    <p className="mb-4 text-sm text-muted-foreground">
      Import{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        @workspace/ui/globals.css
      </code>{" "}
      in your root layout (includes music component styles).
    </p>
  )
}
