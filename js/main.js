/* =============================================
   SAFARSORTED 2.0 - PREMIUM JAVASCRIPT
   World-Class Interactivity & Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initPageLoader();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initParallax();
    initTestimonialsCarousel();
    initFormValidation();
    initFilterTags();
    initCounterAnimation();
    initTravelerTypeSelector();
    initSmoothScroll();
});

/* =============================================
   PAGE LOADER
   ============================================= */
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.style.overflow = '';
        }, 500);
    });

    // Prevent scroll during loading
    document.body.style.overflow = 'hidden';
}

/* =============================================
   NAVBAR - Scroll Effect & Glass Morphism
   ============================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll direction (optional)
        // if (currentScroll > lastScroll && currentScroll > 300) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }

        lastScroll = currentScroll;
    });
}

/* =============================================
   MOBILE MENU - Animated Toggle
   ============================================= */
function initMobileMenu() {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');

    if (!toggle || !menu) return;

    // Toggle menu
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* =============================================
   SCROLL REVEAL ANIMATIONS
   ============================================= */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal, .stagger-children');

    if (!reveals.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));

    // Also animate destination cards, stat cards
    const cards = document.querySelectorAll('.destination-card, .stat-card, .traveler-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, Math.random() * 200);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cardObserver.observe(card);
    });
}

/* =============================================
   PARALLAX EFFECT
   ============================================= */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-floating');

    if (!parallaxElements.length) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;

                parallaxElements.forEach((el, index) => {
                    const speed = 0.2 + (index * 0.1);
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

/* =============================================
   TESTIMONIALS CAROUSEL
   ============================================= */
function initTestimonialsCarousel() {
    const testimonials = [
        {
            quote: "SafarSorted made our Manali trip absolutely magical! From the stay to the activities, everything was perfectly planned. We didn't have to worry about anything. Truly the best travel experience we've ever had.",
            author: "Priya & Rahul",
            role: "Honeymoon in Manali",
            avatar: "images/founder.jpg"
        },
        {
            quote: "Our family trip to Dharamshala was unforgettable thanks to SafarSorted. They customized everything for us - from kid-friendly activities to the perfect accommodations. Everyone had the time of their lives!",
            author: "The Sharma Family",
            role: "Family Trip to Dharamshala",
            avatar: "images/founder.jpg"
        },
        {
            quote: "As a solo traveler, I was nervous about my Rishikesh trip. SafarSorted not only made it seamless but introduced me to experiences I never knew existed. The river rafting and yoga sessions changed my life!",
            author: "Ananya Verma",
            role: "Solo Adventure in Rishikesh",
            avatar: "images/founder.jpg"
        }
    ];

    const container = document.querySelector('.testimonials-container');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (!container || !dotsContainer) return;

    let currentIndex = 0;
    let autoplayInterval;

    const updateTestimonial = (index) => {
        const card = container.querySelector('.testimonial-card');
        const t = testimonials[index];

        // Fade out
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.querySelector('.testimonial-quote').textContent = t.quote;
            card.querySelector('.testimonial-info h4').textContent = t.author;
            card.querySelector('.testimonial-info p').textContent = t.role;
            card.querySelector('.testimonial-avatar').src = t.avatar;

            // Fade in
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300);

        // Update dots
        dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;
    };

    // Dot click handlers
    dotsContainer.querySelectorAll('.testimonial-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            updateTestimonial(index);
            resetAutoplay();
        });
    });

    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % testimonials.length;
            updateTestimonial(nextIndex);
        }, 6000);
    };

    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };

    startAutoplay();
}

/* =============================================
   FORM VALIDATION & SUBMISSION
   ============================================= */
