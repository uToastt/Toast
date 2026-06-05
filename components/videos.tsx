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

  const trackRef = useRef<HTMLDivElement | null>(null);

  // drag physics
  const drag = useRef({
    isDown: false,
    startX: 0,
    currentX: 0,
    velocity: 0,
    lastTime: 0,
  });

  const requestRef = useRef<number | null>(null);

  const clampIndex = (i: number) => {
    if (!safeVideos.length) return 0;
    return (i + safeVideos.length) % safeVideos.length;
  };

  const goTo = (i: number) => setIndex(clampIndex(i));

  // autoplay
  useEffect(() => {
    if (!safeVideos.length) return;

    const t = setInterval(() => {
      setIndex((p) => clampIndex(p + 1));
    }, 5000);

    return () => clearInterval(t);
  }, [safeVideos.length]);

  // inertia animation loop
  const animate = () => {
    const d = drag.current;

    if (!d.isDown && Math.abs(d.velocity) > 0.01) {
      d.velocity *= 0.92;
      d.currentX += d.velocity;

      if (Math.abs(d.currentX) > 120) {
        const direction = d.currentX > 0 ? -1 : 1;
        goTo(index + direction);
        d.currentX = 0;
        d.velocity = 0;
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [index]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current.isDown = true;
    drag.current.startX = e.clientX;
    drag.current.currentX = 0;
    drag.current.velocity = 0;
    drag.current.lastTime = Date.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.isDown) return;

    const now = Date.now();
    const dx = e.clientX - drag.current.startX;

    const dt = now - drag.current.lastTime || 16;

    drag.current.velocity = (dx - drag.current.currentX) / dt;
    drag.current.currentX = dx;
    drag.current.lastTime = now;

    if (Math.abs(dx) > 80) {
      if (dx > 0) goTo(index - 1);
      else goTo(index + 1);

      drag.current.isDown = false;
    }
  };

  const onPointerUp = () => {
    drag.current.isDown = false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
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

  const active = safeVideos[index];

  return (
    <section className="relative py-24 overflow-hidden">

      {/* 🔥 blurred background */}
      <div className="absolute inset-0 scale-110">
        <Image
          src={active.thumbnail}
          alt=""
          fill
          className="object-cover blur-3xl opacity-40 scale-125"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative container mx-auto px-4">

        {/* header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white">
            OP <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* CAROUSEL */}
        <div
          ref={trackRef}
          className="flex justify-center items-center gap-6 select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >

          {safeVideos.map((video, i) => {
            const offset = i - index;

            const scale = offset === 0 ? 1 : 0.8;
            const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3;
            const x = offset * 260;

            return (
              <Link
                key={video.id}
                href={video.url}
                target="_blank"
                className="absolute transition-all duration-500"
                style={{
                  transform: `translateX(${x}px) scale(${scale})`,
                  opacity,
                  zIndex: offset === 0 ? 10 : 1,
                }}
              >
                <div className="relative w-[420px] aspect-video rounded-2xl overflow-hidden shadow-2xl">

                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />

                  {/* overlay */}
                  <div className="absolute inset-0 bg-black/30" />

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

        {/* dots */}
        <div className="flex justify-center gap-2 mt-10">
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
        <div className="text-center mt-12">
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