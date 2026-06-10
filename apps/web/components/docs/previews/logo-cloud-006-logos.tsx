import {
  BaseUILogo,
  CursorLogo,
  DribbbleLogo,
  GhosttyLogo,
  MotionLogo,
  PaperLogo,
  StripeLogo,
  TrelloLogo,
} from "@/components/docs/previews/logo-cloud-brand-logos"

export const DEFAULT_LOGO_CLOUD_006_ROWS = [
  [
    { name: "Trello", logo: <TrelloLogo />, href: "#" },
    { name: "Stripe", logo: <StripeLogo />, href: "#" },
    { name: "Dribbble", logo: <DribbbleLogo />, href: "#" },
    { name: "Paper", logo: <PaperLogo />, href: "#" },
  ],
  [
    { name: "Cursor", logo: <CursorLogo />, href: "#" },
    { name: "Ghostty", logo: <GhosttyLogo />, href: "#" },
    { name: "Base UI", logo: <BaseUILogo />, href: "#" },
    { name: "Motion", logo: <MotionLogo />, href: "#" },
  ],
] as const
