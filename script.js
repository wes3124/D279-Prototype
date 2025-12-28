// JavaScript for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add your JavaScript functionality here
    console.log('Figma site code loaded');
});

// Subnav behavior: rewrite data-anchor links and add mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const isIndex = location.pathname === '/' || location.pathname.endsWith('index.html');
    document.querySelectorAll('.subnav-link[data-anchor]').forEach(a => {
        const anchor = a.dataset.anchor;
        if (!anchor) return;
        a.href = isIndex ? `#${anchor}` : `index.html#${anchor}`;
    });

    document.querySelectorAll('.subnav').forEach(subnav => {
        const btn = subnav.querySelector('.subnav-toggle');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
            subnav.classList.toggle('open');
        });
    });
});

// Global image fallback: replace failed images with an inline SVG placeholder
(function() {
    const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

    function applyFallback(img) {
        if (!img) return;
        // store original src
        if (!img.dataset.originalUrl) img.dataset.originalUrl = img.src || '';
        img.addEventListener('error', function onErr() {
            if (img.src === ERROR_IMG_SRC) return; // avoid loop
            img.src = ERROR_IMG_SRC;
        }, { once: true });
        // if src is empty or missing, immediately set placeholder
        if (!img.src) img.src = ERROR_IMG_SRC;
    }

    document.addEventListener('DOMContentLoaded', function() {
        const imgs = Array.from(document.getElementsByTagName('img'));
        imgs.forEach(applyFallback);
    });
})();
