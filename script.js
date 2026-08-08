document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                let current = 0;
                const increment = Math.ceil(target / 50);
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = current;
                }, 25);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));



    const videoControls = {};

    document.querySelectorAll('.portfolio-video').forEach(function(video) {
        const videoId = video.id;
        const slide = video.closest('.portfolio-slide');
        const playBtn = slide ? slide.querySelector('.video-play-btn') : null;
        const progress = slide ? slide.querySelector('.video-progress') : null;
        const muteBtn = slide ? slide.querySelector('.video-mute-btn') : null;
        const timeDisplay = slide ? slide.querySelector('.video-time') : null;

        if (!videoId) return;

        videoControls[videoId] = {
            element: video,
            playBtn: playBtn,
            progress: progress,
            muteBtn: muteBtn,
            timeDisplay: timeDisplay,
            isMuted: true
        };

        video.muted = true;

        video.addEventListener('timeupdate', function() {
            if (this.duration) {
                const percent = (this.currentTime / this.duration) * 100;
                if (progress) progress.value = percent;

                if (timeDisplay) {
                    const formatTime = function(seconds) {
                        if (!seconds || isNaN(seconds)) return '0:00';
                        const mins = Math.floor(seconds / 60);
                        const secs = Math.floor(seconds % 60);
                        return mins + ':' + (secs < 10 ? '0' : '') + secs;
                    };
                    timeDisplay.textContent = formatTime(this.currentTime) + ' / ' + formatTime(this.duration);
                }
            }
        });

        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const videoEl = videoControls[videoId].element;

                if (videoEl.paused) {
                    Object.keys(videoControls).forEach(function(id) {
                        if (id !== videoId) {
                            videoControls[id].element.pause();
                            if (videoControls[id].playBtn) {
                                videoControls[id].playBtn.textContent = '▶';
                            }
                        }
                    });

                    videoEl.muted = false;
                    videoControls[videoId].isMuted = false;
                    if (muteBtn) muteBtn.textContent = '🔊';

                    videoEl.play().catch(function() {});
                    playBtn.textContent = '⏸';
                } else {
                    videoEl.pause();
                    playBtn.textContent = '▶';
                }
            });
        }

        if (progress) {
            progress.addEventListener('input', function() {
                const videoEl = videoControls[videoId].element;
                if (videoEl.duration) {
                    videoEl.currentTime = (this.value / 100) * videoEl.duration;
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const videoEl = videoControls[videoId].element;
                videoEl.muted = !videoEl.muted;
                videoControls[videoId].isMuted = videoEl.muted;
                muteBtn.textContent = videoEl.muted ? '🔇' : '🔊';

                if (!videoEl.muted) {
                    Object.keys(videoControls).forEach(function(id) {
                        if (id !== videoId) {
                            videoControls[id].element.muted = true;
                            videoControls[id].isMuted = true;
                            if (videoControls[id].muteBtn) {
                                videoControls[id].muteBtn.textContent = '🔇';
                            }
                        }
                    });
                }
            });
        }

        video.addEventListener('click', function() {
            if (playBtn) playBtn.click();
        });
    });

    const slides = document.querySelectorAll('.portfolio-slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const prevBtnInside = document.getElementById('prev-slide-inside');
    const nextBtnInside = document.getElementById('next-slide-inside');
    let currentIndex = 0;
    let autoSlide;

    function goToSlide(index) {

        Object.keys(videoControls).forEach(function(id) {
            if (videoControls[id].element) {
                videoControls[id].element.pause();
                if (videoControls[id].playBtn) {
                    videoControls[id].playBtn.textContent = '▶';
                }
            }
        });

        slides.forEach(function(slide, i) {
            slide.classList.toggle('active', i === index);
        });

        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === index);
        });

        currentIndex = index;

        setTimeout(function() {
            const activeSlide = document.querySelector('.portfolio-slide.active');
            if (activeSlide) {
                const video = activeSlide.querySelector('.portfolio-video');
                if (video && video.id) {
                    const v = videoControls[video.id];
                    if (v) {
                        if (video.currentTime >= video.duration - 0.1) {
                            video.currentTime = 0;
                        }
                        video.muted = false;
                        v.isMuted = false;
                        if (v.muteBtn) v.muteBtn.textContent = '🔊';
                        video.play().catch(function() {});
                        if (v.playBtn) v.playBtn.textContent = '⏸';
                    }
                }
            }
        }, 300);
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    function startAutoSlide() {
        if (autoSlide) clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlide) {
            clearInterval(autoSlide);
            autoSlide = null;
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); startAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); startAutoSlide(); });
    if (prevBtnInside) prevBtnInside.addEventListener('click', function() { prevSlide(); startAutoSlide(); });
    if (nextBtnInside) nextBtnInside.addEventListener('click', function() { nextSlide(); startAutoSlide(); });

    dots.forEach(function(dot, i) {
        dot.addEventListener('click', function() {
            goToSlide(i);
            startAutoSlide();
        });
    });

    const slider = document.querySelector('#slide-wrapper');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }

    goToSlide(0);
    startAutoSlide();

    document.querySelectorAll('.gallery-item').forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

});

(function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = function() {
        emailjs.init('JOli6OA0RA_0BFyV1');
    };
    document.head.appendChild(script);
})();

const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        btnText.textContent = 'Sending...';
        btnSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
        formStatus.className = 'text-center text-sm hidden';

        const serviceID = 'service_qcolxjk';
        const templateID = 'template_k39xaxe';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btnText.textContent = 'Sent! ✅';
                btnSpinner.classList.add('hidden');
                submitBtn.disabled = false;
                formStatus.className = 'text-center text-sm text-green-600 mt-3';
                formStatus.textContent = 'Message sent successfully! Thank you 🙏';
                contactForm.reset();

                setTimeout(() => {
                    btnText.textContent = 'Send Message';
                    formStatus.className = 'text-center text-sm hidden';
                }, 5000);
            })
            .catch((error) => {
                console.error('Error:', error);
                btnText.textContent = 'Send Message';
                btnSpinner.classList.add('hidden');
                submitBtn.disabled = false;
                formStatus.className = 'text-center text-sm text-red-500 mt-3';
                formStatus.textContent = 'Failed to send message. Please try again.';
            });
    });
}
