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
              hey, I'm Toast.
              <br />
              slightly burnt <span>bread.</span>
            </h1>

            <p className="hero-description">
              Memories are never lost.
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
              <h2>op videos<span>.</span></h2>
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
              community, get early leaks, and see what’s coming next.
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
      <style jsx global>{`
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap");

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0 !important;
    background: #14110c !important;
  }

  .toast-site {
    --yellow: #ffd76a;
    --text: #fff6df;
    --muted: #bfb49d;
    background: #14110c;
    color: var(--text);
    font-family: "Nunito", "Trebuchet MS", sans-serif;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: clip;
  }

  .toast-site *,
  .toast-player * {
    box-sizing: border-box;
  }

  .toast-site a {
    color: inherit;
    text-decoration: none;
  }

  .toast-site button {
    font: inherit;
    cursor: pointer;
  }

  .toast-site a:focus-visible,
  .toast-site button:focus-visible {
    outline: 3px solid #ffd76a;
    outline-offset: 5px;
  }

  .site-header {
    position: absolute;
    inset: 0 0 auto;
    z-index: 10;
    padding: 22px 6%;
    min-height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    background: linear-gradient(#14110cee, #14110c30);
    border-bottom: 1px solid #ffd76a20;
  }

  .toast-site .logo {
    font-size: 31px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1.5px;
  }

  .logo span {
    color: #ffd76a;
  }

  .site-header nav {
    display: flex;
    gap: 30px;
    font-size: 14px;
  }

  .header-discord {
    padding: 10px 18px;
    border: 1px solid #ffd76a40;
    border-radius: 16px;
    font-size: 13px;
  }

  .hero {
    min-height: 740px;
    height: 94svh;
    max-height: 1000px;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .video-wall {
    position: absolute;
    inset: -15% -12% -8% 25%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    transform: rotate(-12deg) scale(1.08);
    opacity: 0.7;
  }

  .wall-tile {
    aspect-ratio: 16 / 9;
    border-radius: 18px;
    overflow: hidden;
    background: #49391e;
  }

  .wall-tile img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .wall-placeholder {
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #735729, #2d2315);
    color: #ffd76a80;
    font-size: 40px;
    font-weight: 600;
    line-height: 1.1;
  }

  .hero-shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, #14110cfc 4%, #14110ce8 28%, #14110c30),
      linear-gradient(0deg, #14110c, transparent 45%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: 140px 6% 110px;
  }

  .toast-site .eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--yellow);
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 22px;
    letter-spacing: 0;
    text-transform: none;
  }

  .little-dot {
    width: 7px;
    height: 7px;
    background: #ffd76a;
    border-radius: 50%;
  }

  .toast-site .hero h1 {
    font-family: inherit;
    margin: 0 0 25px;
    font-size: clamp(60px, 7.8vw, 110px);
    font-weight: 600;
    line-height: 1.05;
    letter-spacing: -3px;
    text-transform: none;
  }

  .hero h1 span {
    color: #ffd76a;
  }

  .hero-description {
    margin: 0 0 30px;
    color: #c8bfa9;
    font-size: 17px;
    line-height: 1.85;
  }

  .button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .toast-site .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 49px;
    padding: 14px 23px;
    border: 0;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 700;
    transition: transform 0.2s;
  }

  .button:hover {
    transform: translateY(-2px);
  }

  .toast-site .yellow-button {
    background: #ffd76a;
    color: #38290b;
  }

  .toast-site .quiet-button {
    background: #ffffff09;
    color: #fff6df;
    border: 1px solid #ffd76a35;
    backdrop-filter: blur(8px);
  }

  .scroll-hint {
    position: absolute;
    bottom: 32px;
    left: 6%;
    display: flex;
    align-items: center;
    gap: 18px;
    font-size: 12px;
    color: #b7aa8d !important;
  }

  .scroll-hint span {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 1px solid #ffd76a30;
    border-radius: 50%;
  }

  .toast-site .section {
    padding: 85px 6%;
  }

  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 25px;
    margin-bottom: 35px;
  }

  .section-heading .eyebrow {
    margin-bottom: 12px;
  }

  .toast-site .section h2 {
    font-family: inherit;
    margin: 0;
    font-size: clamp(32px, 3.3vw, 47px);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -1px;
    text-transform: none;
  }

  .section h2 > span {
    color: var(--yellow);
  }

  .text-link {
    font-size: 14px;
    padding-bottom: 6px;
    border-bottom: 1px solid #ffd76a45;
    white-space: nowrap;
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 34px 23px;
  }

  .toast-site .video-card {
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: #fff6df;
    text-align: left;
  }

  .video-thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 18px;
    background: #302817;
  }

  .video-thumbnail > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .video-card:hover .video-thumbnail > img {
    transform: scale(1.05);
  }

  .latest-tag {
    position: absolute;
    z-index: 1;
    top: 12px;
    left: 12px;
    padding: 6px 11px;
    border-radius: 10px;
    background: #ffd76a;
    color: #38290b;
    font-size: 11px;
    font-weight: 700;
  }

  .play-cover {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: #0002;
  }

  .play-cover > span {
    display: grid;
    place-items: center;
    width: 49px;
    height: 49px;
    padding-left: 3px;
    border: 1px solid #ffffff50;
    border-radius: 50%;
    background: #14110cbb;
    color: #fff6df;
    font-size: 18px;
  }

  .video-description {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding-top: 15px;
  }

  .toast-site .video-description h3 {
    flex: 1;
    margin: 0;
    font-family: inherit;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
  }

  .video-number,
  .video-arrow {
    color: #b4a17b;
    font-size: 13px;
  }

  .loading-card {
    aspect-ratio: 16 / 10;
    border-radius: 18px;
    background: linear-gradient(120deg, #292214, #40341d, #292214);
  }

  .feed-message {
    padding: 35px;
    border: 1px solid #ffd76a25;
    border-radius: 22px;
    background: #201b12;
  }

  .feed-message h3 {
    margin: 0 0 12px;
    font-size: 25px;
    font-weight: 600;
  }

  .feed-message p {
    margin: 0 0 25px;
    color: #bfb49d;
  }

  .toast-site .revenant-section {
    --yellow: #ff8589;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 9%;
    align-items: center;
    background:
      radial-gradient(ellipse at 8% 90%, #862b3455, transparent 65%),
      #1d1115;
    border-top: 1px solid #ff858925;
    border-bottom: 1px solid #ff858925;
  }

  .toast-site .revenant-title h2 {
    font-size: clamp(50px, 7vw, 100px);
    font-weight: 600;
    letter-spacing: -3px;
    line-height: 1.03;
  }

  .revenant-title h2 > span {
    font-size: 1.25em;
    color: #ff8589;
  }

  .revenant-decoration {
    margin-top: 15px;
    font-size: 80px;
    color: #ff858950;
    line-height: 1;
  }

  .community-tag {
    display: inline-block;
    padding: 7px 12px;
    margin-bottom: 23px;
    border: 1px solid #ff858930;
    border-radius: 20px;
    color: #e6a1aa;
    background: #ff858909;
    font-size: 11px;
  }

  .toast-site .revenant-content h3 {
    margin: 0 0 20px;
    font-family: inherit;
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.7px;
  }

  .revenant-content > p {
    color: #c7aab2;
    font-size: 15px;
    line-height: 1.85;
  }

  .server-address {
    margin-top: 26px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    background: #ff858908;
    border: 1px solid #ff858935;
    border-radius: 18px;
  }

  .server-address > div > span {
    display: block;
    margin-bottom: 7px;
    color: #d4a4af;
    font-size: 11px;
  }

  .server-address code {
    font-size: 25px;
    color: #ffe6eb;
    letter-spacing: -0.8px;
  }

  .server-address button {
    padding: 10px;
    border: 0;
    background: transparent;
    color: #ff9ca3;
    font-size: 13px;
    white-space: nowrap;
  }

  .revenant-content .copy-message {
    min-height: 20px;
    margin: 8px 0 16px;
    color: #ff9ca3;
    font-size: 12px;
  }

  .toast-site .red-button {
    background: #ff8589;
    color: #3b101c;
  }

  .toast-site .about-section {
    display: grid;
    grid-template-columns: 170px minmax(0, 600px);
    justify-content: center;
    align-items: center;
    gap: 65px;
    padding-top: 110px;
    padding-bottom: 110px;
  }

  .avatar-frame {
    position: relative;
    width: 170px;
  }

  .avatar-frame img {
    display: block;
    width: 170px !important;
    height: 170px !important;
    max-width: 100%;
    object-fit: cover;
    border-radius: 40px;
    transform: rotate(-5deg);
  }

  .avatar-frame > span {
    position: absolute;
    top: -30px;
    right: -20px;
    color: #ffd76a;
    font-size: 50px;
  }

  .about-copy > p:not(.eyebrow) {
    margin: 23px 0;
    color: #bfb49d;
    font-size: 15px;
    line-height: 1.95;
  }

  .site-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    padding: 32px 6%;
    border-top: 1px solid #ffd76a20;
  }

  .site-footer p {
    color: #a29479;
    font-size: 12px;
  }

  .site-footer > div {
    display: flex;
    gap: 25px;
    font-size: 13px;
  }

  .skip-link {
    position: fixed;
    top: -100px;
    left: 12px;
    z-index: 100;
    padding: 12px;
    background: #ffd76a;
    color: #352609 !important;
    border-radius: 10px;
  }

  .skip-link:focus {
    top: 12px;
  }

  .toast-player {
    width: min(1000px, 94vw);
    max-height: 94svh;
    padding: 0;
    overflow: auto;
    border: 1px solid #ffd76a35;
    border-radius: 20px;
    background: #201a11;
    color: #fff6df;
    font-family: "Nunito", "Trebuchet MS", sans-serif;
  }

  .toast-player::backdrop {
    background: #000d;
    backdrop-filter: blur(8px);
  }

  .player-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 18px;
  }

  .player-heading h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.5;
  }

  .player-heading button {
    border: 0;
    border-radius: 10px;
    background: #ffffff09;
    color: #fff6df;
    padding: 10px 14px;
    cursor: pointer;
  }

  .toast-player iframe {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 0;
  }

  .toast-player > p {
    padding: 10px 18px;
    font-size: 13px;
    color: #bfb49d;
  }

  .toast-player a {
    color: #ffd76a;
  }

  @media (max-width: 850px) {
    .site-header nav {
      gap: 16px;
      font-size: 12px;
    }

    .video-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .toast-site .revenant-section {
      gap: 35px;
    }

    .server-address code {
      font-size: 19px;
    }
  }

  @media (max-width: 600px) {
    .site-header {
      flex-wrap: wrap;
      gap: 16px;
      min-height: 110px;
      padding: 17px 6%;
    }

    .site-header nav {
      order: 3;
      width: 100%;
      justify-content: space-between;
      font-size: 12px;
    }

    .header-discord {
      font-size: 11px;
      padding: 9px 12px;
    }

    .hero {
      min-height: 720px;
      height: 93svh;
    }

    .hero-content {
      padding-top: 155px;
    }

    .toast-site .hero h1 {
      font-size: clamp(47px, 13vw, 65px);
      letter-spacing: -1.8px;
    }

    .hero-description {
      font-size: 15px;
    }

    .video-wall {
      inset: -5% -85% 0 -5%;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      opacity: 0.4;
    }

    .hero-content .button-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .toast-site .section {
      padding: 63px 6%;
    }

    .section-heading {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    .toast-site .section h2 {
      font-size: 34px;
    }

    .video-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }

    .toast-site .revenant-section {
      grid-template-columns: 1fr;
      gap: 35px;
    }

    .toast-site .revenant-title h2 {
      font-size: 64px;
      letter-spacing: -2px;
    }

    .revenant-decoration {
      display: none;
    }

    .server-address code {
      font-size: 23px;
    }

    .toast-site .about-section {
      grid-template-columns: 1fr;
      gap: 35px;
    }

    .avatar-frame {
      width: 110px;
    }

    .avatar-frame img {
      width: 110px !important;
      height: 110px !important;
      border-radius: 28px;
    }

    .site-footer {
      flex-wrap: wrap;
    }

    .site-footer > div {
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    .toast-site *,
    .toast-player * {
      transition: none !important;
      animation: none !important;
    }
  }
`}</style>
    </div>
  );
}