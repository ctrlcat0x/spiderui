import { DocsPageLayout } from "@/components/docs-page-layout";
import { GitHubRepoCardPreview } from "@/components/docs/previews/github-repo-card-preview";
import { readComponentSource } from "@/lib/source-code";

const importCode = `import { GitHubRepoCard } from "@/components/ui/github-repo-card"`;

const usageCode = `export default function Page() {
  return <GitHubRepoCard owner="shadcn-ui" repo="ui" />
}`;

export async function GitHubRepoCardDocs() {
  const sourceCode =
    (await readComponentSource("github-repo-card")) ||
    "// Unable to load source code";

  return (
    <DocsPageLayout
      title="GitHub Repo Card"
      description="Server-rendered GitHub repository card with cached metadata, topics, language, and repository stats."
      preview={<GitHubRepoCardPreview />}
      fullWidthPreview
      previewCode={usageCode}
      installPackageName="github-repo-card"
      installDependencies="lucide-react class-variance-authority clsx tailwind-merge"
      installSourceCode={sourceCode}
      installSourceFilename="components/ui/github-repo-card.tsx"
      usageImportCode={importCode}
      usageCode={usageCode}
      props={[
        {
          name: "owner",
          type: "string",
          description: "GitHub username or organization.",
        },
        {
          name: "repo",
          type: "string",
          description: "GitHub repository name.",
        },
        {
          name: "data",
          type: "GitHubRepoData",
          description:
            "Optional pre-fetched repository data that skips the API request.",
        },
        {
          name: "variant",
          type: '"default" | "outline" | "muted" | "ghost"',
          default: '"default"',
          description: "Surface style for the card.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Card spacing and corner radius.",
        },
        {
          name: "showLanguage",
          type: "boolean",
          default: "true",
          description: "Show the primary language and colored dot.",
        },
        {
          name: "showTopics",
          type: "boolean",
          default: "true",
          description: "Show GitHub topics.",
        },
        {
          name: "showLicense",
          type: "boolean",
          default: "true",
          description: "Show SPDX license identifier.",
        },
        {
          name: "showUpdated",
          type: "boolean",
          default: "true",
          description: "Show relative last-push time.",
        },
        {
          name: "maxTopics",
          type: "number",
          default: "4",
          description: "Maximum topic tags before a remaining-count badge.",
        },
        {
          name: "className",
          type: "string",
          description: "Additional classes for the link card.",
        },
      ]}
    />
  );
}
