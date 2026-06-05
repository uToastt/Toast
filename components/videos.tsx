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

const RADIUS = 420;

export function Videos() {
  const { videos, isLoading, isError } = usePlaylist();

  const safeVideos: Video[] = useMemo(
    () => (Array.isArray(videos) ? videos : []),
    [videos]
  );

  const [angle, setAngle] = useState(0);

  const drag = useRef({
    isDown: false,
    startX: 0,
    lastX: 0,
    velocity: 0,
    lastTime: 0,
  });

  const raf = useRef<number | null>(null);

  const itemCount = safeVideos.length || 1;
  const angleStep = 360 / itemCount;

  // 🎯 spring physics loop
  const animate = () => {
    setAngle((prev) => {
      let next = prev + drag.current.velocity;

      // damping (spring feel)
      drag.current.velocity *= 0.92;

      if (Math.abs(drag.current.velocity) < 0.01) {
        drag.current.velocity = 0;
      }

      return next;
    });

    raf.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current.isDown = true;
    drag.current.startX = e.clientX;
    drag.current.lastX = e.clientX;
    drag.current.velocity = 0;
    drag.current.lastTime = Date.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.isDown) return;

    const now = Date.now();
    const dx = e.clientX - drag.current.lastX;

    const dt = now - drag.current.lastTime || 16;

    drag.current.velocity = dx / dt * 20;

    drag.current.lastX = e.clientX;
    drag.current.lastTime = now;

    setAngle((prev) => prev + dx * 0.3);
  };

  const onPointerUp = () => {
    drag.current.isDown = false;
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

  const activeIndex = Math.round(
    ((angle % 360) + 360) % 360 / angleStep
  ) % itemCount;

  const active = safeVideos[activeIndex];

  return (
    <section className="relative py-32 overflow-hidden bg-black">

      {/* 🌫 background blur */}
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

        {/* header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white">
            3D <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* 🎡 3D RING */}
        <div
          className="relative h-[500px] flex items-center justify-center perspective-[1200px]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >

          {safeVideos.map((video, i) => {
            const theta = angle + i * angleStep;
            const rad = (theta * Math.PI) / 180;

            const x = Math.sin(rad) * RADIUS;
            const z = Math.cos(rad) * RADIUS;

            const scale = (z + RADIUS) / (RADIUS * 2) + 0.6;
            const opacity = scale;

            return (
              <Link
                key={video.id}
                href={video.url}
                target="_blank"
                className="absolute transition-transform duration-200"
                style={{
                  transform: `
                    translateX(${x}px)
                    translateZ(${z}px)
                    scale(${scale})
                  `,
                  opacity,
                  zIndex: Math.round(z),
                }}
              >
                <div className="relative w-[360px] aspect-video rounded-2xl overflow-hidden shadow-2xl">

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