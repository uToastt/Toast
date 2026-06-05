"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Loader2 } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // autoplay (pauses on hover)
  useEffect(() => {
    if (!safeVideos.length) return;

    const start = () => {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % safeVideos.length);
      }, 4500);
    };

    start();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [safeVideos.length]);

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resume = () => {
    if (!safeVideos.length) return;
    pause();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeVideos.length);
    }, 4500);
  };

  // drag/swipe logic
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let isDown = false;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    };

    const onUp = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      isDown = false;

      const endX =
        "changedTouches" in e
          ? e.changedTouches[0].clientX
          : (e as MouseEvent).clientX;

      const diff = endX - startX;

      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          setIndex((prev) => (prev + 1) % safeVideos.length);
        } else {
          setIndex((prev) =>
            prev === 0 ? safeVideos.length - 1 : prev - 1
          );
        }
      }
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onUp);

    el.addEventListener("touchstart", onDown);
    el.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchend", onUp);
    };
  }, [safeVideos.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (isError || !safeVideos.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No videos available
      </div>
    );
  }

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">
            op <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className="relative flex justify-center items-center"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          <div className="relative w-full max-w-4xl aspect-video">

            {safeVideos.map((video, i) => {
              const active = i === index;

              return (
                <Link
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    active
                      ? "opacity-100 scale-100 z-20"
                      : "opacity-0 scale-95 z-0 pointer-events-none"
                  }`}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">

                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-primary/90 p-5 rounded-full hover:scale-110 transition">
                        <Play className="w-10 h-10 text-white fill-current" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white text-lg font-semibold line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-6">
          {safeVideos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-2 bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href={CHANNEL_URL}
            target="_blank"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg"
          >
            View All on YouTube
          </Link>
        </div>

      </div>
    </section>
  );
}