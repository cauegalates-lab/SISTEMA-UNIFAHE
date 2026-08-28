const CONFIG = {
  apiUrl: "/api/meta",
  refreshIntervalMs: 60_000,
  previewDurationMs: 8500
};

const dashboardElement = document.querySelector(".dashboard");
const GOAL = Number(dashboardElement?.dataset.goal) || 1_200_000;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const TEAM_DEFINITIONS = [
  {
    key: "alfas",
    name: "ALFAS",
    image: "assets/teams/alfas.jpeg",
    alt: "Logo do time Alfas"
  },
  {
    key: "vip",
    name: "VIP",
    image: "assets/teams/vip.jpeg",
    alt: "Logo do time VIP"
  },
  {
    key: "evolution",
    name: "EVOLUTION",
    image: "assets/teams/evolution.jpeg",
    alt: "Logo do time Evolution"
  },
  {
    key: "goat",
    name: "GOAT",
    image: "assets/teams/goat.jpeg",
    alt: "Logo do time GOAT"
  },
  {
    key: "winx",
    name: "WINX",
    image: "assets/teams/winx.jpeg",
    alt: "Logo do time Winx"
  },
  {
    key: "predadores",
    name: "PREDADORES",
    image: "assets/teams/predadores.jpeg",
    alt: "Logo do time Predadores"
  }
];

const animationFrames = new WeakMap();
let liveRevenueValue = 0;
let displayedRevenueValue = 0;
let displayedRemainingValue = GOAL;
let displayedPercentValue = 0;
let displayedRemainingPercentValue = 100;
let hasRenderedRevenue = false;
let hasCelebratedMillion = false;
let previewActive = false;
let previewTimer = null;
let celebrationAnimationFrame = null;
let goalCountdownRunning = false;
let goalCountdownSequence = 0;
let dailySalesHistory = [];
let dailySalesMonth = new Date().getMonth() + 1;
let dailySalesYear = new Date().getFullYear();
let dailySalesSignature = "";
let previousMonthTotalValue = 0;
let currentTeamQuantities = [];
let currentTeamQuantitiesSignature = "";

const DASHBOARD_STORAGE_KEY = "unifahe_rumo_1_milhao_state_v3";

function getDailySalesSignature(history = dailySalesHistory) {
  return JSON.stringify((Array.isArray(history) ? history : []).map(item => [
    Number(item?.dia) || 0,
    Number(item?.mes) || 0,
    Number(item?.ano) || 0,
    Math.round((Number(item?.valor) || 0) * 100) / 100
  ]));
}

function getTeamQuantitiesSignature(teams = currentTeamQuantities) {
  return JSON.stringify((Array.isArray(teams) ? teams : []).map(team => [
    String(team?.key || ""),
    Math.round((Number(team?.quantity) || 0) * 100) / 100
  ]));
}

function normalizeTeamQuantities(rawTeams) {
  const source = rawTeams && typeof rawTeams === "object" ? rawTeams : {};

  return TEAM_DEFINITIONS.map(team => {
    const incoming = source[team.key] || source[team.name] || {};
    const rawQuantity = typeof incoming === "object"
      ? (incoming.quantidade ?? incoming.valor ?? incoming.total ?? 0)
      : incoming;
    const numericQuantity = Number(rawQuantity);

    return {
      ...team,
      quantity: Number.isFinite(numericQuantity) ? numericQuantity : 0,
      range: typeof incoming === "object" ? String(incoming.intervalo || "") : ""
    };
  });
}

function formatTeamQuantity(value) {
  const numericValue = Number(value) || 0;
  const isInteger = Math.abs(numericValue - Math.round(numericValue)) < 0.00001;
  return isInteger
    ? new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(numericValue)
    : numberFormatter.format(numericValue);
}

