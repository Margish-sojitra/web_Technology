/* ==========================================================================
   PRACTICAL 5 & 10: Form Validation & Login Authentication Dispatch
   Subject: Web Development Frameworks (AIUE203)
   Project: StudentHub Portal | CHARUSAT University
   File: Project_code/frontend/js/Login_page.js
   Description: Client-side validation of student credentials and asynchronous login submission to login_process.php
   ========================================================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const usernameError = document.getElementById("usernameError");
        const passwordError = document.getElementById("passwordError");
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        clearError(usernameError);
        clearError(passwordError);

        if (!username) {
            showError(usernameInput, usernameError, "Please enter your Student ID or Username.");
            return;
        }
        const validUsernameOrId = /^[A-Za-z0-9_.-]{1,50}$/.test(username);
        const validEmail = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(username);
        if (!validUsernameOrId && !validEmail) {
            showError(usernameInput, usernameError, "Please enter a valid Student ID, username, or email.");
            return;
        }
        if (!password) {
            showError(passwordInput, passwordError, "Please enter your password.");
            return;
        }

        try {
            const response = await fetch("../../backend/api/login_process.php", {
                method: "POST",
                body: new FormData(loginForm)
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                showError(passwordInput, passwordError, result.message || "Invalid Student ID or password.");
                return;
            }

            sessionStorage.setItem("studenthub_logged_in_user", result.student.id);
            sessionStorage.setItem("studenthub_logged_in_student", JSON.stringify(result.student));
            window.location.href = result.redirect;
        } catch (error) {
            console.error(error);
            showError(passwordInput, passwordError, "Unable to contact the login server. Please try again.");
        }
    });
}

function clearError(errorElement) {
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}

function showError(input, errorElement, message) {
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    } else {
        alert(message);
    }
    input.focus();
}
