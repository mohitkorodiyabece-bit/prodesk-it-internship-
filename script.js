document.addEventListener('DOMContentLoaded', () => {

    // --- Dark / Light Theme Toggle System ---
    // Note: the actual theme class is applied by an inline script in <head>
    // *before* this file loads, so there is no flash of the wrong theme.
    // This block only needs to sync the icons/buttons and handle clicks.
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const themeIcon = document.getElementById('theme-icon');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    const htmlElement = document.documentElement;

    function safeSetItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            // localStorage can throw in private browsing / restricted contexts.
            // The site still works, it just won't remember the choice.
            console.warn('Could not persist theme preference:', e);
        }
    }

    function applyTheme(theme) {
        htmlElement.classList.remove('light', 'dark');
        htmlElement.classList.add(theme);

        const iconClass = theme === 'light' ? 'fa-solid fa-sun text-lg' : 'fa-solid fa-moon text-lg';
        if (themeIcon) themeIcon.className = iconClass;
        if (themeIconMobile) themeIconMobile.className = iconClass;
        if (themeToggleBtn) themeToggleBtn.setAttribute('aria-pressed', String(theme === 'light'));
        if (themeToggleMobileBtn) themeToggleMobileBtn.setAttribute('aria-pressed', String(theme === 'light'));
    }

    // Sync icons with whichever theme the head script already applied.
    applyTheme(htmlElement.classList.contains('light') ? 'light' : 'dark');

    function toggleTheme() {
        const nextTheme = htmlElement.classList.contains('light') ? 'dark' : 'light';
        safeSetItem('prodesk-theme', nextTheme);
        applyTheme(nextTheme);
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

    // --- Mobile Navigation Controller ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-link') : [];

    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.querySelector('i').className = 'fa-solid fa-xmark text-2xl';
        const firstLink = mobileMenu.querySelector('.mobile-link');
        if (firstLink) firstLink.focus();
    }

    function closeMobileMenu({ returnFocus = false } = {}) {
        if (mobileMenu.classList.contains('hidden')) return;
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.querySelector('i').className = 'fa-solid fa-bars text-2xl';
        if (returnFocus) menuBtn.focus();
    }

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
            isOpen ? closeMobileMenu() : openMobileMenu();
        });

        mobileLinks.forEach(link => link.addEventListener('click', () => closeMobileMenu()));

        // Close on outside click
        document.addEventListener('click', (event) => {
            const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
            if (!isOpen) return;
            if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
                closeMobileMenu();
            }
        });

        // Close on Escape, return focus to the toggle button
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
                closeMobileMenu({ returnFocus: true });
            }
        });
    }

    // --- Sticky Header Controller ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    // --- Scroll Reveal Performance Engine ---
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });
        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        // No IntersectionObserver support: just show everything immediately.
        revealElements.forEach(element => element.classList.add('active'));
    }

    // --- Scrollspy: highlight the nav link for the section in view ---
    const navLinks = document.querySelectorAll('[data-nav]');
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('active-nav', isActive);
                    link.classList.toggle('text-mutedText', !isActive);
                });
            });
        }, {
            rootMargin: '-45% 0px -45% 0px',
            threshold: 0
        });
        sections.forEach(section => spyObserver.observe(section));
    }

    // --- Auto-updating copyright year ---
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

});