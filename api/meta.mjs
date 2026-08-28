import { getRequiredEnv, json, verifySession } from "../server/auth.mjs";

export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return json({ ok: false, error: "Método não permitido." }, 405, { Allow: "GET" });
    }

    if (!verifySession(request)) {
      return json({ ok: false, error: "Não autorizado." }, 401);
    }

    try {
      const appsScriptUrl = getRequiredEnv("META_APPS_SCRIPT_URL");
      const token = getRequiredEnv("META_APPS_SCRIPT_TOKEN");
      const incomingUrl = new URL(request.url);
      const includeHistory = incomingUrl.searchParams.get("incluirHistorico") === "0" ? "0" : "1";

      const url = new URL(appsScriptUrl);
      if (
        url.protocol !== "https:" ||
        url.hostname !== "script.google.com" ||
        !url.pathname.includes("/macros/s/") ||
        !url.pathname.endsWith("/exec")
      ) {
        throw new Error("META_APPS_SCRIPT_URL inválida.");
      }

      url.searchParams.set("rota", "metaMilhao");
      url.searchParams.set("incluirHistorico", includeHistory);
      url.searchParams.set("token", token);
      url.searchParams.set("nocache", "1");
      url.searchParams.set("t", String(Date.now()));

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), includeHistory === "1" ? 24000 : 12000);
      let response;

      try {
        response = await fetch(url, {
          redirect: "follow",
          cache: "no-store",
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      if (!response.ok) {
        throw new Error(`Apps Script respondeu HTTP ${response.status}.`);
      }

      const raw = await response.json();
      if (raw?.sucesso === false || raw?.success === false) {
        throw new Error(raw.mensagem || raw.error || "Apps Script retornou erro.");
      }

      const faturado = Number(raw?.faturado ?? raw?.currentRevenue ?? raw?.valor);
      if (!Number.isFinite(faturado)) {
        throw new Error("Faturamento inválido na origem.");
      }

      const mesAnteriorBruto = Number(raw?.mesAnterior ?? 0);
      const mesAnterior = Number.isFinite(mesAnteriorBruto) ? mesAnteriorBruto : 0;

      const historicoDiario = Array.isArray(raw?.historicoDiario)
        ? raw.historicoDiario
            .map(item => ({
              dia: Number(item?.dia) || 0,
              mes: Number(item?.mes) || 0,
              ano: Number(item?.ano) || 0,
              valor: Number(item?.valor) || 0
            }))
            .filter(item => item.dia >= 1 && item.dia <= 31)
        : [];

      return json({
        success: true,
        faturado,
        mesAnterior,
        mes: Number(raw?.mes) || null,
        ano: Number(raw?.ano) || null,
        historicoDiario,
        timesQuantidade: raw?.timesQuantidade && typeof raw.timesQuantidade === "object"
          ? raw.timesQuantidade
          : {}
      });
    } catch (error) {
      console.error("Meta proxy error:", error);
      const message = error?.name === "AbortError"
        ? "A planilha demorou para responder."
        : "Não foi possível consultar a planilha.";
      return json({ ok: false, error: message }, 502);
    }
  }
};
