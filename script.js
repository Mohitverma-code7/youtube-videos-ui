// Neo Brutalist YouTube Videos JS
const API_URL = 'https://api.freeapi.app/api/v1/public/youtube/videos';
const GRID = document.getElementById('videos-grid');
const LOADING = document.getElementById('loading');
const ERROR = document.getElementById('error');
const NO_RESULTS = document.getElementById('no-results');
const RETRY_BTN = document.getElementById('retry');

let videos = [];

// Fetch videos
async function fetchVideos() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        
        // Assume structure: data.videos or data.results array - adjust based on actual
        videos = data.videos || data.results || data || [];
        renderVideos();
    } catch (err) {
        console.error(err);
        showError();
    }
}

// Render video cards
function renderVideos() {
    hideAllStates();
    
    if (videos.length === 0) {
        NO_RESULTS.classList.remove('hidden');
        return;
    }
    
    GRID.innerHTML = videos.map(video => createCard(video)).join('');
    GRID.classList.remove('hidden');
}

// Create brutalist card
function createCard(video) {
    // Adapt fields based on API - common YouTube-like: id, title, channel, thumbnail, views, duration
    const title = video.title || 'Untitled';
    const channel = video.channel?.title || video.channel || 'Unknown Channel';
    const thumb = video.thumbnail?.url || video.thumbnails?.[0]?.url || 'https://via.placeholder.com/400x225/000/fff?text=No+Image';
    const views = video.views || 0;
    const duration = video.duration || 'N/A';
    const id = video.id || '';

    return `
        <article class="video-card group cursor-pointer" onclick="window.open('https://youtube.com/watch?v=${id}', '_blank')">
            <img src="${thumb}" alt="${title}" loading="lazy" />
            <div class="video-info">
                <h3 class="title">${title}</h3>
                <div class="channel">${channel}</div>
                <div class="stats">
                    <span class="badge">${formatViews(views)}</span>
                    <span class="badge">${duration}</span>
                </div>
            </div>
        </article>
    `;
}

// Utils
function formatViews(views) {
    if (!views) return '0 views';
    const num = parseInt(views);
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num + ' views';
}

function showLoading() {
    hideAllStates();
    LOADING.classList.remove('hidden');
    LOADING.classList.add('animate-pulse-brutal');
}

function showError() {
    hideAllStates();
    ERROR.classList.remove('hidden');
}

function hideAllStates() {
    GRID.classList.add('hidden');
    LOADING.classList.add('hidden');
    ERROR.classList.add('hidden');
    NO_RESULTS.classList.add('hidden');
}

// Event listeners
RETRY_BTN.addEventListener('click', fetchVideos);

// Init
document.addEventListener('DOMContentLoaded', fetchVideos);
