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

    // --- Galaxy Background ---
    const sidebar = document.getElementById('sidebar');
    sidebar.style.backgroundColor = '#050505';

    // --- Galaxy Effect (inspired by reactbits.dev/backgrounds/galaxy) ---
    const canvas = document.createElement('canvas');
    canvas.id = 'galaxy-canvas';
    Object.assign(canvas.style, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
    });
    sidebar.prepend(canvas);

    // Keep sidebar content above the canvas
    Array.from(sidebar.children).forEach(child => {
        if (child !== canvas) {
            child.style.position = 'relative';
            child.style.zIndex = 1;
        }
    });

    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 200;

    const initGalaxy = () => {
        canvas.width = sidebar.clientWidth;
        canvas.height = sidebar.clientHeight;
        stars = [];
        const maxRadius = Math.max(canvas.width, canvas.height) / 2;
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                angle: Math.random() * Math.PI * 2,
                radius: Math.random() * maxRadius,
                speed: 0.0005 + Math.random() * 0.0015,
                size: Math.random() * 1.5 + 0.5,
                hue: 200 + Math.random() * 140 // blue to magenta
            });
        }
    };

    window.addEventListener('resize', initGalaxy);
    initGalaxy();

    const drawGalaxy = () => {
        ctx.fillStyle = 'rgba(5,5,10,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'lighter';
        stars.forEach(star => {
            star.angle += star.speed;
            const x = canvas.width / 2 + Math.cos(star.angle) * star.radius;
            const y = canvas.height / 2 + Math.sin(star.angle) * star.radius * 0.6;

            ctx.beginPath();
            ctx.fillStyle = `hsla(${star.hue}, 80%, 80%, 0.8)`;
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(drawGalaxy);
    };

    drawGalaxy();
});
