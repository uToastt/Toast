"use client";

import { useEffect, useState } from "react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
};

const DISCORD = "https://discord.gg/MZ4w4RBtwZ";
const YOUTUBE = "https://www.youtube.com/@Taostt";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<Video | null>(null);
  const [copyMessage, setCopyMessage] = useState("");

  async function loadVideos() {
    setLoading(true);
    setFailed(false);

    try {
      const response = await fetch("/api/videos");

      if (!response.ok) throw new Error("Feed unavailable");

      const data = await response.json();

      if (!Array.isArray(data.videos)) {
        throw new Error("Invalid video feed");
      }

      setVideos(
        data.videos.filter(
          (video: Video) =>
            video &&
            /^[a-zA-Z0-9_-]{11}$/.test(video.id) &&
            typeof video.title === "string"
        )
      );
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVideos();
  }, []);

  useEffect(() => {
    if (!selected) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const dialog = document.querySelector<HTMLDialogElement>(
      "#revenant-video-player"
    );

    dialog?.showModal();

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [selected]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText("rs.taostt.com");
      setCopyMessage("Copied!");
    } catch {
      setCopyMessage("Select and copy rs.taostt.com");
    }
  }

  const wallVideos = [...videos, ...videos].slice(0, 12);

  return (
    <div className="revenant-site">
      <a className="skip-link" href="#videos">
        Skip to videos
      </a>

      <header className="site-header">
        <a href="#home" className="site-logo">
          TAOSTT<span>.</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#videos">Videos</a>
          <a href="#server">Revenant SMP</a>
          <a href="#about">About</a>
        </nav>

        <a
          className="discord-link"
          href={DISCORD}
          target="_blank"
          rel="noreferrer"
        >
          Join Discord ↗
        </a>
      </header>

      <main>
        <section id="home" className="showcase-hero">
          <div className="thumbnail-wall" aria-hidden="true">
            {wallVideos.length
              ? wallVideos.map((video, index) => (
                  <div className="wall-tile" key={`${video.id}-${index}`}>
                    <img src={video.thumbnail} alt="" />
                  </div>
                ))
              : Array.from({ length: 12 }, (_, index) => (
                  <div className="wall-tile placeholder" key={index}>
                    REVENANT
                    <br />
                    SMP
                  </div>
                ))}
          </div>

          <div className="hero-overlay" />

          <div className="hero-copy">
            <p className="eyebrow">MINECRAFT STORIES BY TOAST</p>

            <h1>
              Every world.
              <br />
              A new <span>story.</span>
            </h1>

            <p className="hero-description">
              Big ideas. Unforgettable Minecraft moments.
              <br />
              Watch the stories, then join the next chapter.
            </p>

            <div className="button-row">
              {videos[0] ? (
                <button
                  className="action-button primary-button"
                  onClick={() => setSelected(videos[0])}
                >
                  ▶ Watch latest
                </button>
              ) : (
                <a
                  className="action-button primary-button"
                  href={YOUTUBE}
                  target="_blank"
                  rel="noreferrer"
                >
                  ▶ Watch on YouTube
                </a>
              )}

              <a className="action-button secondary-button" href="#server">
                Explore Revenant SMP ↗
              </a>
            </div>
          </div>

          <a className="scroll-link" href="#videos">
            SCROLL TO DISCOVER ↓
          </a>
        </section>

        <section id="videos" className="content-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE WATCHLIST</p>
              <h2>Fresh from the channel.</h2>
            </div>

            <a href={YOUTUBE} target="_blank" rel="noreferrer">
              All videos ↗
            </a>
          </div>

          {loading ? (
            <div className="video-grid" aria-busy="true">
              {[1, 2, 3].map((number) => (
                <div className="video-skeleton" key={number} />
              ))}
              <span className="sr-only">Loading videos</span>
            </div>
          ) : videos.length ? (
            <div className="video-grid">
              {videos.map((video, index) => (
                <button
                  className="video-card"
                  key={video.id}
                  onClick={() => setSelected(video)}
                  aria-label={`Play ${video.title}`}
                >
                  <div className="video-image">
                    <img
                      src={video.thumbnail}
                      alt=""
                      loading="lazy"
                    />

                    {index === 0 && (
                      <span className="latest-badge">LATEST UPLOAD</span>
                    )}

                    <span className="video-play">▶</span>
                  </div>

                  <div className="video-caption">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{video.title}</h3>
                    <span>↗</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="feed-fallback">
              <h3>
                {failed
                  ? "The video feed is taking a break."
                  : "New stories are on their way."}
              </h3>

              <p>
                Visit the YouTube channel to watch every upload.
              </p>

              <div className="button-row">
                <a
                  className="action-button primary-button"
                  href={YOUTUBE}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open YouTube ↗
                </a>

                <button
                  className="action-button secondary-button"
                  onClick={() => void loadVideos()}
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </section>

        <section id="server" className="content-section server-section">
          <div>
            <p className="eyebrow">YOUR NEXT CHAPTER</p>
            <h2 className="server-heading">
              REVENANT
              <br />
              <span>SMP ↗</span>
            </h2>
          </div>

          <div className="server-copy">
            <h3>
              Don’t just watch.
              <br />
              Be part of the story.
            </h3>

            <p>
              Discover Revenant SMP. Meet the community on Discord
              for server details, updates, and what comes next.
            </p>

            <div className="server-address">
              <div>
                <small>SERVER ADDRESS</small>
                <code>rs.taostt.com</code>
              </div>

              <button onClick={copyAddress}>Copy</button>
            </div>

            <p className="copy-message" role="status">
              {copyMessage}
            </p>

            <a
              className="action-button primary-button"
              href={DISCORD}
              target="_blank"
              rel="noreferrer"
            >
              Join the Discord ↗
            </a>
          </div>
        </section>

        <section id="about" className="content-section about-section">
          <img
            className="creator-image"
            src="/favicon.jpg"
            alt="Toast channel avatar"
          />

          <div>
            <p className="eyebrow">BEHIND THE VIDEOS</p>
            <h2>Hey, I’m Toast.</h2>

            <p>
              I make Minecraft content, build stories, and turn big
              ideas into videos. This is the home for everything I’m
              creating — and the community coming along for the ride.
            </p>

            <a
              className="subscribe-link"
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
        <a href="#home" className="site-logo">
          TAOSTT<span>.</span>
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
        <dialog
          id="revenant-video-player"
          className="video-dialog"
          aria-labelledby="video-dialog-title"
          onCancel={() => setSelected(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="dialog-heading">
            <h2 id="video-dialog-title">{selected.title}</h2>

            <button
              autoFocus
              onClick={() => setSelected(null)}
              aria-label="Close video"
            >
              ✕
            </button>
          </div>

          <iframe
            src={`https://www.youtube-nocookie.com/embed/${selected.id}?autoplay=1&rel=0`}
            title={selected.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />

          <p>
            Player unavailable?{" "}
            <a href={selected.url} target="_blank" rel="noreferrer">
              Watch on YouTube ↗
            </a>
          </p>
        </dialog>
      )}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 30px;
        }

        body {
          margin: 0;
          background: #0c0e0d !important;
        }

        .revenant-site {
          --accent: #d6f574;
          background: #0c0e0d;
          color: #f4f5ee;
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.5;
        }

        .revenant-site *,
        .video-dialog * {
          box-sizing: border-box;
        }

        .revenant-site a {
          color: inherit;
          text-decoration: none;
        }

        .revenant-site button {
          font: inherit;
          cursor: pointer;
        }

        .revenant-site a:focus-visible,
        .revenant-site button:focus-visible {
          outline: 3px solid var(--accent);
          outline-offset: 5px;
        }

        .site-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 10;
          min-height: 90px;
          padding: 20px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-bottom: 1px solid #ffffff18;
          background: linear-gradient(#0c0e0dcc, transparent);
        }

        .site-logo {
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .site-logo span {
          color: var(--accent);
        }

        .site-header nav {
          display: flex;
          gap: 30px;
          font-size: 13px;
        }

        .discord-link {
          border: 1px solid #ffffff40;
          border-radius: 5px;
          padding: 10px 17px;
          font-size: 12px;
        }

        .showcase-hero {
          min-height: 740px;
          height: 94svh;
          max-height: 1000px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .thumbnail-wall {
          position: absolute;
          inset: -15% -12% -5% 25%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 17px;
          transform: rotate(-12deg) scale(1.08);
          opacity: 0.75;
        }

        .wall-tile {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 7px;
          background: #26362b;
        }

        .wall-tile img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        .placeholder {
          display: grid;
          place-content: center;
          font-size: clamp(25px, 4vw, 65px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -2px;
          color: #d6f57460;
          background: linear-gradient(135deg, #405b49, #15201a);
        }

        .placeholder:nth-child(3n) {
          background: linear-gradient(135deg, #384852, #141e1c);
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, #0c0e0dfc 5%, #0c0e0ddd 30%, #0c0e0d30),
            linear-gradient(0deg, #0c0e0d, transparent 45%);
        }

        .hero-copy {
          position: relative;
          z-index: 1;
          padding: 120px 6% 100px;
        }

        .eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.7px;
          color: var(--accent);
          margin: 0 0 22px;
        }

        .hero-copy h1 {
          font-size: clamp(58px, 7.7vw, 112px);
          line-height: 0.99;
          letter-spacing: -5px;
          font-weight: 800;
          margin: 0 0 27px;
        }

        .hero-copy h1 span {
          color: var(--accent);
        }

        .hero-description {
          color: #b8c0b8;
          line-height: 1.8;
          font-size: 16px;
          margin: 0 0 30px;
        }

        .button-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .action-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-height: 48px;
          padding: 14px 22px;
          border-radius: 5px;
          border: 0;
          font-size: 12px;
          font-weight: 700;
          transition: transform 0.2s, background 0.2s;
        }

        .action-button:hover {
          transform: translateY(-2px);
        }

        .revenant-site .primary-button {
          background: var(--accent);
          color: #15200c;
        }

        .secondary-button {
          background: #ffffff0d;
          color: #f4f5ee;
          border: 1px solid #ffffff30;
          backdrop-filter: blur(8px);
        }

        .scroll-link {
          position: absolute;
          bottom: 35px;
          left: 6%;
          font-size: 9px;
          letter-spacing: 2px;
          color: #b1b8ab !important;
        }

        .content-section {
          padding: 85px 6%;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 35px;
        }

        .section-heading .eyebrow {
          margin-bottom: 13px;
        }

        .content-section h2 {
          font-size: clamp(30px, 3.2vw, 45px);
          font-weight: 750;
          line-height: 1.1;
          letter-spacing: -1.6px;
          margin: 0;
        }

        .section-heading > a {
          font-size: 12px;
          white-space: nowrap;
          padding-bottom: 6px;
          border-bottom: 1px solid #ffffff35;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px 22px;
        }

        .video-card {
          background: transparent;
          border: 0;
          color: inherit;
          padding: 0;
          text-align: left;
          min-width: 0;
        }

        .video-image {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          position: relative;
          border-radius: 7px;
          background: #1d291e;
        }

        .video-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .video-card:hover img {
          transform: scale(1.05);
        }

        .video-play {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: #0003;
          font-size: 30px;
          color: white;
        }

        .latest-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 1;
          background: var(--accent);
          color: #15200c;
          padding: 6px 9px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .video-caption {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding-top: 15px;
        }

        .video-caption h3 {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
          margin: 0;
        }

        .video-caption > span {
          color: #83917c;
          font-size: 12px;
        }

        .video-skeleton {
          aspect-ratio: 16 / 10;
          border-radius: 7px;
          background: linear-gradient(120deg, #19211a, #2c3728, #19211a);
        }

        .feed-fallback {
          border: 1px solid #ffffff20;
          border-radius: 8px;
          padding: 35px;
          background: #151b14;
        }

        .feed-fallback h3 {
          font-size: 23px;
          margin: 0 0 12px;
        }

        .feed-fallback p {
          color: #aab3a3;
          margin: 0 0 25px;
        }

        .server-section {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 9%;
          align-items: center;
          background:
            radial-gradient(ellipse at 10% 90%, #2a381e80, transparent 65%),
            #10160f;
          border-top: 1px solid #ffffff15;
          border-bottom: 1px solid #ffffff15;
        }

        .content-section .server-heading {
          font-size: clamp(48px, 7vw, 100px);
          letter-spacing: -4px;
          line-height: 1;
        }

        .server-heading span {
          color: var(--accent);
          font-size: 1.4em;
        }

        .server-copy h3 {
          font-size: 34px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -1px;
          margin: 0 0 22px;
        }

        .server-copy > p,
        .about-section > div > p:not(.eyebrow) {
          color: #aab3a3;
          font-size: 14px;
          line-height: 1.9;
        }

        .server-address {
          margin-top: 25px;
          border: 1px solid #ffffff25;
          background: #ffffff06;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px;
        }

        .server-address small {
          display: block;
          font-size: 8px;
          letter-spacing: 2px;
          color: #aab3a3;
          margin-bottom: 8px;
        }

        .server-address code {
          font-size: 24px;
          color: #f4f5ee;
        }

        .server-address button {
          padding: 10px;
          color: var(--accent);
          background: transparent;
          border: 0;
          font-size: 12px;
        }

        .server-copy .copy-message {
          color: var(--accent);
          min-height: 20px;
          font-size: 12px;
          margin: 8px 0 15px;
        }

        .about-section {
          display: grid;
          grid-template-columns: 160px minmax(0, 580px);
          gap: 60px;
          justify-content: center;
          align-items: center;
          padding-top: 110px;
          padding-bottom: 110px;
        }

        .creator-image {
          width: 160px;
          height: 160px;
          border-radius: 22px;
          object-fit: cover;
          transform: rotate(-5deg);
        }

        .about-section > div > p:not(.eyebrow) {
          margin: 22px 0;
        }

        .subscribe-link {
          color: var(--accent) !important;
          font-size: 13px;
        }

        .site-footer {
          border-top: 1px solid #ffffff15;
          padding: 30px 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
        }

        .site-footer p {
          color: #8b9783;
          font-size: 11px;
        }

        .site-footer > div {
          display: flex;
          gap: 25px;
          font-size: 12px;
        }

        .skip-link {
          position: fixed;
          top: -100px;
          left: 12px;
          z-index: 100;
          padding: 12px;
          background: var(--accent);
          color: #15200c !important;
        }

        .skip-link:focus {
          top: 12px;
        }

        .video-dialog {
          width: min(1000px, 94vw);
          max-height: 94svh;
          padding: 0;
          overflow: auto;
          background: #11170f;
          color: white;
          border: 1px solid #ffffff30;
          border-radius: 10px;
          font-family: Arial, Helvetica, sans-serif;
        }

        .video-dialog::backdrop {
          background: #000d;
          backdrop-filter: blur(8px);
        }

        .dialog-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 18px;
        }

        .dialog-heading h2 {
          margin: 0;
          font-size: 17px;
          line-height: 1.4;
        }

        .dialog-heading button {
          padding: 10px;
          color: white;
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        .video-dialog iframe {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          border: 0;
        }

        .video-dialog > p {
          padding: 10px 18px;
          font-size: 12px;
          color: #aab3a3;
        }

        .video-dialog a {
          color: #d6f574;
        }

        @media (max-width: 850px) {
          .site-header nav {
            gap: 16px;
            font-size: 11px;
          }

          .video-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .server-section {
            gap: 35px;
          }

          .server-address code {
            font-size: 19px;
          }

          .about-section {
            gap: 35px;
          }
        }

        @media (max-width: 600px) {
          .site-header {
            min-height: 105px;
            flex-wrap: wrap;
            gap: 12px;
            padding-top: 16px;
            padding-bottom: 16px;
          }

          .site-logo {
            font-size: 22px;
          }

          .site-header nav {
            order: 3;
            width: 100%;
            justify-content: space-between;
            font-size: 11px;
          }

          .discord-link {
            font-size: 10px;
            padding: 8px 12px;
          }

          .showcase-hero {
            min-height: 700px;
            height: 92svh;
          }

          .hero-copy {
            padding-top: 150px;
          }

          .hero-copy h1 {
            font-size: 59px;
            letter-spacing: -3px;
          }

          .hero-description {
            font-size: 14px;
          }

          .eyebrow {
            font-size: 8px;
            letter-spacing: 2px;
          }

          .thumbnail-wall {
            inset: -5% -80% 0 -5%;
            grid-template-columns: repeat(2, 1fr);
            opacity: 0.45;
          }

          .hero-overlay {
            background:
              linear-gradient(90deg, #0c0e0de8, #0c0e0d88),
              linear-gradient(0deg, #0c0e0d, transparent 70%);
          }

          .hero-copy .button-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .content-section {
            padding: 60px 6%;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
          }

          .video-grid {
            grid-template-columns: 1fr;
          }

          .server-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .content-section .server-heading {
            font-size: 57px;
            letter-spacing: -3px;
          }

          .server-address code {
            font-size: 23px;
          }

          .about-section {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .creator-image {
            width: 100px;
            height: 100px;
          }

          .site-footer {
            flex-wrap: wrap;
          }

          .site-footer > div {
            width: 100%;
          }

          .feed-fallback {
            padding: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .revenant-site * {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}