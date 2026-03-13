/**
 * SmartBudget - Authentication JavaScript
 * Handles login, registration, and user session management
 */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    // Helper function to show notifications
    function showNotification(message, type = 'error') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles dynamically
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
            color: white;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOut {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
    `;
    document.head.appendChild(style);



    /* ================= LOGIN with VALIDATION ================= */

    if (loginForm) {

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            // Client-side validation
            const emailRegex = /^.+@.+$/;
            if (!emailRegex.test(email)) {
                showNotification("Please enter a valid email address", 'error');
                return;
            }

            if (password.length < 6) {
                showNotification("Password must be at least 6 characters", 'error');
                return;
            }

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            // AbortController with 8s timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort(new DOMException('Request timed out after 8 seconds', 'AbortError'));
            }, 8000);

            try {
                const res = await fetch(SmartBudgetAPI.getApiUrl("/api/auth/login"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                const data = await res.json();

                if (!res.ok) {
                    let errorMsg = data.msg || "Login failed";
                    if (res.status >= 500) {
                        errorMsg = "Server error. Please try again later.";
                    } else if (res.status >= 400) {
                        errorMsg = data.msg || "Invalid credentials";
                    }
                    showNotification(errorMsg, 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                /* Store token + user */
                localStorage.setItem("token", data.token);
                localStorage.setItem("userName", data.user.name);
                localStorage.setItem("userEmail", email);

                showNotification('Login successful! Welcome back.', 'success');

                /* Redirect after brief delay */
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);

            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    console.warn('Fetch aborted:', error.message || 'timeout');
                    showNotification("Request timed out (8s). Check your internet connection and try again.", 'error');
                } else {
                    console.error(error);
                    showNotification("Network error. Please check your connection.", 'error');
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Real-time email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                const emailRegex = /^.+@.+$/;
                if (e.target.value && !emailRegex.test(e.target.value)) {
                    e.target.style.borderColor = '#ef4444';
                } else {
                    e.target.style.borderColor = '';
                }
            });
        }

    }


    /* ================= REGISTER ================= */

    if (registerForm) {

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                showNotification("Passwords do not match", 'error');
                return;
            }

            if (password.length < 6) {
                showNotification("Password must be at least 6 characters", 'error');
                return;
            }

            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;

            // Build URL and validate immediate config mistakes (bad host characters from stale deploy/client cache)
            const endpoint = "/api/auth/register";
            const apiUrl = SmartBudgetAPI.getApiUrl(endpoint);
            console.log('Registration endpoint used:', apiUrl);
            if (!apiUrl.includes('smartbudget-jij8.onrender.com')) {
                console.error('Invalid API URL:', apiUrl);
                showNotification('Configuration error: invalid API URL. Clear cache and redeploy.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }

            // AbortController with 8s timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort(new DOMException('Request timed out after 8 seconds', 'AbortError'));
            }, 8000);

            try {

                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                const data = await res.json();

                if (!res.ok) {
                    let errorMsg = data.msg || "Registration failed";
                    if (res.status >= 500) {
                        errorMsg = "Server error. Please try again later.";
                    } else if (res.status >= 400) {
                        errorMsg = data.msg || "Registration error";
                    }
                    showNotification(errorMsg, 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                showNotification('Account created! Please login.', 'success');

                /* Redirect to login after brief delay */
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);

            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    console.warn('Fetch aborted:', error.message || 'timeout');
                    showNotification("Request timed out (8s). Check your internet connection and try again.", 'error');
                } else {
                    console.error(error);
                    showNotification("Network error. Please check your connection.", 'error');
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

    }

} );

