document.addEventListener("DOMContentLoaded", () => {
    
    // 1. EFEK PARALLAX SCROLL
    const parallaxElements = document.querySelectorAll(".parallax-elem");

    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;

        parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-speed")) || 0.1;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // 2. SCROLL REVEAL ANIMATION (MUNCUL SAAT DI-SCROLL)
    const revealElements = document.querySelectorAll(".reveal-on-scroll");

    const revealOnScrollObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target); // Hanya jalankan animasi 1 kali
                }
            });
        },
        {
            threshold: 0.15, // Pemicu saat 15% elemen terlihat di layar
        }
    );

    revealElements.forEach((el) => revealOnScrollObserver.observe(el));

    // 3. EFEK INTERAKTIF 3D TILT ON HOVER FOR ORGANISASI CARD
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 12; // Sudut kemiringan sumbu X
            const rotateY = (x / rect.width) * 12;  // Sudut kemiringan sumbu Y

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        });
    });
});