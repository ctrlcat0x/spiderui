import { NextRequest, NextResponse } from "next/server"
import spotifyUrlInfo from "spotify-url-info"

// @ts-expect-error spotify-url-info has no bundled types
const { getPreview } = spotifyUrlInfo(fetch)

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const data = await getPreview(url.replace(/\/intl-[a-z]{2}\//, "/"))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
