import { DocsPageLayout } from "@/components/docs-page-layout";
import { readComponentSource } from "@/lib/source-code";
import { EmojiReactionPreview } from "@/components/docs/previews/emoji-reaction-preview";

const importCode = `import { EmojiReaction } from "@/components/ui/emoji-reaction"`;
const usageCode = `export default function Page() {
  return <EmojiReaction onReact={(emoji) => console.log(emoji)} />
}`;

export async function EmojiReactionDocs() {
  const sourceCode =
    (await readComponentSource("emoji-reaction")) ||
    "// Unable to load source code";
  return (
    <DocsPageLayout
      title="Emoji Reaction"
      description="A playful reaction picker with native emoji, keyboard-safe controls, and animated emoji bursts."
      preview={<EmojiReactionPreview />}
      previewCode={usageCode}
      installPackageName="emoji-reaction"
      installDependencies="motion clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/emoji-reaction.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "emojis",
          type: "string[]",
          default: "🥰, 🤩, 😕, 🥺, 😁",
          description: "Native emoji options shown in the picker.",
        },
        {
          name: "onReact",
          type: "(emoji: string) => void",
          description: "Called after a reaction is selected.",
        },
        {
          name: "size",
          type: '"sm" | "md" | "lg"',
          default: "md",
          description: "Controls trigger and emoji sizing.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes on the root wrapper.",
        },
      ]}
    />
  );
}
