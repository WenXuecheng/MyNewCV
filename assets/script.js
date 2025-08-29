document.addEventListener('DOMContentLoaded', () => {
    const langSwitcher = document.querySelector('.lang-switcher');
    const allTranslatableElements = document.querySelectorAll('[data-key]');

    const setLanguage = (lang) => {
        // Update text content
        allTranslatableElements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        // Update active class on switcher
        const links = langSwitcher.querySelectorAll('a');
        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-lang') === lang) {
                link.classList.add('active');
            }
        });

        // Save preference
        localStorage.setItem('preferredLanguage', lang);
    };

    langSwitcher.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = e.target.getAttribute('data-lang');
        if (selectedLang) {
            setLanguage(selectedLang);
        }
    });

    // --- Initial Language Setup ---
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(preferredLanguage);

    // --- Plasma Canvas Background (dynamic) ---
    const sidebar = document.getElementById('sidebar');

    const startPlasma = (host) => {
        if (!host) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'plasma-canvas';
        Object.assign(canvas.style, {
            position: 'absolute', inset: '0', zIndex: '0', pointerEvents: 'none'
        });
        host.prepend(canvas);
        host.classList.add('plasma-enabled');

        const ctx = canvas.getContext('2d');
        const DPR = Math.min(window.devicePixelRatio || 1, 2);

        // Moving blob parameters
        const blobs = [
            { r: 260, hue: 178, sat: 95, alpha: 0.65, spd: 0.6, px: 0.15, py: 0.20 }, // cyan/teal
            { r: 230, hue: 265, sat: 86, alpha: 0.60, spd: 0.5, px: 0.85, py: 0.15 }, // purple
            { r: 230, hue: 345, sat: 85, alpha: 0.55, spd: 0.7, px: 0.30, py: 0.85 }, // pink
            { r: 250, hue: 50,  sat: 96, alpha: 0.45, spd: 0.4, px: 0.75, py: 0.75 }, // yellow
            { r: 220, hue: 205, sat: 90, alpha: 0.50, spd: 0.55, px: 0.50, py: 0.05 }  // blue
        ];

        let w = 0, h = 0, t0 = performance.now();

        const resize = () => {
            const cw = host.clientWidth;
            const ch = host.clientHeight;
            if (!cw || !ch) return;
            w = Math.floor(cw);
            h = Math.floor(ch);
            canvas.width = Math.floor(w * DPR);
            canvas.height = Math.floor(h * DPR);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        };

        const draw = (t) => {
            const dt = (t - t0) / 1000;
            t0 = t;

            // dark base to match sidebar
            ctx.fillStyle = '#0b1020';
            ctx.fillRect(0, 0, w, h);

            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < blobs.length; i++) {
                const b = blobs[i];
                const k = t / 1000 * b.spd;
                const x = (0.5 + 0.45 * Math.sin(k + i)) * w * b.px + (1 - b.px) * 0.5 * w;
                const y = (0.5 + 0.45 * Math.cos(k * 0.9 + i * 1.7)) * h * b.py + (1 - b.py) * 0.5 * h;

                const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r);
                // center color
                grad.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, 60%, ${b.alpha})`);
                grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, b.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';

            requestAnimationFrame(draw);
        };

        const start = () => {
            resize();
            requestAnimationFrame(draw);
        };

        const ro = new ResizeObserver(() => resize());
        ro.observe(host);
        window.addEventListener('resize', resize);
        start();
    };

    // start plasma on sidebar
    startPlasma(sidebar);
});
