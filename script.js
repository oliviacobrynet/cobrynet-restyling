document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const headerLogo = document.querySelector('.logo img');
    let ticking = false;
    
    // Loading icon scroll-based rotation
    const loadingIcon = document.querySelector('.ai-icon img');
    const comingSoonText = document.querySelector('.ai-coming-soon');
    let lastScrollY = window.pageYOffset;
    let scrollSpeed = 0;
    let rotation = 0;
    let baseRotation = 0;
    
    // Base slow rotation animation
    function animateBaseRotation() {
        baseRotation += 0.4; // Slow base rotation speed
        if (loadingIcon) {
            loadingIcon.style.transform = `rotate(${baseRotation + rotation}deg)`;
        }
        requestAnimationFrame(animateBaseRotation);
    }
    animateBaseRotation();
    
    // Intersection Observer for coming soon text
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    if (comingSoonText) {
        observer.observe(comingSoonText);
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Calculate scroll speed
                scrollSpeed = Math.abs(scrollTop - lastScrollY);
                lastScrollY = scrollTop;
                
                // Accumulate rotation based on scroll speed
                if (loadingIcon) {
                    rotation += scrollSpeed * 0.5; // Adjust multiplier for rotation speed
                }
                
                if (scrollTop > 100) {
                    // Scrolling DOWN (oltre 100px) - stringi l'header e cambia logo
                    header.classList.add('shrink');
                    if (headerLogo) {
                        headerLogo.src = 'SVG/simbolo-cobrynet.svg';
                    }
                } else {
                    // Scrolling UP o in cima - header normale e logo originale
                    header.classList.remove('shrink');
                    if (headerLogo) {
                        headerLogo.src = 'SVG/logo.svg';
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, false);

    // Carousel functionality
    let currentSlide = 0;
    const cards = document.querySelectorAll('.donatello-card');
    const prevBtn = document.querySelector('.ai-section > .carousel-prev');
    const nextBtn = document.querySelector('.ai-section > .carousel-next');
    const totalSlides = cards.length;

    console.log('Carousel initialized:', { cards: cards.length, prevBtn, nextBtn });

    function showSlide(newIndex, direction) {
        console.log('Showing slide:', newIndex, 'direction:', direction);
        
        const oldIndex = currentSlide;
        
        // Set initial positions for all cards
        cards.forEach((card, i) => {
            card.classList.remove('active', 'slide-left', 'slide-right');
            
            if (i === oldIndex) {
                // Current card slides out
                if (direction === 'next') {
                    card.classList.add('slide-left');
                } else {
                    card.classList.add('slide-right');
                }
            } else if (i === newIndex) {
                // New card comes in from opposite side
                if (direction === 'next') {
                    card.classList.add('slide-right');
                } else {
                    card.classList.add('slide-left');
                }
                
                // Trigger reflow
                void card.offsetWidth;
                
                // Activate new card (slides to center)
                card.classList.remove('slide-right', 'slide-left');
                card.classList.add('active');
            }
        });
        
        currentSlide = newIndex;
    }

    function nextSlide() {
        const newIndex = (currentSlide + 1) % totalSlides;
        console.log('Next slide:', newIndex);
        showSlide(newIndex, 'next');
    }

    function prevSlide() {
        const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        console.log('Prev slide:', newIndex);
        showSlide(newIndex, 'prev');
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        console.log('Prev button listener added');
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        console.log('Next button listener added');
    }

    // Click on dots to navigate
    document.querySelectorAll('.carousel-dots').forEach((dotsContainer, cardIndex) => {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', function() {
                const direction = dotIndex > currentSlide ? 'next' : 'prev';
                showSlide(dotIndex, direction);
            });
        });
    });

    // Initialize first card with animation
    setTimeout(() => {
        cards[0].classList.add('active');
    }, 100);

    // Scroll animation for AI section
    const aiSection = document.querySelector('.ai-section');
    if (aiSection) {
        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -50px 0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a class to trigger animation when section is visible
                    aiSection.classList.add('visible');
                } else {
                    // Remove class when section is not visible
                    aiSection.classList.remove('visible');
                }
            });
        }, observerOptions);

        observer.observe(aiSection);
    }

    // CTA Drag to Navigate
    const ctaButton = document.querySelector('.cta-button');
    const ctaCircle = document.querySelector('.cta-circle');
    const ctaGradient = document.querySelector('.cta-gradient');
    
    if (ctaButton && ctaCircle) {
        let isDragging = false;
        let startX = 0;
        let offsetX = 0;
        let currentX = 0;
        let maxDistance = 0;
        
        ctaCircle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = ctaCircle.getBoundingClientRect();
            // Salva la posizione iniziale del cerchio e l'offset del mouse rispetto ad esso
            startX = rect.left;
            offsetX = e.clientX - rect.left;
            maxDistance = window.innerWidth - startX - rect.width;
            ctaButton.style.cursor = 'grabbing';
            ctaCircle.style.transition = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            // Il cerchio segue il mouse mantenendo l'offset iniziale
            currentX = e.clientX - offsetX - startX;
            if (currentX < 0) currentX = 0;
            if (currentX > maxDistance) currentX = maxDistance;
            
            // Muove solo il cerchio - il gradiente è dentro e si muove insieme automaticamente
            ctaCircle.style.transform = `translateX(${currentX}px)`;
            
            if (maxDistance > 0) {
                ctaGradient.style.opacity = 0.8 + (currentX / maxDistance) * 0.2;
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            ctaButton.style.cursor = 'pointer';
            
            if (currentX >= maxDistance * 0.7) {
                // Animazione finale e redirect - scorre fino al bordo e va subito al link
                ctaCircle.style.transition = 'transform 0.3s ease';
                ctaCircle.style.transform = `translateX(${maxDistance}px)`;
                
                setTimeout(() => {
                    window.open('https://www.brynetapp.com/', '_blank');
                    // Reset
                    ctaCircle.style.transition = 'none';
                    ctaCircle.style.transform = 'translateX(0)';
                    ctaGradient.style.opacity = '0.8';
                    setTimeout(() => {
                        ctaCircle.style.transition = '';
                    }, 50);
                }, 300);
            } else {
                // Torna indietro
                ctaCircle.style.transition = 'transform 0.3s ease';
                ctaCircle.style.transform = 'translateX(0)';
                ctaGradient.style.opacity = '0.8';
                setTimeout(() => {
                    ctaCircle.style.transition = '';
                }, 300);
            }
            
            currentX = 0;
        });
    }

    // Enhanced smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip if it's an external link
            if (this.getAttribute('target') === '_blank') return;
            
            const href = this.getAttribute('href');
            if (href === '' || href === 'javascript:void(0)') return;
            
            e.preventDefault();
            
            // Handle scroll to top for # links
            if (href === '#') {
                const startPosition = window.pageYOffset;
                const distance = -startPosition;
                const duration = 1200;
                const startTime = performance.now();
                
                function easeInOutCubic(t) {
                    return t < 0.5 
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }
                
                function animation(currentTime) {
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const ease = easeInOutCubic(progress);
                    
                    const newPosition = Math.round(startPosition + (distance * ease));
                    window.scrollTo(0, newPosition);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                // All links use same smooth easing
                const duration = href === '#marketplace' ? 800 : 1200;
                const startTime = performance.now();
                
                // Same smooth easing for all links
                function easingFunction(t) {
                    // easeInOutCubic - smooth on both ends
                    return t < 0.5 
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }
                
                function animation(currentTime) {
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const ease = easingFunction(progress);
                    
                    const newPosition = Math.round(startPosition + (distance * ease));
                    window.scrollTo(0, newPosition);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
            }
        });
    });
});
