"use client";

import Link from "next/link";
import Image from "next/image";
import { Youtube, ExternalLink } from "lucide-react";
import { useYouTubeStats } from "@/lib/use-youtube-stats";

const creators = [
  {
    handle: "@1ts_Toxic",
    name: "1ts_Toxic",
    role: "Co-Creator",
    link: "https://www.youtube.com/@1ts_Toxic",
  },
];

export function DystopianUniverse() {
  const { channels } = useYouTubeStats();

  return (
    <section id="dystopian" className="py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(45 100% 51%) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-primary font-display uppercase tracking-widest text-sm font-semibold">
            The Team
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Dystopian <span className="text-primary">Universe</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the creators behind the Dystopian Universe - a collaborative Minecraft world where chaos meets creativity.
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {creators.map((creator) => {
            const channelData = channels?.[creator.handle];
            
            return (
              <div
                key={creator.handle}
                className="bg-background border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {channelData?.profileImage ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
                        <Image
                          src={channelData.profileImage}
                          alt={creator.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors">
                        <span className="text-2xl font-display font-bold text-primary">
                          {creator.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-xl font-bold text-foreground truncate">
                        {channelData?.name || creator.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded">
                        {creator.role}
                      </span>
                    </div>

                    {/* Link */}
                    <Link
                      href={creator.link}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <Youtube className="w-4 h-4" />
                      Visit Channel
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Join Discord CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-background border border-border rounded-2xl p-8 max-w-md">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Join the Community
            </h3>
            <p className="text-muted-foreground mb-6">
              Connect with us and other fans on our Discord server for updates, events, and more!
            </p>
            <Link
              href="https://discord.gg/636ydAffDE"
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
