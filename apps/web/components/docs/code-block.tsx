import { CopyButton } from "@/components/copy-button"

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative rounded-xl border border-border overflow-hidden bg-zinc-100 dark:bg-zinc-900/50 font-mono text-sm leading-relaxed text-foreground">
      <pre className="overflow-x-auto p-4 pr-12 whitespace-pre">
        <code className="text-zinc-950 dark:text-zinc-100">{code}</code>
      </pre>
      <CopyButton code={code.trim()} />
    </div>
  )
}
