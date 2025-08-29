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
});
