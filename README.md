# StudentHub - Web Technology Practicals (2 to 6)

Welcome to **StudentHub**, a campus web portal built for CHARUSAT University as part of the Web Technology laboratory curriculum.

---

## 📚 Practical Index & Implementation Details

| Practical No. | Topic & Problem Definition | Files & Modules | Key Features |
| :--- | :--- | :--- | :--- |
| **Practical 2** | **Semantic HTML5 Pages with Accessibility-Ready Structure**<br>Develop static HTML5 skeletons for at least 10 StudentHub pages using semantic tags and accessibility-friendly structure. | `index.html`, `about.html`, `register.html`, `login.html`, `dashboard.html`, `events.html`, `profile.html`, `contact.html`, `admin.html`, `faq.html`, `feedback.html` | Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<time>`), skip-to-content links, ARIA labels, roles, accessible forms, and headings hierarchy (`h1`-`h3`). |
| **Practical 3** | **Responsive UI Design using CSS Grid, Flexbox, and Mobile-First Layout**<br>Design responsive layouts for Home, About, Registration, Dashboard, and Events pages using CSS Grid and Flexbox with mobile-first responsiveness. | `css/style.css`, `Index.css`, `About.css`, `Register.css`, `Dashbord.css`, `Event.css`, `Profile.css`, `Contect.css`, `FAQ.css`, `Feedback.css` | CSS Custom Properties (Design tokens), CSS Grid (`repeat(auto-fit, minmax(...))`), Flexbox navigation and hero rows, media queries (`@media (min-width: 640px, 768px, 1024px)`), glassmorphism, and responsive tables. |
| **Practical 4** | **JavaScript DOM Manipulation, Event Handling, and UI Interactivity**<br>Add dynamic UI components such as collapsible FAQ, modal popup, image/content slider, notification banner, hamburger menu, and light/dark theme switcher using JavaScript. | `js/components.js` | 1. Collapsible FAQ accordion with keyboard navigation.<br>2. Accessible modal popup with focus trap and ESC dismiss.<br>3. Autoplay image slider/carousel with dot indicators and hover pause.<br>4. Dismissible announcement banner with session memory.<br>5. Mobile hamburger drawer menu.<br>6. Light/Dark theme switcher with `localStorage` persistence. |
| **Practical 5** | **Registration Form with Frontend Validation and User-Friendly Error Handling**<br>Student registration form with HTML5 input types and JavaScript validation for name, email, mobile, password, confirm password, course, year, gender, and terms acceptance using Regular Expressions. | `register.html`, `js/validation.js`, `reg.js` | Full Name (`/^[a-zA-Z\s]{3,50}$/`), Email (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`), Mobile (`/^[6-9]\d{9}$/`), Strong Password (`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`), Confirm password match, Real-time password strength meter, inline error states (`.input-error`), accessible ARIA invalid alerts, and password visibility toggle. |
| **Practical 6** | **Rendering External JSON Data using Fetch API, Search and Filter**<br>Display event lists, notices, and FAQs from external JSON files using Fetch API. Implement dynamic rendering, search, filter, sorting, and pagination. | `data/events.json`, `data/notices.json`, `events.html`, `dashboard.html`, `js/fetch-data.js` | Native `fetch()` API with `async/await`, dynamic DOM card generation, live keyword search, category filter pills & dropdowns, multi-criteria sorting (Date, Title, Available Seats), responsive pagination controls, active counter, and empty states. |

---

## 🚀 How to Run the Website Locally

You can open the project directly in any modern browser:

### Option 1: Using VS Code Live Server / Python HTTP Server (Recommended)
```bash
# Using Python
python -m http.server 3000

# Open in browser:
http://localhost:3000/
```

### Option 2: Direct File Open
Double click on `index.html` or open it with Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

## 📂 Project Directory Structure

```text
web_Technology/
├── index.html            # Home Page (Practical 2, 3, 4)
├── about.html            # About Campus & Milestones (Practical 2, 3)
├── register.html         # Student Registration Form (Practical 2, 3, 5)
├── login.html            # Portal Authentication (Practical 2, 3)
├── dashboard.html        # Student Dashboard (Practical 2, 3, 6)
├── dashbord.html         # Compatibility alias
├── events.html           # Campus Events Directory (Practical 2, 3, 6)
├── event.html            # Compatibility alias
├── profile.html          # Student Academic Profile (Practical 2, 3)
├── Profile.html          # Case-insensitive alias
├── contact.html          # Faculty & Helpdesk Directory (Practical 2, 3)
├── contect.html          # Compatibility alias
├── admin.html            # Super Administrator Portal (Practical 2, 3)
├── faq.html              # FAQ Knowledge Base & Accordion (Practical 2, 4)
├── feedback.html         # Student Feedback Form (Practical 2, 3)
├── css/
│   └── style.css         # Universal CSS Design System (Practical 3)
├── js/
│   ├── components.js     # UI Components & DOM Manipulation (Practical 4)
│   ├── validation.js     # Form Regex Validations (Practical 5)
│   └── fetch-data.js     # Fetch API, Search, Filter & Pagination (Practical 6)
├── data/
│   ├── events.json       # External JSON Dataset of Campus Events (Practical 6)
│   └── notices.json      # External JSON Dataset of Circulars (Practical 6)
└── README.md             # Project & Practicals Documentation
```

---

## 📝 Git Commit History

1. **Commit 1**: `Practical 2: Semantic HTML5 Pages with Accessibility-Ready Structure`
2. **Commit 2**: `Practical 3: Responsive UI Design using CSS Grid, Flexbox, and Mobile-First Layout`
3. **Commit 3**: `Practical 4: JavaScript DOM Manipulation, Event Handling, and UI Interactivity`
4. **Commit 4**: `Practical 5: Registration Form with Frontend Validation and User-Friendly Error Handling`
5. **Commit 5**: `Practical 6: Rendering External JSON Data using Fetch API, Search and Filter`
