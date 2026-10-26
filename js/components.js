/**
 * ==========================================================================
 * Practical 4: JavaScript DOM Manipulation, Event Handling, and UI Interactivity
 * Problem Definition: Add dynamic UI components such as collapsible FAQ,
 * modal popup, image/content slider, notification banner, hamburger menu,
 * and light/dark theme switcher using JavaScript.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all Practical 4 UI components
    initThemeSwitcher();
    initHamburgerMenu();
    initNotificationBanner();
    initModalPopup();
    initContentSlider();
    initCollapsibleFAQ();
});

/* -------------------------------------------------------------------------- */
/* Component 1: Light / Dark Theme Switcher with LocalStorage Persistence     */
/* -------------------------------------------------------------------------- */
function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    const themeText = themeToggleBtn.querySelector('.theme-text');

    // Retrieve saved theme or check user OS preference
    const savedTheme = localStorage.getItem('studenthub_theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Apply initial theme
    applyTheme(initialTheme);

    // Event listener for theme toggle button click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('studenthub_theme', theme);

        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.innerHTML = '&#9728;'; // Sun icon
                themeText.textContent = 'Light Mode';
            } else {
                themeIcon.innerHTML = '&#9790;'; // Moon icon
                themeText.textContent = 'Dark Mode';
            }
        }
    }
}

/* -------------------------------------------------------------------------- */
/* Component 2: Responsive Hamburger Menu Navigation Toggle                   */
/* -------------------------------------------------------------------------- */
function initHamburgerMenu() {
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');

    if (!navToggle || !primaryNav) return;

    // Toggle menu state on button click
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        setMenuState(!isExpanded);
    });

    // Close menu when clicking on any nav link (important for mobile UX)
    const navLinks = primaryNav.querySelectorAll('.nav-link, .btn');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                setMenuState(false);
            }
        });
    });

    // Close menu when clicking outside of the navigation container
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && primaryNav.classList.contains('nav-open')) {
            if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
                setMenuState(false);
            }
        }
    });

    // Close menu when resizing to desktop width
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            setMenuState(false);
        }
    });

    function setMenuState(open) {
        navToggle.setAttribute('aria-expanded', String(open));
        if (open) {
            primaryNav.classList.add('nav-open');
        } else {
            primaryNav.classList.remove('nav-open');
        }
    }
}

/* -------------------------------------------------------------------------- */
/* Component 3: Dismissible Notification Banner with Session Memory           */
/* -------------------------------------------------------------------------- */
function initNotificationBanner() {
    const banner = document.getElementById('announcementBanner');
    const closeBtn = document.getElementById('closeBannerBtn');

    if (!banner || !closeBtn) return;

    // Check if user previously dismissed banner in this session
    if (sessionStorage.getItem('studenthub_banner_dismissed') === 'true') {
        banner.classList.add('dismissed');
        return;
    }

    // Dismiss banner on close button click
    closeBtn.addEventListener('click', () => {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            banner.classList.add('dismissed');
            sessionStorage.setItem('studenthub_banner_dismissed', 'true');
        }, 300);
    });
}

/* -------------------------------------------------------------------------- */
/* Component 4: Accessible Modal Dialog Popup (Events Tour / Announcements)   */
/* -------------------------------------------------------------------------- */
function initModalPopup() {
    const openBtn = document.getElementById('openModalBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('closeModalBtn');
    const dismissBtn = document.getElementById('modalDismissBtn');

    if (!modalBackdrop) return;

    let previousActiveElement = null;

    // Open modal event handler
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            openModal();
        });
    }

    // Close modal via close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    // Close modal via dismiss button
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    // Close modal when clicking on backdrop outside modal dialog
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    // Close modal when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
            closeModal();
        }
    });

    function openModal() {
        previousActiveElement = document.activeElement;
        modalBackdrop.classList.add('open');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Focus the first focusable element inside the modal
        if (closeBtn) {
            closeBtn.focus();
        }
    }

    function closeModal() {
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Restore focus to button that opened modal
        if (previousActiveElement) {
            previousActiveElement.focus();
        }
    }
}

/* -------------------------------------------------------------------------- */
/* Component 5: Content & Image Carousel / Slider with Auto-Play & Controls   */
/* -------------------------------------------------------------------------- */
function initContentSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 4500; // 4.5 seconds

    // Dynamically generate navigation dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Navigate to slide ${idx + 1}`);
            dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                goToSlide(idx);
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Previous slide button listener
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartAutoplay();
        });
    }

    // Next slide button listener
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartAutoplay();
        });
    }

    function updateSliderDOM() {
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            }
        });

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-selected', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.setAttribute('aria-selected', 'false');
                }
            });
        }
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateSliderDOM();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Pause autoplay on mouse hover, resume on mouse leave
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Initial start
    startAutoplay();
}

/* -------------------------------------------------------------------------- */
/* Component 6: Accessible Collapsible FAQ Accordion with Search Filter       */
/* -------------------------------------------------------------------------- */
function initCollapsibleFAQ() {
    const accordion = document.getElementById('faqAccordion');
    if (!accordion) return;

    const items = accordion.querySelectorAll('.accordion-item');
    const expandAllBtn = document.getElementById('expandAllFaqsBtn');
    const collapseAllBtn = document.getElementById('collapseAllFaqsBtn');
    const searchInput = document.getElementById('faqSearchInput');

    // Attach click listeners to each accordion trigger
    items.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const panel = item.querySelector('.accordion-panel');

        if (!trigger || !panel) return;

        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            toggleItem(trigger, panel, !isExpanded);
        });

        // Keyboard navigation (Enter / Space already native for button)
    });

    function toggleItem(trigger, panel, expand) {
        trigger.setAttribute('aria-expanded', String(expand));
        if (expand) {
            panel.removeAttribute('hidden');
        } else {
            panel.setAttribute('hidden', '');
        }
    }

    // Expand All Button
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => {
            items.forEach(item => {
                const trigger = item.querySelector('.accordion-trigger');
                const panel = item.querySelector('.accordion-panel');
                if (trigger && panel) toggleItem(trigger, panel, true);
            });
        });
    }

    // Collapse All Button
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
            items.forEach(item => {
                const trigger = item.querySelector('.accordion-trigger');
                const panel = item.querySelector('.accordion-panel');
                if (trigger && panel) toggleItem(trigger, panel, false);
            });
        });
    }

    // Live FAQ Question Search Filter
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            items.forEach(item => {
                const titleText = item.querySelector('.accordion-title')?.textContent.toLowerCase() || '';
                const bodyText = item.querySelector('.accordion-body')?.textContent.toLowerCase() || '';
                
                if (titleText.includes(query) || bodyText.includes(query)) {
                    item.style.display = 'block';
                    if (query.length > 2) {
                        // Automatically open matching answers for convenience
                        const trigger = item.querySelector('.accordion-trigger');
                        const panel = item.querySelector('.accordion-panel');
                        if (trigger && panel) toggleItem(trigger, panel, true);
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}
