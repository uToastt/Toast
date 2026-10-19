"use client";

import { useEffect, useRef, useState } from "react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

const YOUTUBE = "https://www.youtube.com/@Taostt";
const DISCORD = "https://discord.gg/MZ4w4RBtwZ";

function VideoPlayer({
  video,
  onClose,
}: {
  video: Video;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="toast-player"
      aria-labelledby="player-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="player-heading">
        <h2 id="player-title">{video.title}</h2>
        <button autoFocus onClick={onClose} aria-label="Close video">
          ✕
        </button>
      </div>

      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />

      <p>
        Player unavailable?{" "}
        <a href={video.url} target="_blank" rel="noreferrer">
          Watch on YouTube ↗
        </a>
      </p>
    </dialog>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState<Video | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadVideos() {
      setLoading(true);
      setFailed(false);

      try {
        const response = await fetch("/api/videos", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Feed unavailable");

        const data = await response.json();

        if (!Array.isArray(data.videos)) {
          throw new Error("Invalid feed");
        }

        const cleanVideos = data.videos.filter(
          (video: Video | null) =>
            video &&
            typeof video.id === "string" &&
            /^[a-zA-Z0-9_-]{11}$/.test(video.id) &&
            typeof video.title === "string"
        );

        if (!controller.signal.aborted) setVideos(cleanVideos);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadVideos();

    return () => controller.abort();
  }, [attempt]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText("rs.taostt.com");
      setCopyMessage("Copied! See you there.");
    } catch {
      setCopyMessage("Select and copy rs.taostt.com");
    }
  }

  const wallVideos = [...videos, ...videos].slice(0, 12);

  return (
    <div className="toast-site">
      <a className="skip-link" href="#videos">
        Skip to videos
      </a>

      <header className="site-header">
        <a className="logo" href="#home">
          taostt<span>.</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#videos">Videos</a>
          <a href="#revenant">Revenant SMP</a>
          <a href="#about">About me</a>
        </nav>

        <a
          className="header-discord"
          href={DISCORD}
          target="_blank"
          rel="noreferrer"
        >
          Join Discord ↗
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="video-wall" aria-hidden="true">
            {wallVideos.length > 0
              ? wallVideos.map((video, index) => (
                  <div className="wall-tile" key={`${video.id}-${index}`}>
                    <img src={video.thumbnail} alt="" />
                  </div>
                ))
              : Array.from({ length: 12 }, (_, index) => (
                  <div className="wall-tile wall-placeholder" key={index}>
                    <span>
                      another
                      <br />
                      adventure.
                    </span>
                  </div>
                ))}
          </div>

          <div className="hero-shade" />

          <div className="hero-content">
            <p className="eyebrow">
              <span className="little-dot" />
              Minecraft stories by Toast
            </p>

            <h1>
              Every world.
              <br />
              A new <span>story.</span>
            </h1>

            <p className="hero-description">
              A little chaos. A lot of Minecraft.
              <br />
              Come watch the stories and join the next chapter.
            </p>

            <div className="button-row">
              {videos[0] ? (
                <button
                  className="button yellow-button"
                  onClick={() => setSelected(videos[0])}
                >
                  <span aria-hidden="true">▶</span>
                  Watch latest
                </button>
              ) : (
                <a
                  className="button yellow-button"
                  href={YOUTUBE}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span aria-hidden="true">▶</span>
                  Watch on YouTube
                </a>
              )}

              <a className="button quiet-button" href="#revenant">
                Meet Revenant SMP ↗
              </a>
            </div>
          </div>

          <a className="scroll-hint" href="#videos">
            A few stories worth watching <span>↓</span>
          </a>
        </section>

        <section className="section videos-section" id="videos">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Grab a snack. Stay a while.</p>
              <h2>Fresh from the channel<span>.</span></h2>
            </div>

            <a
              className="text-link"
              href={YOUTUBE}
              target="_blank"
              rel="noreferrer"
            >
              All videos ↗
            </a>
          </div>

          {loading ? (
            <div className="video-grid" aria-busy="true">
              <span className="sr-only">Loading videos</span>
              {[1, 2, 3].map((number) => (
                <div className="loading-card" key={number} />
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="video-grid">
              {videos.map((video, index) => (
                <button
                  className="video-card"
                  key={video.id}
                  onClick={() => setSelected(video)}
                  aria-label={`Play ${video.title}`}
                >
                  <div className="video-thumbnail">
                    <img
                      src={video.thumbnail}
                      alt=""
                      loading="lazy"
                    />

                    {index === 0 && (
                      <span className="latest-tag">Fresh upload</span>
                    )}

                    <span className="play-cover" aria-hidden="true">
                      <span>▶</span>
                    </span>
                  </div>

                  <div className="video-description">
                    <span className="video-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>{video.title}</h3>
                    <span className="video-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="feed-message">
              <h3>
                {failed
                  ? "The video feed needs a little break."
                  : "More adventures are on the way."}
              </h3>

              <p>
                You can still find the videos over on my YouTube channel.
              </p>

              <div className="button-row">
                <a
                  className="button yellow-button"
                  href={YOUTUBE}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open YouTube ↗
                </a>

                <button
                  className="button quiet-button"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="section revenant-section" id="revenant">
          <div className="revenant-title">
            <p className="eyebrow">Your next chapter starts here</p>

            <h2>
              Revenant
              <br />
              <span>SMP.</span>
            </h2>

            <div className="revenant-decoration" aria-hidden="true">
              ✦
            </div>
          </div>

          <div className="revenant-content">
            <span className="community-tag">A place for the community</span>

            <h3>
              Don’t just watch.
              <br />
              Come be part of it.
            </h3>

            <p>
              Discover Revenant SMP. Join the Discord to meet the
              community, get server details, and see what’s coming next.
            </p>

            <div className="server-address">
              <div>
                <span>Server address</span>
                <code>rs.taostt.com</code>
              </div>

              <button onClick={copyAddress} aria-label="Copy server address">
                Copy ↗
              </button>
            </div>

            <p className="copy-message" role="status">
              {copyMessage}
            </p>

            <a
              className="button red-button"
              href={DISCORD}
              target="_blank"
              rel="noreferrer"
            >
              Join the Discord ↗
            </a>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="avatar-frame">
            <img src="/favicon.jpg" alt="Toast channel avatar" />
            <span aria-hidden="true">✦</span>
          </div>

          <div className="about-copy">
            <p className="eyebrow">The person behind the pixels</p>
            <h2>Hey, I’m Toast<span>.</span></h2>

            <p>
              I make Minecraft content, build stories, and turn big
              ideas into videos. This is a little home for everything
              I’m creating and the community coming along for the ride.
            </p>

            <a
              className="text-link"
              href={`${YOUTUBE}?sub_confirmation=1`}
              target="_blank"
              rel="noreferrer"
            >
              Come along. Subscribe ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="logo" href="#home">
          taostt<span>.</span>
        </a>

        <p>© {new Date().getFullYear()} Toast</p>

        <div>
          <a href={YOUTUBE} target="_blank" rel="noreferrer">
            YouTube ↗
          </a>
          <a href={DISCORD} target="_blank" rel="noreferrer">
            Discord ↗
          </a>
        </div>
      </footer>

      {selected && (
        <VideoPlayer
          video={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}