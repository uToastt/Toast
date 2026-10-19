import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
};

export const categories = [
  "Collaboration",
  "Sponsorship",
  "General inquiry",
];

export function textField(
  value: unknown,
  label: string,
  min: number,
  max: number
): string {
  if (typeof value !== "string") {
    throw new Error(`Please enter ${label}.`);
  }

  const text = value.trim();

  if (
    text.length < min ||
    text.length > max ||
    /\u0000/.test(text)
  ) {
    throw new Error(
      `${label} must be ${min}–${max} characters.`
    );
  }

  return text;
}

export function validateContact(
  value: Record<string, unknown>
): ContactInput {
  const name = textField(value.name, "your name", 1, 100);

  const email = textField(
    value.email,
    "your email address",
    3,
    254
  ).toLowerCase();

  if (
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
    /[\r\n]/.test(email)
  ) {
    throw new Error("Please enter a valid email address.");
  }

  const subject = textField(
    value.subject,
    "a subject",
    3,
    160
  );

  if (/[\r\n]/.test(subject)) {
    throw new Error("Please use one line for the subject.");
  }

  const category = textField(
    value.category,
    "an inquiry type",
    1,
    40
  );

  if (!categories.includes(category)) {
    throw new Error("Please select an inquiry type.");
  }

  const message = textField(
    value.message,
    "a message",
    20,
    6000
  );

  return {
    name,
    email,
    subject,
    category,
    message,
  };
}

export function hashPassword(
  password: string,
  salt = randomBytes(16).toString("hex")
): string {
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

export function validPasswordHash(hash: string): boolean {
  return /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash);
}

export function verifyPassword(
  password: string,
  hash: string
): boolean {
  if (!validPasswordHash(hash)) return false;

  const [, salt, expected] = hash.split(":");
  const actual = scryptSync(password, salt, 64);

  return timingSafeEqual(
    actual,
    Buffer.from(expected, "hex")
  );
}

function signature(
  payload: string,
  secret: string
): string {
  return createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

function equal(a: string, b: string): boolean {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  return (
    first.length === second.length &&
    timingSafeEqual(first, second)
  );
}

function fingerprint(hash: string): string {
  return createHash("sha256")
    .update(hash)
    .digest("hex")
    .slice(0, 24);
}

export function issueSession(
  secret: string,
  passwordHash: string,
  now = Date.now()
): string {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(now / 1000) + 28800,
      v: fingerprint(passwordHash),
      nonce: randomBytes(16).toString("hex"),
    })
  ).toString("base64url");

  return `${payload}.${signature(payload, secret)}`;
}

export function verifySession(
  token: string,
  secret: string,
  passwordHash: string,
  now = Date.now()
): boolean {
  try {
    if (token.length > 1500) return false;

    const [payload, sig, extra] = token.split(".");

    if (
      !payload ||
      !sig ||
      extra ||
      !equal(sig, signature(payload, secret))
    ) {
      return false;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    const currentTime = Math.floor(now / 1000);

    return (
      Number.isInteger(data.exp) &&
      data.exp > currentTime &&
      data.exp <= currentTime + 28800 &&
      data.v === fingerprint(passwordHash)
    );
  } catch {
    return false;
  }
}

export function rateKey(
  value: string,
  secret: string
): string {
  return createHmac("sha256", secret)
    .update(value)
    .digest("hex");
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}