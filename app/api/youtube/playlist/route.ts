// app/api/videos/route.ts
import { NextResponse } from "next/server";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
};

async function fetchRSSVideos(): Promise<Video[]> {
  try {
    // Replace with your channel ID (UC...)
    const CHANNEL_ID = "UCxxxxxxxxxxxxxxxxxxxx";

    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        next: { revalidate: 900 },
      }
    );

    if (!res.ok) return [];

    const xml = await res.text();

    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

    return entries.slice(0, 10).map((entry) => {
      const block = entry[1];

      const id =
        block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || "";

      const title =
        block.match(/<title>(.*?)<\/title>/)?.[1] || "Video";

      const publishedAt =
        block.match(/<published>(.*?)<\/published>/)?.[1] || "";

      return {
        id,
        title,
        publishedAt,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GET() {
  const videos = await fetchRSSVideos();

  return NextResponse.json({
    videos,
    updatedAt: new Date().toISOString(),
  });
}