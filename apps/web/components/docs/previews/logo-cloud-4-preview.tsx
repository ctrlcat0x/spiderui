"use client"

import { LogoMarquee } from "@workspace/ui/components/logo-cloud-4"
import {
  BoltLogo,
  ClaudeLogo,
  ClerkLogo,
  LinearLogo,
  NvidiaLogo,
  StripeLogo,
  VercelLogo,
} from "@/components/docs/previews/logo-cloud-1-logos"

const logos = [
  { name: "Claude", svg: <ClaudeLogo /> },
  { name: "Nvidia", svg: <NvidiaLogo /> },
  { name: "Clerk", svg: <ClerkLogo /> },
  { name: "Bolt", svg: <BoltLogo /> },
  { name: "Stripe", svg: <StripeLogo /> },
  { name: "Vercel", svg: <VercelLogo /> },
  { name: "Linear", svg: <LinearLogo /> },
]

export function LogoCloud4Preview() {
  return (
    <LogoMarquee
      logos={logos}
      label="Used by modern companies"
      duration={40}
      gap={200}
    />
  )
}
