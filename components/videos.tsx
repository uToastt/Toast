"use client";

import { Play, Eye, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePlaylist, formatViews } from "@/lib/use-playlist";

const PLAYLIST_URL = "https://youtube.com/playlist?list=PLCgYlEtkXxo8MS5EErbrhfFB4w1lPsjwH";

export function Videos() {
  const { videos, isLoading, isError } = usePlaylist();

  return (
    <section id="videos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-primary font-display uppercase tracking-widest text-sm font-semibold">
            Latest Content
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-balance">
            Featured <span className="text-primary">Videos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check out my most popular videos and join the community on epic Minecraft adventures.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading videos...</span>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Unable to load videos right now.</p>
            <Link
              href={PLAYLIST_URL}
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all"
            >
              <Play className="w-5 h-5" />
              Watch on YouTube
            </Link>
          </div>
        )}

        {/* Video Grid */}
        {!isLoading && !isError && videos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video) => (
              <Link
                key={video.id}
                href={video.url}
                target="_blank"
                className="group block"
              >
                <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                  {/* Thumbnail */}
                  <div className="aspect-video relative bg-muted">
                    {video.thumbnail ? (
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                      </div>
                    </div>
                    {video.duration && (
                      <span className="absolute bottom-3 right-3 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    {video.views && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatViews(video.views)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No videos in the playlist yet.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href={PLAYLIST_URL}
            target="_blank"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" />
            View Full Playlist on YouTube
          </Link>
        </div>
      </div>
    </section>
  );
}
