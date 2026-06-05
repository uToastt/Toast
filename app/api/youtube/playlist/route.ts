import { NextResponse } from "next/server";

interface PlaylistVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  url: string;
}

interface VideoRendererResult {
  videoId: string;
  title: string;
  duration: string;
  views: string;
}

async function fetchRecentVideos(): Promise<PlaylistVideo[]> {
  try {
    const response = await fetch(
      "https://www.youtube.com/@Taostt/videos",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        },
        next: { revalidate: 900 },
      }
    );

    if (!response.ok) {
      console.error(
        "[v0] Failed to fetch channel page:",
        response.status
      );
      return [];
    }

    const html = await response.text();

    const videos: PlaylistVideo[] = [];

    const jsonMatch =
      html.match(
        /var ytInitialData = (\{[\s\S]*?\});/
      ) ||
      html.match(
        /window\["ytInitialData"\]\s*=\s*(\{[\s\S]*?\});/
      );

    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1]);

        const videoItems = findVideoRenderers(data);

        for (const item of videoItems.slice(0, 12)) {
          videos.push({
            id: item.videoId,
            title: decodeHTMLEntities(item.title || "Video"),
            thumbnail: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
            duration: item.duration || "",
            views: item.views || "",
            publishedAt: "",
            url: `https://www.youtube.com/watch?v=${item.videoId}`,
          });
        }
      } catch (e) {
        console.error("[v0] JSON parse failed:", e);
      }
    } else {
      console.warn("[v0] Could not locate ytInitialData");
    }

    console.log(
      `[v0] Found ${videos.length} videos from channel`
    );

    return videos;
  } catch (error) {
    console.error("[v0] Error fetching recent videos:", error);
    return [];
  }
}

function findVideoRenderers(
  obj: unknown,
  results: VideoRendererResult[] = [],
  seen = new Set<string>()
): VideoRendererResult[] {
  if (!obj || typeof obj !== "object") {
    return results;
  }

  const recordVideo = (vr: any) => {
    if (!vr?.videoId || seen.has(vr.videoId)) {
      return;
    }

    seen.add(vr.videoId);

    results.push({
      videoId: vr.videoId,
      title:
        vr.title?.runs?.[0]?.text ||
        vr.title?.simpleText ||
        "",
      duration: vr.lengthText?.simpleText || "",
      views:
        vr.viewCountText?.simpleText
          ?.replace(/ views?/i, "")
          ?.replace(/,/g, "") || "",
    });
  };

  const current = obj as Record<string, any>;

  if (current.videoRenderer) {
    recordVideo(current.videoRenderer);
  }

  if (current.richItemRenderer?.content?.videoRenderer) {
    recordVideo(current.richItemRenderer.content.videoRenderer);
  }

  for (const value of Object.values(current)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        findVideoRenderers(item, results, seen);
      }
    } else if (value && typeof value === "object") {
      findVideoRenderers(value, results, seen);
    }
  }

  return results;
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"');
}

export async function GET() {
  const videos = await fetchRecentVideos();

  return NextResponse.json(
    {
      videos,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control":
          "public, s-maxage=900, stale-while-revalidate=1800",
      },
    }
  );
}