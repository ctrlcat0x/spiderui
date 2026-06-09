"use client"

import { LogoMarquee, Marquee } from "@workspace/ui/components/logo-cloud-004"
import {
  BoltLogo,
  ClaudeLogo,
  ClerkLogo,
  LinearLogo,
  NvidiaLogo,
  StripeLogo,
  VercelLogo,
} from "@/components/docs/previews/logo-cloud-001-logos"

const logos = [
  { name: "Claude", svg: <ClaudeLogo /> },
  { name: "Nvidia", svg: <NvidiaLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
  { name: "Bolt", svg: <BoltLogo /> },
  { name: "Stripe", svg: <StripeLogo /> },
  { name: "Vercel", svg: <VercelLogo /> },
  { name: "Linear", svg: <LinearLogo /> },
]

export function LogoCloud004Preview() {
  return (
    <LogoMarquee
      logos={logos}
      label="Used by modern companies"
      duration={40}
      gap={200}
    />
  )
}

export function MarqueePrimitivePreview() {
  return (
    <Marquee direction="left" duration={30} gap={64} pauseOnHover fade>
      {logos.slice(0, 5).map(({ name, svg }) => (
        <span key={name} aria-label={name} className="flex items-center opacity-80">
          {svg}
        </span>
      ))}
    </Marquee>
  )
}