function initFormValidation() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Get form data
        const formData = {
            name: form.querySelector('#name').value.trim(),
            phone: form.querySelector('#phone').value.trim(),
            travelers: form.querySelector('#travelers').value,
            destination: form.querySelector('#destination').value,
            travelDate: form.querySelector('#travelDate')?.value || ''
        };

        // Show loading state
        submitBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 60"/>
            </svg>
            Processing...
        `;
        submitBtn.disabled = true;

        // Use backend service if available, fallback to direct localStorage
        if (window.SS && window.SS.Forms) {
            const result = await window.SS.Forms.submitInquiry(formData);
            if (result.success) {
                form.reset();
            }
        } else {
            // Fallback - save directly to localStorage
            const inquiry = {
                id: Date.now(),
                ...formData,
                travelers: parseInt(formData.travelers),
                status: 'new',
                notes: '',
                created_at: new Date().toISOString()
            };
            const inquiries = JSON.parse(localStorage.getItem('safarsorted_inquiries') || '[]');
            inquiries.unshift(inquiry);
            localStorage.setItem('safarsorted_inquiries', JSON.stringify(inquiries));
            showNotification('Thank you! We\'ll contact you within 2 hours.', 'success');
            form.reset();
        }

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

/* =============================================
   NOTIFICATION SYSTEM
   ============================================= */
function showNotification(message, type = 'info') {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            ${type === 'success' ?
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' :
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        }
        </div>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
    `;

    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '100px',
        right: '24px',
        padding: '16px 20px',
        paddingRight: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        zIndex: '9999',
        maxWidth: '400px',
        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: type === 'success' ? '#2E7D32' : type === 'error' ? '#c41e3a' : '#333',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.95rem'
    });

    const iconStyle = notification.querySelector('.notification-icon');
    Object.assign(iconStyle.style, {
        width: '24px',
        height: '24px',
        flexShrink: '0'
    });

    const closeBtn = notification.querySelector('button');
    Object.assign(closeBtn.style, {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        padding: '4px',
        opacity: '0.8'
    });

    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .spinner {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* =============================================
   FILTER TAGS (Destinations Page)
   ============================================= */
function initFilterTags() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const cards = document.querySelectorAll('.destination-detail-card');

    if (!filterTags.length || !cards.length) return;

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.dataset.filter;

            // Update active state
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            // Filter cards with animation
            cards.forEach((card, index) => {
                const categories = card.dataset.category || '';
                const shouldShow = filter === 'all' || categories.includes(filter);

                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    if (!counters.length) return;

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.round(current) + '+';
                requestAnimationFrame(update);
            } else {
                el.textContent = target + '+';
            }
        };

        update();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

/* =============================================
   TRAVELER TYPE SELECTOR
   ============================================= */
function initTravelerTypeSelector() {
    const cards = document.querySelectorAll('.traveler-card');

    if (!cards.length) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all
            cards.forEach(c => c.classList.remove('selected'));

            // Add to clicked
            card.classList.add('selected');

            // Store selection
            const type = card.dataset.type;
            sessionStorage.setItem('travelerType', type);

            // Store in backend if available
            if (window.SS && window.SS.UserPrefs) {
                window.SS.UserPrefs.setTravelerType(type);
            }

            // Visual feedback
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);

            // Scroll to inquiry form after a short delay
            setTimeout(() => {
                const inquirySection = document.getElementById('inquiry');
                if (inquirySection) {
                    inquirySection.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Flash the form to draw attention
                    const form = inquirySection.querySelector('form');
                    if (form) {
                        form.style.boxShadow = '0 0 30px rgba(211, 47, 47, 0.5)';
                        setTimeout(() => {
                            form.style.boxShadow = '';
                        }, 1500);
                    }
                }
            }, 300);
        });
    });

    // Restore previous selection
    const savedType = sessionStorage.getItem('travelerType');
    if (savedType) {
        const savedCard = document.querySelector(`.traveler-card[data-type="${savedType}"]`);
        if (savedCard) {
            savedCard.classList.add('selected');
        }
    }
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */

// Debounce
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

// Throttle
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format currency
function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}
