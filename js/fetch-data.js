/**
 * ==========================================================================
 * Practical 6: Rendering External JSON Data using Fetch API, Search and Filter
 * Problem Definition: Display event lists, student profiles, notices, or FAQs
 * from external JSON files using Fetch API. Implement dynamic rendering,
 * search, filter, sorting, and pagination.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // If on Events page, initialize events directory pipeline
    if (document.getElementById('eventsGrid')) {
        initEventsPipeline();
    }

    // If on Dashboard page, initialize notices fetcher
    if (document.getElementById('noticesContainer')) {
        initNoticesPipeline();
    }
});

/* -------------------------------------------------------------------------- */
/* Practical 6: Events Fetch, Dynamic Rendering, Search, Filter & Pagination  */
/* -------------------------------------------------------------------------- */
function initEventsPipeline() {
    // State management
    let allEvents = [];
    let filteredEvents = [];
    let currentPage = 1;
    const ITEMS_PER_PAGE = 6;
    let selectedCategory = 'All';
    let searchQuery = '';
    let sortCriterion = 'date-asc';

    // DOM Elements
    const eventsGrid = document.getElementById('eventsGrid');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsCountText = document.getElementById('resultsCountText');
    const noEventsMessage = document.getElementById('noEventsMessage');
    const paginationList = document.getElementById('paginationList');
    const searchInput = document.getElementById('eventSearchInput');
    const categorySelect = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortOrder');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const clearAllFiltersBtn = document.getElementById('clearAllFiltersBtn');
    const categoryPills = document.querySelectorAll('.category-pill');

    // Fetch Events data from external JSON
    loadEventsData();

    async function loadEventsData() {
        showLoading(true);
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error while fetching events: ${response.status}`);
            }
            allEvents = await response.json();
            filteredEvents = [...allEvents];
            applyPipeline();
        } catch (error) {
            console.warn('Fetch from data/events.json encountered error (e.g. file:// CORS restriction). Falling back to built-in campus dataset.', error);
            // Fallback dataset for local offline file inspection
            allEvents = getFallbackEvents();
            filteredEvents = [...allEvents];
            applyPipeline();
        } finally {
            showLoading(false);
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Data Pipeline: Filter -> Search -> Sort -> Paginate -> Render          */
    /* ---------------------------------------------------------------------- */
    function applyPipeline() {
        // 1. Filter by Category
        let results = allEvents.filter(evt => {
            if (selectedCategory === 'All') return true;
            return evt.category.toLowerCase() === selectedCategory.toLowerCase();
        });

        // 2. Filter by Search Query (Title, Description, Venue, Organizer)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            results = results.filter(evt => {
                return evt.title.toLowerCase().includes(query) ||
                       evt.description.toLowerCase().includes(query) ||
                       evt.venue.toLowerCase().includes(query) ||
                       (evt.organizer && evt.organizer.toLowerCase().includes(query));
            });
        }

        // 3. Sort Results
        results.sort((a, b) => {
            switch (sortCriterion) {
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'seats':
                    return b.seatsAvailable - a.seatsAvailable;
                default:
                    return 0;
            }
        });

        filteredEvents = results;

        // Ensure current page is within valid range
        const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        // 4. Paginate
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageItems = filteredEvents.slice(startIndex, endIndex);

        // 5. Render DOM
        renderEventsGrid(pageItems);
        renderPagination(totalPages);
        updateStatusText(startIndex, endIndex, filteredEvents.length, allEvents.length);
    }

    /* ---------------------------------------------------------------------- */
    /* Dynamic DOM Rendering Functions                                        */
    /* ---------------------------------------------------------------------- */
    function renderEventsGrid(items) {
        if (!eventsGrid) return;
        eventsGrid.innerHTML = '';

        if (items.length === 0) {
            if (noEventsMessage) noEventsMessage.style.display = 'flex';
            return;
        }

        if (noEventsMessage) noEventsMessage.style.display = 'none';

        // Build accessible semantic event cards using template literals
        items.forEach(evt => {
            const card = document.createElement('article');
            card.className = 'event-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${evt.title}, ${evt.category} event`);

            // Format date for readable display
            const eventDate = new Date(evt.date);
            const dateFormatted = eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            card.innerHTML = `
                <div class="event-badge ${evt.badgeClass || 'badge-tech'}">${escapeHtml(evt.category)}</div>
                <h3>${escapeHtml(evt.title)}</h3>
                <p class="event-meta">
                    <time datetime="${evt.date}T${evt.time}">${dateFormatted} &bull; ${escapeHtml(evt.time)}</time><br>
                    <span>&#128205; ${escapeHtml(evt.venue)}</span>
                </p>
                <p>${escapeHtml(evt.description)}</p>
                <div class="card-footer">
                    <span class="seats-left">${evt.seatsAvailable} seats available</span>
                    <a href="register.html?event=${encodeURIComponent(evt.id)}" class="btn btn-sm btn-primary">Register</a>
                </div>
            `;

            eventsGrid.appendChild(card);
        });
    }

    function renderPagination(totalPages) {
        if (!paginationList) return;
        paginationList.innerHTML = '';

        if (totalPages <= 1) {
            return;
        }

        // Previous button
        const prevLi = document.createElement('li');
        prevLi.innerHTML = `
            <button type="button" class="page-btn" ${currentPage === 1 ? 'disabled' : ''} aria-label="Go to previous page">
                &laquo;
            </button>
        `;
        prevLi.querySelector('button').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                applyPipeline();
                scrollToTop();
            }
        });
        paginationList.appendChild(prevLi);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageLi = document.createElement('li');
            const isActive = i === currentPage;
            pageLi.innerHTML = `
                <button type="button" class="page-btn ${isActive ? 'active' : ''}" 
                    aria-label="Go to page ${i}" 
                    aria-current="${isActive ? 'page' : 'false'}">
                    ${i}
                </button>
            `;
            pageLi.querySelector('button').addEventListener('click', () => {
                currentPage = i;
                applyPipeline();
                scrollToTop();
            });
            paginationList.appendChild(pageLi);
        }

        // Next button
        const nextLi = document.createElement('li');
        nextLi.innerHTML = `
            <button type="button" class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Go to next page">
                &raquo;
            </button>
        `;
        nextLi.querySelector('button').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                applyPipeline();
                scrollToTop();
            }
        });
        paginationList.appendChild(nextLi);
    }

    function updateStatusText(start, end, currentTotal, grandTotal) {
        if (!resultsCountText) return;
        if (currentTotal === 0) {
            resultsCountText.textContent = `No events found matching your criteria.`;
        } else {
            const actualEnd = Math.min(end, currentTotal);
            resultsCountText.textContent = `Showing ${start + 1} to ${actualEnd} of ${currentTotal} events (filtered from ${grandTotal} total).`;
        }
    }

    function showLoading(show) {
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'inline-block' : 'none';
        }
    }

    function scrollToTop() {
        const target = document.querySelector('.filter-controls-section');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Event Handlers (Live Search, Category & Sorting)                        */
    /* ---------------------------------------------------------------------- */
    // Live Search on input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            currentPage = 1; // Reset to first page
            applyPipeline();
        });
    }

    // Category Select Dropdown
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            selectedCategory = e.target.value;
            currentPage = 1;
            syncCategoryPills(selectedCategory);
            applyPipeline();
        });
    }

    // Category Pills Bar
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-checked', 'false');
            });
            pill.classList.add('active');
            pill.setAttribute('aria-checked', 'true');

            selectedCategory = pill.getAttribute('data-category');
            if (categorySelect) categorySelect.value = selectedCategory;
            currentPage = 1;
            applyPipeline();
        });
    });

    function syncCategoryPills(category) {
        categoryPills.forEach(pill => {
            if (pill.getAttribute('data-category').toLowerCase() === category.toLowerCase()) {
                pill.classList.add('active');
                pill.setAttribute('aria-checked', 'true');
            } else {
                pill.classList.remove('active');
                pill.setAttribute('aria-checked', 'false');
            }
        });
    }

    // Sort order change
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortCriterion = e.target.value;
            applyPipeline();
        });
    }

    // Reset Filters Button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', resetAllFilters);
    }

    function resetAllFilters() {
        searchQuery = '';
        selectedCategory = 'All';
        sortCriterion = 'date-asc';
        currentPage = 1;

        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'All';
        if (sortSelect) sortSelect.value = 'date-asc';
        syncCategoryPills('All');

        applyPipeline();
    }
}

