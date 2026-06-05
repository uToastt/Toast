"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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

  const safeVideos: Video[] = Array.isArray(videos) ? videos : [];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goNext = () => {
    setIndex((prev) => (prev + 1) % safeVideos.length);
  };

  const goPrev = () => {
    setIndex((prev) =>
      prev === 0 ? safeVideos.length - 1 : prev - 1
    );
  };

  // autoplay
  useEffect(() => {
    if (safeVideos.length === 0) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeVideos.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [safeVideos.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Failed to load videos
      </div>
    );
  }

  if (!safeVideos.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No videos found
      </div>
    );
  }

  const current = safeVideos[index];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            Latest <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">

          {/* Left button */}
          <button
            onClick={goPrev}
            className="absolute left-0 z-10 bg-black/40 hover:bg-black/60 p-3 rounded-full"
          >
            <ChevronLeft className="text-white" />
          </button>

          {/* Center card */}
          <Link
            href={current.url}
            target="_blank"
            className="w-full max-w-3xl group"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">

              <Image
                src={current.thumbnail}
                alt={current.title}
                fill
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
              />

              {/* dark overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 p-5 rounded-full opacity-90 group-hover:scale-110 transition">
                  <Play className="w-10 h-10 text-white fill-current" />
                </div>
              </div>

              {/* title */}
              <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-lg font-semibold line-clamp-2">
                  {current.title}
                </h3>
              </div>
            </div>
          </Link>

          {/* Right button */}
          <button
            onClick={goNext}
            className="absolute right-0 z-10 bg-black/40 hover:bg-black/60 p-3 rounded-full"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-6">
          {safeVideos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition ${
                i === index ? "bg-primary w-4" : "bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href={CHANNEL_URL}
            target="_blank"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg"
          >
            <Play className="w-5 h-5" />
            View All on YouTube
          </Link>
        </div>

      </div>
    </section>
  );
}