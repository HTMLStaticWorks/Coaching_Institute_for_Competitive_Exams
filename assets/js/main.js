document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    const themeToggles = document.querySelectorAll('#themeToggle, .theme-toggle-btn');
    const root = document.documentElement;
    
    if (themeToggles.length > 0) {
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const currentTheme = root.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    root.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                } else {
                    root.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
            });
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        }
    }

    // RTL Toggle
    const rtlToggles = document.querySelectorAll('#rtlToggle, .rtl-toggle-btn');
    if (rtlToggles.length > 0) {
        rtlToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const currentDir = root.getAttribute('dir');
                if (currentDir === 'rtl') {
                    root.removeAttribute('dir');
                    localStorage.setItem('dir', 'ltr');
                } else {
                    root.setAttribute('dir', 'rtl');
                    localStorage.setItem('dir', 'rtl');
                }
            });
        });
        
        // Load saved dir
        const savedDir = localStorage.getItem('dir');
        if (savedDir === 'rtl') {
            root.setAttribute('dir', 'rtl');
        }
    }

    // Mobile Menu Restructuring
    const navbarContainer = document.querySelector('.navbar .container');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    // For main pages
    if (navbarContainer && navLinks && navActions && mobileToggle) {
        // Create navMenu wrapper
        const navMenu = document.createElement('div');
        navMenu.className = 'nav-menu';
        navMenu.id = 'navMenu';
        
        // Create Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-close-btn';
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('aria-label', 'Close Menu');
        
        // Assemble
        navMenu.appendChild(closeBtn);
        navbarContainer.insertBefore(navMenu, navLinks);
        navMenu.appendChild(navLinks);
        navMenu.appendChild(navActions);
        
        // Ensure mobile toggle is outside the hidden nav-menu
        navbarContainer.appendChild(mobileToggle);
        
        // Toggle logic
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.add('active');
        });
        
        closeBtn.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    }

    // For dashboard page: hamburger slides in the sidebar nav links
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    const dashboardMenuToggle = document.getElementById('dashboardMenuToggle');

    if (dashboardSidebar && dashboardMenuToggle) {
        dashboardMenuToggle.addEventListener('click', () => {
            dashboardSidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!dashboardSidebar.contains(e.target) && !dashboardMenuToggle.contains(e.target)) {
                dashboardSidebar.classList.remove('open');
            }
        });
    }

    // Intersection Observer for fade-up animations
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // Mouse Parallax Effect for Premium Hero
    const heroVisual = document.querySelector('.hero-premium-visual');
    const heroCard = document.querySelector('.hero-image-card');

    if (heroVisual && heroCard) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 30;
            const moveY = (y - centerY) / 30;

            heroCard.style.transform = `rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'rotateY(-5deg) rotateX(5deg)';
        });
    }

    // Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
