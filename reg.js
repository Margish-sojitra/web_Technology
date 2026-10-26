/**
 * ==========================================================================
 * Practical 5: Registration Form with Frontend Validation and User-Friendly Error Handling
 * ==========================================================================
 */

// Legacy validation function fallback
function f() {
    var form = document.forms["myForm"] || document.forms["registrationForm"];
    if (!form) return true;
    
    var user = form.user ? form.user.value : (form.fullName ? form.fullName.value : "");
    var pass = form.pass ? form.pass.value : (form.password ? form.password.value : "");
    
    if (user.trim().length >= 3 && pass.length >= 6) {
        alert("Validation Passed - Welcome!");
        return true;
    } else {
        alert("Please enter valid credentials (Min 3 characters for username, 6 for password).");
        return false;
    }
}
