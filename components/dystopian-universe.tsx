"use client";

import Link from "next/link";
import Image from "next/image";
import { Youtube, ExternalLink, Users, BadgeCheck } from "lucide-react";
import { useYouTubeStats } from "@/lib/use-youtube-stats";
import { AnimatedNumber } from "@/components/AnimatedNumber";

const creators = [
  {
    handle: "@Taostt",
    name: "Toast",
    role: "Founder",
    link: "https://www.youtube.com/@Taostt",
  },
  {
    handle: "@1ts_Toxic",
    name: "1ts_Toxic",
    role: "Co-Founder",
    link: "https://www.youtube.com/@1ts_Toxic",
  },
];

export function DystopianUniverse() {
  const { channels } = useYouTubeStats();

  return (
    <section id="dystopian" className="py-32 bg-card relative overflow-hidden">

      {/* Background */}
      <div className="stars-layer" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-primary uppercase tracking-[0.35em] text-sm mb-4 font-semibold">
            Meet The Team
          </p>

          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Dystopian <span className="text-primary">Universe</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {creators.map((creator) => {
            const channel = channels?.[creator.handle];

            return (
              <div
                key={creator.handle}
                className="relative rounded-3xl border border-primary/20 bg-black/30 p-8 backdrop-blur-xl hover:scale-[1.02] transition"
              >

                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  {channel?.profileImage ? (
                    <Image
                      src={channel.profileImage}
                      alt={creator.name}
                      width={110}
                      height={110}
                      className="rounded-2xl border border-primary/30"
                      unoptimized
                    />
                  ) : (
                    <div className="w-[110px] h-[110px] rounded-2xl bg-primary/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {creator.name[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="text-center">

                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-3xl font-bold">
                      {channel?.name || creator.name}
                    </h3>

                    {/* glowing badge */}
                    <BadgeCheck className="w-5 h-5 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  </div>

                  <p className="text-primary mt-2">{creator.role}</p>

                  {/* Subscribers (FIXED + SAFE + ANIMATED) */}
                  {typeof channel?.subscribers === "number" && (
                    <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <AnimatedNumber value={channel.subscribers} />
                      <span>Subscribers</span>
                    </div>
                  )}

                </div>

                {/* Button */}
                <div className="mt-8 flex justify-center">
                  <Link
                    href={creator.link}
                    target="_blank"
                    className="flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
                  >
                    <Youtube className="w-5 h-5" />
                    Visit Channel
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Discord CTA */}
        <div className="mt-20 flex justify-center">

          <div className="max-w-2xl w-full rounded-3xl border border-primary/20 bg-black/30 p-10 text-center">

            <h3 className="text-3xl font-bold mb-4">
              Join the Community
            </h3>

            <p className="text-muted-foreground mb-8">
              Connect with players, events, and updates.
            </p>

            <Link
              href="https://discord.gg/636ydAffDE"
              target="_blank"
              className="inline-flex items-center gap-3 bg-primary text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
            >
              {/* REAL DISCORD LOGO */}
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515..." />
              </svg>

              Join Discord
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}