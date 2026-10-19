"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (busy) return;

    const form = event.currentTarget;
    const values = new FormData(form);

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.fromEntries(values)
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Your message could not be saved. Please try again."
        );
      }

      form.reset();
      setSent(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Please try again later."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="correspondence">
      <header className="mail-header">
        <Link href="/" className="mail-logo">
          taostt<span>.</span>
        </Link>

        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/#videos">Videos</Link>
          <Link href="/#revenant">Revenant SMP</Link>
        </nav>
      </header>

      <main className="contact-layout">
        <section className="contact-intro">
          <p className="mail-eyebrow">
            A good idea starts with a hello
          </p>

          <h1>
            Let’s make
            <br />
            something <em>good.</em>
          </h1>

          <p>
            Have a collaboration in mind, a sponsorship
            idea, or a question? Leave me a message here.
          </p>

          <div className="contact-note">
            <span aria-hidden="true">✦</span>

            <div>
              <h2>Straight to my inbox.</h2>

              <p>
                I’ll reply to the email address you
                provide. Please double-check it before
                sending.
              </p>
            </div>
          </div>

          <a
            className="mail-link"
            href="https://discord.gg/MZ4w4RBtwZ"
            target="_blank"
            rel="noreferrer"
          >
            Looking for the community? Join Discord ↗
          </a>
        </section>

        <section
          className="mail-card"
          aria-label="Contact form"
        >
          {sent ? (
            <div
              className="success-panel"
              role="status"
            >
              <span aria-hidden="true">✓</span>

              <h2>Your message is in.</h2>

              <p>
                Thanks for reaching out. If I reply,
                it’ll arrive at the email address you
                entered.
              </p>

              <button
                className="mail-button"
                onClick={() => setSent(false)}
              >
                Send another message
              </button>

              <Link className="mail-link" href="/">
                Back to the videos ↗
              </Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-heading">
                <h2>Say hello.</h2>
                <span>Collabs & inquiries</span>
              </div>

              <div className="form-pair">
                <label>
                  Your name

                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="What should I call you?"
                  />
                </label>

                <label>
                  Email address

                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label>
                What’s it about?

                <select
                  name="category"
                  defaultValue="Collaboration"
                >
                  <option>Collaboration</option>
                  <option>Sponsorship</option>
                  <option>General inquiry</option>
                </select>
              </label>

              <label>
                Subject

                <input
                  name="subject"
                  required
                  minLength={3}
                  maxLength={160}
                  placeholder="The short version"
                />
              </label>

              <label>
                Your message

                <textarea
                  name="message"
                  rows={6}
                  required
                  minLength={20}
                  maxLength={6000}
                  placeholder="Tell me a little about your idea, timeline, and what you have in mind."
                />
              </label>

              <div
                className="mail-trap"
                aria-hidden="true"
              >
                <label>
                  Website

                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              <p className="privacy-note">
                Your name, email, and message are stored
                privately so I can respond to your inquiry.
                Please don’t include passwords or sensitive
                personal information.
              </p>

              {error && (
                <p
                  className="mail-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                className="mail-button"
                disabled={busy}
              >
                {busy ? "Sending…" : "Send message ↗"}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="mail-footer">
        <span>
          © {new Date().getFullYear()} Toast
        </span>

        <Link href="/">Back home ↗</Link>
      </footer>
    </div>
  );
}