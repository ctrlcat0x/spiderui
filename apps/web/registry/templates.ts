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

export const templates: Record<string, TemplateMetadata> = {
  product: {
    slug: "product",
    title: "Product",
    description:
      "Neo-brutalist SaaS landing page with a dashboard-style hero, pricing, FAQ, and bold color-block sections.",
    heroImage: "/templates/product.png",
    liveUrl: "https://product-spiderui-template.vercel.app",
    repoUrl: "https://github.com/ctrlcat0x/product-spiderui-template",
    whatIsThis:
      "A full Next.js starter for product and SaaS marketing sites. It uses a neo-brutalist, color-block aesthetic with a bento-style hero, feature galleries, transparent pricing, FAQ accordion, and conversion-focused CTAs. All copy and links live in a single config file so you can rebrand quickly.",
    whoIsFor:
      "Founders, indie hackers, and product teams who want a distinctive landing page without starting from a blank canvas. Ideal for B2B tools, productivity apps, and startup launches.",
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "shadcn/ui (base-rhea)",
      "Hugeicons",
      "next-themes",
    ],
  },
  pixels: {
    slug: "pixels",
    title: "Pixels",
    description:
      "Playful creative-agency landing page with block typography, project showcase, pricing, and contact sections.",
    heroImage: "/templates/pixels.png",
    liveUrl: "https://pixels-spiderui-template.vercel.app",
    repoUrl: "https://github.com/ctrlcat0x/pixels-spiderui-template",
    whatIsThis:
      "A creative digital-agency template built around bold block typography and a warm cream-and-charcoal palette. It includes a pixel-inspired hero, services marquee, project grid, rolling-price plans, logo cloud, lead-capture form, FAQ, and footer — all driven from centralized config.",
    whoIsFor:
      "Design studios, freelancers, and agencies that want a polished marketing site with personality. Great for portfolios, service businesses, and client-facing landing pages.",
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "shadcn/ui (base-lyra)",
      "Motion",
      "Phosphor Icons",
      "next-themes",
    ],
  },
  sprout: {
    slug: "sprout",
    title: "Sprout",
    description:
      "Premium design-agency template with scroll-driven hero, showcase carousel, testimonials, pricing, and multi-page routing.",
    heroImage: "/templates/sprout.png",
    liveUrl: "https://sprout-spiderui-template.vercel.app",
    repoUrl: "https://github.com/ctrlcat0x/sprout-spiderui-template",
    whatIsThis:
      "A high-polish agency site with a full-bleed hero, sticky navigation, selected-work carousel, animated stats, service cards, team hover interactions, testimonial bento grid, pricing tiers, and accolades. Includes dedicated Projects and Contact pages, wired to Spider UI's component registry.",
    whoIsFor:
      "Creative agencies, brand studios, and design-led teams that need a multi-section marketing site with motion and depth. Best when you want a premium feel out of the box.",
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "shadcn/ui (base-maia)",
      "GSAP",
      "Motion",
      "Spider UI registry",
      "next-themes",
    ],
  },
  "minimal-portfolio": {
    slug: "minimal-portfolio",
    title: "Minimal Portfolio",
    description:
      "Developer portfolio with MDX blog, smooth scrolling, sound design, and thoughtful micro-interactions.",
    heroImage: "/templates/minimal-portfolio.png",
    liveUrl: "https://sahilrana.vercel.app",
    repoUrl: "https://github.com/ctrlcat0x/portfolio",
    whatIsThis:
      "A minimal personal-site template for developers and designers. Single-column layout with bio, selected work, career timeline, reading list, and an MDX-powered blog. Features Lenis smooth scroll, optional preloader, rough-notation highlights, theme-aware sound effects, and staggered section reveals.",
    whoIsFor:
      "Engineers, designers, and creators who want a refined portfolio with writing built in. Swap the placeholder John Doe content in global config and ship.",
    stack: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "shadcn/ui (base-nova)",
      "MDX",
      "Framer Motion",
      "GSAP",
      "Lenis",
      "Biome",
    ],
  },
}

export function getTemplate(slug: string) {
  return templates[slug]
}

export function getAllTemplates() {
  return Object.values(templates)
}
