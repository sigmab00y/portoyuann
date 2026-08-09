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

    const slides = document.querySelectorAll('.portfolio-slide');
    const dots = document.querySelectorAll('.slide-dot');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const prevBtnInside = document.getElementById('prev-slide-inside');
    const nextBtnInside = document.getElementById('next-slide-inside');
    let currentIndex = 0;

    const videos = {
        'video-0': {
            element: document.getElementById('video-0'),
            playBtn: document.querySelector('[data-video="video-0"].video-play-btn'),
            progress: document.querySelector('[data-video="video-0"].video-progress'),
            muteBtn: document.querySelector('[data-video="video-0"].video-mute-btn'),
            timeDisplay: document.querySelector('[data-video="video-0"].video-time'),
            isMuted: true
        },
        'video-1': {
            element: document.getElementById('video-1'),
            playBtn: document.querySelector('[data-video="video-1"].video-play-btn'),
            progress: document.querySelector('[data-video="video-1"].video-progress'),
            muteBtn: document.querySelector('[data-video="video-1"].video-mute-btn'),
            timeDisplay: document.querySelector('[data-video="video-1"].video-time'),
            isMuted: true
        },
        'video-2': {
            element: document.getElementById('video-2'),
            playBtn: document.querySelector('[data-video="video-2"].video-play-btn'),
            progress: document.querySelector('[data-video="video-2"].video-progress'),
            muteBtn: document.querySelector('[data-video="video-2"].video-mute-btn'),
            timeDisplay: document.querySelector('[data-video="video-2"].video-time'),
            isMuted: true
        },
        'video-3': {
            element: document.getElementById('video-3'),
            playBtn: document.querySelector('[data-video="video-3"].video-play-btn'),
            progress: document.querySelector('[data-video="video-3"].video-progress'),
            muteBtn: document.querySelector('[data-video="video-3"].video-mute-btn'),
            timeDisplay: document.querySelector('[data-video="video-3"].video-time'),
            isMuted: true
        },
        'video-4': {
            element: document.getElementById('video-4'),
            playBtn: document.querySelector('[data-video="video-4"].video-play-btn'),
            progress: document.querySelector('[data-video="video-4"].video-progress'),
            muteBtn: document.querySelector('[data-video="video-4"].video-mute-btn'),
            timeDisplay: document.querySelector('[data-video="video-4"].video-time'),
            isMuted: true
        }
    };

    Object.keys(videos).forEach(videoId => {
        const v = videos[videoId];
        if (!v.element) return;

        v.element.muted = true;

        v.element.addEventListener('timeupdate', function() {
            if (this.duration) {
                const percent = (this.currentTime / this.duration) * 100;
                if (v.progress) v.progress.value = percent;
                
                const formatTime = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                };
                if (v.timeDisplay) {
                    v.timeDisplay.textContent = `${formatTime(this.currentTime)} / ${formatTime(this.duration)}`;
                }
            }
        });

        v.element.addEventListener('ended', function() {
            this.currentTime = 0;
            if (v.playBtn) v.playBtn.textContent = '▶';
            const parentSlide = this.closest('.portfolio-slide');
            if (parentSlide && parentSlide.classList.contains('active')) {
                setTimeout(() => {
                    this.play().catch(() => {});
                    if (v.playBtn) v.playBtn.textContent = '⏸';
                }, 300);
            }
        });

        if (v.playBtn) {
            v.playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const video = v.element;
                
                if (video.paused) {
                    Object.keys(videos).forEach(id => {
                        if (id !== videoId) {
                            videos[id].element.pause();
                            if (videos[id].playBtn) videos[id].playBtn.textContent = '▶';
                        }
                    });
                    
                    Object.keys(videos).forEach(id => {
                        if (id !== videoId) {
                            videos[id].element.muted = true;
                            if (videos[id].muteBtn) videos[id].muteBtn.textContent = '🔇';
                            videos[id].isMuted = true;
                        }
                    });
                    
                    video.muted = false;
                    v.isMuted = false;
                    if (v.muteBtn) v.muteBtn.textContent = '🔊';
                    
                    video.play();
                    this.textContent = '⏸';
                } else {
                    video.pause();
                    this.textContent = '▶';
                }
            });
        }

        if (v.progress) {
            v.progress.addEventListener('input', function() {
                const percent = this.value;
                if (v.element.duration) {
                    v.element.currentTime = (percent / 100) * v.element.duration;
                }
            });
        }

        if (v.muteBtn) {
            v.muteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                v.element.muted = !v.element.muted;
                v.isMuted = v.element.muted;
                this.textContent = v.element.muted ? '🔇' : '🔊';
                
                if (!v.element.muted) {
                    Object.keys(videos).forEach(id => {
                        if (id !== videoId) {
                            videos[id].element.muted = true;
                            videos[id].isMuted = true;
                            if (videos[id].muteBtn) videos[id].muteBtn.textContent = '🔇';
                        }
                    });
                }
            });
        }

        v.element.addEventListener('click', function() {
            if (v.playBtn) v.playBtn.click();
        });
    });

    function goToSlide(index) {
        Object.keys(videos).forEach(id => {
            if (videos[id].element) {
                videos[id].element.pause();
                if (videos[id].playBtn) videos[id].playBtn.textContent = '▶';
            }
        });

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;

        setTimeout(() => {
            const activeSlide = document.querySelector('.portfolio-slide.active');
            if (activeSlide) {
                const video = activeSlide.querySelector('.portfolio-video');
                if (video) {
                    const videoId = video.id;
                    const v = videos[videoId];
                    if (v) {
                        if (video.currentTime >= video.duration - 0.1) {
                            video.currentTime = 0;
                        }
                        
                        video.muted = false;
                        v.isMuted = false;
                        if (v.muteBtn) v.muteBtn.textContent = '🔊';
                        
                        Object.keys(videos).forEach(id => {
                            if (id !== videoId) {
                                videos[id].element.muted = true;
                                videos[id].isMuted = true;
                                if (videos[id].muteBtn) videos[id].muteBtn.textContent = '🔇';
                            }
                        });
                        
                        video.play().catch(() => {});
                        if (v.playBtn) v.playBtn.textContent = '⏸';
                    }
                }
            }
        }, 300);
    }

    function goToNextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function goToPrevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', goToPrevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', goToNextSlide);
    }

    if (prevBtnInside) {
        prevBtnInside.addEventListener('click', function(e) {
            e.stopPropagation();
            goToPrevSlide();
        });
    }
    if (nextBtnInside) {
        nextBtnInside.addEventListener('click', function(e) {
            e.stopPropagation();
            goToNextSlide();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
    });

    document.addEventListener('keydown', function(e) {
        const portfolioSection = document.querySelector('#portfolio');
        if (portfolioSection) {
            const rect = portfolioSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    goToNextSlide();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    goToPrevSlide();
                }
            }
        }
    });

    goToSlide(0);

});

