document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const headerLogo = document.querySelector('.logo img');
    
    // ===== HAMBURGER MENU =====
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (hamburgerBtn && mobileNav) {
        // Toggle menu
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburgerBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }
    
    // Marketplace Carousel Dots Navigation
    const marketplaceCarousel = document.getElementById('marketplace-carousel');
    const marketplaceDots = document.getElementById('marketplace-dots');
    
    if (marketplaceCarousel && marketplaceDots) {
        // Update dots on scroll
        marketplaceCarousel.addEventListener('scroll', function() {
            const scrollLeft = this.scrollLeft;
            const cardWidth = this.querySelector('.package-card').offsetWidth;
            const currentIndex = Math.round(scrollLeft / (cardWidth + 20)); // 20px è il gap
            
            // Update all dots
            document.querySelectorAll('.marketplace-dots .dot').forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
        
        // Click dots to scroll to card
        document.querySelectorAll('.marketplace-dots .dot').forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const cardWidth = marketplaceCarousel.querySelector('.package-card').offsetWidth;
                marketplaceCarousel.scrollLeft = index * (cardWidth + 20);
            });
        });
    }
    
    // MOBILE Marketplace Carousel - TOUCH SWIPE ENABLED
    const mobileMarketplaceCarousel = document.getElementById('mobile-marketplace-carousel');
    const mobileMarketplaceDots = document.getElementById('mobile-marketplace-dots');
    
    if (mobileMarketplaceCarousel && mobileMarketplaceDots) {
        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;
        
        mobileMarketplaceCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - mobileMarketplaceCarousel.offsetLeft;
            scrollLeft = mobileMarketplaceCarousel.scrollLeft;
        });
        
        mobileMarketplaceCarousel.addEventListener('mouseleave', () => {
            isDown = false;
        });
        
        mobileMarketplaceCarousel.addEventListener('mouseup', () => {
            isDown = false;
        });
        
        mobileMarketplaceCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - mobileMarketplaceCarousel.offsetLeft;
            const walk = (x - startX) * 1;
            mobileMarketplaceCarousel.scrollLeft = scrollLeft - walk;
        });
        
        // TOUCH SWIPE for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;
        
        mobileMarketplaceCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchScrollLeft = mobileMarketplaceCarousel.scrollLeft;
        }, { passive: true });
        
        mobileMarketplaceCarousel.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const x = e.touches[0].clientX;
            const walk = touchStartX - x;
            mobileMarketplaceCarousel.scrollLeft = touchScrollLeft + walk;
        }, { passive: true });
        
        mobileMarketplaceCarousel.addEventListener('touchend', () => {
            touchStartX = 0;
        }, { passive: true });
        
        // Update dots on scroll
        mobileMarketplaceCarousel.addEventListener('scroll', function() {
            const scrollLeft = this.scrollLeft;
            const containerWidth = this.offsetWidth;
            const currentIndex = Math.round(scrollLeft / containerWidth);
            
            // Update all dots
            document.querySelectorAll('#mobile-marketplace-dots .mobile-dot').forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.style.background = '#EC6C25';
                    dot.style.transform = 'scale(1.5)';
                    dot.style.boxShadow = '0 0 15px rgba(236, 108, 37, 1)';
                } else {
                    dot.style.background = 'white';
                    dot.style.transform = 'scale(1)';
                    dot.style.boxShadow = 'none';
                }
            });
        });
        
        // Click dots to scroll to card
        document.querySelectorAll('#mobile-marketplace-dots .mobile-dot').forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const containerWidth = mobileMarketplaceCarousel.offsetWidth;
                mobileMarketplaceCarousel.scrollLeft = index * containerWidth;
            });
        });
    }
    
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

    // Hero tooltip follows mouse on logo hover
    const logo = document.querySelector('.logo');
    const heroTooltip = document.querySelector('.hero-tooltip');
    
    console.log('Tooltip setup:', logo, heroTooltip);
    
    if (logo && heroTooltip) {
        logo.addEventListener('mousemove', function(e) {
            // Mostra il tooltip e aggiorna la posizione
            heroTooltip.style.setProperty('opacity', '1', 'important');
            heroTooltip.style.setProperty('visibility', 'visible', 'important');
            heroTooltip.style.setProperty('left', (e.clientX + 20) + 'px', 'important');
            heroTooltip.style.setProperty('top', (e.clientY + 20) + 'px', 'important');
            console.log('Showing tooltip at', e.clientX, e.clientY);
        });
        
        logo.addEventListener('mouseleave', function() {
            heroTooltip.style.setProperty('opacity', '0', 'important');
            heroTooltip.style.setProperty('visibility', 'hidden', 'important');
            console.log('Mouse left logo');
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
    
    // Logic for Mobile Fixed Burger Menu
    const mobileBurger = document.getElementById('burger-mobile-fixed');
    if (mobileBurger) {
        mobileBurger.addEventListener('click', function(e) {
            e.stopPropagation();
            // Reuse existing mobile nav logic or trigger the main hamburger button
            const mainHamburger = document.getElementById('hamburger-btn');
            if(mainHamburger) {
                mainHamburger.click();
            } else {
                // Fallback if main button logic isn't accessible directly
                const mobileNav = document.getElementById('mobile-nav');
                if(mobileNav) {
                     mobileNav.classList.toggle('active');
                }
            }
        });
    }
    
    // Mobile responsive scaling with max 500% (5x) - no height adjustment needed
    function scaleMobileContent() {
        if (window.innerWidth > 1279) {
            // Reset body height for desktop
            document.body.style.minHeight = '';
            document.body.style.height = '';
        }
    }
    
    // Run on load and resize
    window.addEventListener('load', scaleMobileContent);
    window.addEventListener('resize', scaleMobileContent);
    
    // Run immediately
    scaleMobileContent();
    
    // Blocca completamente lo scroll orizzontale e zoom su mobile
    if (window.innerWidth <= 1279) {
        // BLOCCA ZOOM/PINCH
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
        });
        
        // Blocca doppio tap per zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Blocca pinch-to-zoom rilevando multiple dita
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Blocca scroll orizzontale in modo aggressivo
        let lastScrollLeft = 0;
        
        const preventHorizontalScroll = () => {
            if (window.scrollX !== 0) {
                window.scrollTo(0, window.scrollY);
            }
            if (document.documentElement.scrollLeft !== 0) {
                document.documentElement.scrollLeft = 0;
            }
            if (document.body.scrollLeft !== 0) {
                document.body.scrollLeft = 0;
            }
        };
        
        // Previeni ogni tentativo di scroll orizzontale
        window.addEventListener('scroll', preventHorizontalScroll, { passive: true });
        document.addEventListener('scroll', preventHorizontalScroll, { passive: true });
        
        // Blocca touch orizzontale
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const diffX = Math.abs(touchX - touchStartX);
                const diffY = Math.abs(touchY - touchStartY);
                
                // Se movimento più orizzontale che verticale, blocca
                if (diffX > diffY && diffX > 10) {
                    e.preventDefault();
                    return false;
                }
            }
        }, { passive: false });
        
        // Forza controllo continuo
        setInterval(preventHorizontalScroll, 50);
    }
    
    // Animazione linea verticale con scroll
    const animatedLine = document.querySelector('.animated-line');
    const animatedDot = document.querySelector('.animated-dot');
    
    const lineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Aggiungi il pallino dopo un piccolo ritardo
                if (entry.target === animatedLine) {
                    setTimeout(() => {
                        if (animatedDot) {
                            animatedDot.classList.add('visible');
                        }
                    }, 800);
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    if (animatedLine) {
        lineObserver.observe(animatedLine);
    }

    // Animazione contenitore Donatello con scroll
    const donatelloContainer = document.querySelector('.donatello-container');
    
    if (donatelloContainer) {
        function checkDonatelloVisibility() {
            const rect = donatelloContainer.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !donatelloContainer.classList.contains('visible')) {
                donatelloContainer.classList.add('visible');
            }
        }
        
        // Controlla al caricamento
        checkDonatelloVisibility();
        
        // Controlla allo scroll
        window.addEventListener('scroll', checkDonatelloVisibility, { passive: true });
    }
    
    // Force mobile video playback
    const mobileVideo = document.querySelector('.mobile-footer-video');
    if (mobileVideo) {
        // Try to play immediately
        const playPromise = mobileVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Mobile video autoplay prevented:", error);
                // Add click listener to body as fallback to start video on first interaction
                const startVideo = () => {
                    mobileVideo.play();
                    document.removeEventListener('click', startVideo);
                    document.removeEventListener('touchstart', startVideo);
                };
                document.addEventListener('click', startVideo);
                document.addEventListener('touchstart', startVideo);
            });
        }
        
        // Ensure loop continues even if browser tries to pause it
        mobileVideo.addEventListener('pause', () => {
            if (!mobileVideo.seeking && mobileVideo.currentTime > 0 && !mobileVideo.paused && !mobileVideo.ended) {
               mobileVideo.play();
            }
        });
    }
});
