import type { Metadata } from "next"
import { absoluteUrl } from "@/lib/utils"

interface MetadataProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: "profile" | "website" | "article" | "book" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other"
}

export function constructMetadata({ title, description, image, url, type = "website" as "profile" | "website" | "article" | "book" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other" }: MetadataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
      url,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  }
}
