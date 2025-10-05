/**
 * JobMatch Pro - Utility Functions
 * Common utility functions used throughout the application
 */

// ===== STRING UTILITIES =====
const StringUtils = {
    /**
     * Capitalize first letter of a string
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    /**
     * Convert string to title case
     */
    toTitleCase(str) {
        if (!str) return '';
        return str.toLowerCase().replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    },

    /**
     * Create URL-friendly slug from string
     */
    slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Truncate string with ellipsis
     */
    truncate(str, length = 100, suffix = '...') {
        if (!str || str.length <= length) return str;
        return str.substring(0, length).trim() + suffix;
    },

    /**
     * Strip HTML tags from string
     */
    stripHtml(str) {
        if (!str) return '';
        return str.replace(/<[^>]*>/g, '');
    },

    /**
     * Escape HTML entities
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// ===== DATE UTILITIES =====
const DateUtils = {
    /**
     * Format date to readable string
     */
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const formatOptions = { ...defaultOptions, ...options };
        return new Date(date).toLocaleDateString('en-US', formatOptions);
    },

    /**
     * Get relative time (e.g., "2 days ago")
     */
    getRelativeTime(date) {
        const now = new Date();
        const targetDate = new Date(date);
        const diffInSeconds = Math.floor((now - targetDate) / 1000);

        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    },

    /**
     * Check if date is today
     */
    isToday(date) {
        const today = new Date();
        const targetDate = new Date(date);
        return today.toDateString() === targetDate.toDateString();
    },

    /**
     * Get days between two dates
     */
    daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    }
};

// ===== DOM UTILITIES =====
const DOMUtils = {
    /**
     * Create element with attributes and content
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },

    /**
     * Get element position relative to viewport
     */
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            bottom: rect.bottom + window.pageYOffset,
            right: rect.right + window.pageXOffset,
            width: rect.width,
            height: rect.height
        };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    },

    /**
     * Smooth scroll to element
     */
    scrollToElement(element, offset = 0, duration = 800) {
        const targetPosition = this.getElementPosition(element).top - offset;
        return this.smoothScrollTo(targetPosition, duration);
    },

    /**
     * Smooth scroll to position
     */
    smoothScrollTo(targetPosition, duration = 800) {
        return new Promise((resolve) => {
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();

            function animation(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function (ease-in-out cubic)
                const easeInOut = progress < 0.5 
                    ? 4 * progress * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
                window.scrollTo(0, startPosition + distance * easeInOut);
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(animation);
        });
    },

    /**
     * Add CSS class with animation
     */
    addClassAnimated(element, className, duration = 300) {
        return new Promise((resolve) => {
            element.classList.add(className);
            setTimeout(resolve, duration);
        });
    },

    /**
     * Remove CSS class with animation
     */
    removeClassAnimated(element, className, duration = 300) {
        return new Promise((resolve) => {
            element.classList.add(`${className}-out`);
            setTimeout(() => {
                element.classList.remove(className, `${className}-out`);
                resolve();
            }, duration);
        });
    }
};

// ===== ARRAY UTILITIES =====
const ArrayUtils = {
    /**
     * Remove duplicates from array
     */
    unique(array) {
        return [...new Set(array)];
    },

    /**
     * Shuffle array elements
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Group array elements by key
     */
    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },

    /**
     * Chunk array into smaller arrays
     */
    chunk(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },

    /**
     * Find item by property value
     */
    findByProperty(array, property, value) {
        return array.find(item => item[property] === value);
    },

    /**
     * Sort array by property
     */
    sortBy(array, property, direction = 'asc') {
        return [...array].sort((a, b) => {
            const aVal = a[property];
            const bVal = b[property];
            
            if (direction === 'desc') {
                return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
            }
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
    }
};

// ===== VALIDATION UTILITIES =====
const ValidationUtils = {
    /**
     * Validate email address
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },

    /**
     * Validate URL
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check if string contains only letters
     */
    isAlpha(str) {
        return /^[a-zA-Z]+$/.test(str);
    },

    /**
     * Check if string contains only numbers
     */
    isNumeric(str) {
        return /^[0-9]+$/.test(str);
    },

    /**
     * Check if string is alphanumeric
     */
    isAlphanumeric(str) {
        return /^[a-zA-Z0-9]+$/.test(str);
    },

    /**
     * Validate password strength
     */
    validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
        
        return { checks, score, strength };
    }
};

// ===== STORAGE UTILITIES =====
const StorageUtils = {
    /**
     * Set item in localStorage with error handling
     */
    setLocal(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting localStorage:', error);
            return false;
        }
    },

    /**
     * Get item from localStorage with error handling
     */
    getLocal(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     */
    removeLocal(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clearLocal() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    /**
     * Set item in sessionStorage
     */
    setSession(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting sessionStorage:', error);
            return false;
        }
    },

    /**
     * Get item from sessionStorage
     */
    getSession(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error getting sessionStorage:', error);
            return defaultValue;
        }
    }
};

// ===== PERFORMANCE UTILITIES =====
const PerformanceUtils = {
    /**
     * Debounce function calls
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    /**
     * Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Lazy load images
     */
    lazyLoadImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    /**
     * Preload critical resources
     */
    preloadResource(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    },

    /**
     * Measure function execution time
     */
    measureTime(func, ...args) {
        const start = performance.now();
        const result = func(...args);
        const end = performance.now();
        console.log(`Function executed in ${end - start} milliseconds`);
        return result;
    }
};

// ===== ACCESSIBILITY UTILITIES =====
const A11yUtils = {
    /**
     * Announce message to screen readers
     */
    announce(message, priority = 'polite') {
        const announcer = document.getElementById('a11y-announcer') || this.createAnnouncer();
        announcer.setAttribute('aria-live', priority);
        announcer.textContent = message;
        
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    },

    /**
     * Create screen reader announcer element
     */
    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        return announcer;
    },

    /**
     * Manage focus for keyboard navigation
     */
    manageFocus(element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    /**
     * Create skip link
     */
    createSkipLink(targetId, text = 'Skip to main content') {
        const skipLink = document.createElement('a');
        skipLink.href = `#${targetId}`;
        skipLink.textContent = text;
        skipLink.className = 'skip-link';
        
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-color);
            color: white;
            padding: 8px;
            z-index: 10000;
            text-decoration: none;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        return skipLink;
    }
};

// ===== DEVICE DETECTION UTILITIES =====
const DeviceUtils = {
    /**
     * Check if device is mobile
     */
    isMobile() {
        return window.innerWidth <= 768;
    },

    /**
     * Check if device is tablet
     */
    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    /**
     * Check if device is desktop
     */
    isDesktop() {
        return window.innerWidth > 1024;
    },

    /**
     * Check if device supports touch
     */
    isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    },

    /**
     * Get device type
     */
    getDeviceType() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    },

    /**
     * Check if user prefers reduced motion
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};

// ===== EXPORT ALL UTILITIES =====
window.Utils = {
    String: StringUtils,
    Date: DateUtils,
    DOM: DOMUtils,
    Array: ArrayUtils,
    Validation: ValidationUtils,
    Storage: StorageUtils,
    Performance: PerformanceUtils,
    A11y: A11yUtils,
    Device: DeviceUtils
};

// ===== POLYFILLS =====
// Polyfill for IntersectionObserver (if needed)
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported. Consider adding a polyfill.');
}

// Polyfill for requestAnimationFrame (if needed)
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
}

console.log('Utils loaded successfully');