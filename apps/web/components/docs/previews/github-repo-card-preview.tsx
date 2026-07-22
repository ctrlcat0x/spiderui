import {
  GitHubRepoCard,
  type GitHubRepoData,
} from "@workspace/ui/components/github-repo-card";

const repos: GitHubRepoData[] = [
  {
    fullName: "shadcn-ui/ui",
    description:
      "A set of beautifully-designed, accessible components and a code distribution platform.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 119_500,
    forks: 9_500,
    openIssues: 0,
    license: "MIT",
    topics: ["base-ui", "components", "laravel", "nextjs", "react"],
    updatedAt: new Date().toISOString(),
    isFork: false,
    isArchived: false,
    homepage: null,
  },
  {
    fullName: "vercel/next.js",
    description: "The React framework for the web.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 141_100,
    forks: 31_500,
    openIssues: 0,
    license: "MIT",
    topics: [],
    updatedAt: new Date().toISOString(),
    isFork: false,
    isArchived: false,
    homepage: null,
  },
];

export function GitHubRepoCardPreview() {
  return (
    <div className="mx-auto flex min-h-[420px] w-full max-w-3xl flex-col justify-center gap-5 px-6 py-14 sm:px-10">
      {repos.map((data) => {
        const [owner, repo] = data.fullName.split("/");
        return (
          <GitHubRepoCard
            key={data.fullName}
            owner={owner!}
            repo={repo!}
            data={data}
          />
        );
      })}
    </div>
  );
}
