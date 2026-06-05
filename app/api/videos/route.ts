import { NextResponse } from "next/server";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

export const revalidate = 900;

export async function GET() {
  try {
    const CHANNEL_ID = "UCJsjU10QIMgaO_1bKz87HHA"; // 🔥 replace this

    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        cache: "force-cache",
      }
    );

    const xml = await res.text();

    if (!xml.includes("<entry>")) {
      console.error("[videos] invalid RSS response");
      return NextResponse.json({ videos: [] });
    }

    const entries = xml.split("<entry>").slice(1);

    const videos: Video[] = entries.slice(0, 12).map((entry) => {
      const id =
        entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || "";

      const title =
        entry.match(/<title>(.*?)<\/title>/)?.[1] || "Video";

      return {
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      };
    });

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("[videos error]", err);
    return NextResponse.json({ videos: [] });
  }
}