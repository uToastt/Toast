"use client";

import { useEffect, useMemo, useState } from "react";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePlaylist } from "@/lib/use-playlist";

const CHANNEL_URL = "https://www.youtube.com/@Taostt";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

export function Videos() {
  const { videos, isLoading, isError } = usePlaylist();

  const safeVideos: Video[] = useMemo(
    () => (Array.isArray(videos) ? videos : []),
    [videos]
  );

  const [index, setIndex] = useState(0);

  // auto rotate (safe version)
  useEffect(() => {
    if (!safeVideos.length) return;

    const t = setInterval(() => {
      setIndex((p) => (p + 1) % safeVideos.length);
    }, 5000);

    return () => clearInterval(t);
  }, [safeVideos.length]);

  const getOffset = (i: number) => {
    if (!safeVideos.length) return 0;
    let diff = i - index;

    // wrap shortest direction
    const half = safeVideos.length / 2;
    if (diff > half) diff -= safeVideos.length;
    if (diff < -half) diff += safeVideos.length;

    return diff;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-white">
        Loading...
      </div>
    );
  }

  if (isError || !safeVideos.length) {
    return (
      <div className="text-center py-20 text-white/60">
        No videos available
      </div>
    );
  }

  const active = safeVideos[index];

  return (
    <section className="relative py-32 overflow-hidden bg-black">

      {/* background blur */}
      <div className="absolute inset-0">
        <Image
          src={active.thumbnail}
          alt=""
          fill
          className="object-cover blur-3xl opacity-40 scale-125"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative container mx-auto px-4">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white">
            Vision <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* SPATIAL STACK (stable version) */}
        <div className="relative h-[520px] flex items-center justify-center perspective-[1200px]">

          {safeVideos.map((video, i) => {
            const offset = getOffset(i);

            const isActive = offset === 0;

            const scale = isActive ? 1 : 0.82;
            const x = offset * 260;
            const rotateY = offset * -28;
            const z = -Math.abs(offset) * 120;
            const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25;

            return (
              <div
                key={video.id}
                onClick={() => setIndex(i)}
                className="absolute transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `
                    translateX(${x}px)
                    translateZ(${z}px)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                  opacity,
                  zIndex: 100 - Math.abs(offset),
                }}
              >
                <Link
                  href={video.url}
                  target="_blank"
                  className="block"
                >
                  <div className="relative w-[420px] aspect-video rounded-2xl overflow-hidden shadow-2xl">

                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/25" />

                    {/* play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-primary/90 p-5 rounded-full hover:scale-110 transition">
                        <Play className="w-10 h-10 text-white fill-current" />
                      </div>
                    </div>

                    {/* title */}
                    <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-semibold line-clamp-2">
                        {video.title}
                      </p>
                    </div>

                  </div>
                </Link>
              </div>
            );
          })}

        </div>

        {/* controls */}
        <div className="flex justify-center gap-2 mt-8">
          {safeVideos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href={CHANNEL_URL}
            target="_blank"
            className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-semibold"
          >
            View All on YouTube
          </Link>
        </div>

      </div>
    </section>
  );
}