let lastScrollY = window.scrollY;
let scrollDirection = 'down';

const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
    
    if (scrollTop > lastScrollY) {
        scrollDirection = 'down';
    } else if (scrollTop < lastScrollY) {
        scrollDirection = 'up';
    }
    lastScrollY = scrollTop;
});

const heroRing = document.querySelector('.hero-ring');
if (heroRing) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.08;
        const scaleFactor = 1 + scrolled * 0.0003;
        const directionMultiplier = scrollDirection === 'up' ? 1.5 : 1;
        heroRing.style.transform = `translate(-50%, -50%) rotate(${rate * directionMultiplier}deg) scale(${scaleFactor})`;
        heroRing.style.transition = 'transform 0.05s ease-out';
    });
}

const aboutImg = document.querySelector('#about img');
if (aboutImg) {
    window.addEventListener('scroll', () => {
        const rect = aboutImg.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.05;
        
        const directionMultiplier = scrollDirection === 'up' ? 1.8 : 1;
        const finalOffset = offset * directionMultiplier;
        
        aboutImg.style.transform = `translateY(${finalOffset}px) scale(${1 + Math.abs(finalOffset) * 0.0005})`;
        aboutImg.style.boxShadow = `0 ${20 + Math.abs(finalOffset) * 0.5}px 40px rgba(0,0,0,${0.05 + Math.abs(finalOffset) * 0.001})`;
        aboutImg.style.transition = 'transform 0.05s ease-out, box-shadow 0.05s ease-out';
    });
}

