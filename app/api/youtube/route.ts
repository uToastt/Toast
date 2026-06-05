import { NextResponse } from "next/server";

interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: string;
  views: string;
  videoCount: string;
  profileImage: string;
}

async function fetchChannelData(handle: string): Promise<YouTubeChannel | null> {
  try {
    // Fetch the YouTube channel page
    const response = await fetch(`https://www.youtube.com/${handle}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract subscriber count
    const subscriberMatch = html.match(/"subscriberCountText":\s*{\s*"simpleText":\s*"([^"]+)"/);
    const subscribers = subscriberMatch ? subscriberMatch[1].replace(" subscribers", "") : "0";

    // Extract channel name
    const nameMatch = html.match(/"channelMetadataRenderer":\s*{\s*"title":\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : handle.replace("@", "");

    // Extract profile image
    const avatarMatch = html.match(/"avatar":\s*{\s*"thumbnails":\s*\[\s*{\s*"url":\s*"([^"]+)"/);
    let profileImage = avatarMatch ? avatarMatch[1] : "";
    // Get higher resolution avatar
    if (profileImage) {
      profileImage = profileImage.replace(/=s\d+-/, "=s176-");
    }

    // Extract video count and view count from about tab data if available
    const videoCountMatch = html.match(/"videosCountText":\s*{\s*"runs":\s*\[\s*{\s*"text":\s*"([^"]+)"/);
    const videoCount = videoCountMatch ? videoCountMatch[1] : "0";

    const viewCountMatch = html.match(/"viewCountText":\s*{\s*"simpleText":\s*"([^"]+)"/);
    const views = viewCountMatch ? viewCountMatch[1].replace(" views", "") : "0";

    return {
      id: handle,
      name,
      handle,
      subscribers,
      views,
      videoCount,
      profileImage,
    };
  } catch (error) {
    console.error(`Error fetching channel ${handle}:`, error);
    return null;
  }
}

export async function GET() {
  const channels = ["@Taostt", "@1ts_Toxic", "@Cant_DoIt-Tv"];
  
  const results = await Promise.all(
    channels.map((handle) => fetchChannelData(handle))
  );

  const channelData: Record<string, YouTubeChannel | null> = {};
  channels.forEach((handle, index) => {
    channelData[handle] = results[index];
  });

  return NextResponse.json(channelData, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
