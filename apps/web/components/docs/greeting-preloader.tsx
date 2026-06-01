import React from "react"
import { DocsPageLayout } from "@/components/docs-page-layout"
import { readComponentSource } from "@/lib/source-code"
import {
  GreetingPreloaderPlayground,
  GreetingPreloaderPersonalizePanel,
} from "@/components/docs/previews/greeting-preloader-playground"

const usageCode = `import { GreetingPreloader } from "@/components/ui/greeting-preloader"

export default function Page() {
  return (
    <GreetingPreloader
      greetings={[
        { text: "Hello", language: "English" },
        { text: "Bonjour", language: "French" },
        { text: "안녕하세요", language: "Korean" },
        { text: "Hola", language: "Spanish" },
        { text: "Ciao", language: "Italian" },
        { text: "नमस्ते", language: "Hindi" },
        { text: "こんにちは", language: "Japanese" },
      ]}
      intervalMs={600}
    />
  )
}`

const customGreetingsCode = `import { GreetingPreloader } from "@/components/ui/greeting-preloader"

export default function Page() {
  return (
    <GreetingPreloader
      greetings={[
        { text: "Hello", language: "English" },
        { text: "Hola", language: "Spanish" },
        { text: "नमस्ते", language: "Hindi" },
      ]}
      intervalMs={500}
    />
  )
}`

const inlineCode = `import { GreetingPreloader } from "@/components/ui/greeting-preloader"

export default function Page() {
  return (
    <div className="relative min-h-50 w-full">
      <GreetingPreloader fullPage={false} intervalMs={400} />
    </div>
  )
}`

export async function GreetingPreloaderDocs() {
  const sourceCode =
    (await readComponentSource("greeting-preloader")) ||
    "// Unable to load source code"

  const installationNote = (
    <p className="text-sm leading-relaxed text-muted-foreground">
      The install command also adds{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        gsap
      </code>{" "}
      and{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        motion
      </code>{" "}
      from the registry. Manual install:{" "}
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
        pnpm add gsap motion
      </code>
    </p>
  )

  const usageNote = (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <p>
        Cycles greetings with <strong className="text-foreground">Motion</strong>{" "}
        (<code className="text-foreground">AnimatePresence</code>) and exits with{" "}
        <strong className="text-foreground">GSAP</strong>. Full-page mode reveals{" "}
        <code className="text-foreground">#navbar</code>, headings, and other layout
        elements after the overlay slides away.
      </p>
    </div>
  )

  return (
    <DocsPageLayout
      title="Greetings Preloader"
      description="A greeting preloader that displays rapid greetings in different languages before revealing your page."
      preview={<GreetingPreloaderPlayground />}
      personalizeContent={<GreetingPreloaderPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="greeting-preloader"
      installDependencies="gsap motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/greeting-preloader.tsx"
      installationNote={installationNote}
      usageNote={usageNote}
      usageCode={usageCode}
      examples={[
        {
          title: "Custom Greetings",
          preview: (
            <GreetingPreloaderPlayground
              greetings={[
                { text: "Hello", language: "English" },
                { text: "Hola", language: "Spanish" },
                { text: "नमस्ते", language: "Hindi" },
              ]}
              intervalMs={500}
              remountKey={1}
            />
          ),
          code: customGreetingsCode,
        },
        {
          title: "Inline Mode",
          preview: (
            <GreetingPreloaderPlayground fullPage={false} intervalMs={400} remountKey={2} />
          ),
          code: inlineCode,
        },
      ]}
      props={[
        {
          name: "greetings",
          type: "Greeting[]",
          description:
            "Custom greeting list. Falls back to built-in defaults when omitted.",
        },
        {
          name: "intervalMs",
          type: "number",
          default: "300",
          description: "Milliseconds between greeting transitions.",
        },
        {
          name: "fullPage",
          type: "boolean",
          default: "true",
          description:
            "Cover the viewport and animate layout selectors on exit.",
        },
      ]}
    />
  )
}
