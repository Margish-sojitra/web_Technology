# StudentHub – CHARUSAT University Student Portal
**Course:** Web Development Frameworks (AIUE203)  
**Curriculum Mapping:** Practical 2 to Practical 15 (Practical 1 Excluded)  
**Technology Stack:** HTML5, CSS3, Vanilla JavaScript (ES6), PHP 8.x, MySQL 8.x, XAMPP (Apache, MySQL, phpMyAdmin)

---

## 1. Project Overview & Architecture

**StudentHub** is a clean, accessible, and responsive student portal engineered for CHARUSAT University as part of the semester-long Web Development Frameworks (AIUE203) practical curriculum.

The portal provides an integrated, dual-role system:
1. **Student Role:** Browse academic profile, view registered courses and lecture attendance, inspect exam timetables, download semester grade results, register for campus events, and submit institutional feedback.
2. **Admin Role:** Manage student records (CRUD), publish and update campus events with poster uploads, monitor registrations, inspect real-time dashboard KPIs, and review administrative audit trail logs.

---

## 2. Practical-by-Practical Mapping (Practical 2 to 15)

Every file in the codebase has been tagged with a descriptive comment header specifying its practical number:

| Practical No. | Practical Name & Core Concepts | Associated Files in `Project_code/` |
|---|---|---|
| **Practical 2** | **Semantic HTML5 Pages & Accessibility**<br>Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`), heading hierarchy (`h1`&rarr;`h3`), explicit form labels, and alternative text on all images. | `frontend/index.html`<br>`frontend/html/about.html`<br>`frontend/html/contact.html`<br>`frontend/html/course_details.html`<br>`frontend/html/events.html`<br>`frontend/html/event_register.html`<br>`frontend/html/family.html`<br>`frontend/html/faq.html`<br>`frontend/html/feedback.html`<br>`frontend/html/login.html`<br>`frontend/html/main_page.html`<br>`frontend/html/register.html`<br>`frontend/html/semester_result.html`<br>`frontend/html/Student_attendance.html`<br>`frontend/html/Student_hostel.html`<br>`frontend/html/Student_Payment.html`<br>`frontend/html/Student_time-table.html`<br>`frontend/html/admin.html` |
| **Practical 3** | **Responsive UI Design**<br>Pure CSS3 responsive styling using Flexbox and CSS Grid. Media queries for Desktop (`992px+`), Tablet (`768-991px`), and Mobile (`<600px`). Custom properties and Light/Dark mode design tokens. | `frontend/css/common.css`<br>`frontend/css/home.css`<br>`frontend/css/style.css`<br>`frontend/css/admin.css`<br>`frontend/css/main_page_style.css`<br>`frontend/css/event_register.css`<br>`frontend/css/attendance.css`<br>`frontend/css/course.css`<br>`frontend/css/family_style.css`<br>`frontend/css/hostel.css`<br>`frontend/css/payment.css`<br>`frontend/css/semester.css`<br>`frontend/css/time_table.css` |
| **Practical 4** | **JavaScript & DOM Manipulation**<br>Responsive drawer/hamburger navigation, modal popup controls (`openModal`, `closeModal`, Escape key, backdrop dismissal), hero carousel slider (`previousSlide`, `nextSlide`), dismissible alert banners, and Light/Dark theme switcher with `localStorage`. | `frontend/js/theme_nav.js`<br>`frontend/js/home.js`<br>`frontend/js/faq_accordion.js`<br>`frontend/js/Main_page.js`<br>`frontend/js/Family_page.js` |
| **Practical 5** | **Registration Form Validation**<br>Client-side regular expression (Regex) validation for Full Name, Username, Email, Mobile (10 digits), Password complexity, Confirm Password match, Course, Year, Gender, DOB age threshold, Captcha, and Terms checkbox with inline accessible error messaging. | `frontend/html/register.html` (`validateForm()`)<br>`frontend/js/Login_page.js`<br>`frontend/js/event_register.js` |
| **Practical 6** | **Fetch API and JSON Loading**<br>Asynchronous data loading from JSON files (`events.json`, `faqs.json`, `timetable.json`). Features real-time keyword search, category filtering, multi-criteria sorting, pagination, and error/loading indicators. | `database/data/events.json`<br>`database/data/faqs.json`<br>`database/data/timetable.json`<br>`frontend/js/events_fetch.js`<br>`frontend/js/faq_accordion.js` |
| **Practical 7** | **PHP Form Processing & Archival**<br>Server-side POST processing, sanitization (`filter_var`, `htmlspecialchars`), validation, and archival to JSON/CSV files. | `backend/api/feedback_process.php` (`feedback_submissions.json`)<br>`backend/api/event_register_process.php`<br>`backend/api/register_process.php` |
| **Practical 8** | **MySQL Database Design**<br>Relational schema in `database/schema.sql` defining primary keys, foreign key constraints (`ON UPDATE CASCADE ON DELETE CASCADE`), indexes, remember tokens, and audit logs. Connection via PDO and MySQLi in `backend/config/database.php`. | `database/schema.sql`<br>`backend/config/database.php`<br>`backend/cli/setup_database.php` |
| **Practical 9** | **Secure Student Registration**<br>Checks duplicate emails and usernames, hashes passwords using BCrypt (`password_hash()`), uses parameterized prepared statements, and records initial profile records. | `backend/api/register_process.php` |
| **Practical 10** | **Authentication, Sessions & Roles**<br>Password verification (`password_verify()`), session ID regeneration (`session_regenerate_id(true)`), role-based redirection (Student vs Admin), remember tokens, and role-guarded pages (`requireStudentRole()`). | `backend/api/login_process.php`<br>`backend/api/logout_process.php`<br>`backend/main_page.php`<br>`frontend/js/student_session.js` |
| **Practical 11** | **Student Management CRUD**<br>Administrative controller and views to Add, View, Edit, and Delete student records with keyword search (name, email, ID) and multi-field filters (course, year, status). | `backend/admin.php`<br>`backend/admin_template.php` (Student Section) |
| **Practical 12** | **Event Management CRUD & Uploads**<br>Publishing and modifying campus events with poster upload validation (MIME types, JPG/PNG/GIF/WebP check, max 10MB limit) stored in `frontend/uploads/event-posters/`. | `backend/admin.php`<br>`backend/admin_template.php` (Events Section)<br>`backend/event_posters.php`<br>`backend/api/admin_events.php` |
| **Practical 13** | **PHP JSON API & Fetch Integration**<br>RESTful JSON endpoints serving event listings and processing registrations consumed asynchronously via Fetch API without full-page reloads. | `backend/api/events.php`<br>`backend/api/admin_events.php`<br>`backend/api/profile_process.php`<br>`backend/api/event_register_process.php`<br>`frontend/js/events_fetch.js`<br>`frontend/js/admin_events.js`<br>`frontend/js/event_register.js` |
| **Practical 14** | **Admin Dashboard & Audit Logging**<br>Real-time KPI statistics cards (Total Students, Active Students, Admins, Events, Registrations), latest student registrations, and administrative action auditing logged to the `audit_logs` table. | `backend/admin.php`<br>`backend/admin_template.php`<br>`backend/admin_audit.php` |
| **Practical 15** | **Final System Integration**<br>End-to-end integration connecting landing gateway `index.php`, session-protected views, database transactions, role-based navigation, and XAMPP compatibility. | `index.php`<br>`backend/main_page.php`<br>`backend/admin.php` |

---

## 3. Directory Tree & File Inventory

```
Project_code/
│
├── index.php                          # [P15] Root Gateway Redirecting to frontend/index.html
├── .gitignore
│
├── backend/
│   ├── admin.php                      # [P11, P12, P14] Master Admin CRUD & Dashboard Controller
│   ├── admin_template.php             # [P11, P12, P14] Admin Dashboard UI & Management Panels
│   ├── admin_audit.php                # [P14] Administrative Audit Trail Telemetry
│   ├── event_posters.php              # [P12] Poster Upload Validation (MIME & Size Enforced)
│   ├── main_page.php                  # [P10] Session-Guarded Student Profile Page
│   │
│   ├── api/
│   │   ├── events.php                 # [P13] Public Events RESTful JSON API
│   │   ├── admin_events.php           # [P12, P13] Event CRUD Operations API
│   │   ├── event_register_process.php # [P7, P8, P13] Event Registration Processor (SQL Transaction)
│   │   ├── feedback_process.php       # [P7] Student Feedback Handler & JSON Archiver
│   │   ├── login_process.php          # [P10] Password Verify, Sessions & Role Redirection
│   │   ├── logout_process.php         # [P10] Session Destruction & Token Revocation
│   │   ├── profile_process.php        # [P10, P13] Student Profile JSON API
│   │   └── register_process.php       # [P7, P9] Secure Registration with BCrypt & MySQL
│   │
│   ├── cli/
│   │   ├── setup_database.php         # [P8] CLI Script to Execute schema.sql
│   │   └── import_legacy_json.php     # [P6, P8] JSON to MySQL Seed Importer
│   │
│   └── config/
│       └── database.php               # [P8] PDO & MySQLi Database Connection Module
│
├── database/
│   ├── schema.sql                     # [P8] Complete Relational MySQL Schema
│   ├── README.md                      # Database Configuration Guide
│   └── data/
│       ├── events.json                # [P6] 15 Sample Event Records
│       ├── faqs.json                  # [P6] 15 Sample FAQ Entries
│       └── timetable.json             # [P6] Academic Class Timetable Model
│
├── frontend/
│   ├── index.html                     # [P2-P4] Homepage: Hero, Slider, Announcements
│   │
│   ├── css/                           # [P3] Responsive CSS3 Stylesheets
│   │   ├── common.css                 # Base Variables, Reset, Typography, Dark Theme
│   │   ├── home.css                   # Home Hero & Announcement Grid
│   │   ├── style.css                  # Master Layout & Breakpoints
│   │   ├── admin.css                  # Admin Dashboard & Roster Grid
│   │   ├── main_page_style.css        # Profile Details Layout
│   │   ├── event_register.css         # Event Selection & Step Form
│   │   ├── attendance.css             # Attendance Cards & Progress Bars
│   │   ├── course.css                 # Course Syllabus Cards
│   │   ├── family_style.css           # Family & Guardian Form
│   │   ├── hostel.css                 # Hostel Accommodation Information
│   │   ├── payment.css                # Payment & Receipt Breakdown
│   │   ├── semester.css               # Semester Result Transcripts
│   │   └── time_table.css             # Weekly Timetable Schedule
│   │
│   ├── html/                          # [P2] Semantic HTML5 Pages
│   │   ├── about.html                 # About University Portal
│   │   ├── admin.html                 # Admin Gateway Redirect
│   │   ├── contact.html               # Contact & Inquiries Form
│   │   ├── course_details.html        # Enrolled Courses & Credits
│   │   ├── events.html                # Campus Events Directory
│   │   ├── event_register.html        # Event Registration Form
│   │   ├── family.html                # Family & Emergency Contact Details
│   │   ├── faq.html                   # Frequently Asked Questions Accordion
│   │   ├── feedback.html              # Student Feedback Evaluation
│   │   ├── login.html                 # Student & Admin Login Form
│   │   ├── main_page.html             # Student Profile View
│   │   ├── register.html              # Student Registration Form
│   │   ├── semester_result.html       # Semester Grade Points Report
│   │   ├── Student_attendance.html    # Subject-wise Lecture Attendance
│   │   ├── Student_hostel.html        # Campus Hostel Room Allotment
│   │   ├── Student_Payment.html       # Tuition Fee Payment Breakdown
│   │   └── Student_time-table.html    # Weekly Academic Class Schedule
│   │
│   ├── js/                            # [P4-P6, P10, P13] JavaScript Modules
│   │   ├── theme_nav.js               # Hamburger Drawer, Modals & Dark Theme
│   │   ├── home.js                    # Carousel Slider & Alert Dismiss
│   │   ├── faq_accordion.js           # FAQ Accordion & Fetch API
│   │   ├── Login_page.js              # Login Validation & Fetch Dispatch
│   │   ├── events_fetch.js            # Events Fetch API, Filter, Sort, Pagination
│   │   ├── event_register.js          # Event Form Validation & API Submission
│   │   ├── admin_events.js            # Admin Event CRUD via Fetch API
│   │   ├── student_session.js         # Session State & Role Navigation
│   │   ├── Main_page.js               # Profile DOM & Live Session Binding
│   │   └── Family_page.js             # Family Form Field Manipulation
│   │
│   ├── image/
│   │   └── charusat_logo.png          # University Logo
│   │
│   └── uploads/
│       └── event-posters/             # [P12] Uploaded Event Poster Assets
│
└── README.md                          # Comprehensive Project & Viva Documentation
```

---

## 4. XAMPP Local Deployment Guide

### Step 1: Start XAMPP Services
1. Open the **XAMPP Control Panel**.
2. Click **Start** for **Apache** and **MySQL**.

### Step 2: Deploy to XAMPP htdocs
Copy `Project_code` into `C:\xampp\htdocs\studenthub` or create a directory link from PowerShell:
```powershell
cmd /c mklink /J "C:\xampp\htdocs\studenthub" "D:\Web_Technology\web_Technology\Project_code"
```

### Step 3: Initialize Database
Run the automated database setup script using XAMPP's PHP CLI:
```powershell
& "C:\xampp\php\php.exe" "backend\cli\setup_database.php"
```
*(Alternatively, import `database/schema.sql` via phpMyAdmin at `http://localhost/phpmyadmin/`)*.

