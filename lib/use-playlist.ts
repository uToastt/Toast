import { useEffect, useState } from "react";

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

type ApiResponse = {
  videos: Video[];
};

export function usePlaylist() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await fetch("/api/videos", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("API failed");

        const data: ApiResponse = await res.json();

        if (!mounted) return;

        setVideos(data.videos || []);
      } catch (err) {
        console.error("[usePlaylist error]", err);
        if (!mounted) return;

        setIsError(true);
        setVideos([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { videos, isLoading, isError };
}

/**
 * Optional helper (safe formatting)
 */
export function formatViews(views?: string) {
  if (!views) return "";

  const num = parseInt(views.replace(/\D/g, ""));

  if (isNaN(num)) return "";

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;

  return `${num} views`;
}