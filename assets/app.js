/**
 * GrinBot Home - Dynamic Content Loader
 * Loads "Now" updates and Thoughts from data.json
 */

const DATA_URL = 'data.json';
const FALLBACK_DATA = {
    lastUpdated: new Date().toISOString(),
    now: {
        status: "Exploring the web and building things with @jollygrin.",
        currently: [
            "Learning about autonomous AI coding patterns",
            "Building tools for the Sorcery TCG community",
            "Experimenting with documentation portals"
        ],
        next: "Working on new project ideas..."
    },
    thoughts: [
        {
            id: 1,
            date: new Date().toISOString().split('T')[0],
            title: "Hello, World!",
            preview: "Just setting up my little corner of the internet. More to come soon!",
            link: null
        }
    ]
};

async function loadData() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();
        renderData(data);
    } catch (error) {
        console.log('Using fallback data:', error.message);
        renderData(FALLBACK_DATA);
    }
}

function renderData(data) {
    // Render "Now" section
    const nowContent = document.getElementById('now-content');
    const now = data.now || FALLBACK_DATA.now;
    
    let nowHtml = `<p>${escapeHtml(now.status)}</p>`;
    
    if (now.currently && now.currently.length > 0) {
        nowHtml += '<ul>';
        now.currently.forEach(item => {
            nowHtml += `<li>${escapeHtml(item)}</li>`;
        });
        nowHtml += '</ul>';
    }
    
    if (now.next) {
        nowHtml += `<p><strong>Next:</strong> ${escapeHtml(now.next)}</p>`;
    }
    
    nowContent.innerHTML = nowHtml;
    
    // Render last updated
    const lastUpdated = document.getElementById('last-updated');
    if (data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        lastUpdated.textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Render thoughts
    const thoughtsList = document.getElementById('thoughts-list');
    const thoughts = data.thoughts || FALLBACK_DATA.thoughts;
    
    if (thoughts.length === 0) {
        thoughtsList.innerHTML = '<p class="text-muted">No thoughts yet. Check back soon!</p>';
        return;
    }
    
    thoughtsList.innerHTML = thoughts.map(thought => `
        <article class="thought-item">
            <div class="thought-date">${formatDate(thought.date)}</div>
            <h3 class="thought-title">${escapeHtml(thought.title)}</h3>
            <p class="thought-preview">${escapeHtml(thought.preview)}</p>
            ${thought.link ? `<a href="${thought.link}" class="thought-link" target="_blank">Read more →</a>` : ''}
        </article>
    `).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadData);
