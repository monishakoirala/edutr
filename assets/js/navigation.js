/**
 * JobMatch Pro - Navigation JavaScript
 * Handles navigation functionality and mobile menu
 */

// ===== NAVIGATION STATE =====
let navigationState = {
    mobileMenuOpen: false,
    currentPage: 'home',
    scrollPosition: 0
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

// ===== MAIN NAVIGATION INITIALIZATION =====
function initializeNavigation() {
    try {
        initializeMobileMenu();
        initializeActiveStates();
        initializeNavigationEvents();
        initializeBreadcrumbs();
        
        console.log('Navigation initialized successfully');
    } catch (error) {
        console.error('Error initializing navigation:', error);
    }
}

// ===== MOBILE MENU =====
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle button click handler
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking on links
    const navLinks = navMenu.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navigationState.mobileMenuOpen && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768 && navigationState.mobileMenuOpen) {
            closeMobileMenu();
        }
    }, 250));
    
    // Keyboard navigation for mobile menu
    navToggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Escape key to close menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navigationState.mobileMenuOpen) {
            closeMobileMenu();
            navToggle.focus();
        }
    });
}

function toggleMobileMenu() {
    if (navigationState.mobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.classList.add('active');
    navMenu.classList.add('active');
    navigationState.mobileMenuOpen = true;
    
    // Prevent body scroll
    navigationState.scrollPosition = window.pageYOffset;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${navigationState.scrollPosition}px`;
    document.body.style.width = '100%';
    
    // Update ARIA attributes
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    
    // Focus first menu item
    const firstLink = navMenu.querySelector('.nav__link');
    if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
    }
    
    // Announce to screen readers
    announceToScreenReader('Navigation menu opened');
    
    // Track event
    trackEvent('mobile_menu_opened');
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    navigationState.mobileMenuOpen = false;
    
    // Restore body scroll
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo(0, navigationState.scrollPosition);
    
    // Update ARIA attributes
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    
    // Announce to screen readers
    announceToScreenReader('Navigation menu closed');
    
    // Track event
    trackEvent('mobile_menu_closed');
}

// ===== ACTIVE STATES =====
function initializeActiveStates() {
    updateActiveNavigationState();
    
    // Update active state when navigating
    window.addEventListener('popstate', updateActiveNavigationState);
}

function updateActiveNavigationState() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        
        const href = link.getAttribute('href');
        if (href) {
            // Handle different URL patterns
            if (currentPath === '/' && href === 'index.html') {
                link.classList.add('nav__link--active');
                navigationState.currentPage = 'home';
            } else if (href !== 'index.html' && currentPath.includes(getPageNameFromHref(href))) {
                link.classList.add('nav__link--active');
                navigationState.currentPage = getPageNameFromHref(href);
            }
        }
    });
}

function getPageNameFromHref(href) {
    if (href.includes('/')) {
        return href.split('/').pop().replace('.html', '');
    }
    return href.replace('.html', '');
}

// ===== NAVIGATION EVENTS =====
function initializeNavigationEvents() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        // Click tracking
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const pageName = getPageNameFromHref(href);
            
            trackEvent('navigation_click', {
                page_name: pageName,
                link_text: this.textContent.trim(),
                link_url: href
            });
        });
        
        // Hover effects with keyboard support
        link.addEventListener('mouseenter', handleLinkHover);
        link.addEventListener('focus', handleLinkHover);
        link.addEventListener('mouseleave', handleLinkLeave);
        link.addEventListener('blur', handleLinkLeave);
    });
}

function handleLinkHover(e) {
    const link = e.target;
    link.style.transform = 'translateY(-2px)';
    link.style.transition = 'transform 0.2s ease';
}

function handleLinkLeave(e) {
    const link = e.target;
    link.style.transform = 'translateY(0)';
}

// ===== BREADCRUMBS =====
function initializeBreadcrumbs() {
    const breadcrumbContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbContainer) return;
    
    const breadcrumbs = generateBreadcrumbs();
    renderBreadcrumbs(breadcrumbs, breadcrumbContainer);
}

function generateBreadcrumbs() {
    const path = window.location.pathname;
    const breadcrumbs = [{ name: 'Home', url: 'index.html' }];
    
    // Parse current path
    if (path !== '/' && !path.endsWith('index.html')) {
        const segments = path.split('/').filter(segment => segment);
        
        segments.forEach((segment, index) => {
            const name = formatBreadcrumbName(segment);
            const url = segments.slice(0, index + 1).join('/') + '.html';
            breadcrumbs.push({ name, url });
        });
    }
    
    return breadcrumbs;
}

function formatBreadcrumbName(segment) {
    return segment
        .replace('.html', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function renderBreadcrumbs(breadcrumbs, container) {
    const breadcrumbList = document.createElement('ol');
    breadcrumbList.className = 'breadcrumb-list';
    breadcrumbList.setAttribute('aria-label', 'Breadcrumb navigation');
    
    breadcrumbs.forEach((crumb, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'breadcrumb-item';
        
        if (index === breadcrumbs.length - 1) {
            // Current page (not a link)
            listItem.textContent = crumb.name;
            listItem.setAttribute('aria-current', 'page');
        } else {
            // Link to previous pages
            const link = document.createElement('a');
            link.href = crumb.url;
            link.textContent = crumb.name;
            link.className = 'breadcrumb-link';
            listItem.appendChild(link);
        }
        
        breadcrumbList.appendChild(listItem);
    });
    
    container.appendChild(breadcrumbList);
}

// ===== NAVIGATION HELPERS =====
function navigateToPage(href, trackEvent = true) {
    if (trackEvent) {
        trackEvent('programmatic_navigation', {
            destination: href,
            source: 'javascript'
        });
    }
    
    window.location.href = href;
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
        trackEvent('navigation_back');
    } else {
        navigateToPage('index.html');
    }
}

function goHome() {
    navigateToPage('index.html');
}

// ===== NAVIGATION ANIMATIONS =====
function animateNavigationChange(direction = 'forward') {
    const main = document.querySelector('.main');
    if (!main) return;
    
    main.style.opacity = '0';
    main.style.transform = direction === 'forward' ? 'translateX(20px)' : 'translateX(-20px)';
    
    setTimeout(() => {
        main.style.opacity = '1';
        main.style.transform = 'translateX(0)';
        main.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }, 150);
}

// ===== SEARCH FUNCTIONALITY =====
function initializeNavigationSearch() {
    const searchInput = document.querySelector('.nav-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function(e) {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 2) {
            performNavigationSearch(query);
        } else {
            clearSearchResults();
        }
    }, 300));
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            clearSearchResults();
            this.blur();
        }
    });
}

function performNavigationSearch(query) {
    // This would typically search through your content/pages
    const searchablePages = [
        { title: 'Home', url: 'index.html', keywords: ['home', 'main', 'start'] },
        { title: 'Blog', url: 'pages/blog.html', keywords: ['blog', 'articles', 'posts'] },
        { title: 'About', url: 'pages/about.html', keywords: ['about', 'company', 'team'] },
        { title: 'Contact', url: 'pages/contact.html', keywords: ['contact', 'support', 'help'] },
        { title: 'Privacy Policy', url: 'pages/privacy.html', keywords: ['privacy', 'policy', 'data'] },
        { title: 'Terms of Service', url: 'pages/terms.html', keywords: ['terms', 'service', 'legal'] }
    ];
    
    const results = searchablePages.filter(page => 
        page.title.toLowerCase().includes(query) ||
        page.keywords.some(keyword => keyword.includes(query))
    );
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    let resultsContainer = document.querySelector('.nav-search-results');
    
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'nav-search-results';
        document.querySelector('.nav-search').parentNode.appendChild(resultsContainer);
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
        resultsContainer.innerHTML = results.map(result => `
            <a href="${result.url}" class="search-result-item">
                <span class="search-result-title">${result.title}</span>
            </a>
        `).join('');
    }
    
    resultsContainer.style.display = 'block';
}

function clearSearchResults() {
    const resultsContainer = document.querySelector('.nav-search-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
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
}

// ===== EXPORT NAVIGATION FUNCTIONS =====
window.Navigation = {
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
    navigateToPage,
    goBack,
    goHome,
    updateActiveNavigationState,
    animateNavigationChange
};

// ===== ADD STYLES FOR NAVIGATION =====
const navigationStyles = document.createElement('style');
navigationStyles.textContent = `
    .breadcrumbs {
        padding: 1rem 0;
        background-color: var(--light-gray);
        border-bottom: 1px solid #e9ecef;
    }
    
    .breadcrumb-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        flex-wrap: wrap;
    }
    
    .breadcrumb-item {
        display: flex;
        align-items: center;
    }
    
    .breadcrumb-item:not(:last-child)::after {
        content: '/';
        margin: 0 0.5rem;
        color: var(--medium-gray);
    }
    
    .breadcrumb-link {
        color: var(--accent-color);
        text-decoration: none;
        transition: color 0.2s ease;
    }
    
    .breadcrumb-link:hover {
        color: var(--accent-dark);
        text-decoration: underline;
    }
    
    .breadcrumb-item[aria-current="page"] {
        color: var(--medium-gray);
        font-weight: var(--font-weight-medium);
    }
    
    .nav-search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--white);
        border: 1px solid #e9ecef;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        display: none;
        max-height: 300px;
        overflow-y: auto;
    }
    
    .search-result-item {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--text-color);
        text-decoration: none;
        border-bottom: 1px solid #f8f9fa;
        transition: background-color 0.2s ease;
    }
    
    .search-result-item:hover,
    .search-result-item:focus {
        background-color: var(--accent-light);
        color: var(--accent-color);
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-title {
        font-weight: var(--font-weight-medium);
    }
    
    .search-no-results {
        padding: 1rem;
        text-align: center;
        color: var(--medium-gray);
        font-style: italic;
    }
`;
document.head.appendChild(navigationStyles);