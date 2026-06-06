"use client";

import { Server, Copy, Check, Wifi } from "lucide-react";
import { useState } from "react";

export function JoinServer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("du.taostt.com");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section
      id="join-server"
      className="py-32 bg-background relative overflow-hidden"
    >
      {/* Background */}
      <div className="stars-layer" />

      <div
        className="absolute w-[40rem] h-[40rem] -top-32 left-1/2 -translate-x-1/2 opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(250,204,21,.35) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">
                Server Online
              </span>
            </div>

            <h2 className="font-display text-5xl md:text-7xl font-bold mb-4">
              Join the
              <span className="text-primary"> Adventure</span>
            </h2>

            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Build, conquer, form alliances, and survive in a constantly
              evolving world.
            </p>
          </div>

          {/* Main Card */}
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/70 backdrop-blur-xl p-8 md:p-12 shadow-2xl">

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />

            <div className="relative">

              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <Server className="w-10 h-10 text-primary" />
                </div>
              </div>

              {/* IP */}
              <p className="text-primary uppercase tracking-[0.35em] text-xs mb-4">
                SERVER ADDRESS
              </p>

              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between gap-3 bg-background/80 border border-border rounded-2xl p-4 md:p-5">

                  <code className="font-mono text-xl md:text-3xl font-bold truncate">
                    du.taostt.com
                  </code>

                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-primary text-black hover:scale-105"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">

                <div className="px-4 py-2 rounded-full border border-border bg-background/60">
                  Any Version
                </div>

                <div className="px-4 py-2 rounded-full border border-border bg-background/60">
                  Java Edition
                </div>

                <div className="px-4 py-2 rounded-full border border-border bg-background/60">
                  Bedrock Edition
                </div>

                <div className="px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-500" />
                  Online
                </div>

              </div>

              {/* Bottom Text */}
              <p className="text-muted-foreground mt-8">
                Copy the IP above and join instantly.
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}