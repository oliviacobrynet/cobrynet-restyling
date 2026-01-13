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
});
