"use client";

import { Youtube, Twitter, Instagram, Twitch } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              hsl(45 100% 51%) 0,
              hsl(45 100% 51%) 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-display uppercase tracking-widest text-sm font-semibold">
                Minecraft Content Creator
              </p>
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-balance">
                I am{" "}
                <span className="text-primary relative">
                  Toast
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 10C50 2 150 2 198 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
                Building worlds, breaking blocks, and bringing epic adventures
                to millions of players around the globe.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="https://youtube.com"
                target="_blank"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 animate-pulse-glow"
              >
                <Youtube className="w-5 h-5" />
                Subscribe
              </Link>
              <Link
                href="#videos"
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-all hover:scale-105 border border-border"
              >
                Watch Videos
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6 pt-4">
              <span className="text-muted-foreground text-sm">Follow me:</span>
              <div className="flex gap-4">
                {[
                  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                  { icon: Twitch, href: "https://twitch.tv", label: "Twitch" },
                ].map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Avatar Container */}
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center animate-float">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
                    <span className="text-6xl md:text-7xl font-display font-bold text-primary-foreground">
                      T
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">TOAST</p>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <p className="text-xs text-muted-foreground">Subscribers</p>
                <p className="font-display font-bold text-primary text-lg">1.2M+</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <p className="text-xs text-muted-foreground">Total Views</p>
                <p className="font-display font-bold text-primary text-lg">100M+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
