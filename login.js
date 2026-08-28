const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loader = document.getElementById("pageLoader");
const form = document.getElementById("loginForm");
const username = document.getElementById("username");
const password = document.getElementById("password");
const errorBox = document.getElementById("loginError");
const submitButton = document.getElementById("loginButton");
const togglePassword = document.getElementById("togglePassword");

let dashboardScriptPromise = null;

function setLoaderVisible(visible) {
  loader?.classList.toggle("hidden", !visible);
}

function showLogin(message = "") {
  dashboardView?.setAttribute("hidden", "");
  loginView?.removeAttribute("hidden");
  setLoaderVisible(false);
  if (errorBox) errorBox.textContent = message;
  window.setTimeout(() => username?.focus(), 50);
}

function loadDashboardScript() {
  if (dashboardScriptPromise) return dashboardScriptPromise;

  dashboardScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-dashboard-script="true"]');
    if (existing) {
      if (existing.dataset.loaded === "true") return resolve();
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "script.js";
    script.defer = true;
    script.dataset.dashboardScript = "true";
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.body.appendChild(script);
  });

  return dashboardScriptPromise;
}

async function showDashboard() {
  loginView?.setAttribute("hidden", "");
  dashboardView?.removeAttribute("hidden");
  setLoaderVisible(true);

  try {
    await loadDashboardScript();
  } catch (error) {
    console.error("Não foi possível carregar o painel:", error);
    showLogin("Não foi possível carregar o painel. Atualize a página e tente novamente.");
  }
}

async function checkSession() {
  try {
    const response = await fetch("/api/session", {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin"
    });

    if (response.ok) {
      await showDashboard();
      return;
    }

    showLogin();
  } catch (error) {
    console.error("Falha ao verificar sessão:", error);
    showLogin("Não foi possível verificar sua sessão agora.");
  }
}

togglePassword?.addEventListener("click", () => {
  const showing = password.type === "text";
  password.type = showing ? "password" : "text";
  togglePassword.textContent = showing ? "Mostrar" : "Ocultar";
  togglePassword.setAttribute("aria-label", showing ? "Mostrar senha" : "Ocultar senha");
});

form?.addEventListener("submit", async event => {
  event.preventDefault();
  if (errorBox) errorBox.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Validando...";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Usuário ou senha inválidos.");

    password.value = "";
    await showDashboard();
  } catch (error) {
    if (errorBox) errorBox.textContent = error.message || "Não foi possível entrar.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Entrar no painel";
  }
});

checkSession();
