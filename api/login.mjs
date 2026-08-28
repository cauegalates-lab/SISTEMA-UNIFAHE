import { createSession, getRequiredEnv, json, safeEqual, sessionCookie } from "../server/auth.mjs";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "Método não permitido." }, 405, { Allow: "POST" });
    }

    try {
      const expectedUser = getRequiredEnv("DASHBOARD_LOGIN_USER");
      const expectedPassword = getRequiredEnv("DASHBOARD_LOGIN_PASSWORD");
      const body = await request.json().catch(() => ({}));
      const user = String(body?.username || "").trim();
      const password = String(body?.password || "");

      if (!safeEqual(user, expectedUser) || !safeEqual(password, expectedPassword)) {
        return json({ ok: false, error: "Usuário ou senha inválidos." }, 401);
      }

      return json({ ok: true }, 200, {
        "Set-Cookie": sessionCookie(createSession(user))
      });
    } catch (error) {
      console.error("Login error:", error);
      return json({ ok: false, error: "Login não configurado no servidor." }, 500);
    }
  }
};
