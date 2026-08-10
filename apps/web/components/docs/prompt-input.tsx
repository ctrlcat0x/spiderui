import { DocsPageLayout } from "@/components/docs-page-layout";
import { PromptInputPreview } from "@/components/docs/previews/prompt-input-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { PromptInput } from "@/components/ui/prompt-input"`;

const usageCode = `export function AIPrompt() {
  return (
    <PromptInput
      placeholder="Ask anything..."
      models={["GPT 5.5", "Claude Opus", "Gemini Flash"]}
      efforts={["Low", "Medium", "High"]}
      onSubmit={(prompt, details) => {
        console.log(prompt, details)
      }}
    />
  )
}`;

export async function PromptInputDocs() {
  const sourceCode =
    (await readComponentSource("prompt-input")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="Prompt Input"
      description="An elastic AI composer that expands from a compact prompt pill into a multiline input with model, effort, attachment, voice, and submit controls."
      preview={<PromptInputPreview />}
      previewCode={usageCode}
      installPackageName="prompt-input"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/prompt-input.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "value",
          type: "string",
          description: "Controlled prompt value.",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          description: "Initial uncontrolled value.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called when the prompt changes.",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          description: "Alias for onValueChange for form-style integrations.",
        },
        {
          name: "onSubmit",
          type: "(value, details) => void",
          description:
            "Receives the prompt plus selected model, effort, and files.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Ask anything..."',
          description: "Collapsed and expanded placeholder text.",
        },
        {
          name: "models",
          type: "string[]",
          description: "Available model labels.",
        },
        {
          name: "efforts",
          type: "string[]",
          description: "Available reasoning effort labels.",
        },
        {
          name: "defaultModel",
          type: "string",
          description: "Initially selected model.",
        },
        {
          name: "defaultEffort",
          type: "string",
          description: "Initially selected effort.",
        },
        {
          name: "maxAttachments",
          type: "number",
          default: "4",
          description: "Maximum number of image attachments.",
        },
        {
          name: "enableAttachments",
          type: "boolean",
          default: "true",
          description: "Shows the image attachment control.",
        },
        {
          name: "enableVoice",
          type: "boolean",
          default: "true",
          description: "Shows and enables the voice control.",
        },
        {
          name: "onVoiceChange",
          type: "(recording: boolean) => void",
          description: "Connects the voice control to your recording pipeline.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional root classes.",
        },
      ]}
    />
  );
}
