"use client";

import useSWR from "swr";

interface PlaylistVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: string;
  url: string;
}

interface PlaylistData {
  playlistId: string;
  videos: PlaylistVideo[];
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePlaylist() {
  const { data, error, isLoading } = useSWR<PlaylistData>(
    "/api/youtube/playlist",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 1800000, // 30 minutes
    }
  );

  return {
    videos: data?.videos || [],
    playlistId: data?.playlistId,
    updatedAt: data?.updatedAt,
    isLoading,
    isError: error,
  };
}

export function formatViews(views: string): string {
  // Already formatted (e.g., "1.2K", "500K", "1M")
  if (/[KMB]$/i.test(views)) {
    return views + " views";
  }

  // Try to parse as number
  const num = parseInt(views.replace(/[,\s]/g, ""), 10);
  if (isNaN(num)) return views + " views";

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K views";
  }
  return num.toString() + " views";
}
