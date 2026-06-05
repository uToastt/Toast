"use client";

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

  const safeVideos: Video[] = Array.isArray(videos) ? videos : [];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            Latest <span className="text-primary">Videos</span>
          </h2>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              Unable to load videos right now.
            </p>
            <Link href={CHANNEL_URL} className="text-primary underline">
              Visit YouTube
            </Link>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !isError && safeVideos.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {safeVideos.slice(0, 6).map((video) => (
              <Link
                key={video.id}
                href={video.url}
                target="_blank"
                className="group"
              >
                <div className="rounded-xl overflow-hidden border">

                  <div className="aspect-video relative">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                      <Play className="text-white w-10 h-10" />
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="font-medium line-clamp-2">
                      {video.title}
                    </p>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && safeVideos.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No videos found.
          </div>
        )}
      </div>
    </section>
  );
}