/* -------------------------------------------------------------------------- */
/* Practical 6: Official Notices Dynamic Fetch on Dashboard                   */
/* -------------------------------------------------------------------------- */
function initNoticesPipeline() {
    const noticesContainer = document.getElementById('noticesContainer');
    const refreshBtn = document.getElementById('refreshNoticesBtn');

    if (!noticesContainer) return;

    loadNotices();

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('rotating');
            loadNotices().finally(() => {
                setTimeout(() => refreshBtn.classList.remove('rotating'), 600);
            });
        });
    }

    async function loadNotices() {
        try {
            const response = await fetch('data/notices.json');
            if (!response.ok) throw new Error('Failed to load notices JSON');
            const notices = await response.json();
            renderNotices(notices);
        } catch (err) {
            console.warn('Using fallback notices data:', err);
            renderNotices(getFallbackNotices());
        }
    }

    function renderNotices(notices) {
        noticesContainer.innerHTML = '';
        notices.forEach(notice => {
            const item = document.createElement('article');
            item.className = 'notice-card';
            item.innerHTML = `
                <span class="notice-tag ${notice.tagClass || 'tag-general'}">${escapeHtml(notice.tag)}</span>
                <h3>${escapeHtml(notice.title)}</h3>
                <p>${escapeHtml(notice.summary)}</p>
                <time datetime="${notice.date}" class="notice-date">Published: ${escapeHtml(notice.date)} &bull; ${escapeHtml(notice.department || 'Admin')}</time>
            `;
            noticesContainer.appendChild(item);
        });
    }
}