function renderTeamBoard() {
  const board = document.getElementById("teamsBoard");
  if (!board) return;

  if (!currentTeamQuantities.length) {
    board.innerHTML = `
      <article class="team-score-card is-loading"><strong>Carregando</strong></article>
      <article class="team-score-card is-loading"><strong>Carregando</strong></article>
      <article class="team-score-card is-loading"><strong>Carregando</strong></article>
    `;
    return;
  }

  board.innerHTML = currentTeamQuantities.map(team => `
    <article class="team-score-card" data-team="${team.key}">
      <div class="team-score-thumb">
        <img src="${team.image}" alt="${team.alt}" loading="lazy" />
      </div>
      <strong class="team-score-name">${team.name}</strong>
      <span class="team-score-value">${formatTeamQuantity(team.quantity)}</span>
      <span class="team-score-label">Quantidade</span>
    </article>
  `).join("");
}

function updateTeamQuantities(data, { force = false } = {}) {
  const nextTeams = normalizeTeamQuantities(
    data?.timesQuantidade ?? data?.teamQuantities ?? data?.times ?? data?.equipesQuantidade
  );

  if (!nextTeams.length) {
    return false;
  }

  const nextSignature = getTeamQuantitiesSignature(nextTeams);
  if (!force && nextSignature === currentTeamQuantitiesSignature) {
    return false;
  }

  currentTeamQuantities = nextTeams;
  currentTeamQuantitiesSignature = nextSignature;
  renderTeamBoard();
  saveDashboardState();
  return true;
}

function saveDashboardState() {
  if (!hasRenderedRevenue) return;

  try {
    localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify({
      revenue: displayedRevenueValue,
      history: dailySalesHistory,
      month: dailySalesMonth,
      year: dailySalesYear,
      previousMonthTotal: previousMonthTotalValue,
      teamQuantities: currentTeamQuantities,
      savedAt: Date.now()
    }));
  } catch (error) {
    console.warn("Não foi possível salvar o último estado do painel.", error);
  }
}

function restoreDashboardState() {
  try {
    const raw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (!raw) return false;

    const saved = JSON.parse(raw);
    const revenue = Number(saved?.revenue);
    if (!Number.isFinite(revenue) || revenue < 0) return false;

    liveRevenueValue = revenue;
    renderDashboard(revenue, { animate: false, honorPreview: true });
    setGoalVisualState(revenue >= GOAL, { preview: false, entering: false });
    hasCelebratedMillion = revenue >= GOAL;

    const restoredPreviousMonthTotal = Number(saved?.previousMonthTotal);
    if (Number.isFinite(restoredPreviousMonthTotal) && restoredPreviousMonthTotal >= 0) {
      previousMonthTotalValue = restoredPreviousMonthTotal;
      renderPreviousMonthTotal();
    }

    const restoredHistory = normalizeDailySalesHistory(saved?.history);
    if (restoredHistory.length) {
      dailySalesHistory = restoredHistory;
      dailySalesMonth = Number(saved?.month) || restoredHistory.at(-1)?.mes || dailySalesMonth;
      dailySalesYear = Number(saved?.year) || restoredHistory.at(-1)?.ano || dailySalesYear;
      dailySalesSignature = getDailySalesSignature(restoredHistory);
      renderDailySalesCarousel();
    }

    const restoredTeams = normalizeTeamQuantities(saved?.teamQuantities);
    if (restoredTeams.length) {
      currentTeamQuantities = restoredTeams;
      currentTeamQuantitiesSignature = getTeamQuantitiesSignature(restoredTeams);
      renderTeamBoard();
    }

    return true;
  } catch (error) {
    console.warn("Não foi possível restaurar o último estado do painel.", error);
    return false;
  }
}

function formatPercent(value, digits = 0) {
  return `${value.toFixed(digits).replace(".", ",")}%`;
}

function animateValue({
  key,
  from,
  to,
  duration = 1000,
  onUpdate,
  onComplete
}) {
  const previousFrame = animationFrames.get(key);
  if (previousFrame) cancelAnimationFrame(previousFrame);

  const startTime = performance.now();
  const difference = to - from;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = from + difference * eased;
    onUpdate?.(value);

    if (progress < 1) {
      const frame = requestAnimationFrame(update);
      animationFrames.set(key, frame);
    } else {
      onUpdate?.(to);
      animationFrames.delete(key);
      onComplete?.(to);
    }
  }

  const frame = requestAnimationFrame(update);
  animationFrames.set(key, frame);
}