const statCards = document.querySelectorAll('#stats .text-center');
statCards.forEach((card, index) => {
    window.addEventListener('scroll', () => {
        const rect = card.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.03;
        
        const directionMultiplier = scrollDirection === 'up' ? 2 : 1;
        const finalOffset = offset * (1 + index * 0.1) * directionMultiplier;
        
        card.style.transform = `translateY(${finalOffset}px) rotateX(${offset * 0.02 * directionMultiplier}deg)`;
        card.style.transition = 'transform 0.05s ease-out';
    });
});

const skillCards = document.querySelectorAll('#skills .bg-white\\/40');
skillCards.forEach((card) => {
    window.addEventListener('scroll', () => {
        const rect = card.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.04;
        
        const directionMultiplier = scrollDirection === 'up' ? 2.5 : 1;
        const finalOffset = offset * directionMultiplier;
        
        card.style.transform = `perspective(800px) rotateY(${finalOffset * 0.05}deg) translateY(${finalOffset * 0.2}px)`;
        card.style.transition = 'transform 0.05s ease-out';
    });
});

const sliderWrapper = document.querySelector('#slide-wrapper');
if (sliderWrapper) {
    window.addEventListener('scroll', () => {
        const rect = sliderWrapper.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.02;
        
        const directionMultiplier = scrollDirection === 'up' ? 2 : 1;
        const finalOffset = offset * directionMultiplier;
        
        sliderWrapper.style.transform = `perspective(1000px) rotateX(${finalOffset * 0.03}deg) translateY(${finalOffset * 0.1}px)`;
        sliderWrapper.style.transition = 'transform 0.05s ease-out';
    });
}

const sections = document.querySelectorAll('section');
sections.forEach((section) => {
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.015;
        
        const directionMultiplier = scrollDirection === 'up' ? 2 : 1;
        const finalOffset = offset * directionMultiplier;
        const opacity = 1 - Math.abs(finalOffset) * 0.003;
        
        section.style.transform = `translateY(${finalOffset * 0.1}px)`;
        section.style.opacity = Math.max(0.85, opacity);
        section.style.transition = 'transform 0.05s ease-out, opacity 0.05s ease-out';
    });
});

const footer = document.querySelector('footer');
if (footer) {
    window.addEventListener('scroll', () => {
        const rect = footer.getBoundingClientRect();
        const bottom = rect.bottom;
        const viewportHeight = window.innerHeight;
        
        const directionMultiplier = scrollDirection === 'up' ? 2 : 1;
        
        if (bottom < viewportHeight) {
            const offset = (viewportHeight - bottom) * 0.1;
            const finalOffset = offset * directionMultiplier;
            footer.style.transform = `translateY(${finalOffset * 0.2}px)`;
            footer.style.opacity = 1 - (viewportHeight - bottom) * 0.002;
            footer.style.transition = 'transform 0.05s ease-out, opacity 0.05s ease-out';
        }
    });
}

const hobbyItems = document.querySelectorAll('#hobby .px-6');
hobbyItems.forEach((item, index) => {
    window.addEventListener('scroll', () => {
        const rect = item.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.02;
        
        const directionMultiplier = scrollDirection === 'up' ? 2 : 1;
        const finalOffset = offset * directionMultiplier;
        const delay = index * 0.05;
        
        item.style.transform = `translateY(${finalOffset * 0.5}px) scale(${1 - Math.abs(finalOffset) * 0.0003})`;
        item.style.transition = `transform 0.05s ease-out ${delay}s`;
    });
});

