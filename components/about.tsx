"use client";

import { Gamepad2, Users, Video, Eye } from "lucide-react";
import { useYouTubeStats, formatCount } from "@/lib/use-youtube-stats";

export function About() {
  const { channels, isLoading } = useYouTubeStats();
  const mainChannel = channels?.["@Taostt"];

  const stats = [
    { 
      icon: Users, 
      value: isLoading ? "..." : mainChannel ? formatCount(mainChannel.subscribers) : "...", 
      label: "Subscribers" 
    },
    { 
      icon: Video, 
      value: isLoading ? "..." : mainChannel ? mainChannel.videoCount : "...", 
      label: "Videos" 
    },
    { icon: Gamepad2, value: "9", label: "Years Gaming" },
    { 
      icon: Eye, 
      value: isLoading ? "..." : mainChannel ? formatCount(mainChannel.views) : "...", 
      label: "Total Views" 
    },
  ];

  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden">
      {/* Decorative stripe pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-display uppercase tracking-widest text-sm font-semibold">
                About
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-balance">
                From Crafting Blocks to Creating{" "}
                <span className="text-primary">Epic Content</span>
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {"Hey I'm Toast! I have been making minecraft content for years and am working on many projects that will turn into content for all of you!"}
              </p>
              <p>
                I do mostly a scripted minecraft series named Dystopian Universe to create interesting stories for people to watch. I hope you enjoy my content!
              </p>
            </div>

            {/* Content Types */}
            <div className="flex flex-wrap gap-3">
              {["Scripted Series", "Dystopian Universe", "Minecraft", "Storytelling"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right - Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`p-6 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all group ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <stat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
