/**
 * ==========================================================================
 * Practical 4 – JavaScript DOM Manipulation, Event Handling & UI Interactivity
 * Covers: theme switcher, hamburger nav, banner dismiss, modal popup,
 *         image slider, FAQ accordion, profile edit, form submissions,
 *         login validation, admin export/approve, sidebar scroll links.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initHamburgerMenu();
    initNotificationBanner();
    initModalPopup();
    initContentSlider();
    initCollapsibleFAQ();

    // Page-specific handlers (all guard with null checks — safe on every page)
    initProfileEditButton();
    initContactForm();
    initFeedbackForm();
    initLoginForm();
    initAdminButtons();
    initSidebarScrollLinks();
});

/* -------------------------------------------------------------------------- */
/* 1. Light / Dark Theme Switcher                                             */
/* -------------------------------------------------------------------------- */
function initThemeSwitcher() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    const icon = btn.querySelector('.theme-icon');
    const text = btn.querySelector('.theme-text');

    const saved   = localStorage.getItem('studenthub_theme');
    const sysDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (sysDark ? 'dark' : 'light'));

    btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('studenthub_theme', theme);
        if (icon && text) {
            icon.innerHTML  = theme === 'dark' ? '&#9728;' : '&#9790;';
            text.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
    }
}

/* -------------------------------------------------------------------------- */
/* 2. Hamburger Menu Navigation Toggle                                        */
/* -------------------------------------------------------------------------- */
function initHamburgerMenu() {
    const toggle = document.getElementById('navToggle');
    const nav    = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        setState(open);
    });

    nav.querySelectorAll('.nav-link, .btn').forEach(link =>
        link.addEventListener('click', () => { if (window.innerWidth < 1024) setState(false); })
    );

    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && nav.classList.contains('nav-open')) {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) setState(false);
        }
    });

    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) setState(false); });

    function setState(open) {
        toggle.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('nav-open', open);
    }
}

/* -------------------------------------------------------------------------- */
/* 3. Dismissible Notification Banner                                         */
/* -------------------------------------------------------------------------- */
function initNotificationBanner() {
    const banner   = document.getElementById('announcementBanner');
    const closeBtn = document.getElementById('closeBannerBtn');
    if (!banner || !closeBtn) return;

    if (sessionStorage.getItem('studenthub_banner_dismissed') === 'true') {
        banner.classList.add('dismissed');
        return;
    }

    closeBtn.addEventListener('click', () => {
        banner.style.transition = 'opacity 0.3s ease';
        banner.style.opacity    = '0';
        setTimeout(() => {
            banner.classList.add('dismissed');
            sessionStorage.setItem('studenthub_banner_dismissed', 'true');
        }, 300);
    });
}

/* -------------------------------------------------------------------------- */
/* 4. Modal Popup – open / close / ESC / backdrop click                       */
/* -------------------------------------------------------------------------- */
function initModalPopup() {
    const backdrop   = document.getElementById('modalBackdrop');
    if (!backdrop) return;

    const openBtn    = document.getElementById('openModalBtn');
    const closeBtn   = document.getElementById('closeModalBtn');
    const dismissBtn = document.getElementById('modalDismissBtn');
    let   trigger    = null;

    const open = () => {
        trigger = document.activeElement;
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn?.focus();
    };
    const close = () => {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        trigger?.focus();
    };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    dismissBtn?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop.classList.contains('open')) close();
    });
}

/* -------------------------------------------------------------------------- */
/* 5. Image/Content Slider with Autoplay, Arrows, and Dots                   */
/* -------------------------------------------------------------------------- */
function initContentSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const slides  = slider.querySelectorAll('.slide');
    if (!slides.length) return;

    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsEl  = document.getElementById('sliderDots');

    let idx   = 0;
    let timer = null;

    // Build dots
    if (dotsEl) {
        dotsEl.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.setAttribute('aria-selected', String(i === 0));
            dot.addEventListener('click', () => { goTo(i); reset(); });
            dotsEl.appendChild(dot);
        });
    }

    prevBtn?.addEventListener('click', () => { goTo(idx - 1); reset(); });
    nextBtn?.addEventListener('click', () => { goTo(idx + 1); reset(); });
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', start);

    function goTo(i) {
        idx = (i + slides.length) % slides.length;
        slides.forEach((s, j) => {
            s.classList.toggle('active', j === idx);
            s.setAttribute('aria-hidden', String(j !== idx));
        });
        dotsEl?.querySelectorAll('.dot').forEach((d, j) => {
            d.classList.toggle('active', j === idx);
            d.setAttribute('aria-selected', String(j === idx));
        });
    }

    function start() { clearInterval(timer); timer = setInterval(() => goTo(idx + 1), 4500); }
    function reset() { clearInterval(timer); start(); }
    start();
}

