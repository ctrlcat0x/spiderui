import { DocsPageLayout } from "@/components/docs-page-layout";
import {
  ScrambleTextPersonalizePanel,
  ScrambleTextPreview,
} from "@/components/docs/previews/scramble-text-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { ScrambleText } from "@/components/ui/scramble-text"`;

const usageCode = `export function Demo() {
  return (
    <ScrambleText
      text="Ignoring all bugs"
      scrambleSpeed={70}
      scrambledLetterCount={2}
      caretVariant="line"
      scrambledClassName="text-orange-400"
    />
  )
}`;

export async function ScrambleTextDocs() {
  const sourceCode =
    (await readComponentSource("scramble-text")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Scramble Text"
      description="A stable typewriter reveal with a short scrambling edge, refined caret presets, and imperative replay controls."
      preview={<ScrambleTextPreview />}
      personalizeContent={<ScrambleTextPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="scramble-text"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/scramble-text.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "text",
          type: "string",
          description: "Text revealed from left to right.",
        },
        {
          name: "scrambleSpeed",
          type: "number",
          default: "50",
          description: "Milliseconds between revealed characters.",
        },
        {
          name: "scrambledLetterCount",
          type: "number",
          default: "2",
          description:
            "Number of scrambled characters shown at the reveal edge.",
        },
        {
          name: "characters",
          type: "string",
          default: "Lowercase letters and symbols",
          description: "Character set used for the scrambled edge.",
        },
        {
          name: "caret",
          type: "React.ReactNode",
          description:
            "Custom caret content. Passing it automatically uses custom mode.",
        },
        {
          name: "caretVariant",
          type: '"line" | "block" | "underscore" | "custom" | "none"',
          default: '"line"',
          description: "Built-in caret treatment.",
        },
        {
          name: "showCaret",
          type: "boolean",
          default: "true",
          description: "Show or remove the caret.",
        },
        {
          name: "blinkCaret",
          type: "boolean",
          default: "true",
          description: "Apply a pulse animation to the caret.",
        },
        {
          name: "hideCaretOnComplete",
          type: "boolean",
          default: "false",
          description: "Hide the caret when every character is revealed.",
        },
        {
          name: "autoStart",
          type: "boolean",
          default: "true",
          description: "Start automatically after mounting.",
        },
        {
          name: "delay",
          type: "number",
          default: "0",
          description: "Delay before auto-starting, in milliseconds.",
        },
        {
          name: "scrambledClassName",
          type: "string",
          description: "Classes applied to the scrambled edge.",
        },
        {
          name: "revealedClassName",
          type: "string",
          description: "Classes applied to revealed text.",
        },
        {
          name: "caretClassName",
          type: "string",
          description: "Classes applied to the caret.",
        },
        {
          name: "onStart / onComplete",
          type: "() => void",
          description: "Lifecycle callbacks for the reveal animation.",
        },
        {
          name: "ref",
          type: "ScrambleTextHandle",
          description: "Exposes start() and reset() controls.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes applied to the root span.",
        },
      ]}
    />
  );
}
