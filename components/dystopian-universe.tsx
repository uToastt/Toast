"use client";

import Link from "next/link";
import Image from "next/image";
import { Youtube, ExternalLink, Users } from "lucide-react";
import { useYouTubeStats } from "@/lib/use-youtube-stats";

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

      <div
        className="absolute w-[42rem] h-[42rem] top-[-12rem] left-1/2 -translate-x-1/2 opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(250,204,21,0.45) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute w-80 h-80 bottom-[-6rem] left-[5%] opacity-15 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute w-80 h-80 bottom-[-6rem] right-[5%] opacity-15 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.45) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-primary font-semibold uppercase tracking-[0.35em] text-sm mb-4">
            Meet The Team
          </p>

          <h2 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">
            Dystopian <span className="text-primary">Universe</span>
          </h2>

          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            The creators behind the Dystopian Universe. Building stories,
            civilizations, wars, and unforgettable Minecraft moments.
          </p>
        </div>

        {/* Creator Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

          {creators.map((creator) => {
            const channelData = channels?.[creator.handle];

            return (
              <div
                key={creator.handle}
                className="
                  relative overflow-hidden rounded-3xl
                  border border-primary/15 bg-background/70
                  backdrop-blur-xl p-8
                  hover:border-primary/40 hover:-translate-y-1
                  hover:shadow-2xl hover:shadow-primary/10
                  transition-all duration-300 group
                "
              >

                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">

                  {/* Avatar */}
                  <div className="flex justify-center mb-6">
                    {channelData?.profileImage ? (
                      <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-primary/30 shadow-xl">
                        <Image
                          src={channelData.profileImage}
                          alt={creator.name}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 rounded-3xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">
                          {creator.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-center">

                    <h3 className="font-display text-3xl font-bold text-foreground">
                      {channelData?.name || creator.name}
                    </h3>

                    <div className="inline-flex mt-3 px-3 py-1 rounded-full bg-primary/15 border border-primary/20 text-primary text-sm font-semibold">
                      {creator.role}
                    </div>

                    {/* FIXED subscriber block */}
                    {channelData?.subscribers && (
                      <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>
                          {Number(channelData.subscribers).toLocaleString()} Subscribers
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Button */}
                  <div className="mt-8 flex justify-center">
                    <Link
                      href={creator.link}
                      target="_blank"
                      className="
                        inline-flex items-center gap-2
                        bg-primary text-black px-6 py-3
                        rounded-xl font-semibold
                        hover:scale-105 transition-all
                      "
                    >
                      <Youtube className="w-5 h-5" />
                      Visit Channel
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Discord CTA */}
        <div className="mt-20 flex justify-center">

          <div className="max-w-2xl w-full rounded-3xl border border-primary/15 bg-background/70 backdrop-blur-xl p-10 text-center">

            <h3 className="font-display text-3xl font-bold mb-4">
              Join the Dystopian Universe
            </h3>

            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Meet players, form alliances, get server updates, participate in events, and stay connected with the community.
            </p>

            <Link
              href="https://discord.gg/636ydAffDE"
              target="_blank"
              className="inline-flex items-center gap-3 bg-primary text-black px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791..." />
              </svg>
              Join Discord
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}