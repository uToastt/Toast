import { NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;

const CHANNELS = [
  {
    handle: "@Taostt",
    id: "UCJsjU10QIMgaO_1bKz87HHA",
    name: "Toast",
  },
  {
    handle: "@1ts_Toxic",
    id: "UCLFema9EDYsLlZHr918-mUw",
    name: "1ts_Toxic",
  },
];

export async function GET() {
  try {
    const results = await Promise.all(
      CHANNELS.map(async (channel) => {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channel.id}&key=${API_KEY}`,
          {
            next: { revalidate: 3600 }, // cache 1 hour (Vercel safe)
          }
        );

        if (!res.ok) {
          throw new Error(`Failed for ${channel.handle}`);
        }

        const data = await res.json();
        const item = data.items?.[0];

        return {
          handle: channel.handle,
          name: item?.snippet?.title || channel.name,
          profileImage: item?.snippet?.thumbnails?.high?.url || "",
          subscribers: Number(item?.statistics?.subscriberCount || 0),
          views: Number(item?.statistics?.viewCount || 0),
          videoCount: Number(item?.statistics?.videoCount || 0),
        };
      })
    );

    return NextResponse.json({
      channels: results,
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