"use client";

import { Gamepad2 } from "lucide-react";

export function About() {
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

          {/* Right - Years Gaming Highlight */}
          <div className="flex justify-center">
            <div className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all group max-w-xs">
              <Gamepad2 className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-display text-5xl md:text-6xl font-bold text-foreground">
                9
              </p>
              <p className="text-muted-foreground text-lg">Years Playing Minecraft</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
