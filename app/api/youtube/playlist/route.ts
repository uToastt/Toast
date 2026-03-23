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

const PLAYLIST_ID = "PLCgYlEtkXxo8MS5EErbrhfFB4w1lPsjwH";

async function fetchPlaylistVideos(): Promise<PlaylistVideo[]> {
  try {
    // Fetch the YouTube playlist page
    const response = await fetch(
      `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`,
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
      console.error("Failed to fetch playlist:", response.status);
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

    // Navigate to playlist contents
    const contents =
      initialData?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content
        ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]
        ?.playlistVideoListRenderer?.contents || [];

    const videos: PlaylistVideo[] = [];

    for (const item of contents) {
      const video = item?.playlistVideoRenderer;
      if (!video) continue;

      const videoId = video.videoId;
      const title = video.title?.runs?.[0]?.text || "Untitled";
      
      // Get best thumbnail
      const thumbnails = video.thumbnail?.thumbnails || [];
      const thumbnail = thumbnails[thumbnails.length - 1]?.url || "";
      
      // Get duration
      const duration = video.lengthText?.simpleText || "0:00";
      
      // Get view count
      const viewCountText = video.videoInfo?.runs?.[0]?.text || "";
      const views = viewCountText.replace(" views", "").trim() || "0";

      videos.push({
        id: videoId,
        title,
        thumbnail: thumbnail.split("?")[0], // Remove query params for cleaner URL
        duration,
        views,
        publishedAt: "",
        url: `https://www.youtube.com/watch?v=${videoId}&list=${PLAYLIST_ID}`,
      });
    }

    return videos;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return [];
  }
}

export async function GET() {
  const videos = await fetchPlaylistVideos();

  return NextResponse.json(
    { 
      playlistId: PLAYLIST_ID,
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
