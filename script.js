document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================
    // 1. TYPING ANIMATION
    // ========================================
    const typingText = document.querySelector('.typing-text');
    const textToType = "Mahasiswa • Desainer • Videografer • Pengembang";
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        if (!typingText) return;
        
        if (!isDeleting) {
            // Mengetik
            typingText.textContent = textToType.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === textToType.length) {
                // Berhenti sebentar setelah selesai
                setTimeout(() => {
                    isDeleting = true;
                    typingSpeed = 40;
                    typeEffect();
                }, 2000);
                return;
            }
        } else {
            // Menghapus
            typingText.textContent = textToType.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                typingSpeed = 80;
                // Tunggu sebentar sebelum mengetik ulang
                setTimeout(typeEffect, 500);
                return;
            }
        }
        
        setTimeout(typeEffect, typingSpeed);
    }

    // Mulai typing animation
    setTimeout(typeEffect, 500);

    // ========================================
    // 2. EFEK PARALLAX SCROLL
    // ========================================
    const parallaxElements = document.querySelectorAll(".parallax-elem");

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;

        parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-speed")) || 0.1;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ========================================
    // 3. SCROLL REVEAL ANIMATION
    // ========================================
    const revealElements = document.querySelectorAll(".reveal-on-scroll");

    const revealOnScrollObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    revealElements.forEach((el) => revealOnScrollObserver.observe(el));

    // ========================================
    // 4. EFEK INTERAKTIF 3D TILT CARD
    // ========================================
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 12;
            const rotateY = (x / rect.width) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
    });

    // ========================================
    // 5. SMOOTH SCROLLING NAVBAR
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            if (currentScroll > lastScroll) {
                // Scroll ke bawah - sembunyikan navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scroll ke atas - tampilkan navbar
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // ========================================
    // 6. MOBILE MENU TOGGLE
    // ========================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Tutup menu saat klik link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // ========================================
    // 7. TEXT DISTORTION - Mouse Move Effect
    // ========================================
    const distortionTexts = document.querySelectorAll('.distortion-text');

    distortionTexts.forEach(text => {
        text.addEventListener('mousemove', (e) => {
            const rect = text.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            // Tambahkan efek tilt ringan pada teks
            text.style.transform = `skew(${x * 2}deg, ${y * 2}deg)`;
        });

        text.addEventListener('mouseleave', () => {
            text.style.transform = 'skew(0deg, 0deg)';
        });
    });

    // ========================================
    // 8. NAV LINK ACTIVE STATE
    // ========================================
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-[#f9a400]');
            link.classList.add('text-white/80');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.remove('text-white/80');
                link.classList.add('text-[#f9a400]');
            }
        });
    });

    console.log('✨ Portfolio Muhammad Yuan - Loaded Successfully!');
});