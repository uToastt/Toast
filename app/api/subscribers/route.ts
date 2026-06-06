import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;

const CHANNELS = [
  {
    handle: "@Taostt",
    id: "UCJsjU10QIMgaO_1bKz87HHA",
  },
  {
    handle: "@1ts_Toxic",
    id: "UCLFema9EDYsLlZHr918-mUw",
  },
];

export async function GET() {
  try {
    const channels = await Promise.all(
      CHANNELS.map(async (c) => {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${c.id}&key=${API_KEY}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error(`Failed request for ${c.handle}`);
        }

        const data = await res.json();
        const item = data.items?.[0];

        return {
          handle: c.handle,
          name: item?.snippet?.title || "",
          profileImage: item?.snippet?.thumbnails?.high?.url || "",
          subscribers: Number(item?.statistics?.subscriberCount || 0),
          views: Number(item?.statistics?.viewCount || 0),
          videoCount: Number(item?.statistics?.videoCount || 0),
        };
      })
    );

    return NextResponse.json({
      channels,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[subscribers api error]", err);

    return NextResponse.json(
      { channels: [] },
      { status: 500 }
    );
  }
}