#!/usr/bin/env node
/**
 * Builds an ADMIN_ACCOUNTS entry (username:saltHex:scryptHashHex) for the
 * fixed admin sign-in. The password is read from a hidden prompt (or from
 * stdin when piped), so it never appears in shell history or in any file.
 *
 *   node scripts/hash-admin-password.mjs gourav
 *
 * Join several entries with ";" in ADMIN_ACCOUNTS. Also set
 * ADMIN_SESSION_SECRET to a long random value, e.g.:
 *
 *   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
 */
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const username = (process.argv[2] ?? "").trim().toLowerCase();
if (!/^[a-z0-9._-]{2,64}$/.test(username)) {
  console.error("Usage: node scripts/hash-admin-password.mjs <username>   (letters, digits, . _ -)");
  process.exit(1);
}

function readPassword() {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      let data = "";
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data.replace(/\r?\n$/, "")));
      return;
    }
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    process.stdout.write(`Password for ${username}: `);
    rl._writeToOutput = () => {}; // hide typed characters
    rl.question("", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await readPassword();
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`${username}:${salt.toString("hex")}:${hash.toString("hex")}`);
