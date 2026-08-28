import { clearSessionCookie, json } from "../server/auth.mjs";

export default {
  fetch(request) {
    if (request.method !== "POST") {
      return json({ ok: false }, 405, { Allow: "POST" });
    }

    return json({ ok: true }, 200, {
      "Set-Cookie": clearSessionCookie()
    });
  }
};
