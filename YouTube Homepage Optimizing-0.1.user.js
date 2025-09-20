// ==UserScript==
// @name         YouTube Homepage Optimizing
// @version      0.1
// @description  Forces YouTube homepage to display 4 videos per row, removes Top News and Shorts.
// @match        https://www.youtube.com/*
// ==/UserScript==

(function() {
    'use strict';

    const styleId = 'youtube-4-videos-custom';
    let isStyleApplied = false;

    function applyCustomLayout() {
        const richGrid = document.querySelector('ytd-rich-grid-renderer');
        if (richGrid) {
            richGrid.style.setProperty('--ytd-rich-grid-items-per-row', '4', 'important');
        }

        // Remove Top News and Shorts shelves to prevent empty slots
        const topNewsShelves = document.querySelectorAll('ytd-rich-shelf-renderer[title="Top news"], ytd-rich-shelf-renderer[is-news-shelf]');
        topNewsShelves.forEach(shelf => shelf.remove());

        const shortsShelves = document.querySelectorAll('ytd-reel-shelf-renderer, #reel-shelf-1, ytd-rich-shelf-renderer[title="Shorts"], ytd-shelf-renderer[title="Shorts"], ytd-rich-grid-slim-media[is-short], ytd-rich-grid-media[is-short], [is-shorts], [is-shorts-shelf], yt-horizontal-list-renderer.style-scope.ytd-reel-shelf-renderer');
        shortsShelves.forEach(shelf => shelf.remove());

        if (isStyleApplied) return; // Skip if already applied

        if (document.getElementById(styleId)) return; // Style already exists

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #contents.ytd-rich-grid-renderer {
                display: grid !important;
                grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                gap: 16px !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 16px 0 0 !important;
                margin: 0 auto !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
                justify-items: stretch !important;
            }

            ytd-rich-item-renderer {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
            }

            @media (max-width: 1400px) {
                #contents.ytd-rich-grid-renderer {
                    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
                    gap: 8px !important;
                    padding: 0 8px 0 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
        isStyleApplied = true;
    }

    // Apply on initial load
    window.addEventListener('load', applyCustomLayout, { once: true });

    // Reapply on YouTube navigation events
    window.addEventListener('yt-navigate-finish', applyCustomLayout);

    // Optimized MutationObserver for dynamic changes
    const targetNode = document.querySelector('#contents') || document.body;
    const observer = new MutationObserver(applyCustomLayout);
    observer.observe(targetNode, { childList: true, subtree: true });

    // Initial application
    applyCustomLayout();
})();