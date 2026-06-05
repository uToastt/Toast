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

const CHANNEL_ID = "UCqKaR6Z3WCJ_RW0mEJwJ4Uw"; // @Taostt channel ID

async function fetchRecentVideos(): Promise<PlaylistVideo[]> {
  try {
    // Use YouTube RSS feed - more reliable than scraping HTML
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        next: { revalidate: 1800 }, // Cache for 30 minutes
      }
    );

    if (!response.ok) {
      console.error("[v0] Failed to fetch RSS feed:", response.status);
      return [];
    }

    const xml = await response.text();
    
    // Parse XML to extract video entries
    const videos: PlaylistVideo[] = [];
    
    // Match all entry elements
    const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
    
    for (const entry of entryMatches.slice(0, 12)) {
      // Extract video ID
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const videoId = videoIdMatch?.[1] || "";
      
      // Extract title
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch?.[1] || "Untitled";
      
      // Extract published date
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const publishedAt = publishedMatch?.[1] || "";
      
      // Extract view count from media:statistics
      const viewsMatch = entry.match(/views="(\d+)"/);
      const views = viewsMatch?.[1] || "0";
      
      if (videoId) {
        videos.push({
          id: videoId,
          title: decodeHTMLEntities(title),
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          duration: "", // RSS doesn't provide duration
          views,
          publishedAt,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    }

    return videos;
  } catch (error) {
    console.error("[v0] Error fetching recent videos:", error);
    return [];
  }
}

// Helper to decode HTML entities
function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
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
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    }
  );
}
