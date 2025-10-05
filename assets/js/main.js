/**
 * JobMatch Pro - Main JavaScript File
 * Handles core functionality and page interactions
 */

// ===== GLOBAL VARIABLES =====
let scrollPosition = 0;
let isAnimating = false;

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('JobMatch Pro initialized');
    
    // Initialize all components
    initializeApp();
});

// ===== MAIN INITIALIZATION =====
function initializeApp() {
    try {
        // Core functionality
        initializeScrollEffects();
        initializeAnimations();
        initializeIntersectionObserver();
        initializeLoadingStates();
        initializeAccessibility();
        
        // UI Components
        initializeTooltips();
        initializeSmoothScrolling();
        initializeFormValidation();
        
        // Performance optimizations
        initializeLazyLoading();
        preloadCriticalResources();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        handleError(error);
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateScrollEffects() {
        const currentScrollY = window.scrollY;
        
        // Header background opacity
        if (currentScrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(5px)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        // Header hide/show on scroll
        if (currentScrollY > 100) {
            if (currentScrollY > lastScrollY && !header.classList.contains('header--hidden')) {
                header.classList.add('header--hidden');
            } else if (currentScrollY < lastScrollY && header.classList.contains('header--hidden')) {
                header.classList.remove('header--hidden');
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Add CSS for header hiding
    const style = document.createElement('style');
    style.textContent = `
        .header--hidden {
            transform: translateY(-100%);
            transition: transform 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Add entrance animations to elements
    const animateElements = document.querySelectorAll('.feature-card, .blog-card, .stat-item');
    
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        element.style.animationDelay = `${index * 0.1}s`;
    });

    // Hero title animation
    const heroTitle = document.querySelector('.hero__title');
    const heroDescription = document.querySelector('.hero__description');
    const heroActions = document.querySelector('.hero__actions');

    if (heroTitle) {
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    if (heroDescription) {
        setTimeout(() => {
            heroDescription.style.opacity = '1';
            heroDescription.style.transform = 'translateY(0)';
        }, 400);
    }

    if (heroActions) {
        setTimeout(() => {
            heroActions.style.opacity = '1';
            heroActions.style.transform = 'translateY(0)';
        }, 600);
    }

    // Button ripple effect
    initializeButtonRipples();
}

// ===== BUTTON RIPPLE EFFECTS =====
function initializeButtonRipples() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple keyframes if not already present
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== INTERSECTION OBSERVER =====
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for multiple elements
                const siblings = Array.from(entry.target.parentNode.children);
                const index = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToObserve = document.querySelectorAll('.feature-card, .blog-card, .stat-item, .contact-card');
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                smoothScrollTo(targetPosition, 800);
            }
        });
    });
}

function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function animation(currentTime) {
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const easeInOut = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;
        
        window.scrollTo(0, startPosition + distance * easeInOut);
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// ===== LOADING STATES =====
function initializeLoadingStates() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        if (button.dataset.loading !== 'false') {
            button.addEventListener('click', function(e) {
                if (this.classList.contains('loading')) return;
                
                const originalText = this.textContent;
                this.classList.add('loading');
                this.textContent = 'Loading...';
                this.disabled = true;
                
                // Simulate loading (remove this in production)
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            });
        }
    });
}

// ===== ACCESSIBILITY =====
function initializeAccessibility() {
    // Skip to main content link
    addSkipLink();
    
    // Keyboard navigation
    initializeKeyboardNavigation();
    
    // Focus management
    initializeFocusManagement();
    
    // ARIA live regions
    initializeAriaLiveRegions();
}

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    
    const style = document.createElement('style');
    style.textContent = `
        .skip-link {
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
        }
        .skip-link:focus {
            top: 6px;
        }
    `;
    document.head.appendChild(style);
    document.body.insertBefore(skipLink, document.body.firstChild);
}

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key to close mobile menu
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.focus();
            }
        }
        
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    // Remove keyboard class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });
}

function initializeFocusManagement() {
    // Enhanced focus styles for keyboard users
    const style = document.createElement('style');
    style.textContent = `
        body:not(.using-keyboard) *:focus {
            outline: none;
        }
        
        .using-keyboard *:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

function initializeAriaLiveRegions() {
    // Create aria-live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
}

// ===== FORM VALIDATION =====
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const isValid = validateForm(this);
            
            if (isValid) {
                announceToScreenReader('Form submitted successfully');
                // Handle form submission
                console.log('Form is valid, ready to submit');
            } else {
                announceToScreenReader('Please correct the errors in the form');
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Display validation result
    displayFieldValidation(field, isValid, errorMessage);
    
    return isValid;
}

function displayFieldValidation(field, isValid, errorMessage) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('field-valid', 'field-invalid');
    
    if (!isValid) {
        field.classList.add('field-invalid');
        field.setAttribute('aria-invalid', 'true');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = errorMessage;
        errorElement.id = `${field.id}-error`;
        field.setAttribute('aria-describedby', errorElement.id);
        
        field.parentNode.appendChild(errorElement);
    } else {
        field.classList.add('field-valid');
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
    }
}

// ===== TOOLTIPS =====
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        tooltip.classList.add('visible');
    }, 10);
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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