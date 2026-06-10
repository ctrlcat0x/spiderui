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

export {
  BaseUILogo,
  CursorLogo,
  DribbbleLogo,
  GhosttyLogo,
  MotionLogo,
  PaperLogo,
  StripeLogo,
  TrelloLogo,
}

export const DEFAULT_LOGO_CLOUD_005_ROWS = [
  [
    { name: "TRELLO", est: "EST. 2011", logo: <TrelloLogo /> },
    { name: "STRIPE", est: "EST. 2010", logo: <StripeLogo /> },
    { name: "DRIBBBLE", est: "EST. 2009", logo: <DribbbleLogo /> },
    { name: "PAPER", est: "EST. 2016", logo: <PaperLogo /> },
  ],
  [
    { name: "CURSOR", est: "EST. 2022", logo: <CursorLogo /> },
    { name: "GHOSTTY", est: "EST. 2024", logo: <GhosttyLogo /> },
    { name: "BASE UI", est: "EST. 2024", logo: <BaseUILogo /> },
    { name: "MOTION", est: "EST. 2018", logo: <MotionLogo /> },
  ],
] as const
