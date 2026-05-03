const API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";

const GRID = document.getElementById("videos-grid");
const LOADING = document.getElementById("loading");
const ERROR = document.getElementById("error");
const NO_RESULTS = document.getElementById("no-results");
const RETRY_BTN = document.getElementById("retry");

let videos = [];

/* ================= FETCH ================= */
async function fetchVideos() {
  try {
    showLoading();

    const res = await fetch(API_URL);
    const json = await res.json();

    console.log("RAW API:", json);

    // ✅ correct path
    const rawList = json?.data?.data || [];

    // ✅ extract real video objects
    videos = rawList
      .map((item) => item?.items)
      .filter(Boolean);

    console.log("PARSED VIDEOS:", videos);

    renderVideos();
  } catch (err) {
    console.error(err);
    showError();
  }
}

/* ================= RENDER ================= */
function renderVideos() {
  hideAllStates();

  if (!videos.length) {
    NO_RESULTS.classList.remove("hidden");
    return;
  }

  GRID.innerHTML = videos.map(createCard).join("");
  GRID.classList.remove("hidden");
}

/* ================= CARD ================= */
function createCard(video) {
  const snippet = video.snippet || {};
  const stats = video.statistics || {};

  const id = video.id;
  const title = snippet.title || "Untitled";
  const channel = snippet.channelTitle || "Unknown Channel";

  const thumb =
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    "";

  const views = stats.viewCount || 0;

  return `
    <div class="video-card" onclick="window.open('https://youtube.com/watch?v=${id}', '_blank')">
      <img src="${thumb}" alt="${title}" />
      
      <div class="info">
        <h3>${title}</h3>
        <p>${channel}</p>
        <span>${formatViews(views)}</span>
      </div>
    </div>
  `;
}

/* ================= UTILS ================= */
function formatViews(v) {
  const num = Number(v);
  if (num >= 1e6) return (num / 1e6).toFixed(1) + "M views";
  if (num >= 1e3) return (num / 1e3).toFixed(1) + "K views";
  return num + " views";
}

/* ================= UI STATES ================= */
function showLoading() {
  hideAllStates();
  LOADING.classList.remove("hidden");
}

function showError() {
  hideAllStates();
  ERROR.classList.remove("hidden");
}

function hideAllStates() {
  GRID.classList.add("hidden");
  LOADING.classList.add("hidden");
  ERROR.classList.add("hidden");
  NO_RESULTS.classList.add("hidden");
}

/* ================= EVENTS ================= */
RETRY_BTN.addEventListener("click", fetchVideos);

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", fetchVideos);