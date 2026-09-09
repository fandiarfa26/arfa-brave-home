// ---------------------------------------------------------------------------
// Configuration — edit these values to customize the page.
// ---------------------------------------------------------------------------

// Name shown by `$ whoami`.
const USER = "arfabuma";

// OS shown by `$ fastfetch`.
const OS = "Fedora Linux 44";

// Desktop environment / window manager shown by `$ fastfetch`.
const DE_WM = "Sway (Wayland)";

// Terminal font shown by `$ fetch`; the page renders in this family.
const FONT = "JetBrainsMono Nerd Font";

// Local IP shown by `$ fetch`. Detected dynamically via WebRTC when the browser
// exposes it; set this value to force a fallback, leave "" to auto-detect.
// (Brave obfuscates local IPs with mDNS by default, so dynamic detection may
//  return nothing unless WebRTC handling is set to "Default" in brave://settings.)
const LOCAL_IP = "";

// ANSI colors shown by `$ fetch` (Catppuccin Mocha).
const COLORS = [
  "#45475a", "#f38ba8", "#a6e3a1", "#f9e2af",
  "#89b4fa", "#cba6f7", "#89dceb", "#bac2de",
];

// Clock beside the `$ fetch` info: a circle with a hand pointing toward
// the pointer, like a compass. Static (pointing at 12) for reduced-motion
// users and touch-only devices.
const CLOCK_W = 24, CLOCK_H = 12, CLOCK_CX = 12, CLOCK_CY = 6;
// RX/RY ratio matches monospace cell metrics (advance 0.6em, line box
// 1em) so the ring looks round instead of oval: 10/6 = 1/0.6.
const CLOCK_RX = 10, CLOCK_RY = 6;
const HAND_LEN_X = 8, HAND_LEN_Y = 4;
// Sectors run clockwise from East (screen coords, y down):
// E SE S SW W NW N NE.
const TIP = ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"];

// Ring smoothness: the circle is rasterized in braille-dot space
// (2x4 dots per cell), giving ~4x smoother curves than block chars.
// DOT_BITS[dy][dx] = bit for that dot (dots 1-4 left, 5-8 right).
const DOT_BITS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];
// Half-thickness of the ring, in ellipse-normalized units.
const RING_HALF = 0.03;

function renderClock(sector) {
  const grid = Array.from({ length: CLOCK_H }, () => Array(CLOCK_W).fill(" "));
  const ring = Array.from({ length: CLOCK_H }, () => Array(CLOCK_W).fill(false));
  // Smooth ring: sample the ellipse at each braille dot position.
  for (let cy = 0; cy < CLOCK_H; cy++) {
    for (let cx = 0; cx < CLOCK_W; cx++) {
      let bits = 0;
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const ex = (cx + (dx + 0.5) / 2 - CLOCK_CX) / CLOCK_RX;
          const ey = (cy + (dy + 0.5) / 4 - CLOCK_CY) / CLOCK_RY;
          if (Math.abs(Math.hypot(ex, ey) - 1) <= RING_HALF) {
            bits |= DOT_BITS[dy][dx];
          }
        }
      }
      if (bits) {
        grid[cy][cx] = String.fromCharCode(0x2800 + bits);
        ring[cy][cx] = true;
      }
    }
  }
  // Hand: rasterize the pivot→tip segment in braille-dot space (same
  // resolution as the ring) so diagonals stay connected. Y is scaled by
  // the cell aspect (1/0.6) for uniform visual thickness.
  const HAND_HALF = 0.38;
  const Y_SCALE = 1 / 0.6;
  const a = (sector * Math.PI) / 4;
  const x0 = CLOCK_CX + 0.5;
  const y0 = CLOCK_CY + 0.5;
  const dxs = Math.cos(a) * HAND_LEN_X;
  const dys = Math.sin(a) * HAND_LEN_Y;
  const len2 = dxs * dxs + dys * dys * Y_SCALE * Y_SCALE;
  for (let cy = 0; cy < CLOCK_H; cy++) {
    for (let cx = 0; cx < CLOCK_W; cx++) {
      if (ring[cy][cx]) continue;
      let bits = 0;
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const px = cx + (dx + 0.5) / 2;
          const py = cy + (dy + 0.5) / 4;
          let t = ((px - x0) * dxs + (py - y0) * dys * Y_SCALE * Y_SCALE) / len2;
          t = Math.min(1, Math.max(0, t));
          const qx = x0 + dxs * t;
          const qy = y0 + dys * t;
          if (Math.hypot(px - qx, (py - qy) * Y_SCALE) <= HAND_HALF) {
            bits |= DOT_BITS[dy][dx];
          }
        }
      }
      if (bits) grid[cy][cx] = String.fromCharCode(0x2800 + bits);
    }
  }
  const tx = Math.round(Math.cos(a) * HAND_LEN_X);
  const ty = Math.round(Math.sin(a) * HAND_LEN_Y);
  const hx = CLOCK_CX + tx;
  const hy = CLOCK_CY + ty;
  if (!ring[hy][hx]) grid[hy][hx] = TIP[sector];
  grid[CLOCK_CY][CLOCK_CX] = "•";
  return grid.map((row) => row.join("").replace(/\s+$/, "")).join("\n");
}

