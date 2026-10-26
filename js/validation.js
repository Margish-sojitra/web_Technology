/**
 * ==========================================================================
 * Practical 5: Registration Form with Frontend Validation and User-Friendly Error Handling
 * Problem Definition: Create a student registration form with HTML5 input types
 * and JavaScript validation for name, email, mobile number, password, confirm password,
 * course, year, gender, and terms acceptance. Use Regular Expressions for validations.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initRegistrationValidation();
    initPasswordToggle();
});

/* -------------------------------------------------------------------------- */
/* Practical 5: Form Validation Logic using Regular Expressions & DOM Updates */
/* -------------------------------------------------------------------------- */
function initRegistrationValidation() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    // Field references
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const mobileInput = document.getElementById('mobile');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const courseSelect = document.getElementById('course');
    const yearSelect = document.getElementById('year');
    const termsCheckbox = document.getElementById('terms');
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const alertBox = document.getElementById('formAlertBox');
    const strengthIndicator = document.getElementById('strengthIndicator');

    // Regular Expression definitions
    const REGEX = {
        // Name: Letters and spaces only, 3 to 50 characters
        NAME: /^[a-zA-Z\s]{3,50}$/,
        
        // Standard RFC-compliant email regex
        EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        
        // Mobile: 10 digits starting with 6, 7, 8, or 9
        MOBILE: /^[6-9]\d{9}$/,
        
        // Strong Password: Min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
        PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };

    /* ---------------------------------------------------------------------- */
    /* Validation Helper Functions                                            */
    /* ---------------------------------------------------------------------- */
    function showError(inputElement, errorElementId, message) {
        if (inputElement) {
            inputElement.classList.add('input-error');
            inputElement.classList.remove('input-success');
            inputElement.setAttribute('aria-invalid', 'true');
        }
        const errorElem = document.getElementById(errorElementId);
        if (errorElem) {
            errorElem.textContent = message;
        }
    }

    function clearError(inputElement, errorElementId) {
        if (inputElement) {
            inputElement.classList.remove('input-error');
            inputElement.classList.add('input-success');
            inputElement.removeAttribute('aria-invalid');
        }
        const errorElem = document.getElementById(errorElementId);
        if (errorElem) {
            errorElem.textContent = '';
        }
    }

    // 1. Validate Full Name
    function validateFullName() {
        const value = fullNameInput.value.trim();
        if (!value) {
            showError(fullNameInput, 'fullNameError', 'Full Name is required.');
            return false;
        }
        if (value.length < 3) {
            showError(fullNameInput, 'fullNameError', 'Full Name must be at least 3 characters long.');
            return false;
        }
        if (!REGEX.NAME.test(value)) {
            showError(fullNameInput, 'fullNameError', 'Full Name must contain only alphabets and spaces.');
            return false;
        }
        clearError(fullNameInput, 'fullNameError');
        return true;
    }

    // 2. Validate Email Address
    function validateEmail() {
        const value = emailInput.value.trim();
        if (!value) {
            showError(emailInput, 'emailError', 'Email address is required.');
            return false;
        }
        if (!REGEX.EMAIL.test(value)) {
            showError(emailInput, 'emailError', 'Please enter a valid email format (e.g., student@charusat.edu.in).');
            return false;
        }
        clearError(emailInput, 'emailError');
        return true;
    }

    // 3. Validate Mobile Number
    function validateMobile() {
        const value = mobileInput.value.trim();
        if (!value) {
            showError(mobileInput, 'mobileError', 'Mobile number is required.');
            return false;
        }
        if (!REGEX.MOBILE.test(value)) {
            showError(mobileInput, 'mobileError', 'Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.');
            return false;
        }
        clearError(mobileInput, 'mobileError');
        return true;
    }

    // 4. Validate Password & Update Strength Meter
    function validatePassword() {
        const value = passwordInput.value;
        updatePasswordStrength(value);

        if (!value) {
            showError(passwordInput, 'passwordError', 'Password is required.');
            return false;
        }
        if (!REGEX.PASSWORD.test(value)) {
            showError(
                passwordInput, 
                'passwordError', 
                'Password must have min 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special symbol (@$!%*?&).'
            );
            return false;
        }
        clearError(passwordInput, 'passwordError');

        // Re-validate confirm password if it already has input
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        return true;
    }

    // Dynamic Password Strength Meter
    function updatePasswordStrength(password) {
        if (!strengthIndicator) return;

        strengthIndicator.className = 'strength-indicator';
        if (!password) {
            strengthIndicator.style.width = '0%';
            return;
        }

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&]/.test(password)) score++;

        if (score <= 2) {
            strengthIndicator.classList.add('strength-weak');
        } else if (score === 3) {
            strengthIndicator.classList.add('strength-fair');
        } else if (score === 4) {
            strengthIndicator.classList.add('strength-good');
        } else {
            strengthIndicator.classList.add('strength-strong');
        }
    }

    // 5. Validate Confirm Password
    function validateConfirmPassword() {
        const passwordValue = passwordInput.value;
        const confirmValue = confirmPasswordInput.value;

        if (!confirmValue) {
            showError(confirmPasswordInput, 'confirmPasswordError', 'Please confirm your password.');
            return false;
        }
        if (confirmValue !== passwordValue) {
            showError(confirmPasswordInput, 'confirmPasswordError', 'Passwords do not match.');
            return false;
        }
        clearError(confirmPasswordInput, 'confirmPasswordError');
        return true;
    }

    // 6. Validate Course
    function validateCourse() {
        const value = courseSelect.value;
        if (!value) {
            showError(courseSelect, 'courseError', 'Please select your academic department.');
            return false;
        }
        clearError(courseSelect, 'courseError');
        return true;
    }

    // 7. Validate Academic Year
    function validateYear() {
        const value = yearSelect.value;
        if (!value) {
            showError(yearSelect, 'yearError', 'Please select your current academic year.');
            return false;
        }
        clearError(yearSelect, 'yearError');
        return true;
    }

    // 8. Validate Gender
    function validateGender() {
        const selected = Array.from(genderRadios).some(r => r.checked);
        const errorElem = document.getElementById('genderError');
        if (!selected) {
            if (errorElem) errorElem.textContent = 'Please select your gender.';
            return false;
        }
        if (errorElem) errorElem.textContent = '';
        return true;
    }

    // 9. Validate Terms Acceptance
    function validateTerms() {
        const isChecked = termsCheckbox.checked;
        const errorElem = document.getElementById('termsError');
        if (!isChecked) {
            if (errorElem) errorElem.textContent = 'You must accept the terms of student conduct to proceed.';
            return false;
        }
        if (errorElem) errorElem.textContent = '';
        return true;
    }

    /* ---------------------------------------------------------------------- */
    /* Real-Time Event Listeners (blur & input)                               */
    /* ---------------------------------------------------------------------- */
    fullNameInput.addEventListener('blur', validateFullName);
    fullNameInput.addEventListener('input', () => {
        if (fullNameInput.classList.contains('input-error')) validateFullName();
    });

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('input-error')) validateEmail();
    });

    mobileInput.addEventListener('blur', validateMobile);
    mobileInput.addEventListener('input', () => {
        // Enforce numeric only on type
        mobileInput.value = mobileInput.value.replace(/\D/g, '');
        if (mobileInput.classList.contains('input-error')) validateMobile();
    });

    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

    courseSelect.addEventListener('change', validateCourse);
    yearSelect.addEventListener('change', validateYear);

    genderRadios.forEach(radio => {
        radio.addEventListener('change', validateGender);
    });

    termsCheckbox.addEventListener('change', validateTerms);

    /* ---------------------------------------------------------------------- */
    /* Form Submit Event Handler                                              */
    /* ---------------------------------------------------------------------- */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform all validations
        const isNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isMobileValid = validateMobile();
        const isPassValid = validatePassword();
        const isConfirmPassValid = validateConfirmPassword();
        const isCourseValid = validateCourse();
        const isYearValid = validateYear();
        const isGenderValid = validateGender();
        const isTermsValid = validateTerms();

        const isFormValid = isNameValid && isEmailValid && isMobileValid &&
                            isPassValid && isConfirmPassValid && isCourseValid &&
                            isYearValid && isGenderValid && isTermsValid;

        if (isFormValid) {
            // Success response
            if (alertBox) {
                alertBox.className = 'alert-box alert-success';
                alertBox.style.display = 'block';
                alertBox.innerHTML = `
                    <strong>&#9989; Registration Successful!</strong> Welcome to StudentHub, 
                    <strong>${fullNameInput.value.trim()}</strong>. Your profile has been created and verified.
                    Redirecting to Dashboard in 3 seconds...
                `;
            }

            // Save demo student data to localStorage for Practical 6 to render
            const newStudent = {
                name: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                mobile: mobileInput.value.trim(),
                course: courseSelect.value,
                year: yearSelect.value,
                registrationDate: new Date().toISOString().split('T')[0]
            };
            try {
                localStorage.setItem('studenthub_registered_user', JSON.stringify(newStudent));
            } catch (err) {
                console.warn('LocalStorage save error:', err);
            }

            // Scroll to alert box smoothly
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Redirect after 3 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);

        } else {
            // Error response
            if (alertBox) {
                alertBox.className = 'alert-box alert-error';
                alertBox.style.display = 'block';
                alertBox.innerHTML = `
                    <strong>&#9888; Submission Failed:</strong> Please correct the highlighted errors in the form above before submitting.
                `;
            }

            // Focus on first invalid input field
            const firstInvalidInput = form.querySelector('.input-error, [aria-invalid="true"]');
            if (firstInvalidInput) {
                firstInvalidInput.focus();
                firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    /* ---------------------------------------------------------------------- */
    /* Form Reset Handler                                                     */
    /* ---------------------------------------------------------------------- */
    form.addEventListener('reset', () => {
        // Clear all error classes and messages
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('input-error', 'input-success');
            input.removeAttribute('aria-invalid');
        });

        const errorSpans = form.querySelectorAll('.error-message');
        errorSpans.forEach(span => {
            span.textContent = '';
        });

        if (strengthIndicator) {
            strengthIndicator.className = 'strength-indicator';
            strengthIndicator.style.width = '0%';
        }

        if (alertBox) {
            alertBox.style.display = 'none';
        }
    });
}

/* -------------------------------------------------------------------------- */
/* Password Visibility Toggle Feature                                         */
/* -------------------------------------------------------------------------- */
function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-password-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            if (!targetInput) return;

            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                btn.innerHTML = '&#128584;'; // Hide icon
                btn.setAttribute('aria-label', 'Hide password');
            } else {
                targetInput.type = 'password';
                btn.innerHTML = '&#128065;'; // View icon
                btn.setAttribute('aria-label', 'Show password');
            }
        });
    });
}
