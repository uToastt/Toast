"use client";

import Link from "next/link";
import { Server, Copy, Check } from "lucide-react";
import { useState } from "react";

export function JoinServer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("du.taostt.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="join-server" className="py-24 bg-background relative overflow-hidden">
      {/* Starry galaxy background */}
      <div className="stars-layer" />
      {/* Nebula glow */}
      <div className="nebula-glow absolute w-[28rem] h-[28rem] top-[-3rem] right-[10%] opacity-15" style={{ background: "radial-gradient(circle, rgba(250,204,21,0.4) 0%, transparent 70%)" }} />
      <div className="nebula-glow absolute w-80 h-80 bottom-[-3rem] left-[5%] opacity-10" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-balance">
              Join the Server
            </h2>
          </div>

          {/* Server Info Card */}
          <div className="bg-card border-2 border-primary/30 rounded-2xl p-8 md:p-12 hover:border-primary/50 transition-all">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Server className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Server IP */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest text-center">
                  Server IP
                </p>
                <div className="flex items-center justify-center gap-2">
                  <code className="font-mono text-lg md:text-xl font-bold text-foreground bg-background border border-border rounded-lg px-4 py-3">
                    du.taostt.com
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                    aria-label="Copy server IP"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Port */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest text-center">
                  Port
                </p>
                <p className="text-center font-mono text-lg text-foreground">
                  25601
                </p>
              </div>

              {/* Version */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest text-center">
                  Version
                </p>
                <p className="text-center text-foreground">Any Version</p>
              </div>


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