// Cursor closer than this to the clock center keeps the hand at 12.
const HAND_DEADZONE = 40;
// Sector 6 = North = 12 o'clock.
const REST_SECTOR = 6;

function sectorToward(clientX, clientY, rect) {
  const dx = clientX - (rect.left + rect.width / 2);
  const dy = clientY - (rect.top + rect.height / 2);
  if (Math.hypot(dx, dy) < HAND_DEADZONE) return REST_SECTOR;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
  return ((Math.round(deg / 45) % 8) + 8) % 8;
}

function initClock() {
  const art = $("ascii");
  if (!art) return;
  art.textContent = renderClock(REST_SECTOR);
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia?.("(pointer: coarse)").matches) return;

  let sector = REST_SECTOR;
  const point = (clientX, clientY) => {
    const rect = art.getBoundingClientRect();
    if (!rect.width && !rect.height) return;
    const next = sectorToward(clientX, clientY, rect);
    if (next !== sector) {
      sector = next;
      art.textContent = renderClock(sector);
    }
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    point(event.clientX, event.clientY);
  });
  document.addEventListener("pointerleave", () => {
    sector = REST_SECTOR;
    art.textContent = renderClock(sector);
  });
}

// Fallback search engine URL, only used when `chrome.search` API is unavailable
// (e.g. page opened directly as file:// for development). In the extension,
// search uses the browser's default search engine via `chrome.search.query()`.
// The query is appended URL-encoded after this string.
const SEARCH_URL = "https://www.google.com/search?q=";

// Default links shown when browsing history is unavailable or empty.
const LINKS = [
  { name: "github", url: "https://github.com/" },
  { name: "youtube", url: "https://youtube.com/" },
  { name: "linkedin", url: "https://linkedin.com/" },
  { name: "gmail", url: "https://mail.google.com/" },
];

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const $ = (id) => document.getElementById(id);

const datetimeDateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function renderDatetime() {
  const now = new Date();
  const value = `${datetimeDateFmt.format(now)} ${timeFmt.format(now)}`;
  if ($("ff-datetime").textContent !== value) {
    $("ff-datetime").textContent = value;
  }
}

async function detectBrowser() {
  try {
    if (navigator.brave && typeof navigator.brave.isBrave === "function") {
      if (await navigator.brave.isBrave()) return "Brave";
    }
  } catch {
    /* no-op */
  }
  const brands = navigator.userAgentData?.brands;
  if (brands) {
    const preferred = ["Opera", "Microsoft Edge", "Vivaldi", "Brave", "Chromium", "Google Chrome"];
    for (const name of preferred) {
      const b = brands.find((x) => x.brand.includes(name));
      if (b) return b.brand;
    }
  }
  const m = navigator.userAgent.match(/(Edg|Chrome|Firefox|Safari)/);
  return m ? (m[1] === "Edg" ? "Edge" : m[1]) : "unknown";
}

function isPrivateIPv4(ip) {
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

function detectLocalIP() {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ip) => {
      if (done) return;
      done = true;
      try { pc.close(); } catch { /* no-op */ }
      resolve(ip);
    };
    let pc;
    try {
      pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel("");
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => finish(""));
      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          finish("");
          return;
        }
        const m = event.candidate.candidate.match(/\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/);
        if (m && isPrivateIPv4(m[1])) finish(m[1]);
      };
      setTimeout(() => finish(""), 2000);
    } catch {
      finish("");
    }
  });
}

function renderColors() {
  const el = $("ff-colors");
  el.innerHTML = "";
  for (const color of COLORS) {
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = color;
    el.appendChild(swatch);
  }
}

