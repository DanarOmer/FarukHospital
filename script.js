/**
 * پلانی هاوبەشی مارکێتینگ - نەخۆشخانەی هەرێم
 * Interactive Features & Transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initMockupsSlider();
    initLightbox();
    init3DTilt();
    initCounterAnimation();
    initHeroParticles();
});

/* ==========================================================================
   Navbar Behavior
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    function openMobileMenu() {
        if (!mobileToggle || !navMenu) return;
        mobileToggle.classList.add('open');
        navMenu.classList.add('open');
        document.body.classList.add('menu-open');
        if (navbar) navbar.classList.add('menu-open');
    }

    function closeMobileMenu() {
        if (!mobileToggle || !navMenu) return;
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        if (navbar) navbar.classList.remove('menu-open');
    }

    function toggleMobileMenu() {
        if (navMenu && navMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Scroll state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar && navbar.classList.add('scrolled');
        } else {
            navbar && navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, { passive: true });

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close mobile menu on link click & smooth scroll to target
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();

            const targetHref = link.getAttribute('href');
            if (targetHref && targetHref.startsWith('#')) {
                const targetElement = document.querySelector(targetHref);
                if (targetElement) {
                    e.preventDefault();
                    const navHeight = navbar ? navbar.offsetHeight : 70;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Close menu when clicking outside on backdrop
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('open')) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    });

    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* ==========================================================================
   Scroll-Reveal Transitions (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                obs.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Mockup Carousel & Slider
   ========================================================================== */
function initMockupsSlider() {
    const track = document.getElementById('mockupsTrack');
    const prevBtn = document.getElementById('prevMockup');
    const nextBtn = document.getElementById('nextMockup');
    const cards = document.querySelectorAll('.phone-mockup-card');

    if (!track || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: 280, behavior: 'smooth' }); // RTL direction
    });

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: -280, behavior: 'smooth' });
    });

    // Highlight active card on hover or click
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

/* ==========================================================================
   Lightbox Modal for Fullscreen Mockup Preview
   ========================================================================== */
function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImage');
    const modalCaption = document.getElementById('lightboxCaption');
    const backdrop = document.getElementById('lightboxBackdrop');
    const closeBtn = document.getElementById('lightboxClose');
    const cards = document.querySelectorAll('.phone-mockup-card');

    if (!modal || !modalImg || !cards.length) return;

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const externalUrl = card.getAttribute('data-url') || card.getAttribute('href');
            if (externalUrl) {
                // If the card links to Instagram, allow native navigation in new tab
                return;
            }
            const img = card.querySelector('.screen-img');
            const title = card.querySelector('h4')?.textContent || 'نمونەی کار';
            if (img) {
                modalImg.src = img.src;
                modalCaption.textContent = title;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   3D Tilt Effect on Interactive Cards
   ========================================================================== */
function init3DTilt() {
    const tiltCards = document.querySelectorAll('.main-visual-card, .service-card, .client-card, .pricing-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;

            // Subtle rotation limit (maximum 4 degrees for smooth luxury feel)
            const rotateX = -deltaY * 3.5;
            const rotateY = deltaX * 3.5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease-out';
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });
}

/* ==========================================================================
   Counter Numbers Animation
   ========================================================================== */
function toKurdishDigits(num) {
    const kurdishDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, d => kurdishDigits[d]);
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.metric-num');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'), 10);
                    if (isNaN(target)) return;

                    const duration = 1800;
                    const startTime = performance.now();
                    const startVal = 0;

                    function updateNumber(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease-out cubic formula
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(startVal + (target - startVal) * easeOut);

                        if (target === 2023) {
                            counter.textContent = toKurdishDigits(current);
                        } else if (target === 6) {
                            counter.textContent = `+${toKurdishDigits(current)}`;
                        } else if (target === 100) {
                            counter.textContent = `%${toKurdishDigits(current)}`;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        }
                    }

                    requestAnimationFrame(updateNumber);
                });
            }
        });
    }, { threshold: 0.5 });

    const heroMetrics = document.querySelector('.hero-metrics');
    if (heroMetrics) observer.observe(heroMetrics);
}

/* ==========================================================================
   Hero Ambient Particle Dots
   ========================================================================== */
function initHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = 28;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';

        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(139, 187, 146, ${Math.random() * 0.4 + 0.15});
            top: ${posY}%;
            left: ${posX}%;
            box-shadow: 0 0 10px rgba(139, 187, 146, 0.4);
            animation: floatParticle ${duration}s infinite linear ${delay}s;
            pointer-events: none;
        `;
        container.appendChild(particle);
    }

    // Add keyframes dynamically if not present
    if (!document.getElementById('particleKeyframes')) {
        const style = document.createElement('style');
        style.id = 'particleKeyframes';
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(0) translateX(0); opacity: 0.2; }
                50% { transform: translateY(-40px) translateX(25px); opacity: 0.8; }
                100% { transform: translateY(0) translateX(0); opacity: 0.2; }
            }
        `;
        document.head.appendChild(style);
    }
}
