"use client";

import { Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useYouTubeStats } from "@/lib/use-youtube-stats";

// Discord icon component
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function Hero() {
  const { channels } = useYouTubeStats();
  const mainChannel = channels?.["@Taostt"];

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

            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="https://www.youtube.com/@Taostt?sub_confirmation=1"
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
                <Link
                  href="https://www.youtube.com/@Taostt"
                  target="_blank"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
                <Link
                  href="https://discord.gg/636ydAffDE"
                  target="_blank"
                  aria-label="Discord"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                >
                  <DiscordIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Avatar Container */}
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center animate-float">
                <div className="text-center space-y-4">
                  {mainChannel?.profileImage ? (
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/30">
                      <Image
                        src={mainChannel.profileImage}
                        alt="Toast Profile"
                        width={176}
                        height={176}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
                      <span className="text-6xl md:text-7xl font-display font-bold text-primary-foreground">
                        T
                      </span>
                    </div>
                  )}
                  <p className="font-display text-2xl font-bold text-foreground">TOAST</p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
