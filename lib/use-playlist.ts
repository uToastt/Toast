"use client";

import Link from "next/link";

const CHANNEL_URL = "https://www.youtube.com/@Taostt";

// Replace this with your real channel ID (starts with UC...)
const CHANNEL_ID = "UCxxxxxxxxxxxxxxxxxxxx";

export function Videos() {
  return (
    <section id="videos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">
            Op <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* YouTube Embed Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <iframe
              key={i}
              className="w-full aspect-video rounded-xl"
              src={`https://www.youtube.com/embed/videoseries?list=UUxxxxxxxxxxxxxxxxxxxx&index=${i + 1}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={CHANNEL_URL}
            target="_blank"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg"
          >
            View Full Channel
          </Link>
        </div>
      </div>
    </section>
  );
}