function renderFastfetch() {
  $("ff-user").textContent = USER;
  $("ff-os").textContent = OS;
  $("ff-dewm").textContent = DE_WM;
  $("ff-font").textContent = FONT;
  $("ff-ip").textContent = LOCAL_IP || "\u2014";
  renderColors();
  // Slow async lookups update in place so first paint is never blocked.
  detectBrowser().then((name) => {
    $("ff-browser").textContent = name;
  });
  detectLocalIP().then((ip) => {
    if (ip) $("ff-ip").textContent = ip;
  });
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function renderDefaultLinks() {
  const nav = $("links");
  for (const { name, url } of LINKS) {
    const a = document.createElement("a");
    a.className = "link";
    a.href = url;
    const host = document.createElement("span");
    host.className = "link-host";
    host.textContent = name;
    const title = document.createElement("span");
    title.className = "link-title";
    title.textContent = url;
    a.append(host, title);
    nav.appendChild(a);
  }
}

async function renderRecentLinks() {
  const nav = $("links");
  nav.innerHTML = "";
  if (!globalThis.chrome?.history) {
    renderDefaultLinks();
    return;
  }
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let items;
  try {
    items = await chrome.history.search({
      text: "",
      startTime: since,
      maxResults: 20,
    });
  } catch {
    renderDefaultLinks();
    return;
  }
  const seen = new Set();
  let count = 0;
  for (const item of items) {
    if (!item.url || seen.has(item.url)) continue;
    if (/^(chrome|chrome-extension|brave|edge|devtools|about|view-source):/.test(item.url)) {
      continue;
    }
    seen.add(item.url);
    const title = item.title && item.title.trim() ? item.title.trim() : hostnameOf(item.url);
    const a = document.createElement("a");
    a.className = "link";
    a.href = item.url;
    const host = document.createElement("span");
    host.className = "link-host";
    host.textContent = hostnameOf(item.url);
    const name = document.createElement("span");
    name.className = "link-title";
    name.textContent = title;
    a.append(host, name);
    nav.appendChild(a);
    if (++count >= 5) break;
  }
  if (count === 0) {
    renderDefaultLinks();
  }
}

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------

const form = $("search-form");
const input = $("search-input");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    input.focus();
    return;
  }
  // Use the browser's default search engine when running as extension.
  if (globalThis.chrome?.search?.query) {
    chrome.search.query({ text: query, disposition: "CURRENT_TAB" });
  } else {
    window.location.href = SEARCH_URL + encodeURIComponent(query);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== input) {
    event.preventDefault();
    input.focus();
  }
  if (event.key === "Escape" && document.activeElement === input) {
    input.value = "";
  }
});

// ---------------------------------------------------------------------------
// Cursor glow — a soft light that trails the pointer over the dot grid.
// Skipped entirely for reduced-motion users and touch-only devices.
// ---------------------------------------------------------------------------

// Pixel glow: paint the light on a tiny canvas, then upscale it with
// `image-rendering: pixelated` so the circle breaks into chunky pixels
// instead of a smooth round gradient.
const PIXEL_GLOW_SIZE = 64;

function buildPixelGlow(glow) {
  const canvas = document.createElement("canvas");
  canvas.width = PIXEL_GLOW_SIZE;
  canvas.height = PIXEL_GLOW_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const r = PIXEL_GLOW_SIZE / 2;
  const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, "rgba(203, 166, 247, 0.25)");
  grad.addColorStop(1, "rgba(203, 166, 247, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, PIXEL_GLOW_SIZE, PIXEL_GLOW_SIZE);
  glow.style.backgroundImage = `url(${canvas.toDataURL()})`;
}

function initCursorGlow() {
  const glow = $("cursor-glow");
  if (!glow) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia?.("(pointer: coarse)").matches) return;
  try {
    buildPixelGlow(glow);
  } catch {
    /* keep the CSS gradient fallback */
  }

  let tx = -480, ty = -480; // target (pointer)
  let x = tx, y = ty;       // rendered (lerped)
  let raf = 0;

  const tick = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.transform = `translate3d(${x - 240}px, ${y - 240}px, 0)`;
    if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    tx = event.clientX;
    ty = event.clientY;
    glow.classList.add("is-visible");
    kick();
  });
  document.addEventListener("pointerleave", () => {
    glow.classList.remove("is-visible");
  });
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

renderFastfetch();
renderDatetime();
renderRecentLinks();
initClock();
initCursorGlow();
input.focus();

setInterval(renderDatetime, 1000);
