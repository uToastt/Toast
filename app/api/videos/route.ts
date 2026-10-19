import { NextResponse } from "next/server";

export const revalidate = 900;

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(
      /&(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi,
      (match, entity: string) => {
        const named: Record<string, string> = {
          amp: "&",
          lt: "<",
          gt: ">",
          quot: '"',
          apos: "'",
        };

        if (named[entity]) return named[entity];

        const code = entity.toLowerCase().startsWith("#x")
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);

        return Number.isFinite(code) && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : match;
      }
    );
}

export async function GET() {
  try {
    const channelId =
      process.env.YOUTUBE_CHANNEL_ID ||
      "UCJsjU10QIMgaO_1bKz87HHA";

    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(
        channelId
      )}`,
      {
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error("YouTube feed unavailable");
    }

    const xml = await response.text();

    if (!xml.includes("<feed")) {
      throw new Error("Invalid feed response");
    }

    const videos = Array.from(
      xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)
    )
      .flatMap(([, entry]) => {
        const id = entry.match(
          /<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/
        )?.[1];

        if (!id) return [];

        const title = decodeXml(
          entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ||
            "Watch video"
        );

        return [
          {
            id,
            title,
            thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${id}`,
          },
        ];
      })
      .slice(0, 12);

    return NextResponse.json(
      { videos },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=900, stale-while-revalidate=3600",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        videos: [],
        error: "Video feed temporarily unavailable",
      },
      { status: 502 }
    );
  }
}