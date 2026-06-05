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
      console.error("[v0] Failed to fetch:", response.status);
      return [];
    }

    const html = await response.text();

    const jsonMatch =
      html.match(/var ytInitialData = (\{[\s\S]*?\});/) ||
      html.match(/window\["ytInitialData"\]\s*=\s*(\{[\s\S]*?\});/);

    const videos: PlaylistVideo[] = [];

    if (!jsonMatch) {
      console.error("[v0] ytInitialData not found");
      return [];
    }

    try {
      const data = JSON.parse(jsonMatch[1]);
      const items = findVideoRenderers(data);

      console.log(`[v0] extracted items: ${items.length}`);

      for (const item of items.slice(0, 12)) {
        videos.push({
          id: item.videoId,
          title: item.title || "Video",
          thumbnail: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
          duration: item.duration || "",
          views: item.views || "",
          publishedAt: "",
          url: `https://www.youtube.com/watch?v=${item.videoId}`,
        });
      }
    } catch (err) {
      console.error("[v0] JSON parse error:", err);
    }

    return videos;
  } catch (error) {
    console.error("[v0] fetch error:", error);
    return [];
  }
}

function findVideoRenderers(
  obj: any,
  results: VideoRendererResult[] = [],
  seen = new Set<string>()
): VideoRendererResult[] {
  if (!obj || typeof obj !== "object") return results;

  const extract = (vr: any) => {
    if (!vr?.videoId || seen.has(vr.videoId)) return;

    seen.add(vr.videoId);

    const title =
      vr.title?.runs?.map((r: any) => r.text).join("") ||
      vr.title?.simpleText ||
      "";

    // IMPORTANT FIX: filter out junk titles like "Want to subscribe..."
    if (!title || title.includes("subscribe")) return;

    results.push({
      videoId: vr.videoId,
      title,
      duration: vr.lengthText?.simpleText || "",
      views:
        vr.viewCountText?.simpleText?.replace(/ views?/i, "").replace(/,/g, "") ||
        "",
    });
  };

  const current = obj as Record<string, any>;

  if (current.videoRenderer) extract(current.videoRenderer);
  if (current.richItemRenderer?.content?.videoRenderer) {
    extract(current.richItemRenderer.content.videoRenderer);
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