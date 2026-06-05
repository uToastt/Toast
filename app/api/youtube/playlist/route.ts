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

async function fetchRecentVideos(): Promise<PlaylistVideo[]> {
  try {
    // Fetch the YouTube channel videos page directly
    const response = await fetch(
      "https://www.youtube.com/@Taostt/videos",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        },
        next: { revalidate: 900 }, // Cache for 15 minutes
      }
    );

    if (!response.ok) {
      console.error("[v0] Failed to fetch channel page:", response.status);
      return [];
    }

    const html = await response.text();

    // Find all video IDs and titles using regex patterns that work with current YT format
    const videos: PlaylistVideo[] = [];
    
    // Pattern to find videoId in the page
    const videoIdPattern = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const foundIds = new Set<string>();
    
    let match;
    while ((match = videoIdPattern.exec(html)) !== null) {
      foundIds.add(match[1]);
    }
    
    // Extract video data for each unique ID
    for (const videoId of Array.from(foundIds).slice(0, 12)) {
      // Try to find title for this video
      const titlePattern = new RegExp(`"videoId":"${videoId}"[^}]*"title":\\{"runs":\\[\\{"text":"([^"]+)"`, 'g');
      const titleMatch = titlePattern.exec(html);
      
      // Try alternate title pattern
      const altTitlePattern = new RegExp(`"videoId":"${videoId}".*?"title":\\{"simpleText":"([^"]+)"`, 's');
      const altTitleMatch = altTitlePattern.exec(html);
      
      // Try to find within a larger context
      const contextPattern = new RegExp(`"videoRenderer":\\{[^}]*"videoId":"${videoId}"[^}]*\\}`, 'g');
      const contextMatch = contextPattern.exec(html);
      
      let title = "Video";
      if (titleMatch) {
        title = titleMatch[1];
      } else if (altTitleMatch) {
        title = altTitleMatch[1];
      }
      
      // Look for view count
      const viewPattern = new RegExp(`"videoId":"${videoId}"[\\s\\S]{0,500}"viewCountText":\\{"simpleText":"([^"]+)"`, 'g');
      const viewMatch = viewPattern.exec(html);
      const views = viewMatch ? viewMatch[1].replace(" views", "").replace(",", "") : "";
      
      // Look for duration
      const durationPattern = new RegExp(`"videoId":"${videoId}"[\\s\\S]{0,800}"lengthText":\\{"simpleText":"([^"]+)"`, 'g');
      const durationMatch = durationPattern.exec(html);
      const duration = durationMatch ? durationMatch[1] : "";

      videos.push({
        id: videoId,
        title: decodeHTMLEntities(title),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        duration,
        views,
        publishedAt: "",
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }

    // If regex approach failed, try JSON parsing as fallback
    if (videos.length === 0) {
      console.log("[v0] Regex approach found no videos, trying JSON parse...");
      
      // Look for ytInitialData
      const jsonMatch = html.match(/var ytInitialData = (\{[\s\S]*?\});/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[1]);
          const videoItems = findVideoRenderers(data);
          
          for (const item of videoItems.slice(0, 12)) {
            if (item.videoId) {
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
          }
        } catch (e) {
          console.error("[v0] JSON parse failed:", e);
        }
      }
    }

    console.log(`[v0] Found ${videos.length} videos from channel`);
    return videos;
  } catch (error) {
    console.error("[v0] Error fetching recent videos:", error);
    return [];
  }
}

// Recursively search for videoRenderer objects in nested JSON
function findVideoRenderers(obj: any, results: any[] = []): any[] {
  if (!obj || typeof obj !== 'object') return results;
  
  if (obj.videoRenderer && obj.videoRenderer.videoId) {
    const vr = obj.videoRenderer;
    results.push({
      videoId: vr.videoId,
      title: vr.title?.runs?.[0]?.text || vr.title?.simpleText || "",
      duration: vr.lengthText?.simpleText || "",
      views: vr.viewCountText?.simpleText?.replace(" views", "").replace(",", "") || "",
    });
  }
  
  if (obj.richItemRenderer?.content?.videoRenderer) {
    const vr = obj.richItemRenderer.content.videoRenderer;
    results.push({
      videoId: vr.videoId,
      title: vr.title?.runs?.[0]?.text || vr.title?.simpleText || "",
      duration: vr.lengthText?.simpleText || "",
      views: vr.viewCountText?.simpleText?.replace(" views", "").replace(",", "") || "",
    });
  }
  
  for (const key of Object.keys(obj)) {
    if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        findVideoRenderers(item, results);
      }
    } else if (typeof obj[key] === 'object') {
      findVideoRenderers(obj[key], results);
    }
  }
  
  return results;
}

// Helper to decode HTML entities
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
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    }
  );
}