/* -------------------------------------------------------------------------- */
/* 6. Collapsible FAQ Accordion with Live Search                              */
/* -------------------------------------------------------------------------- */
function initCollapsibleFAQ() {
    const accordion = document.getElementById('faqAccordion');
    if (!accordion) return;

    const items      = accordion.querySelectorAll('.accordion-item');
    const expandAll  = document.getElementById('expandAllFaqsBtn');
    const collapseAl = document.getElementById('collapseAllFaqsBtn');
    const search     = document.getElementById('faqSearchInput');

    items.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const panel   = item.querySelector('.accordion-panel');
        if (!trigger || !panel) return;
        trigger.addEventListener('click', () => {
            setPanel(trigger, panel, trigger.getAttribute('aria-expanded') !== 'true');
        });
    });

    function setPanel(trigger, panel, expand) {
        trigger.setAttribute('aria-expanded', String(expand));
        expand ? panel.removeAttribute('hidden') : panel.setAttribute('hidden', '');
    }

    expandAll?.addEventListener('click', () =>
        items.forEach(i => {
            const t = i.querySelector('.accordion-trigger');
            const p = i.querySelector('.accordion-panel');
            if (t && p) setPanel(t, p, true);
        })
    );

    collapseAl?.addEventListener('click', () =>
        items.forEach(i => {
            const t = i.querySelector('.accordion-trigger');
            const p = i.querySelector('.accordion-panel');
            if (t && p) setPanel(t, p, false);
        })
    );

    search?.addEventListener('input', () => {
        const q = search.value.toLowerCase().trim();
        items.forEach(item => {
            const text = (item.querySelector('.accordion-title')?.textContent || '')
                       + (item.querySelector('.accordion-body')?.textContent  || '');
            const match = !q || text.toLowerCase().includes(q);
            item.style.display = match ? '' : 'none';
            if (match && q.length > 1) {
                const t = item.querySelector('.accordion-trigger');
                const p = item.querySelector('.accordion-panel');
                if (t && p) setPanel(t, p, true);
            }
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 7. Profile Edit Toggle                                                     */
/* -------------------------------------------------------------------------- */
function initProfileEditButton() {
    const editBtn = document.getElementById('editProfileBtn');
    if (!editBtn) return;

    let editing = false;

    editBtn.addEventListener('click', () => {
        editing = !editing;
        const bio = document.querySelector('.bio-text');

        if (editing) {
            editBtn.innerHTML = '&#10003; Save Profile';
            editBtn.classList.remove('btn-primary');
            editBtn.classList.add('btn-secondary');
            if (bio) {
                bio.setAttribute('contenteditable', 'true');
                bio.style.cssText = 'border:1.5px dashed var(--primary);border-radius:6px;padding:8px;outline:none;';
                bio.focus();
            }
            showToast('Edit mode on — click any text to edit, then Save.', 'info');
        } else {
            editBtn.innerHTML = '&#9998; Edit Profile';
            editBtn.classList.remove('btn-secondary');
            editBtn.classList.add('btn-primary');
            if (bio) {
                bio.removeAttribute('contenteditable');
                bio.style.cssText = '';
            }
            showToast('Profile saved successfully.', 'success');
        }
    });
}

/* -------------------------------------------------------------------------- */
/* 8. Contact Form Submission                                                  */
/* -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name    = form.querySelector('#contactName');
        const email   = form.querySelector('#contactEmail');
        const subject = form.querySelector('#contactSubject');
        const message = form.querySelector('#contactMessage');

        if (!name?.value.trim() || !email?.value.trim() || !subject?.value || !message?.value.trim()) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            showToast('Please enter a valid email address.', 'error');
            email?.focus();
            return;
        }
        form.reset();
        showToast('Inquiry sent! We will reply within 24 business hours.', 'success');
    });
}

/* -------------------------------------------------------------------------- */
/* 9. Feedback Form Submission                                                 */
/* -------------------------------------------------------------------------- */
function initFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = form.querySelector('#feedbackCategory');
        const rating   = form.querySelector('input[name="rating"]:checked');
        const comments = form.querySelector('#feedbackComments');
        const alertBox = document.getElementById('feedbackAlert');

        if (!category?.value) {
            showFormAlert(alertBox, 'Please select a feedback topic.', 'error');
            return;
        }
        if (!rating) {
            showFormAlert(alertBox, 'Please rate your experience before submitting.', 'error');
            return;
        }
        if (!comments?.value.trim()) {
            showFormAlert(alertBox, 'Please add a written comment before submitting.', 'error');
            comments?.focus();
            return;
        }
        form.reset();
        showFormAlert(
            alertBox,
            '&#9989; Thank you! Your feedback has been submitted to the Quality Assurance team.',
            'success'
        );
    });
}

/* -------------------------------------------------------------------------- */
/* 10. Login Form Validation                                                   */
/* -------------------------------------------------------------------------- */
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id  = document.getElementById('loginIdentifier');
        const pwd = document.getElementById('loginPassword');
        const box = document.getElementById('loginAlertBox');
        let ok = true;

        if (!id?.value.trim()) {
            setFieldError(id, 'loginIdentifierError', 'Student ID or email is required.');
            ok = false;
        } else clearFieldError(id, 'loginIdentifierError');

        if (!pwd?.value) {
            setFieldError(pwd, 'loginPasswordError', 'Password is required.');
            ok = false;
        } else clearFieldError(pwd, 'loginPasswordError');

        if (!ok) return;

        showFormAlert(box, '&#9989; Login successful! Redirecting to your dashboard…', 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
    });

    ['loginIdentifier', 'loginPassword'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', function () {
            clearFieldError(this, id + 'Error');
        });
    });
}