const dataDiri = document.querySelector('#data-diri .max-w-lg');
if (dataDiri) {
    window.addEventListener('scroll', () => {
        const rect = dataDiri.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.03;
        
        const directionMultiplier = scrollDirection === 'up' ? 2 : 1;
        const finalOffset = offset * directionMultiplier;
        
        dataDiri.style.transform = `translateY(${finalOffset * 0.3}px) rotateX(${finalOffset * 0.01}deg)`;
        dataDiri.style.transition = 'transform 0.05s ease-out';
    });
}

const orgItems = document.querySelectorAll('#organisasi .flex, #kepanitiaan .flex');
orgItems.forEach((item, index) => {
    window.addEventListener('scroll', () => {
        const rect = item.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (centerY - viewportCenter) * 0.02;
        
        const directionMultiplier = scrollDirection === 'up' ? 2 : 1;
        const finalOffset = offset * directionMultiplier;
        const delay = index * 0.02;
        
        item.style.transform = `translateX(${finalOffset * 0.2 * (index % 2 === 0 ? 1 : -1)}px) translateY(${finalOffset * 0.2}px)`;
        item.style.transition = `transform 0.05s ease-out ${delay}s`;
    });
});

function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    document.body.prepend(particleContainer);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 6 + 3;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(53, 77, 53, ${0.05 + Math.random() * 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            animation: float-particle ${15 + Math.random() * 20}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            animation-duration: ${20 + Math.random() * 30}s;
        `;
        particleContainer.appendChild(particle);
    }
}
createParticles();

const EMAILJS_CONFIG = {
    publicKey: 'JOli6OA0RA_0BFyV1', 
    serviceID: 'service_qcolxjk', 
    templateID: 'template_k39xaxe' 
};


(function() {
    emailjs.init({
        publicKey: EMAILJS_CONFIG.publicKey,
    });
})();

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('user_name').value.trim();
        const email = document.getElementById('user_email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            showFormStatus('⚠️ Please fill in all fields!', 'error');
            return;
        }
        
        const btn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnSpinner = document.getElementById('btn-spinner');
        
        btn.disabled = true;
        btnText.textContent = 'sending...';
        btnSpinner.classList.remove('hidden');
        
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,

            to_name: 'Muhammad Yuan',
            reply_to: email,
            subject: `Pesan dari ${name} - Yuan`
        };
        
        console.log('📤 sending email with parameters:', templateParams);
        console.log('📤 Service ID:', EMAILJS_CONFIG.serviceID);
        console.log('📤 Template ID:', EMAILJS_CONFIG.templateID);
        
        emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            templateParams
        )
        .then(function(response) {
            console.log('✅ SUCCESS!', response.status, response.text);
            showFormStatus('✅ Message sent successfully!', 'success');
            contactForm.reset();
            
            btnText.textContent = '✅ Sent!';
            btn.style.backgroundColor = '#27ae60';
            setTimeout(() => {
                btnText.textContent = 'Send Message';
                btn.style.backgroundColor = '';
                btn.disabled = false;
                btnSpinner.classList.add('hidden');
            }, 3000);
        })
        .catch(function(error) {
            console.error('❌ FAILED...', error);
            showFormStatus('❌ Failed to send message. ' + (error.text || 'Please try again'), 'error');
            btnText.textContent = 'Send Message';
            btn.disabled = false;
            btnSpinner.classList.add('hidden');
        });
    });
}

function showFormStatus(message, type) {
    const status = document.getElementById('form-status');
    status.textContent = message;
    status.className = 'text-center text-sm mt-3 ' + (type === 'success' ? 'text-green-600' : 'text-red-500');
    status.classList.remove('hidden');
    
    if (type === 'success') {
        setTimeout(() => {
            status.classList.add('hidden');
        }, 5000);
    }
}