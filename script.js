document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const headerLogo = document.querySelector('.logo img');
    
    // Force immediate scroll behavior to fix Chrome Windows mouse wheel issue
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Smooth scroll for anchor links only (not for mouse wheel)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Loading icon scroll-based rotation
    const loadingIcon = document.querySelector('.ai-icon img');
    const comingSoonText = document.querySelector('.ai-coming-soon');
    let lastScrollY = window.pageYOffset;
    let scrollSpeed = 0;
    let rotation = 0;
    let baseRotation = 0;
    
    // Base slow rotation animation
    function animateBaseRotation() {
        baseRotation += 0.4;
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
    
    // Optimized scroll listener with throttling
    let lastKnownScrollPosition = 0;
    let rafId = null;
    
    function handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate scroll speed
        scrollSpeed = Math.abs(scrollTop - lastScrollY);
        lastScrollY = scrollTop;
        
        // Accumulate rotation based on scroll speed
        if (loadingIcon) {
            rotation += scrollSpeed * 0.5;
        }
        
        if (scrollTop > 100) {
            if (!header.classList.contains('shrink')) {
                header.classList.add('shrink');
            }
            if (headerLogo && headerLogo.src.indexOf('simbolo-cobrynet.svg') === -1) {
                console.log('Changing logo to simbolo-cobrynet.svg');
                headerLogo.src = 'SVG/simbolo-cobrynet.svg';
            }
        } else {
            if (header.classList.contains('shrink')) {
                header.classList.remove('shrink');
            }
            if (headerLogo && headerLogo.src.indexOf('logo.svg') === -1) {
                console.log('Changing logo back to logo.svg');
                headerLogo.src = 'SVG/logo.svg';
            }
        }
        
        rafId = null;
    }
    
    window.addEventListener('scroll', function() {
        if (rafId === null) {
            rafId = window.requestAnimationFrame(handleScroll);
        }
    }, { passive: true });

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
    const ctaGradient = document.querySelector('.cta-gradient');
    const ctaCircle = document.querySelector('.cta-circle');
    
    if (ctaButton && ctaCircle) {
        let isDragging = false;
        let startX = 0;
        ctaCircle.addEventListener('mousedown', (e) => {
            isDragging = true;
            ctaCircle.dataset.dragging = 'true';
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

    // Hero tooltip follows mouse
    const heroTitle = document.querySelector('.hero-title');
    const heroTooltip = document.querySelector('.hero-tooltip');
    
    console.log('Tooltip setup:', heroTitle, heroTooltip);
    
    if (heroTitle && heroTooltip) {
        // Crea un elemento temporaneo per misurare solo "DIGITALIZZAZIONE."
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.fontSize = window.getComputedStyle(heroTitle).fontSize;
        tempSpan.style.fontFamily = window.getComputedStyle(heroTitle).fontFamily;
        tempSpan.style.fontWeight = window.getComputedStyle(heroTitle).fontWeight;
        tempSpan.textContent = 'DIGITALIZZAZIONE.';
        document.body.appendChild(tempSpan);
        const digitalizationeWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        
        console.log('Width calculated:', digitalizationeWidth);
        
        heroTitle.addEventListener('mousemove', function(e) {
            const rect = heroTitle.getBoundingClientRect();
            const mouseRelativeX = e.clientX - rect.left;
            
            console.log('Mouse move:', mouseRelativeX, 'vs', digitalizationeWidth);
            
            // Controlla se il mouse è dentro la larghezza di "DIGITALIZZAZIONE."
            if (mouseRelativeX <= digitalizationeWidth) {
                // Mostra il tooltip e aggiorna la posizione
                heroTooltip.style.setProperty('opacity', '1', 'important');
                heroTooltip.style.setProperty('visibility', 'visible', 'important');
                heroTooltip.style.setProperty('left', (e.clientX + 20) + 'px', 'important');
                heroTooltip.style.setProperty('top', (e.clientY + 20) + 'px', 'important');
                console.log('Showing tooltip at', e.clientX, e.clientY);
            } else {
                // Nascondi il tooltip se il mouse supera la larghezza
                heroTooltip.style.setProperty('opacity', '0', 'important');
                heroTooltip.style.setProperty('visibility', 'hidden', 'important');
                console.log('Hiding tooltip');
            }
        });
        
        heroTitle.addEventListener('mouseleave', function() {
            heroTooltip.style.setProperty('opacity', '0', 'important');
            heroTooltip.style.setProperty('visibility', 'hidden', 'important');
            console.log('Mouse left');
        });
    }

    // Marketplace section scroll animation
    const marketplaceTitle = document.querySelector('.marketplace-title');
    const marketplaceSubtitle = document.querySelector('.marketplace-subtitle');
    const marketplaceBlurOrange = document.querySelector('.marketplace-blur-bg-orange');
    const marketplaceBlurBlack = document.querySelector('.marketplace-blur-bg');
    const marketplaceSection = document.querySelector('.marketplace-section');
    
    let marketplaceTitleVisible = false;
    let marketplaceSubtitleVisible = false;
    
    // Aggiungi la logica marketplace alla funzione handleScroll esistente
    const originalHandleScroll = handleScroll;
    handleScroll = function() {
        originalHandleScroll();
        
        if (!marketplaceSection || !marketplaceTitle) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const marketplaceTop = marketplaceSection.offsetTop;
        const windowHeight = window.innerHeight;
        
        // Calcola quanto è visibile la sezione marketplace
        const sectionVisible = scrollTop + windowHeight > marketplaceTop;
        const scrollIntoSection = scrollTop + windowHeight - marketplaceTop;
        
        // Usa la velocità di scroll corrente
        const currentScrollSpeed = scrollSpeed || 0;
        
        // Mostra il titolo quando la sezione inizia ad essere visibile
        // Più veloce è lo scroll, più rapida è l'apparizione
        if (sectionVisible && !marketplaceTitleVisible && scrollIntoSection > 100) {
            const titleDelay = Math.max(20, 250 - currentScrollSpeed * 8);
            setTimeout(() => {
                if (marketplaceTitle && !marketplaceTitleVisible) {
                    marketplaceTitle.classList.add('visible');
                    marketplaceTitleVisible = true;
                }
            }, titleDelay);
        }
        
        // Mostra il sottotitolo quando è visibile, con delay basato sulla velocità di scroll IN QUEL MOMENTO
        if (sectionVisible && marketplaceTitleVisible && !marketplaceSubtitleVisible && scrollIntoSection > 200) {
            const subtitleDelay = Math.max(20, 200 - currentScrollSpeed * 6);
            setTimeout(() => {
                if (marketplaceSubtitle && !marketplaceSubtitleVisible) {
                    marketplaceSubtitle.classList.add('visible');
                    marketplaceSubtitleVisible = true;
                }
            }, subtitleDelay);
        }
    };
});
