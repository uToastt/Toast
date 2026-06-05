"use client";

import { Gamepad2 } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden">
      {/* Starry galaxy background */}
      <div className="stars-layer" />
      {/* Nebula glow */}
      <div className="nebula-glow absolute w-96 h-96 top-[-4rem] right-[-4rem] opacity-20" style={{ background: "radial-gradient(circle, rgba(250,204,21,0.5) 0%, transparent 70%)" }} />
      <div className="nebula-glow absolute w-80 h-80 bottom-[-2rem] left-[10%] opacity-10" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)" }} />

      {/* Decorative stripe pattern */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-balance">
              <span className="text-primary">About me</span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {"Hey I'm Toast! I have been making minecraft content for years and am working on many projects that will turn into content for all of you!"}
              </p>
              <p>
                I do mostly a scripted minecraft series named Dystopian Universe to create interesting stories for people to watch. I hope you enjoy my content!
              </p>
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
