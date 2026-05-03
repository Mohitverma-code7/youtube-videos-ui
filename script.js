/* script.js */

const API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";

const GRID = document.getElementById("videos-grid");
const LOADING = document.getElementById("loading");
const ERROR = document.getElementById("error");
const NO_RESULTS = document.getElementById("no-results");
const RETRY_BTN = document.getElementById("retry");
const PAGE_NUM = document.getElementById("pageNum");

let videos = [];
let page = 1;
let totalPages = 1;
const perPage = 8;

/* ================= FETCH ALL PAGES ================= */
async function fetchVideos() {
  try {
    showLoading();

    let allVideos = [];
    let currentPage = 1;
    let total = 1;

    while (currentPage <= total) {

      const res = await fetch(`${API_URL}?page=${currentPage}&limit=10`);
      const json = await res.json();

      const pageVideos = json?.data?.data || [];

      const cleanVideos = pageVideos
        .map(item => item?.items)
        .filter(Boolean);

      allVideos = [...allVideos, ...cleanVideos];

      total = json?.data?.totalPages || 1;
      currentPage++;
    }

    videos = allVideos;
    totalPages = Math.ceil(videos.length / perPage);

    console.log("Total videos:", videos.length);
    console.log("Total pages:", totalPages);

    renderVideos();

  } catch (err) {
    console.log(err);
    showError();
  }
}

/* ================= RENDER ================= */
function renderVideos() {
  hideAll();

  if (!videos.length) {
    NO_RESULTS.classList.remove("hidden");
    return;
  }

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const currentVideos = videos.slice(start, end);

  GRID.innerHTML = currentVideos.map(createCard).join("");
  GRID.classList.remove("hidden");

  PAGE_NUM.innerText = `Page ${page} / ${totalPages}`;
}

/* ================= CARD ================= */
function createCard(video) {
  const snippet = video.snippet || {};
  const stats = video.statistics || {};

  const id = video.id;
  const title = snippet.title || "Untitled";
  const channel = snippet.channelTitle || "Unknown";

  const thumb =
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    "";

  const views = formatViews(stats.viewCount || 0);

  return `
    <div class="video-card"
    onclick="window.open('https://youtube.com/watch?v=${id}','_blank')">

      <div class="thumb-box">
        <img src="${thumb}">
      </div>

      <h3 class="video-title">${title}</h3>

      <p class="channel">@${channel}</p>

      <div class="bottom">
        <div class="small-box">${views}</div>
        <div class="watch-btn">Watch ▶</div>
      </div>

    </div>
  `;
}

/* ================= PAGINATION ================= */
function nextPage() {
  if (page < totalPages) {
    page++;
    renderVideos();
  }
}

function prevPage() {
  if (page > 1) {
    page--;
    renderVideos();
  }
}

window.nextPage = nextPage;
window.prevPage = prevPage;

/* ================= HELPERS ================= */
function formatViews(v) {
  const num = Number(v);

  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
}

function showLoading() {
  hideAll();
  LOADING.classList.remove("hidden");
}

function showError() {
  hideAll();
  ERROR.classList.remove("hidden");
}

function hideAll() {
  GRID.classList.add("hidden");
  LOADING.classList.add("hidden");
  ERROR.classList.add("hidden");
  NO_RESULTS.classList.add("hidden");
}

RETRY_BTN.addEventListener("click", fetchVideos);

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", fetchVideos);