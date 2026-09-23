const stories = [
    {
        id: "the-gift-of-the-magi",
        title: "The Gift of the Magi",
        author: "O. Henry",
        description: "A classic short story about love and sacrifice.",
        file: "stories/the-gift-of-the-magi.txt"
    },
    {
        id: "the-yellow-wallpaper",
        title: "The Yellow Wallpaper",
        author: "Charlotte Perkins Gilman",
        description: "About a wallaper that is yellow.",
        file: "stories/the-yellow-wallpaper.txt"
    },
    {
        id: "walter-mitty",
        title: "The Secret Life of Walter Mitty",
        author: "James Thurber ",
        description: "About a secret life.",
        file: "stories/walter-mitty.txt"
    },
];


/* ------------------------------
   Landing page
------------------------------ */

function renderStoryList() {
    const storyList = document.querySelector(".story-list");

    if (!storyList) {
        return;
    }

    storyList.innerHTML = "";

    stories.forEach(story => {
        const link = document.createElement("a");

        link.href = `story.html?story=${encodeURIComponent(story.id)}`;
        link.className = "story-card";

        link.innerHTML = `
            <div>
                <h2>${escapeHtml(story.title)}</h2>
                <p>${escapeHtml(story.author)}</p>
            </div>

            <span class="arrow">→</span>
        `;

        storyList.appendChild(link);
    });
}


/* ------------------------------
   Story page
------------------------------ */

async function loadStory() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("story");

    const story = stories.find(story => story.id === id);

    if (!story) {
        showStoryError("Story not found.");
        return;
    }

    document.title = `${story.title} — Short Stories`;

    document.querySelector(".story-title").textContent = story.title;
    document.querySelector(".story-author").textContent = story.author;

    try {
        const response = await fetch(story.file, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${response.statusText}`
            );
        }

        const text = await response.text();

        const storyText = document.querySelector(".story-text");

        // Blank lines separate paragraphs.
        const paragraphs = text
            .trim()
            .split(/\r?\n\s*\r?\n/)
            .filter(paragraph => paragraph.trim() !== "");

        storyText.innerHTML = paragraphs
            .map(paragraph => `<p>${escapeHtml(paragraph.trim())}</p>`)
            .join("");

    } catch (error) {
        console.error("Unable to load story:", error);

        showStoryError(
            "Unable to load this story. Check the browser console for details."
        );
    }
}


function showStoryError(message) {
    const story = document.querySelector(".story");

    if (!story) {
        return;
    }

    story.innerHTML = `
        <p class="eyebrow">Short Story</p>

        <h1>Oops</h1>

        <p class="story-text">${escapeHtml(message)}</p>

        <p>
            <a href="index.html" class="back-link">
                ← Back to all stories
            </a>
        </p>
    `;
}


/* ------------------------------
   Utility
------------------------------ */

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ------------------------------
   Initialization
------------------------------ */

if (document.querySelector(".story-list")) {
    renderStoryList();
}

if (document.querySelector(".story-title")) {
    loadStory();
}

