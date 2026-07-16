import { readFile } from "node:fs/promises"
import path from "node:path"

// Cache for source code - persists across renders
const sourceCache = new Map<string, string | null>()

const PACKAGE_COMPONENTS_DIR = path.resolve(
  process.cwd(),
  "../../packages/ui/src/components",
)

function normalizeRegistryContent(content: string): string {
  return content
    .replace(/@workspace\/ui\/lib\/utils/g, "@/lib/utils")
    .replace(
      /@workspace\/ui\/components\/webgl-error-boundary/g,
      "./webgl-error-boundary",
    )
}

async function readPackageComponentSource(
  componentName: string,
): Promise<string | null> {
  const componentPath = path.join(PACKAGE_COMPONENTS_DIR, `${componentName}.tsx`)

  try {
    const raw = await readFile(componentPath, "utf8")
    return normalizeRegistryContent(raw)
  } catch {
    return null
  }
}

async function readRegistryComponentSource(
  componentName: string,
): Promise<string | null> {
  // Dynamic import the registry JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const registry = (await import(`@/public/r/${componentName}.json`)) as any

  if (registry.files && registry.files.length > 0) {
    const matchingFile = registry.files.find(
      (file: { path: string }) =>
        file.path.endsWith(`/${componentName}.tsx`) ||
        file.path.endsWith(`${componentName}.tsx`),
    )
    return (
      matchingFile?.content ??
      registry.files[registry.files.length - 1]?.content ??
      registry.files[0].content ??
      null
    )
  }

  if (
    registry.default &&
    registry.default.files &&
    registry.default.files.length > 0
  ) {
    return registry.default.files[0].content ?? null
  }

  return null
}

/**
 * Read component source code with caching.
 *
 * Prefers the live package source so docs previews and copy-to-clipboard
 * stay aligned with what actually renders. Falls back to registry JSON.
 */
export async function readComponentSource(
  componentName: string,
): Promise<string | null> {
  const cached = sourceCache.get(componentName)
  if (cached !== undefined) {
    return cached
  }

  try {
    const content =
      (await readPackageComponentSource(componentName)) ??
      (await readRegistryComponentSource(componentName))

    sourceCache.set(componentName, content)
    return content
  } catch (error) {
    console.error(`Error loading source for ${componentName}:`, error)
    sourceCache.set(componentName, null)
    return null
  }
}

/**
 * Pre-warm the source cache for a list of component names.
 * Call this at build time or on initial page load for commonly used components.
 */
export async function preloadComponentSources(
  componentNames: string[],
): Promise<void> {
  await Promise.all(componentNames.map((name) => readComponentSource(name)))
}