Seed the database with sample students and events:
```powershell
& "C:\xampp\php\php.exe" "backend\cli\import_legacy_json.php"
```

### Step 4: Open in Browser
Visit the application at:
```
http://localhost/studenthub/
```

---

## 5. Viva Examination Reference (Practical 2 to 15)

1. **Practical 2 (Semantic Elements):** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` describe their semantic meaning to browsers and screen readers, ensuring high accessibility (WCAG) and search engine readability.
2. **Practical 3 (CSS Layouts):** Uses native **CSS Grid** for two-dimensional fluid layouts (dashboards, cards) and **Flexbox** for one-dimensional layouts (navbars, controls), adapting across desktop, tablet, and mobile screens via `@media` queries without external frameworks.
3. **Practical 4 (DOM Manipulation & Theme):** Interactivity utilizes `classList.toggle()`, event listeners (`click`, `keydown`), and `localStorage.setItem('studenthub_theme', ...)` for theme persistence.
4. **Practical 5 & 9 (Form Validation & Security):** Client-side regex checks provide immediate UX feedback; server-side regex validation, input sanitization (`filter_var`), duplicate checks, and BCrypt password hashing (`password_hash()`) guarantee security against tampering.
5. **Practical 6 & 13 (Fetch API & REST JSON):** Data is requested asynchronously using `fetch()`, parsed as JSON, and dynamically inserted into the DOM without full-page reloads.
6. **Practical 8 & 9 (Prepared Statements):** Using prepared statements (`$stmt->prepare()` and `$stmt->bind_param()`) cleanly separates SQL query structure from user parameters, preventing **SQL Injection (SQLi)** attacks.
7. **Practical 10 (Authentication & Sessions):** Verifies passwords with `password_verify()`, regenerates session IDs via `session_regenerate_id(true)` to defeat **Session Fixation**, and enforces role-based access control.
8. **Practical 11 & 12 (CRUD Operations):** Administrative tools perform Create, Read, Update, and Delete operations on students and events with image MIME type (`image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`) and file size validation.
9. **Practical 14 (Admin Dashboard & Auditing):** Queries real-time counts from `students`, `events`, and `registrations`, while recording critical administrative actions in the `audit_logs` table.
10. **Practical 15 (Final Integration):** Combines all layers into a unified, responsive, and robust university web application running smoothly on local XAMPP.