/* -------------------------------------------------------------------------- */
/* 11. Admin Buttons – Create Event & Export CSV                              */
/* -------------------------------------------------------------------------- */
function initAdminButtons() {
    document.getElementById('createEventModalBtn')?.addEventListener('click', () => {
        showToast('Create Event panel ready — connect a backend to persist events.', 'info');
    });

    document.getElementById('exportDataBtn')?.addEventListener('click', () => {
        const csv = [
            'Metric,Value',
            'Total Students,5418',
            'Published Events,28',
            'Pending Verifications,14',
            'System Uptime,99.98%'
        ].join('\n');
        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        Object.assign(document.createElement('a'), { href: url, download: 'studenthub_report.csv' }).click();
        URL.revokeObjectURL(url);
        showToast('Report exported as studenthub_report.csv', 'success');
    });

    // Approval queue rows
    document.querySelectorAll('#student-approvals .btn-primary').forEach(btn =>
        btn.addEventListener('click', () => {
            const row  = btn.closest('tr');
            const name = row?.querySelector('td strong')?.textContent || 'Student';
            if (row) { row.style.opacity = '0.45'; row.querySelectorAll('button').forEach(b => b.disabled = true); }
            showToast(`${name} approved and notified via email.`, 'success');
        })
    );

    document.querySelectorAll('#student-approvals .btn-secondary').forEach(btn =>
        btn.addEventListener('click', () => {
            const name = btn.closest('tr')?.querySelector('td strong')?.textContent || 'Student';
            showToast(`Opening document review for ${name}.`, 'info');
        })
    );
}

/* -------------------------------------------------------------------------- */
/* 12. Dashboard Sidebar – Smooth Scroll to Sections                          */
/* -------------------------------------------------------------------------- */
function initSidebarScrollLinks() {
    document.querySelectorAll('.sidebar-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

/* ========================================================================== */
/* Utilities                                                                   */
/* ========================================================================== */

/**
 * showToast – Bottom-right toast notification (auto-dismisses in 3.5s)
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showToast(message, type = 'info') {
    document.querySelector('.sh-toast')?.remove();

    const palette = { success: ['#10b981','✓'], error: ['#ef4444','✕'], info: ['#3b82f6','ℹ'] };
    const [bg, icon] = palette[type] ?? palette.info;

    const toast = document.createElement('div');
    toast.className = 'sh-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = `
        position:fixed;bottom:24px;right:24px;z-index:9999;
        display:flex;align-items:center;gap:10px;
        background:${bg};color:#fff;
        padding:13px 20px;border-radius:10px;
        font-family:'Plus Jakarta Sans',sans-serif;font-size:.9rem;font-weight:600;
        box-shadow:0 8px 28px rgba(0,0,0,.2);max-width:370px;
        animation:shToastIn .25s ease;
    `;
    if (!document.getElementById('sh-toast-style')) {
        const s = document.createElement('style');
        s.id = 'sh-toast-style';
        s.textContent = '@keyframes shToastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}';
        document.head.appendChild(s);
    }
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity .3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/**
 * showFormAlert – Renders an inline alert inside a given element
 * @param {HTMLElement|null} box
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
function showFormAlert(box, message, type) {
    if (!box) return;
    box.className = `alert-box alert-${type}`;
    box.innerHTML = message;
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * setFieldError / clearFieldError – Field-level validation helpers
 */
function setFieldError(input, errorId, msg) {
    input?.classList.add('input-error');
    input?.classList.remove('input-success');
    const el = document.getElementById(errorId);
    if (el) el.textContent = msg;
}

function clearFieldError(input, errorId) {
    input?.classList.remove('input-error');
    const el = document.getElementById(errorId);
    if (el) el.textContent = '';
}
