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
            { r: 300, hue: 200, sat: 88, alpha: 0.55, spd: 0.95 }, // deep blue
            { r: 280, hue: 185, sat: 90, alpha: 0.55, spd: 1.05 }, // teal
            { r: 290, hue: 265, sat: 86, alpha: 0.55, spd: 0.90 }, // purple
            { r: 270, hue: 320, sat: 85, alpha: 0.52, spd: 1.10 }, // magenta
            { r: 310, hue: 30,  sat: 92, alpha: 0.50, spd: 1.00 }  // amber
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
                const sp = b.spd;
                const K = t / 1000;
                // Wider motion range
                const ampX = 0.65;
                const ampY = 0.60;
                const x = (0.5 + ampX * Math.sin(K * sp + i * 0.9)) * w;
                const y = (0.5 + ampY * Math.cos(K * sp * 0.92 + i * 1.1)) * h;

                // Vary radius and brightness over time for broader light change
                const r = b.r * (0.88 + 0.28 * Math.sin(K * sp * 1.35 + i * 0.7));
                const alpha = b.alpha * (0.60 + 0.40 * Math.sin(K * sp * 1.7 + i * 0.5 + 0.5));

                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                // darker lightness, multi-hue palette
                grad.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, 48%, ${Math.max(0, alpha)})`);
                grad.addColorStop(0.6, `hsla(${b.hue}, ${b.sat}%, 35%, ${Math.max(0, alpha * 0.5)})`);
                grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
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
