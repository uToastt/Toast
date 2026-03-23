"use client";

import useSWR from "swr";

interface YouTubeChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: string;
  views: string;
  videoCount: string;
  profileImage: string;
}

type YouTubeData = Record<string, YouTubeChannel | null>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useYouTubeStats() {
  const { data, error, isLoading } = useSWR<YouTubeData>("/api/youtube", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 3600000, // 1 hour
  });

  return {
    channels: data,
    isLoading,
    isError: error,
  };
}

export function formatCount(count: string): string {
  // Already formatted (e.g., "1.2K", "500K", "1M")
  if (/[KMB]$/i.test(count)) {
    return count;
  }
  
  // Try to parse as number
  const num = parseInt(count.replace(/[,\s]/g, ""), 10);
  if (isNaN(num)) return count;
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
