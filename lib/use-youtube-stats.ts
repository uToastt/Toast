"use client";

import { useEffect, useState } from "react";

type Channel = {
  handle: string;
  name: string;
  profileImage: string;
  subscribers: number;
  views: number;
  videoCount: number;
};

export function useYouTubeStats() {
  const [channels, setChannels] = useState<Record<string, Channel>>({});

  async function load() {
    try {
      const res = await fetch("/api/subscribers", {
        cache: "no-store",
      });

      const data = await res.json();

      const map: Record<string, Channel> = {};
      for (const c of data.channels || []) {
        map[c.handle] = c;
      }

      setChannels(map);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();

    const interval = setInterval(load, 30000); // 🔥 auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { channels };
}