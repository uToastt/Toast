"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import Link from "next/link";

type Message = {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  created_at: string;
};

type Reply = {
  id: string;
  body: string;
  status: "sent" | "pending" | "failed";
  created_at: string;
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function api(
  path: string,
  method = "GET",
  body?: unknown
) {
  const response = await fetch(path, {
    method,
    headers: body
      ? { "Content-Type": "application/json" }
      : {},
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || "Please try again.",
      response.status
    );
  }

  return data;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Conversation({
  id,
  onChanged,
  onUnauthorized,
}: {
  id: string;
  onChanged: () => void;
  onUnauthorized: () => void;
}) {
  const [message, setMessage] =
    useState<Message | null>(null);

  const [replies, setReplies] = useState<Reply[]>([]);
  const [draft, setDraft] = useState("");
  const [retryId, setRetryId] =
    useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    try {
      const result = await api(
        `/api/admin/messages/${id}`
      );

      setMessage(result.message);
      setReplies(result.replies);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        onUnauthorized();
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Could not open this conversation."
        );
      }
    }
  }, [id, onUnauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus() {
    if (!message || busy) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await api(
        `/api/admin/messages/${id}`,
        "PATCH",
        {
          status:
            message.status === "open"
              ? "closed"
              : "open",
        }
      );

      onChanged();
      await load();
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        onUnauthorized();
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Could not update the conversation."
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function send(event: FormEvent) {
    event.preventDefault();

    if (busy || !draft.trim()) return;

    setBusy(true);
    setError("");
    setNotice("");

    const requestId =
      retryId || crypto.randomUUID();

    setRetryId(requestId);

    try {
      await api(
        `/api/admin/messages/${id}`,
        "POST",
        {
          body: draft,
          requestId,
        }
      );

      setDraft("");
      setRetryId(null);
      setNotice(
        "Reply accepted by the email service."
      );

      await load();
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        onUnauthorized();
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Could not send your reply."
        );

        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  if (!message) {
    return (
      <section className="conversation mail-card">
        <p role={error ? "alert" : undefined}>
          {error || "Opening conversation…"}
        </p>
      </section>
    );
  }

  return (
    <section className="conversation mail-card">
      <div className="conversation-heading">
        <div>
          <p className="mail-eyebrow">
            {message.category}
          </p>

          <h2>{message.subject}</h2>
        </div>

        <button
          className="mail-button secondary"
          onClick={changeStatus}
          disabled={busy}
        >
          {message.status === "open"
            ? "Close conversation"
            : "Reopen conversation"}
        </button>
      </div>

      <div className="sender-line">
        <strong>{message.name}</strong>
        <span>{message.email}</span>

        <time>
          {formatDate(message.created_at)}
        </time>

        <span
          className={`status-chip ${message.status}`}
        >
          {message.status}
        </span>
      </div>

      <article className="message-bubble">
        <p className="message-body">
          {message.message}
        </p>
      </article>

      <h3 className="reply-heading">
        Your replies
      </h3>

      {!replies.length && (
        <p className="muted">No replies yet.</p>
      )}

      {replies.map((reply) => (
        <article
          className="reply-bubble"
          key={reply.id}
        >
          <div className="reply-info">
            <span>
              {reply.status === "sent"
                ? "Accepted by email service"
                : reply.status === "pending"
                  ? "Delivery not confirmed"
                  : "Email not accepted"}
            </span>

            <time>
              {formatDate(reply.created_at)}
            </time>
          </div>

          <p className="message-body">
            {reply.body}
          </p>

          {reply.status !== "sent" &&
            message.status === "open" && (
              <button
                className="mail-link"
                disabled={busy}
                onClick={() => {
                  setDraft(reply.body);
                  setRetryId(reply.id);
                  setError("");
                  setNotice(
                    "Retry loaded below. The text is locked to avoid duplicate or changed sends."
                  );
                }}
              >
                Retry this reply
              </button>
            )}
        </article>
      ))}

      {message.status === "open" ? (
        <form
          className="reply-form"
          onSubmit={send}
        >
          <label>
            Your email reply

            <textarea
              rows={6}
              maxLength={10000}
              required
              value={draft}
              readOnly={!!retryId}
              onChange={(event) =>
                setDraft(event.target.value)
              }
              placeholder="Write a reply to this inquiry…"
            />
          </label>

          <p className="privacy-note">
            Sent to {message.email}. Incoming email
            replies arrive in your sender mailbox;
            this inbox does not sync incoming email.
          </p>

          {retryId && (
            <p className="privacy-note">
              This send is locked while its delivery
              is checked. Retry the same reply to
              avoid sending a duplicate.
            </p>
          )}

          <button
            className="mail-button"
            disabled={busy || !draft.trim()}
          >
            {busy
              ? "Working…"
              : retryId
                ? "Retry send"
                : "Send reply ↗"}
          </button>
        </form>
      ) : (
        <p className="closed-note">
          This conversation is closed. Reopen it
          to send another reply.
        </p>
      )}

      {error && (
        <p className="mail-error" role="alert">
          {error}
        </p>
      )}

      {notice && (
        <p className="mail-notice" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}

export default function AdminPage() {
  const [auth, setAuth] = useState<
    "checking" | "login" | "ready"
  >("checking");

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [status, setStatus] = useState<
    "open" | "closed"
  >("open");

  const [offset, setOffset] = useState(0);
  const [selected, setSelected] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const unauthorized = useCallback(() => {
    setAuth("login");
    setMessages([]);
    setSelected(null);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api(
        `/api/admin/messages?status=${status}` +
          `&offset=${offset}`
      );

      setMessages(result.messages);
      setAuth("ready");
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 401
      ) {
        unauthorized();
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Could not load your inbox."
        );

        setAuth((current) =>
          current === "checking"
            ? "login"
            : current
        );
      }
    } finally {
      setLoading(false);
    }
  }, [status, offset, unauthorized]);

  useEffect(() => {
    void load();
  }, [load]);

  async function login(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      await api(
        "/api/admin/login",
        "POST",
        Object.fromEntries(data)
      );

      form.reset();
      await load();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not sign in."
      );
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setError("");

    try {
      await api(
        "/api/admin/logout",
        "POST"
      );

      unauthorized();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not sign out."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="correspondence admin-site">
      <header className="mail-header">
        <Link className="mail-logo" href="/">
          taostt<span>.</span>
        </Link>

        <span className="admin-label">
          Private inbox
        </span>

        {auth === "ready" && (
          <button
            className="mail-button secondary"
            onClick={logout}
            disabled={busy}
          >
            Sign out
          </button>
        )}
      </header>

      <main
        className={
          auth === "ready"
            ? "admin-main"
            : "login-main"
        }
      >
        {auth === "checking" ? (
          <p>Checking your session…</p>
        ) : auth === "login" ? (
          <section className="mail-card login-card">
            <p className="mail-eyebrow">
              Just for Toast
            </p>

            <h1>Welcome back.</h1>

            <p className="muted">
              Sign in to read inquiries and send replies.
            </p>

            <form onSubmit={login}>
              <label>
                Username

                <input
                  name="username"
                  autoComplete="username"
                  defaultValue="Taostt"
                  required
                  maxLength={100}
                />
              </label>

              <label>
                Password

                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={256}
                />
              </label>

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
                {busy
                  ? "Signing in…"
                  : "Open my inbox ↗"}
              </button>
            </form>

            <Link className="mail-link" href="/">
              Back to the website
            </Link>
          </section>
        ) : (
          <>
            <div className="admin-title">
              <div>
                <p className="mail-eyebrow">
                  Collabs, questions, and good ideas
                </p>

                <h1>Your conversations.</h1>
              </div>

              <button
                className="mail-button secondary"
                onClick={() => void load()}
                disabled={loading}
              >
                Refresh inbox
              </button>
            </div>

            {error && (
              <p className="mail-error" role="alert">
                {error}
              </p>
            )}

            <div className="inbox-layout">
              <aside className="mail-card inbox-list">
                <div className="inbox-tabs">
                  {(["open", "closed"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        aria-pressed={status === tab}
                        className={
                          status === tab ? "active" : ""
                        }
                        onClick={() => {
                          setStatus(tab);
                          setOffset(0);
                          setSelected(null);
                        }}
                      >
                        {tab === "open"
                          ? "Open"
                          : "Closed"}
                      </button>
                    )
                  )}
                </div>

                {loading ? (
                  <p className="muted">Loading…</p>
                ) : messages.length ? (
                  messages.map((message) => (
                    <button
                      key={message.id}
                      className={
                        "inbox-item " +
                        (selected === message.id
                          ? "selected"
                          : "")
                      }
                      onClick={() =>
                        setSelected(message.id)
                      }
                    >
                      <span>
                        {message.name}

                        <small>
                          {new Date(
                            message.created_at
                          ).toLocaleDateString()}
                        </small>
                      </span>

                      <strong>
                        {message.subject}
                      </strong>

                      <span className="inbox-category">
                        {message.category}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="empty-inbox">
                    <span aria-hidden="true">✦</span>
                    <h2>All quiet here.</h2>
                    <p>
                      No {status} inquiries on this page.
                    </p>
                  </div>
                )}

                <div className="pagination">
                  <button
                    disabled={
                      offset === 0 || loading
                    }
                    onClick={() => {
                      setOffset(
                        Math.max(0, offset - 50)
                      );
                      setSelected(null);
                    }}
                  >
                    ← Previous
                  </button>

                  <span>
                    {Math.floor(offset / 50) + 1}
                  </span>

                  <button
                    disabled={
                      messages.length < 50 || loading
                    }
                    onClick={() => {
                      setOffset(offset + 50);
                      setSelected(null);
                    }}
                  >
                    Next →
                  </button>
                </div>
              </aside>

              {selected ? (
                <Conversation
                  key={selected}
                  id={selected}
                  onChanged={() => void load()}
                  onUnauthorized={unauthorized}
                />
              ) : (
                <section className="mail-card inbox-welcome">
                  <span aria-hidden="true">↗</span>

                  <h2>
                    A little room for good ideas.
                  </h2>

                  <p>
                    Choose a conversation to read it,
                    reply by email, or mark it closed.
                  </p>
                </section>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}