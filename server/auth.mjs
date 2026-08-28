import crypto from "node:crypto";

export const COOKIE_NAME = "rumo_milhao_session";
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

export function getRequiredEnv(name) {
  const value = String(process.env[name] || "").trim();
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value;
}

export function safeEqual(a, b) {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  return first.length === second.length && crypto.timingSafeEqual(first, second);
}

function sign(value) {
  return crypto
    .createHmac("sha256", getRequiredEnv("DASHBOARD_SESSION_SECRET"))
    .update(value)
    .digest("base64url");
}

export function createSession(username) {
  const payload = Buffer.from(JSON.stringify({
    u: username,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000
  })).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

function parseCookies(request) {
  const header = request.headers.get("cookie") || "";
  return Object.fromEntries(
    header
      .split(";")
      .map(part => {
        const index = part.indexOf("=");
        if (index < 0) return [part.trim(), ""];
        return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1))];
      })
      .filter(([key]) => key)
  );
}

export function verifySession(request) {
  try {
    const token = parseCookies(request)[COOKIE_NAME];
    if (!token || !token.includes(".")) return null;

    const [payload, signature] = token.split(".");
    if (!safeEqual(signature, sign(payload))) return null;

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data?.u || !Number.isFinite(data?.exp) || data.exp <= Date.now()) return null;

    return data;
  } catch {
    return null;
  }
}

export function sessionCookie(value, maxAge = SESSION_TTL_SECONDS) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return sessionCookie("", 0);
}

export function json(body, status = 200, extraHeaders = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders
    }
  });
}
