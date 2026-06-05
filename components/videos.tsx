"use client";

import { Play, Eye, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePlaylist } from "@/lib/use-playlist";

const CHANNEL_URL = "https://www.youtube.com/@Taostt";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration?: string;
  views?: string;
};

export function Videos() {
  const { videos, isLoading, isError } = usePlaylist();

  // Force-safe typing so TS stops complaining
  const safeVideos: Video[] = Array.isArray(videos) ? videos : [];

  return (
    <section
      id="videos"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Op <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Loading videos...
            </span>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              Unable to load videos right now.
            </p>

            <Link
              href={CHANNEL_URL}
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg"
            >
              <Play className="w-5 h-5" />
              Watch on YouTube
            </Link>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && safeVideos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeVideos.slice(0, 6).map((video) => {
              if (!video?.id) return null;

              const title = video.title ?? "Untitled video";
              const url = video.url ?? CHANNEL_URL;
              const thumbnail = video.thumbnail ?? "";

              return (
                <Link
                  key={video.id}
                  href={url}
                  target="_blank"
                  className="group block"
                >
                  <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all">

                    {/* Thumbnail */}
                    <div className="aspect-video relative bg-muted">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary" />
                      )}

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition">
                        <div className="opacity-0 group-hover:opacity-100 bg-primary/90 p-3 rounded-full">
                          <Play className="w-6 h-6 text-white fill-current" />
                        </div>
                      </div>

                      {/* Duration (SAFE) */}
                      {video.duration && (
                        <span className="absolute bottom-3 right-3 bg-background/90 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
                        {title}
                      </h3>

                      {/* Views (SAFE) */}
                      {video.views && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {video.views}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && safeVideos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              No videos available right now.
            </p>

            <Link
              href={CHANNEL_URL}
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg"
            >
              <Play className="w-5 h-5" />
              Visit Channel
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}