document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 100) {
                    // Scrolling DOWN (oltre 100px) - stringi l'header
                    header.classList.add('shrink');
                } else {
                    // Scrolling UP o in cima - header normale
                    header.classList.remove('shrink');
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
});
