import { json, verifySession } from "../server/auth.mjs";

export default {
  fetch(request) {
    if (request.method !== "GET") {
      return json({ ok: false }, 405, { Allow: "GET" });
    }

    const session = verifySession(request);
    if (!session) return json({ ok: false }, 401);
    return json({ ok: true, user: session.u });
  }
};
