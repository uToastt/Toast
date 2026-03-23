"use client";

import { Play, Eye, Clock } from "lucide-react";
import Link from "next/link";

const videos = [
  {
    title: "I Survived 100 Days in Hardcore Minecraft",
    views: "2.4K views",
    duration: "45:32",
    thumbnail: "bg-gradient-to-br from-primary/30 to-secondary",
  },
  {
    title: "Building the ULTIMATE Minecraft Base",
    views: "1.8K views",
    duration: "32:15",
    thumbnail: "bg-gradient-to-br from-secondary to-primary/30",
  },
  {
    title: "Speedrunning Minecraft in Under 20 Minutes",
    views: "3.1K views",
    duration: "24:08",
    thumbnail: "bg-gradient-to-br from-primary/40 to-muted",
  },
  {
    title: "Epic Minecraft Multiplayer Battle Royale",
    views: "1.5K views",
    duration: "28:44",
    thumbnail: "bg-gradient-to-br from-muted to-primary/30",
  },
  {
    title: "Creating a Working Redstone Computer",
    views: "890 views",
    duration: "52:21",
    thumbnail: "bg-gradient-to-br from-primary/20 to-secondary",
  },
  {
    title: "Minecraft but Everything is RANDOM",
    views: "2.1K views",
    duration: "36:09",
    thumbnail: "bg-gradient-to-br from-secondary to-primary/20",
  },
];

export function Videos() {
  return (
    <section id="videos" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-primary font-display uppercase tracking-widest text-sm font-semibold">
            Latest Content
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Featured <span className="text-primary">Videos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check out my most popular videos and join the community on epic Minecraft adventures.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <Link
              key={index}
              href="https://www.youtube.com/@Taostt/videos"
              target="_blank"
              className="group block"
            >
              <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                {/* Thumbnail */}
                <div
                  className={`aspect-video ${video.thumbnail} relative flex items-center justify-center`}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Play className="w-8 h-8 text-primary-foreground fill-current ml-1" />
                  </div>
                  <span className="absolute bottom-3 right-3 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {video.views}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="https://www.youtube.com/@Taostt/videos"
            target="_blank"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Play className="w-5 h-5" />
            View All Videos on YouTube
          </Link>
        </div>
      </div>
    </section>
  );
}
