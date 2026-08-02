document.addEventListener("DOMContentLoaded", () => {

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

    const parallaxElements = document.querySelectorAll(".parallax-elem");
    window.addEventListener("scroll", () => {
        const scrolled = window.scrollY;
        const windowHeight = window.innerHeight;
        parallaxElements.forEach((el) => {
            const speed = parseFloat(el.getAttribute("data-speed")) || 0.1;
            const direction = el.getAttribute("data-direction") || "up";
            const rect = el.getBoundingClientRect();
            const centerPoint = rect.top + rect.height / 2;
            const viewportCenter = windowHeight / 2;
            const offset = (centerPoint - viewportCenter) / windowHeight;
            
            let translateY;
            if (direction === "up") {
                translateY = scrolled * speed + offset * 30;
            } else {
                translateY = -scrolled * speed + offset * 30;
            }
            el.style.transform = `translateY(${translateY}px)`;
        });
    });

    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    entry.target.classList.add("is-visible");
                }, delay * 1000);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

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

    const progressBar = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let current = 0;
                const increment = Math.ceil(target / 40);
                const duration = 1200;
                const stepTime = duration / 40;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = current;
                }, stepTime);

                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    const sections = document.querySelectorAll('#about, #stats, #data-diri, #skills, #organisasi, #kepanitiaan, #hobby, #portfolio, #footer');
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
            dot.style.transform = i === currentIndex ? 'scale(1.3)' : 'scale(1)';
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
            setTimeout(startAutoSlide, 3000);
        });
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(currentIndex + 1);
            setTimeout(startAutoSlide, 3000);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(i);
            setTimeout(startAutoSlide, 3000);
        });
    });

    const sliderContainer = document.querySelector('#portfolio .glass-card');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }

    showSlide(0);
    startAutoSlide();

    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;
        let mouseX = -1000;
        let mouseY = -1000;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.originalX = this.x;
                this.originalY = this.y;
            }

            update() {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const force = (150 - dist) / 150 * 0.5;
                    this.x -= dx / dist * force;
                    this.y -= dy / dist * force;
                    this.opacity = Math.min(this.opacity + 0.01, 0.6);
                } else {
                    this.x += (this.originalX - this.x) * 0.02;
                    this.y += (this.originalY - this.y) * 0.02;
                    this.opacity = Math.max(this.opacity - 0.002, 0.1);
                }

                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
                this.originalX = this.x;
                this.originalY = this.y;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(249, 164, 0, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 180) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = 0.08 * (1 - distance / 180);
                        ctx.strokeStyle = `rgba(249, 164, 0, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }

        animateParticles();

        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const observer = new MutationObserver(() => {
                if (intro.style.display === 'none') {
                    canvas.style.opacity = '1';
                }
            });
            observer.observe(intro, { attributes: true, attributeFilter: ['style'] });
        }
    }

});