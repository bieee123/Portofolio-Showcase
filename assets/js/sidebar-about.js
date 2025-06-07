// YouTube-Style Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('overlay');

    // Toggle sidebar function
    function toggleSidebar() {
        const isOpen = !sidebar.classList.contains('-translate-x-full');
        
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    // Open sidebar
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        
        // Update ARIA attributes
        sidebar.setAttribute('aria-hidden', 'false');
        sidebarToggle.setAttribute('aria-expanded', 'true');
    }

    // Close sidebar
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        
        // Update ARIA attributes
        sidebar.setAttribute('aria-hidden', 'true');
        sidebarToggle.setAttribute('aria-expanded', 'false');
    }

    // Event listeners
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close sidebar with Escape key
        if (e.key === 'Escape' && !sidebar.classList.contains('-translate-x-full')) {
            closeSidebar();
        }
        
        // Toggle sidebar with Ctrl+B (YouTube-style)
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        // Don't auto-close on desktop like YouTube
        // User can manually close/open as needed
    });

                // Touch/swipe gesture support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Touch event handlers
    sidebar.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    sidebar.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    // Main content swipe to open sidebar
    document.addEventListener('touchstart', function(e) {
        // Only handle swipe from left edge of screen
        if (e.touches[0].clientX < 20 && sidebar.classList.contains('-translate-x-full')) {
            touchStartX = e.touches[0].screenX;
            touchStartY = e.touches[0].screenY;
        }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        if (touchStartX < 20 && sidebar.classList.contains('-translate-x-full')) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipeToOpen();
        }
    }, { passive: true });

    // Handle swipe gestures
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartX - touchEndX;
        const verticalDistance = Math.abs(touchStartY - touchEndY);
        
        // Only handle horizontal swipes (vertical distance should be small)
        if (verticalDistance < 100) {
            // Swipe left to close sidebar
            if (swipeDistance > swipeThreshold && !sidebar.classList.contains('-translate-x-full')) {
                closeSidebar();
            }
        }
    }

    function handleSwipeToOpen() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        const verticalDistance = Math.abs(touchStartY - touchEndY);
        
        // Only handle horizontal swipes (vertical distance should be small)
        if (verticalDistance < 100) {
            // Swipe right from left edge to open sidebar
            if (swipeDistance > swipeThreshold) {
                openSidebar();
            }
        }
    }

    // Enhanced focus management for accessibility
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            const isTabPressed = e.key === 'Tab';

            if (!isTabPressed) return;

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // Apply focus trap when sidebar is open
    function updateFocusManagement() {
        if (!sidebar.classList.contains('-translate-x-full')) {
            trapFocus(sidebar);
            // Focus on close button when sidebar opens
            setTimeout(() => {
                sidebarClose.focus();
            }, 300); // Wait for animation to complete
        }
    }

    // Update the openSidebar function to include focus management
    const originalOpenSidebar = openSidebar;
    openSidebar = function() {
        originalOpenSidebar();
        updateFocusManagement();
    };

    // Smooth scroll behavior for navigation links
    const navLinks = sidebar.querySelectorAll('a[href]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close sidebar on navigation (mobile-friendly)
            if (window.innerWidth < 1024) {
                setTimeout(() => {
                    closeSidebar();
                }, 150);
            }
        });
    });

    // Add visual feedback for interactive elements
    const interactiveElements = sidebar.querySelectorAll('button, a');
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });

        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    });

    // Performance optimization: debounce resize handler
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

    // Enhanced resize handler
    const handleResize = debounce(function() {
        // Auto-close sidebar on large screens if user prefers
        if (window.innerWidth >= 1024) {
            // Optional: Uncomment to auto-close on desktop
            // closeSidebar();
        }
        
        // Reset touch coordinates on resize
        touchStartX = 0;
        touchStartY = 0;
        touchEndX = 0;
        touchEndY = 0;
    }, 250);

    window.addEventListener('resize', handleResize);

    // Prevent body scroll when sidebar is open (iOS Safari fix)
    function preventBodyScroll(prevent) {
        if (prevent) {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    // Update open/close functions to handle body scroll
    const originalCloseSidebar = closeSidebar;
    closeSidebar = function() {
        originalCloseSidebar();
        preventBodyScroll(false);
    };

    openSidebar = function() {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
        preventBodyScroll(true);
        
        // Update ARIA attributes
        sidebar.setAttribute('aria-hidden', 'false');
        sidebarToggle.setAttribute('aria-expanded', 'true');
        
        updateFocusManagement();
    };

    // Initialize
    console.log('YouTube-style sidebar initialized successfully');
});