"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  // smooth animated position (not raw index)
  const position = useRef(0);
  const velocity = useRef(0);
  const raf = useRef<number | null>(null);

  const clamp = (v: number) => {
    if (!safeVideos.length) return 0;
    const len = safeVideos.length;
    return ((v % len) + len) % len;
  };

  const snapTo = (target: number) => {
    setIndex(clamp(target));
  };

  // 🎯 physics loop (smooth + spring)
  const animate = () => {
    // friction
    velocity.current *= 0.85;
    position.current += velocity.current;

    // snap detection (magnet effect)
    if (Math.abs(velocity.current) < 0.001) {
      const nearest = Math.round(position.current);
      position.current += (nearest - position.current) * 0.15;

      if (Math.abs(nearest - position.current) < 0.01) {
        position.current = nearest;
        snapTo(nearest);
      }
    }

    raf.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // 🧲 clean wheel control (FIXES CRAZY SCROLL ISSUE)
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    velocity.current += e.deltaY * 0.0015;
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

  return (
    <section className="relative py-32 overflow-hidden bg-black">

      {/* background (visionOS blur style) */}
      <div className="absolute inset-0">
        <Image
          src={safeVideos[index].thumbnail}
          alt=""
          fill
          className="object-cover blur-3xl opacity-40 scale-125"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative container mx-auto px-4">

        {/* header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">
            Vision <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* 🧲 SPATIAL STACK */}
        <div
          className="relative h-[520px] flex items-center justify-center"
          onWheel={onWheel}
        >
          {safeVideos.map((video, i) => {
            const offset = i - position.current;

            const scale = Math.max(0.75, 1 - Math.abs(offset) * 0.15);
            const opacity = Math.max(0, 1 - Math.abs(offset) * 0.25);
            const rotateY = offset * -35;
            const translateX = offset * 180;
            const translateZ = -Math.abs(offset) * 120;

            return (
              <Link
                key={video.id}
                href={video.url}
                target="_blank"
                className="absolute transition-all duration-300 ease-out"
                style={{
                  transform: `
                    translateX(${translateX}px)
                    translateZ(${translateZ}px)
                    rotateY(${rotateY}deg)
                    scale(${scale})
                  `,
                  opacity,
                  zIndex: 100 - Math.abs(offset),
                  pointerEvents: Math.abs(offset) > 3 ? "none" : "auto",
                }}
              >
                <div className="relative w-[420px] aspect-video rounded-2xl overflow-hidden shadow-2xl">

                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />

                  {/* glass overlay */}
                  <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

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
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
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