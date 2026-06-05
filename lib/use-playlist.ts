import { useEffect, useState } from "react";

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
};

type ApiResponse = {
  videos: Video[];
  updatedAt: string;
};

export function usePlaylist() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadVideos() {
      try {
        setIsLoading(true);
        setIsError(false);

        const res = await fetch("/api/videos", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: ApiResponse = await res.json();

        if (!isMounted) return;

        setVideos(Array.isArray(data.videos) ? data.videos : []);
      } catch (err) {
        console.error("[usePlaylist] failed:", err);
        if (!isMounted) return;
        setIsError(true);
        setVideos([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    videos,
    isLoading,
    isError,
  };
}

/**
 * Formats YouTube-style view counts safely
 */
export function formatViews(views?: string | number) {
  if (!views) return "";

  const num = typeof views === "string" ? parseInt(views.replace(/\D/g, "")) : views;

  if (isNaN(num)) return "";

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;

  return `${num} views`;
}