function setProgressVisual(percentage) {
  const normalized = Math.min(Math.max(percentage, 0), 100);
  const fill = document.getElementById("progressFill");
  const badge = document.getElementById("progressBadge");

  if (fill) {
    fill.style.width = normalized <= 0 ? "0" : `calc(${normalized}% - 4px)`;
  }

  if (badge) {
    badge.style.left = `${Math.min(Math.max(normalized, 5), 95)}%`;
  }
}

function setGoalVisualState(active, { preview = false, entering = false } = {}) {
  document.body.classList.toggle("goal-achieved", active);
  document.body.classList.toggle("goal-preview", active && preview);

  if (entering) {
    document.body.classList.add("goal-animating");
    window.setTimeout(() => {
      document.body.classList.remove("goal-animating");
    }, 1800);
  } else if (!active) {
    document.body.classList.remove("goal-animating");
  }
}

function createCelebrationParticles(canvas, duration = 7000) {
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  if (celebrationAnimationFrame) {
    cancelAnimationFrame(celebrationAnimationFrame);
    celebrationAnimationFrame = null;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const host = canvas.parentElement;
  let width = 0;
  let height = 0;
  let startTime = performance.now();
  let lastBurst = -800;
  const sparkles = [];
  const bursts = [];
  const flares = [];
  const colors = ["#ffd76b", "#ffbe38", "#fff1b4", "#ff9f1a", "#ffeaa0"];

  function resizeCanvas() {
    const rect = (host || canvas).getBoundingClientRect();
    width = Math.max(Math.round(rect.width), 1);
    height = Math.max(Math.round(rect.height), 1);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function addSparkles(amount = 28) {
    for (let index = 0; index < amount; index += 1) {
      sparkles.push({
        x: width * (.05 + Math.random() * .86),
        y: height * (.04 + Math.random() * .66),
        radius: .8 + Math.random() * 2.8,
        alpha: .18 + Math.random() * .55,
        twinkle: Math.random() * Math.PI * 2,
        life: 1,
        driftX: (-.2 + Math.random() * .4),
        driftY: -.04 - Math.random() * .12,
        decay: .002 + Math.random() * .004,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function addFlare(x, y) {
    flares.push({
      x,
      y,
      radius: 8,
      life: 1,
      decay: .028 + Math.random() * .012,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function addBurst(x, y, amount = reducedMotion ? 22 : 42) {
    addFlare(x, y);
    for (let index = 0; index < amount; index += 1) {
      const angle = (Math.PI * 2 * index) / amount + Math.random() * .1;
      const speed = 1.5 + Math.random() * 3.8;
      bursts.push({
        x,
        y,
        previousX: x,
        previousY: y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 1,
        decay: .015 + Math.random() * .018,
        width: 1.1 + Math.random() * 1.9,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function drawFlares() {
    for (let index = flares.length - 1; index >= 0; index -= 1) {
      const flare = flares[index];
      flare.radius += 4.2;
      flare.life -= flare.decay;

      const gradient = context.createRadialGradient(flare.x, flare.y, 0, flare.x, flare.y, flare.radius * 1.8);
      gradient.addColorStop(0, 'rgba(255,245,190,' + Math.max(flare.life * .45, 0) + ')');
      gradient.addColorStop(.35, 'rgba(255,205,90,' + Math.max(flare.life * .2, 0) + ')');
      gradient.addColorStop(1, 'rgba(255,180,40,0)');
      context.fillStyle = gradient;
      context.globalAlpha = 1;
      context.beginPath();
      context.arc(flare.x, flare.y, flare.radius * 1.8, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = flare.color;
      context.globalAlpha = Math.max(flare.life * .45, 0);
      context.lineWidth = 1.5;
      context.beginPath();
      context.arc(flare.x, flare.y, flare.radius, 0, Math.PI * 2);
      context.stroke();

      if (flare.life <= 0) flares.splice(index, 1);
    }

    context.globalAlpha = 1;
  }

  function drawSparkles() {
    for (let index = sparkles.length - 1; index >= 0; index -= 1) {
      const particle = sparkles[index];
      particle.twinkle += .09;
      particle.x += particle.driftX;
      particle.y += particle.driftY;
      particle.life -= particle.decay;

      const glow = Math.max(particle.alpha * (0.55 + Math.sin(particle.twinkle) * .45), 0);
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.globalAlpha = Math.max(glow * particle.life, 0);
      context.shadowBlur = 16;
      context.shadowColor = particle.color;
      context.fill();

      if (particle.life <= 0) sparkles.splice(index, 1);
    }

    context.shadowBlur = 0;
    context.globalAlpha = 1;
  }

  function drawBursts() {
    context.lineCap = "round";
    for (let index = bursts.length - 1; index >= 0; index -= 1) {
      const particle = bursts[index];
      particle.previousX = particle.x;
      particle.previousY = particle.y;
      particle.velocityX *= .986;
      particle.velocityY = particle.velocityY * .988 + .022;
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.life -= particle.decay;

      context.beginPath();
      context.moveTo(particle.previousX, particle.previousY);
      context.lineTo(particle.x, particle.y);
      context.strokeStyle = particle.color;
      context.globalAlpha = Math.max(particle.life, 0);
      context.lineWidth = particle.width;
      context.shadowBlur = 20;
      context.shadowColor = particle.color;
      context.stroke();

      if (particle.life <= 0) bursts.splice(index, 1);
    }

    context.shadowBlur = 0;
    context.globalAlpha = 1;
  }

  function animate(now) {
    const elapsed = now - startTime;
    context.clearRect(0, 0, width, height);

    if (elapsed - lastBurst > 760 && elapsed < duration * .88) {
      lastBurst = elapsed;
      const positions = [
        { x: width * .08, y: height * .16 },
        { x: width * .18, y: height * .28 },
        { x: width * .49, y: height * .18 },
        { x: width * .66, y: height * .24 },
        { x: width * .79, y: height * .14 }
      ];
      const origin = positions[Math.floor((elapsed / 760) % positions.length)];
      addBurst(origin.x, origin.y);
      addSparkles(reducedMotion ? 10 : 22);
    }

    if (Math.random() > .68) addSparkles(2);

    drawFlares();
    drawSparkles();
    drawBursts();

    if (elapsed < duration || sparkles.length || bursts.length || flares.length) {
      celebrationAnimationFrame = requestAnimationFrame(animate);
    } else {
      context.clearRect(0, 0, width, height);
      celebrationAnimationFrame = null;
    }
  }

  resizeCanvas();
  addSparkles(reducedMotion ? 22 : 54);
  addBurst(width * .08, height * .16, reducedMotion ? 16 : 24);
  addBurst(width * .18, height * .28, reducedMotion ? 14 : 22);
  addBurst(width * .49, height * .18, reducedMotion ? 16 : 24);
  addBurst(width * .66, height * .24, reducedMotion ? 14 : 22);
  addBurst(width * .79, height * .14, reducedMotion ? 16 : 24);
  window.addEventListener("resize", resizeCanvas, { once: true });
  celebrationAnimationFrame = requestAnimationFrame(animate);
}

function stopCelebrationParticles() {
  const canvas = document.getElementById("performanceCelebrationLayer");
  if (celebrationAnimationFrame) {
    cancelAnimationFrame(celebrationAnimationFrame);
    celebrationAnimationFrame = null;
  }
  if (canvas) {
    const context = canvas.getContext("2d");
    context?.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function renderDashboard(faturado, { animate = true, honorPreview = false } = {}) {
  const safeRevenue = Math.max(Number(faturado) || 0, 0);
  const remaining = Math.max(GOAL - safeRevenue, 0);
  const percentage = GOAL > 0 ? Math.min((safeRevenue / GOAL) * 100, 100) : 0;
  const remainingPercentage = Math.max(100 - percentage, 0);

  const currentElement = document.getElementById("currentRevenue");
  const remainingElement = document.getElementById("remainingRevenue");
  const progressPercentElement = document.getElementById("progressPercent");
  const progressCaptionElement = document.getElementById("progressCaption");
  const remainingPercentElement = document.getElementById("remainingPercent");

  if (animate) {
    animateValue({
      key: currentElement,
      from: hasRenderedRevenue ? displayedRevenueValue : 0,
      to: safeRevenue,
      duration: 1450,
      onUpdate: value => {
        currentElement.textContent = currencyFormatter.format(value);
      }
    });

    animateValue({
      key: remainingElement,
      from: hasRenderedRevenue ? displayedRemainingValue : GOAL,
      to: remaining,
      duration: 1450,
      onUpdate: value => {
        remainingElement.textContent = currencyFormatter.format(Math.max(value, 0));
      }
    });

    animateValue({
      key: progressPercentElement,
      from: hasRenderedRevenue ? displayedPercentValue : 0,
      to: percentage,
      duration: 1400,
      onUpdate: value => {
        const rounded = Math.round(value);
        progressPercentElement.textContent = `${rounded}%`;
        progressCaptionElement.textContent = `${rounded}%`;
        setProgressVisual(value);
      }
    });

    animateValue({
      key: remainingPercentElement,
      from: hasRenderedRevenue ? displayedRemainingPercentValue : 100,
      to: remainingPercentage,
      duration: 1400,
      onUpdate: value => {
        remainingPercentElement.textContent = formatPercent(Math.max(value, 0), 1);
      }
    });
  } else {
    currentElement.textContent = currencyFormatter.format(safeRevenue);
    remainingElement.textContent = currencyFormatter.format(remaining);
    progressPercentElement.textContent = `${Math.round(percentage)}%`;
    progressCaptionElement.textContent = `${Math.round(percentage)}%`;
    remainingPercentElement.textContent = formatPercent(remainingPercentage, 1);
    setProgressVisual(percentage);
  }

  displayedRevenueValue = safeRevenue;
  displayedRemainingValue = remaining;
  displayedPercentValue = percentage;
  displayedRemainingPercentValue = remainingPercentage;
  hasRenderedRevenue = true;

  if (!honorPreview) {
    const reachedGoal = safeRevenue >= GOAL;
    const entering = reachedGoal && !document.body.classList.contains("goal-achieved");
    setGoalVisualState(reachedGoal, { preview: false, entering });
  }
}

function wait(milliseconds) {
  return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}

function restartTickAnimation(element) {
  if (!element) return;
  element.classList.remove("is-ticking");
  void element.offsetWidth;
  element.classList.add("is-ticking");
}

async function runGoalCountdown({ preview = false, preserve = false } = {}) {
  if (goalCountdownRunning) return;

  goalCountdownRunning = true;
  const sequence = ++goalCountdownSequence;
  window.clearTimeout(previewTimer);
  stopCelebrationParticles();

  const overlay = document.getElementById("goalCountdownOverlay");
  const numberElement = document.getElementById("goalCountdownNumber");
  if (!overlay || !numberElement) {
    goalCountdownRunning = false;
    activateGoalExperience({ preview, preserve });
    return;
  }

  if (!preview) {
    hasCelebratedMillion = true;
  }

  previewActive = preview;
  setConnectionStatus(
    preview ? "is-demo" : "is-loading",
    preview ? "Preparando a prévia de 1,2 milhão..." : "Meta alcançada! Preparando comemoração..."
  );

  overlay.hidden = false;
  overlay.classList.remove("is-launching");
  overlay.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => overlay.classList.add("is-active"));

  for (const number of [3, 2, 1]) {
    if (sequence !== goalCountdownSequence) return;
    numberElement.textContent = String(number);
    restartTickAnimation(numberElement);
    await wait(900);
  }

  if (sequence !== goalCountdownSequence) return;
  overlay.classList.add("is-launching");
  await wait(460);

  overlay.classList.remove("is-active", "is-launching");
  overlay.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  numberElement.classList.remove("is-ticking");
  goalCountdownRunning = false;

  activateGoalExperience({ preview, preserve });
}

function restoreRealDashboard() {
  previewActive = false;
  window.clearTimeout(previewTimer);

  if (liveRevenueValue >= GOAL) {
    hasCelebratedMillion = true;
    renderDashboard(liveRevenueValue, { animate: true, honorPreview: true });
    setGoalVisualState(true, { preview: false, entering: false });
    createCelebrationParticles(document.getElementById("performanceCelebrationLayer"), 5200);
    setConnectionStatus("is-connected", "Meta de R$ 1,2 milhão atingida!");
    return;
  }

  stopCelebrationParticles();
  setGoalVisualState(false);
  renderDashboard(liveRevenueValue, { animate: true, honorPreview: true });

  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());

  setConnectionStatus("is-connected", `Planilha atualizada às ${time}`);
}

function activateGoalExperience({ preview = false, preserve = false } = {}) {
  window.clearTimeout(previewTimer);
  previewActive = preview;

  const entering = !document.body.classList.contains("goal-achieved");
  setGoalVisualState(true, { preview, entering });
  createCelebrationParticles(document.getElementById("performanceCelebrationLayer"));
  renderDashboard(GOAL, { animate: true, honorPreview: true });

  if (preview) {
    setConnectionStatus("is-demo", "Prévia da animação de 1,2 milhão");
    previewTimer = window.setTimeout(restoreRealDashboard, CONFIG.previewDurationMs);
  } else {
    hasCelebratedMillion = true;
    if (!preserve) {
      setConnectionStatus("is-connected", "Meta de R$ 1,2 milhão atingida!");
    }
  }
}

function maybeCelebrateGoal(revenue) {
  if (previewActive || goalCountdownRunning) return;

  if (revenue >= GOAL) {
    if (!hasCelebratedMillion) {
      runGoalCountdown({ preview: false, preserve: false });
    } else {
      setGoalVisualState(true, { preview: false, entering: false });
    }
  } else {
    hasCelebratedMillion = false;
    stopCelebrationParticles();
    setGoalVisualState(false);
  }
}

function setConnectionStatus(type, text) {
  const status = document.getElementById("connectionStatus");
  const statusText = document.getElementById("connectionStatusText");
  if (!status || !statusText) return;

  status.classList.remove("is-loading", "is-connected", "is-error", "is-demo");
  status.classList.add(type);
  statusText.textContent = text;
}

function normalizeDailySalesHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .map(item => ({
      dia: Number(item?.dia),
      mes: Number(item?.mes),
      ano: Number(item?.ano),
      valor: Number(item?.valor)
    }))
    .filter(item =>
      Number.isInteger(item.dia) &&
      item.dia >= 1 &&
      item.dia <= 31 &&
      Number.isFinite(item.valor)
    )
    .sort((a, b) => a.dia - b.dia);
}

function getDailySalesLabel(item) {
  if (!item) return "--/--";

  return `${String(item.dia).padStart(2, "0")}/${String(item.mes || dailySalesMonth).padStart(2, "0")}`;
}

function updateDailySalesCarouselControls() {
  const viewport = document.getElementById("dailySalesViewport");
  const previousButton = document.getElementById("dailySalesPrev");
  const nextButton = document.getElementById("dailySalesNext");
  if (!viewport || !previousButton || !nextButton) return;

  const maximumScroll = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
  previousButton.disabled = viewport.scrollLeft <= 2;
  nextButton.disabled = viewport.scrollLeft >= maximumScroll - 2;
}

function renderPreviousMonthTotal() {
  const element = document.getElementById("previousMonthTotal");
  if (!element) return;

  element.textContent = currencyFormatter.format(
    Math.max(Number(previousMonthTotalValue) || 0, 0)
  );
}

function updatePreviousMonthTotal(data, { force = false } = {}) {
  const rawValue = data?.mesAnterior;
  const numericValue = Number(rawValue);

  // Se uma resposta antiga ainda não tiver o campo, preserva o último valor conhecido.
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return false;
  }

  const changed = force || Math.abs(numericValue - previousMonthTotalValue) >= 0.005;
  previousMonthTotalValue = numericValue;
  renderPreviousMonthTotal();

  if (changed) {
    saveDashboardState();
  }

  return changed;
}

function renderDailySalesCarousel() {
  const container = document.getElementById("dailySalesDays");
  const total = document.getElementById("dailySalesTotal");
  const viewport = document.getElementById("dailySalesViewport");
  if (!container || !total || !viewport) return;

  const totalSold = dailySalesHistory.reduce((sum, item) => sum + item.valor, 0);
  total.textContent = currencyFormatter.format(totalSold);

  if (!dailySalesHistory.length) {
    container.innerHTML = `
      <span class="daily-sales-unavailable">
        Histórico indisponível. Atualize e publique novamente o Code.gs.
      </span>
    `;
    updateDailySalesCarouselControls();
    return;
  }

  container.innerHTML = dailySalesHistory.map((item, index) => `
    <span class="daily-sales-day${index === dailySalesHistory.length - 1 ? " is-current" : ""}">
      <small>${getDailySalesLabel(item)}</small>
      <strong>${currencyFormatter.format(item.valor)}</strong>
    </span>
  `).join("");

  requestAnimationFrame(() => {
    viewport.scrollLeft = viewport.scrollWidth;
    updateDailySalesCarouselControls();
  });
}

function updateDailySales(data, { force = false } = {}) {
  const nextHistory = normalizeDailySalesHistory(data?.historicoDiario);

  // Uma resposta sem histórico nunca apaga os dias que já estão na tela.
  if (!nextHistory.length && dailySalesHistory.length) {
    return false;
  }

  const nextSignature = getDailySalesSignature(nextHistory);
  if (!force && nextSignature === dailySalesSignature) {
    return false;
  }

  dailySalesHistory = nextHistory;
  dailySalesMonth = Number(data?.mes) || dailySalesHistory.at(-1)?.mes || dailySalesMonth;
  dailySalesYear = Number(data?.ano) || dailySalesHistory.at(-1)?.ano || dailySalesYear;
  dailySalesSignature = nextSignature;
  renderDailySalesCarousel();
  saveDashboardState();
  return true;
}

function scrollDailySales(direction) {
  const viewport = document.getElementById("dailySalesViewport");
  if (!viewport) return;

  const distance = Math.max(viewport.clientWidth * 0.82, 190);
  viewport.scrollBy({ left: direction * distance, behavior: "smooth" });
}

function parseRevenueFromResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Resposta inválida do Apps Script.");
  }

  if (data.success === false || data.sucesso === false) {
    throw new Error(data.error || data.erro || data.mensagem || "O Apps Script retornou um erro.");
  }

  const rawValue = data.faturado ?? data.currentRevenue ?? data.valor;
  const numericValue = Number(rawValue);

  if (!Number.isFinite(numericValue)) {
    throw new Error("O valor de Agosto!AK35 não é numérico.");
  }

  if (data.origem && data.origem !== "Agosto!AK35") {
    throw new Error(`O Apps Script respondeu uma origem inesperada: ${data.origem}.`);
  }

  console.info("[Meta milhão] Fonte confirmada:", {
    origem: data.origem || "Agosto!AK35",
    planilhaNome: data.planilhaNome || "não informado",
    planilhaId: data.planilhaId || "não informado",
    valorBruto: data.valorBruto,
    valorExibido: data.valorExibido,
    formula: data.formula || ""
  });

  updatePreviousMonthTotal(data);
  updateTeamQuantities(data);

  if (Array.isArray(data.historicoDiario)) {
    updateDailySales(data);
  }

  return numericValue;
}

async function fetchProtectedData(parameters = {}, timeoutMs = 15_000) {
  const search = new URLSearchParams({
    t: String(Date.now()),
    ...parameters
  });

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${CONFIG.apiUrl}?${search.toString()}`, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal
    });

    if (response.status === 401) {
      window.location.replace("/");
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.mensagem || `Falha HTTP ${response.status}.`);
    }

    return data;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("A consulta demorou para responder.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchRevenueFromSheet() {
  const data = await fetchProtectedData({ incluirHistorico: "0" }, 10_000);
  return parseRevenueFromResponse(data);
}

async function updateDailySalesFromSheet() {
  const data = await fetchProtectedData({ incluirHistorico: "1" }, 20_000);

  if (data?.success === false || data?.sucesso === false) {
    throw new Error(data.error || data.erro || data.mensagem || "Não foi possível carregar os dias.");
  }

  updatePreviousMonthTotal(data);
  updateTeamQuantities(data);
  updateDailySales(data);
  return data;
}

function clearDynamicValues() {
  const ids = [
    "currentRevenue",
    "remainingRevenue",
    "progressPercent",
    "progressCaption",
    "remainingPercent"
  ];

  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = "";
  });

  setProgressVisual(0);
}

async function updateRevenue({ manageStatus = true } = {}) {
  if (manageStatus && !previewActive) {
    setConnectionStatus("is-loading", "Consultando planilha, aguarde...");
  }

  const faturado = await fetchRevenueFromSheet();
  liveRevenueValue = Math.max(Number(faturado) || 0, 0);

  const revenueChanged =
    !hasRenderedRevenue ||
    Math.abs(liveRevenueValue - displayedRevenueValue) >= 0.005;

  if (!previewActive && !goalCountdownRunning && revenueChanged) {
    const firstGoalReach = liveRevenueValue >= GOAL && !hasCelebratedMillion;
    renderDashboard(liveRevenueValue, {
      animate: hasRenderedRevenue,
      honorPreview: firstGoalReach
    });
    maybeCelebrateGoal(liveRevenueValue);
    saveDashboardState();
  }

  if (manageStatus && !goalCountdownRunning) {
    const time = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());

    setConnectionStatus(
      "is-connected",
      liveRevenueValue >= GOAL ? "Meta de R$ 1,2 milhão atingida!" : `Planilha atualizada às ${time}`
    );
  }

  return { changed: revenueChanged, revenue: liveRevenueValue };
}

async function synchronizeDashboard({ initial = false } = {}) {
  if (!previewActive) {
    setConnectionStatus("is-loading", "Consultando planilha, aguarde...");
  }

  const [revenueResult, historyResult] = await Promise.allSettled([
    updateRevenue({ manageStatus: false }),
    updateDailySalesFromSheet()
  ]);

  if (revenueResult.status === "rejected") {
    console.error("Não foi possível atualizar o faturamento:", revenueResult.reason);
  }
  if (historyResult.status === "rejected") {
    console.error("Não foi possível atualizar o carrossel de vendas:", historyResult.reason);
  }

  if (!previewActive && !goalCountdownRunning) {
    if (revenueResult.status === "fulfilled") {
      const time = new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date());

      setConnectionStatus(
        "is-connected",
        liveRevenueValue >= GOAL ? "Meta de R$ 1,2 milhão atingida!" : `Planilha atualizada às ${time}`
      );

      if (historyResult.status === "rejected") {
        document.getElementById("connectionStatus")?.setAttribute(
          "title",
          `Faturamento atualizado. Histórico: ${String(historyResult.reason?.message || historyResult.reason || "indisponível")}`
        );
      } else {
        document.getElementById("connectionStatus")?.removeAttribute("title");
      }
      return;
    }

    const message = String(
      revenueResult.reason?.message ||
      historyResult.reason?.message ||
      "Erro ao consultar a planilha"
    );
    const shortMessage = message.length > 54 ? `${message.slice(0, 51)}...` : message;
    setConnectionStatus("is-error", shortMessage);
    document.getElementById("connectionStatus")?.setAttribute("title", message);
  }
}

function updateCountdown() {
  const monthEndText = document.getElementById("monthEndText");
  if (!monthEndText) return;

  const now = new Date();
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(now);
  monthEndText.textContent = `Quantidades consolidadas da aba Times em ${monthName}`;
}

let dashboardAppInitialized = false;

function initializeDashboardApp() {
  if (dashboardAppInitialized) return;
  dashboardAppInitialized = true;
  const loader = document.getElementById("pageLoader");

  document.getElementById("logoutButton")?.addEventListener("click", async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      window.location.replace("/");
    }
  });

  updateCountdown();
  renderTeamBoard();

  const dailySalesViewport = document.getElementById("dailySalesViewport");
  document.getElementById("dailySalesPrev")?.addEventListener("click", () => scrollDailySales(-1));
  document.getElementById("dailySalesNext")?.addEventListener("click", () => scrollDailySales(1));
  dailySalesViewport?.addEventListener("scroll", updateDailySalesCarouselControls, { passive: true });
  window.addEventListener("resize", updateDailySalesCarouselControls);

  // Exibe imediatamente os últimos dados conhecidos e consulta a planilha sem
  // bloquear a abertura do painel.
  restoreDashboardState();
  setConnectionStatus("is-loading", "Consultando planilha, aguarde...");
  loader?.classList.add("hidden");

  synchronizeDashboard({ initial: true });
  setInterval(() => synchronizeDashboard(), CONFIG.refreshIntervalMs);

}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initializeDashboardApp, { once: true });
} else {
  initializeDashboardApp();
}
