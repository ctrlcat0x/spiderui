import { DocsPageLayout } from "@/components/docs-page-layout";
import { AIPromptBoxPreview } from "@/components/docs/previews/ai-prompt-box-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { PromptInputBox } from "@/components/ui/ai-prompt-box"`;

const usageCode = `export function AIPromptDemo() {
  return (
    <PromptInputBox
      onSend={(message, files) => console.log(message, files)}
    />
  )
}`;

export async function AIPromptBoxDocs() {
  const sourceCode =
    (await readComponentSource("ai-prompt-box")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="AI Prompt Box"
      description="A self-contained AI message composer with image attachments, drag and paste support, tool modes, voice state, loading controls, and no headless UI dependency."
      preview={<AIPromptBoxPreview />}
      previewCode={usageCode}
      installPackageName="ai-prompt-box"
      installDependencies="clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/ai-prompt-box.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "value",
          type: "string",
          description: "Controlled message value.",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '""',
          description: "Initial uncontrolled message value.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called whenever the message changes or resets.",
        },
        {
          name: "onSend",
          type: "(message: string, files?: File[]) => void",
          description: "Receives submitted content and images.",
        },
        {
          name: "onStop",
          type: "() => void",
          description: "Called from the stop control while loading.",
        },
        {
          name: "onRecordingChange",
          type: "(recording: boolean) => void",
          description: "Connects voice state to your recorder.",
        },
        {
          name: "isLoading",
          type: "boolean",
          default: "false",
          description: "Shows a stop action and locks editing.",
        },
        {
          name: "placeholder",
          type: "string",
          default: '"Type your message here..."',
          description: "Textarea placeholder.",
        },
        {
          name: "maxHeight",
          type: "number",
          default: "180",
          description: "Maximum auto-growing textarea height in pixels.",
        },
        {
          name: "maxFileSize",
          type: "number",
          default: "10485760",
          description: "Maximum bytes accepted per image.",
        },
        {
          name: "maxFiles",
          type: "number",
          default: "3",
          description: "Maximum attached images.",
        },
        {
          name: "accept",
          type: "string",
          default: '"image/*"',
          description: "Native file picker accept filter.",
        },
        {
          name: "modes",
          type: 'Array<"search" | "think" | "canvas">',
          description: "Tool controls shown in the toolbar.",
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