/* -------------------------------------------------------------------------- */
/* Utilities & Fallback Data Sets                                             */
/* -------------------------------------------------------------------------- */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getFallbackEvents() {
    return [
        {
            "id": "EVT-001",
            "title": "Annual Hackathon 2026: Code for Change",
            "category": "Technical",
            "date": "2026-11-15",
            "time": "09:00 AM",
            "venue": "CSPIT Computing Labs A & B",
            "description": "48-hour continuous software engineering hackathon tackling real-world sustainability and AI challenges.",
            "seatsTotal": 120,
            "seatsAvailable": 34,
            "badgeClass": "badge-tech"
        },
        {
            "id": "EVT-002",
            "title": "Inter-College Football Championship Cup",
            "category": "Sports",
            "date": "2026-11-20",
            "time": "03:30 PM",
            "venue": "CHARUSAT Central Sports Ground",
            "description": "Cheer on department teams battling through knockout brackets and the grand championship trophy match.",
            "seatsTotal": 300,
            "seatsAvailable": 95,
            "badgeClass": "badge-sports"
        },
        {
            "id": "EVT-003",
            "title": "Symphony & Fusion Music Gala Night",
            "category": "Cultural",
            "date": "2026-11-28",
            "time": "06:00 PM",
            "venue": "Central Auditorium Amphitheatre",
            "description": "An electric evening featuring Indian classical fusion bands, unplugged sessions, and rock ensembles.",
            "seatsTotal": 500,
            "seatsAvailable": 18,
            "badgeClass": "badge-cultural"
        },
        {
            "id": "EVT-004",
            "title": "Generative AI & LLM Deployment Workshop",
            "category": "Workshop",
            "date": "2026-12-02",
            "time": "10:00 AM",
            "venue": "DEPSTAR AI Lab Room 302",
            "description": "Deep dive into model fine-tuning, prompt engineering, vector embeddings, and RAG applications.",
            "seatsTotal": 60,
            "seatsAvailable": 12,
            "badgeClass": "badge-workshop"
        },
        {
            "id": "EVT-005",
            "title": "Student Research & Innovation Symposium",
            "category": "Academic",
            "date": "2026-12-08",
            "time": "09:30 AM",
            "venue": "Senate Hall, Administration Block",
            "description": "Paper presentations, peer-reviewed poster sessions, and keynote addresses by visiting scientists.",
            "seatsTotal": 200,
            "seatsAvailable": 76,
            "badgeClass": "badge-academic"
        },
        {
            "id": "EVT-006",
            "title": "Inter-Department Cricket Premier League",
            "category": "Sports",
            "date": "2026-12-14",
            "time": "08:30 AM",
            "venue": "Campus Turf Stadium",
            "description": "T20 format university cricket league featuring student and faculty combined squads.",
            "seatsTotal": 250,
            "seatsAvailable": 45,
            "badgeClass": "badge-sports"
        }
    ];
}

function getFallbackNotices() {
    return [
        {
            "id": "NOT-101",
            "title": "Mid-Semester Examination Schedule Announced",
            "tag": "Urgent",
            "tagClass": "tag-urgent",
            "date": "2026-10-24",
            "summary": "Exam timetables for all 3rd and 5th-semester engineering branches are published. Check room allotments.",
            "department": "Examination Cell"
        },
        {
            "id": "NOT-102",
            "title": "Campus Placement Drive: TCS & Infosys",
            "tag": "General",
            "tagClass": "tag-general",
            "date": "2026-10-22",
            "summary": "Pre-placement orientations and mock aptitude sessions will commence this Friday at the Central Auditorium.",
            "department": "Placement Cell"
        },
        {
            "id": "NOT-103",
            "title": "National Merit Scholarship Portal Open",
            "tag": "Scholarship",
            "tagClass": "tag-scholarship",
            "date": "2026-10-20",
            "summary": "Eligible candidates can submit proof documents to the student welfare desk by November 10th.",
            "department": "Student Welfare"
        }
    ];
}
