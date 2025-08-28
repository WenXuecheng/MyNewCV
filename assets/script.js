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

    // --- Dynamic Gradient Background ---
    const sidebar = document.getElementById('sidebar');
    const startColor = [58, 12, 163]; // Deep Purple
    const endColor = [0, 180, 216];   // Bright Cyan

    let ticking = false;

    const updateGradient = () => {
        const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(window.scrollY / scrollMax, 1);

        const r = Math.floor(startColor[0] + (endColor[0] - startColor[0]) * scrollPercent);
        const g = Math.floor(startColor[1] + (endColor[1] - startColor[1]) * scrollPercent);
        const b = Math.floor(startColor[2] + (endColor[2] - startColor[2]) * scrollPercent);

        sidebar.style.background = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}), #121212 80%)`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateGradient);
            ticking = true;
        }
    });

    // Set initial gradient
    updateGradient();
});
