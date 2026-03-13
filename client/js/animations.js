/**
 * SmartBudget - Animation Utilities
 * Provides smooth animations, counters, and visual effects
 */

// =====================================================
// ANIMATED COUNTERS
// =====================================================

/**
 * Animate a number from start to end over a duration
 * @param {HTMLElement} element - The element to animate
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 * @param {string} prefix - Prefix to add (e.g., '₹')
 * @param {string} suffix - Suffix to add (e.g., '%')
 */
function animateCounter(element, start, end, duration = 1000, prefix = '', suffix = '') {
    if (!element) return;
    
    const startTime = performance.now();
    const range = end - start;
    
    // Easing function (ease-out cubic)
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        const currentValue = start + (range * easedProgress);
        
        // Format the number with commas
        let formattedValue;
        if (Number.isInteger(currentValue)) {
            formattedValue = Math.round(currentValue).toLocaleString('en-IN');
        } else {
            formattedValue = currentValue.toFixed(1);
        }
        
        element.textContent = prefix + formattedValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Final formatting
            const finalValue = end.toLocaleString('en-IN');
            element.textContent = prefix + finalValue + suffix;
            
            // Add pulse animation
            element.classList.add('counter-animated');
            setTimeout(() => element.classList.remove('counter-animated'), 300);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Animate multiple counters with stagger
 * @param {string} selector - Element selector
 * @param {number} targetValue - Target value
 * @param {number} duration - Animation duration
 * @param {string} prefix - Prefix
 * @param {string} suffix - Suffix
 */
function animateAllCounters(selector, targetValue, duration = 1000, prefix = '', suffix = '') {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        const start = parseFloat(el.dataset.current || 0);
        setTimeout(() => {
            animateCounter(el, start, targetValue, duration, prefix, suffix);
            el.dataset.current = targetValue;
        }, index * 100);
    });
}

// =====================================================
// SKELETON LOADING
// =====================================================

/**
 * Show skeleton loading state
 */
function showSkeleton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-value"></div>
    `;
}

/**
 * Hide skeleton and show content
 */
function hideSkeleton(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const skeletons = container.querySelectorAll('.skeleton');
    skeletons.forEach(sk => sk.remove());
}

// =====================================================
// TOAST NOTIFICATIONS
// =====================================================

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
function showToast(message, type = 'info') {
    // Create container if not exists
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span style="font-size: 18px;">${icons[type]}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// =====================================================
// RIPPLE EFFECT
// =====================================================

/**
 * Add ripple effect to button
 */
function addRippleEffect(button) {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// Initialize ripple on all premium buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-premium').forEach(btn => {
        addRippleEffect(btn);
    });
});

// =====================================================
// PAGE TRANSITION ANIMATIONS
// =====================================================

/**
 * Add entrance animations to elements
 */
function initEntranceAnimations() {
    const elements = document.querySelectorAll('.premium-card, .entry-card, .chart-card, .glass-card');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Stagger animation for grid items
 */
function staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * delay);
    });
}

// =====================================================
// NUMBER FORMATting
// =====================================================

/**
 * Format number with Indian locale
 */
function formatNumber(num, decimals = 0) {
    return num.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Format currency (Indian Rupees)
 */
function formatCurrency(num) {
    return '₹' + formatNumber(num);
}

/**
 * Format percentage
 */
function formatPercent(num, decimals = 1) {
    return num.toFixed(decimals) + '%';
}

// =====================================================
// PROGRESS BAR ANIMATION
// =====================================================

/**
 * Animate progress bar width
 */
function animateProgressBar(element, targetWidth, duration = 800) {
    if (!element) return;
    
    const startWidth = parseFloat(element.style.width) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentWidth = startWidth + (targetWidth - startWidth) * eased;
        
        element.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// =====================================================
// CARD HOVER EFFECTS
// =====================================================

/**
 * Initialize card hover effects
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.premium-card, .entry-card, .glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// =====================================================
// CHART ANIMATIONS
// =====================================================

/**
 * Enhanced Chart.js configuration
 */
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    },
    plugins: {
        legend: {
            labels: {
                color: '#9ca3af',
                font: {
                    family: "'Inter', sans-serif",
                    size: 12
                }
            }
        }
    }
};

/**
 * Create animated chart
 */
function createAnimatedChart(canvasId, type, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    const defaultOptions = {
        ...chartDefaults,
        ...options
    };
    
    return new Chart(ctx, {
        type,
        data,
        options: defaultOptions
    });
}

/**
 * Update chart with animation
 */
function updateChartAnimated(chart, newData, duration = 800) {
    chart.data.datasets.forEach((dataset, i) => {
        dataset.data = newData[i] || dataset.data;
    });
    
    chart.update('active', duration);
}

// =====================================================
// GSAP-LIKE ANIMATIONS (Pure JS)
// =====================================================

/**
 * Simple tween function (GSAP-style)
 */
function tween(element, properties, duration = 1000) {
    const startValues = {};
    const startTime = performance.now();
    
    // Get current values
    for (let prop in properties) {
        if (prop === 'opacity') {
            startValues[prop] = parseFloat(window.getComputedStyle(element).opacity) || 0;
        } else if (prop === 'transform') {
            startValues[prop] = 0; // Simplified
        }
    }
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        for (let prop in properties) {
            const start = startValues[prop] || 0;
            const end = properties[prop];
            const current = start + (end - start) * eased;
            
            if (prop === 'opacity') {
                element.style.opacity = current;
            } else if (prop === 'transform') {
                element.style.transform = `translateY(${current}px)`;
            }
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Stagger reveal animation
 */
function staggerReveal(selector, options = {}) {
    const {
        delay = 100,
        duration = 600,
        from = 30,
        opacity = true
    } = options;
    
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        
        if (opacity) {
            el.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        }
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * delay);
    });
}

// =====================================================
// DEBOUNCE & THROTTLE
// =====================================================

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =====================================================
// EXPORT
// =====================================================

window.SmartBudgetAnimations = {
    animateCounter,
    animateAllCounters,
    showSkeleton,
    hideSkeleton,
    showToast,
    addRippleEffect,
    initEntranceAnimations,
    staggerAnimation,
    formatNumber,
    formatCurrency,
    formatPercent,
    animateProgressBar,
    initCardHoverEffects,
    chartDefaults,
    createAnimatedChart,
    updateChartAnimated,
    tween,
    staggerReveal,
    debounce,
    throttle
};

