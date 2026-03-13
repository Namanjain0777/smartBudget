// Shared Navbar - Injects pixel-perfect navbar across all app pages
// Run on DOM ready, sets active link + username

(function() {
    'use strict';

    // Only run on app pages (skip auth)
    if (window.location.pathname.includes('login') || window.location.pathname.includes('register')) {
        return;
    }

    const placeholderId = 'navbar-placeholder';
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
        console.warn('Navbar placeholder not found');
        return;
    }

    async function initNavbar() {
        try {
            // Fetch navbar HTML
            const response = await fetch('components/navbar.html');
            if (!response.ok) throw new Error('Navbar load failed');
            const navbarHtml = await response.text();

            // Insert
            placeholder.outerHTML = navbarHtml;

            // Set username
            const userNameNav = document.getElementById('userNameNav') || document.getElementById('userName');
            const name = localStorage.getItem('userName') || 'User';
            if (userNameNav) userNameNav.textContent = `Hi, ${name}`;

            // Set active link
            const pageMap = {
                'dashboard.html': 'dashboard',
                'goal-planner.html': 'goal-planner',
                'ai-advisor.html': 'ai-advisor',
                'stock-predictor.html': 'stock-predictor',
                'credit-card-advisor.html': 'credit-card',
                'contact.html': 'contact'
            };

            const currentPage = pageMap[window.location.pathname.split('/').pop()] || 'dashboard';
            const activeLink = document.querySelector(`[data-page="${currentPage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Logout global
            window.logout = () => {
                if (confirm('Logout?')) {
                    ['token', 'userName', 'userEmail'].forEach(key => localStorage.removeItem(key));
                    window.location.href = 'login.html';
                }
            };

            console.log('Navbar injected successfully');
        } catch (error) {
            console.error('Navbar init error:', error);
            placeholder.innerHTML = '<div style="text-align:center;padding:20px;background:var(--bg-card);">Navigation temporarily unavailable</div>';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})();

