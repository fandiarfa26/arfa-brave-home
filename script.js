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

// ASCII art shown beside the `$ fetch` info (from ASCII-ART.md).
const ASCII_ART = `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠉⣻⣿⣿⣿⣿⣿⣿⣿⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣏⣉⣉⣉⡉⠉⠁
⢠⡄⠀⠀⠀⠀⠀⠀⠀⠀⢠⣼⣿⣿⣿⣿⡟⠛⠛⠛⠛⠃⠀⠀
⢸⣇⣀⠀⠀⠀⠀⣀⣀⣿⣿⣿⣿⣿⣿⣿⣇⣀⣀⠀⠀⠀⠀⠀
⢸⣿⣿⣴⠀⢰⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠻⣿⠀⠀⠀⠀⠀
⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀
⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠉⢹⣿⣿⢿⣿⡿⢿⣯⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡟⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠸⠿⠿⠀⠀⠀⠸⠿⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

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
  return a === 10 || a === 192 && b === 168 || a === 172 && b >= 16 && b <= 31;
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
  for (const color of COLORS) {
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = color;
    el.appendChild(swatch);
  }
}

async function renderFastfetch() {
  $("ascii").textContent = ASCII_ART;
  $("ff-user").textContent = USER;
  $("ff-os").textContent = OS;
  $("ff-dewm").textContent = DE_WM;
  $("ff-font").textContent = FONT;
  $("ff-browser").textContent = await detectBrowser();
  $("ff-ip").textContent = (await detectLocalIP()) || LOCAL_IP || "\u2014";
  renderColors();
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
  if (!chrome?.history) {
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
  if (chrome?.search?.query) {
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
// Init
// ---------------------------------------------------------------------------

renderFastfetch();
renderDatetime();
renderRecentLinks();
input.focus();

setInterval(renderDatetime, 1000);
