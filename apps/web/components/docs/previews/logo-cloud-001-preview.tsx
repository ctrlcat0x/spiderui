"use client"

import {
  LogoCloud,
  LogoCloudGroup,
  LogoCloudItem,
} from "@workspace/ui/components/logo-cloud-001"
import {
  BoltLogo,
  ClaudeLogo,
  ClerkLogo,
  LinearLogo,
  NvidiaLogo,
  StripeLogo,
  VercelLogo,
} from "@/components/docs/previews/logo-cloud-001-logos"

export function LogoCloud001Preview() {
  return (
    <LogoCloud label="Trusted by">
      <LogoCloudGroup>
        <LogoCloudItem icon={<ClaudeLogo />} name="Claude" />
        <LogoCloudItem icon={<NvidiaLogo />} name="Nvidia" />
        <LogoCloudItem icon={<ClerkLogo />} name="Clerk" />
        <LogoCloudItem icon={<BoltLogo />} name="Bolt" />
        <LogoCloudItem icon={<StripeLogo />} name="Stripe" />
      </LogoCloudGroup>
      <LogoCloudGroup>
        <LogoCloudItem icon={<VercelLogo />} name="Vercel" />
        <LogoCloudItem icon={<ClaudeLogo />} name="Claude" />
        <LogoCloudItem icon={<LinearLogo />} name="Linear" />
        <LogoCloudItem icon={<BoltLogo />} name="Bolt" />
        <LogoCloudItem icon={<ClerkLogo />} name="Clerk" />
      </LogoCloudGroup>
    </LogoCloud>
  )
}
