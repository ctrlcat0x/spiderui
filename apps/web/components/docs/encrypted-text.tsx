import { DocsPageLayout } from "@/components/docs-page-layout";
import {
  EncryptedTextPersonalizePanel,
  EncryptedTextPlayground,
} from "@/components/docs/previews/encrypted-text-playground";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { EncryptedText } from "@/components/ui/encrypted-text"`;

const usageCode = `export default function Page() {
  return (
    <EncryptedText
      text="Welcome to the Matrix"
      revealDelayMs={50}
      flipDelayMs={40}
      encryptedClassName="text-muted-foreground"
      revealedClassName="text-foreground"
    />
  )
}`;

export async function EncryptedTextDocs() {
  const sourceCode =
    (await readComponentSource("encrypted-text")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Encrypted Text"
      description="A viewport-triggered scramble effect that resolves gibberish into readable text one character at a time."
      preview={<EncryptedTextPlayground />}
      personalizeContent={<EncryptedTextPersonalizePanel />}
      previewCode={usageCode}
      installPackageName="encrypted-text"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/encrypted-text.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "text",
          type: "string",
          description: "Text to scramble and reveal.",
        },
        {
          name: "revealDelayMs",
          type: "number",
          default: "50",
          description: "Delay in milliseconds between revealed characters.",
        },
        {
          name: "flipDelayMs",
          type: "number",
          default: "50",
          description:
            "Delay in milliseconds between scramble character flips.",
        },
        {
          name: "charset",
          type: "string",
          default: "Letters, numbers, and symbols",
          description: "Characters used to generate the scrambled text.",
        },
        {
          name: "encryptedClassName",
          type: "string",
          description: "Classes applied to unrevealed characters.",
        },
        {
          name: "revealedClassName",
          type: "string",
          description: "Classes applied to revealed characters.",
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
