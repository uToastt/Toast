import {
  randomBytes,
  scryptSync,
} from "node:crypto";

import {
  emitKeypressEvents,
} from "node:readline";

if (!process.stdin.isTTY) {
  console.error(
    "Run this in an interactive terminal on your computer."
  );

  process.exit(1);
}

process.stdout.write(
  "Choose a NEW admin password (12+ characters; typing is hidden): "
);

emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let password = "";

process.stdin.on("keypress", (character, key) => {
  if (key?.ctrl && key.name === "c") {
    process.stdin.setRawMode(false);
    process.exit(1);
  }

  if (key?.name === "backspace") {
    password = password.slice(0, -1);
    return;
  }

  if (key?.name === "return") {
    process.stdin.setRawMode(false);
    process.stdin.pause();

    if (
      password.length < 12 ||
      password.length > 256
    ) {
      console.error(
        "\nUse 12–256 characters. Run the script again."
      );

      process.exitCode = 1;
      return;
    }

    const salt = randomBytes(16).toString("hex");

    const hash = [
      "scrypt",
      salt,
      scryptSync(password, salt, 64).toString("hex"),
    ].join(":");

    const sessionSecret =
      randomBytes(48).toString("hex");

    console.log("\n\nYour private Vercel settings:\n");
    console.log("ADMIN_USERNAME=Taostt");
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log(
      `ADMIN_SESSION_SECRET=${sessionSecret}`
    );

    console.log(
      "\nKeep these values private. Do not paste them into chat."
    );

    return;
  }

  if (
    character &&
    !key?.ctrl &&
    !key?.meta
  ) {
    password += character;
  }
});