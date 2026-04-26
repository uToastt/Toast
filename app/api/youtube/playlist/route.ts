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

async function fetchPopularVideos(): Promise<PlaylistVideo[]> {
  try {
    // Fetch the YouTube channel's videos tab with popular sort
    const response = await fetch(
      `https://www.youtube.com/@Taostt/videos?sort=p`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        next: { revalidate: 1800 }, // Cache for 30 minutes
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch channel videos:", response.status);
      return [];
    }

    const html = await response.text();

    // Extract initial data JSON from the page
    const initialDataMatch = html.match(/var ytInitialData = ({[\s\S]*?});/);
    if (!initialDataMatch) {
      console.error("Could not find ytInitialData");
      return [];
    }

    const initialData = JSON.parse(initialDataMatch[1]);

    // Navigate to tab contents - for videos tab with popular sort
    const tabs = initialData?.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
    let videoContents: any[] = [];

    // Find the videos tab
    for (const tab of tabs) {
      const tabRenderer = tab?.tabRenderer;
      if (tabRenderer?.content) {
        const richGridContents =
          tabRenderer.content?.richGridRenderer?.contents || [];
        videoContents = richGridContents;
        break;
      }
    }

    const videos: PlaylistVideo[] = [];

    for (const item of videoContents) {
      const videoRenderer = item?.richItemRenderer?.content?.videoRenderer;
      if (!videoRenderer) continue;

      const videoId = videoRenderer.videoId;
      const title = videoRenderer.title?.runs?.[0]?.text || "Untitled";
      
      // Get best thumbnail
      const thumbnails = videoRenderer.thumbnail?.thumbnails || [];
      const thumbnail = thumbnails[thumbnails.length - 1]?.url || "";
      
      // Get duration
      const duration = videoRenderer.lengthText?.simpleText || "0:00";
      
      // Get view count from shortcuts
      const viewCountText = videoRenderer.shortBylineText?.simpleText || 
                           videoRenderer.viewCountText?.simpleText || 
                           videoRenderer.metrics?.[0]?.metricRenderer?.label?.simpleText || "";
      const views = viewCountText.replace(" views", "").trim() || "0";

      videos.push({
        id: videoId,
        title,
        thumbnail: thumbnail.split("?")[0], // Remove query params for cleaner URL
        duration,
        views,
        publishedAt: "",
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }

    return videos;
  } catch (error) {
    console.error("Error fetching popular videos:", error);
    return [];
  }
}

export async function GET() {
  const videos = await fetchPopularVideos();

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
