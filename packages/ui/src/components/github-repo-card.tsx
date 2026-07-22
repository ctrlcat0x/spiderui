import * as React from "react";
import { Archive, Clock3, GitFork, Github, Scale, Star } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@workspace/ui/lib/utils";

export interface GitHubRepoData {
  fullName: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  license: string | null;
  topics: string[];
  updatedAt: string | null;
  isFork: boolean;
  isArchived: boolean;
  homepage: string | null;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Elixir: "#6e4a7e",
  Zig: "#ec915c",
};

export function getLanguageColor(language: string) {
  return LANGUAGE_COLORS[language] ?? "#8b8b8b";
}

export function formatCount(count: number) {
  if (count >= 1_000_000)
    return `${(count / 1_000_000).toFixed(1).replace(".0", "")}m`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(".0", "")}k`;
  return count.toLocaleString("en-US");
}

export function formatRelativeDate(iso: string) {
  const timestamp = new Date(iso).getTime();
  if (Number.isNaN(timestamp)) return null;

  const days = Math.max(0, Math.floor((Date.now() - timestamp) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export async function fetchGitHubRepoData(
  owner: string,
  repo: string,
): Promise<GitHubRepoData | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 },
      } as RequestInit,
    );

    if (!response.ok) return null;
    const data = (await response.json()) as Record<string, unknown>;
    if (typeof data.full_name !== "string") return null;

    const language = typeof data.language === "string" ? data.language : null;
    const license = data.license as { spdx_id?: unknown } | null;

    return {
      fullName: data.full_name,
      description:
        typeof data.description === "string" ? data.description : null,
      language,
      languageColor: language ? getLanguageColor(language) : null,
      stars:
        typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
      forks: typeof data.forks_count === "number" ? data.forks_count : 0,
      openIssues:
        typeof data.open_issues_count === "number" ? data.open_issues_count : 0,
      license: typeof license?.spdx_id === "string" ? license.spdx_id : null,
      topics: Array.isArray(data.topics)
        ? data.topics.filter(
            (topic): topic is string => typeof topic === "string",
          )
        : [],
      updatedAt: typeof data.pushed_at === "string" ? data.pushed_at : null,
      isFork: data.fork === true,
      isArchived: data.archived === true,
      homepage:
        typeof data.homepage === "string" && data.homepage
          ? data.homepage
          : null,
    };
  } catch {
    return null;
  }
}

export const githubRepoCardVariants = cva(
  "flex flex-col gap-4 rounded-2xl border p-5 transition-colors duration-200",
  {
    variants: {
      variant: {
        default:
          "border-border/70 bg-card shadow-sm hover:border-foreground/20 hover:bg-accent/35",
        outline: "border-border bg-background hover:bg-accent/35",
        muted: "border-border/60 bg-muted/35 hover:bg-muted/60",
        ghost: "border-transparent bg-transparent hover:bg-accent/35",
      },
      size: {
        sm: "gap-3 rounded-xl p-4",
        default: "gap-4 rounded-2xl p-5",
        lg: "gap-5 rounded-3xl p-6",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface GitHubRepoCardProps
  extends
    Omit<React.ComponentProps<"a">, "children" | "href">,
    VariantProps<typeof githubRepoCardVariants> {
  owner: string;
  repo: string;
  showLanguage?: boolean;
  showTopics?: boolean;
  showLicense?: boolean;
  showUpdated?: boolean;
  maxTopics?: number;
  data?: GitHubRepoData;
}

export async function GitHubRepoCard({
  owner,
  repo,
  variant,
  size,
  showLanguage = true,
  showTopics = true,
  showLicense = true,
  showUpdated = true,
  maxTopics = 4,
  data: suppliedData,
  className,
  ...props
}: GitHubRepoCardProps) {
  const data = suppliedData ?? (await fetchGitHubRepoData(owner, repo));
  if (!data) return null;

  const topicLimit = Math.max(0, maxTopics);
  const topics = data.topics.slice(0, topicLimit);
  const remainingTopics = data.topics.length - topics.length;
  const relativeDate = data.updatedAt
    ? formatRelativeDate(data.updatedAt)
    : null;

  return (
    <a
      href={`https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`}
      target="_blank"
      rel="noreferrer"
      data-slot="github-repo-card"
      data-archived={data.isArchived || undefined}
      data-fork={data.isFork || undefined}
      aria-label={`${data.fullName} on GitHub, ${data.stars.toLocaleString("en-US")} stars`}
      className={cn(githubRepoCardVariants({ variant, size }), className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Github
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate text-base font-semibold tracking-tight">
            {data.fullName}
          </span>
        </div>
        {(data.isArchived || data.isFork) && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-2 py-1 text-[10px] font-medium text-muted-foreground">
            {data.isArchived ? (
              <Archive className="size-3" />
            ) : (
              <GitFork className="size-3" />
            )}
            {data.isArchived ? "Archived" : "Fork"}
          </span>
        )}
      </div>

      {data.description && (
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {data.description}
        </p>
      )}

      {showTopics && topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {topic}
            </span>
          ))}
          {remainingTopics > 0 && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              +{remainingTopics}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {showLanguage && data.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{
                backgroundColor:
                  data.languageColor ?? getLanguageColor(data.language),
              }}
            />
            {data.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <Star className="size-3.5" aria-hidden="true" />
          {formatCount(data.stars)}
        </span>
        {data.forks > 0 && (
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <GitFork className="size-3.5" aria-hidden="true" />
            {formatCount(data.forks)}
          </span>
        )}
        {showLicense && data.license && data.license !== "NOASSERTION" && (
          <span className="inline-flex items-center gap-1.5">
            <Scale className="size-3.5" aria-hidden="true" />
            {data.license}
          </span>
        )}
        {showUpdated && relativeDate && (
          <span className="ml-auto inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {relativeDate}
          </span>
        )}
      </div>
    </a>
  );
}
