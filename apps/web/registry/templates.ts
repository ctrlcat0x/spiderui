export interface TemplateMetadata {
  slug: string
  title: string
  description: string
  heroImage: string
  liveUrl: string
  repoUrl: string
  whatIsThis: string
  whoIsFor?: string
  stack?: string[]
}

export const templates: Record<string, TemplateMetadata> = {}

export function getTemplate(slug: string) {
  return templates[slug]
}

export function getAllTemplates() {
  return Object.values(templates)
}
