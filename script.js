document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // 1. INTRO / LANDING PAGE
    // ============================================================
    const intro = document.getElementById('intro');
    const enterBtn = document.getElementById('enter-btn');

    if (enterBtn && intro) {
        enterBtn.addEventListener('click', () => {
            intro.style.opacity = '0';
            intro.style.transform = 'scale(1.08)';
            setTimeout(() => {
                intro.style.display = 'none';
                document.body.style.overflow = 'auto';
                window.dispatchEvent(new Event('scroll'));
            }, 800);
        });

        document.addEventListener('wheel', (e) => {
            if (e.deltaY > 20 && intro.style.display !== 'none') {
                enterBtn.click();
            }
        }, { passive: true });
    }

    // ============================================================
    // 2. PARALLAX SCROLL
    // ============================================================
    const parallaxElements = document.querySelectorAll(".parallax-elem");
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-speed")) || 0.1;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================================
    // 3. SCROLL REVEAL
    // ============================================================
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================================
    // 4. 3D TILT CARD
    // ============================================================
    document.querySelectorAll(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (-y / rect.height) * 10;
            const rotateY = (x / rect.width) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
    });

    // ============================================================
    // 5. NAVBAR HIDE/SHOW
    // ============================================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 80) {
            navbar.style.transform = currentScroll > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // ============================================================
    // 6. MOBILE MENU TOGGLE
    // ============================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // ============================================================
    // 7. NAV LINK ACTIVE STATE
    // ============================================================
    const sections = document.querySelectorAll('#about, #skills, #organization, #portfolio, #footer');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('text-[#f9a400]');
            link.classList.add('text-white/60');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.remove('text-white/60');
                link.classList.add('text-[#f9a400]');
            }
        });
    });

    // ============================================================
    // 8. PORTFOLIO SLIDESHOW (AUTOSLIDE)
    // ============================================================
    const slides = document.querySelectorAll('.portfolio-slide');
    const dots = document.querySelectorAll('.dot-indicator');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    function showSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;

        slides.forEach((slide, i) => {
            slide.classList.remove('visible-slide', 'hidden-slide');
            if (i === currentIndex) {
                slide.classList.add('visible-slide');
            } else {
                slide.classList.add('hidden-slide');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.remove('bg-[#f9a400]', 'bg-white/20');
            dot.classList.add(i === currentIndex ? 'bg-[#f9a400]' : 'bg-white/20');
        });
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => showSlide(currentIndex + 1), 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(currentIndex - 1);
            startAutoSlide();
        });
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(currentIndex + 1);
            startAutoSlide();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(i);
            startAutoSlide();
        });
    });

    const sliderContainer = document.querySelector('#portfolio .glass-card');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    showSlide(0);
    startAutoSlide();

    console.log('✨ Portfolio Muhammad Yuan - Loaded Successfully!');
});