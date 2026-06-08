/* assets/js/animations.js */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Independent Hero Carousels
    // Since there are 5 hero sections on this showcase page, we need to handle their carousels independently.
    const animationSections = document.querySelectorAll('.animation-section');
    const slideInterval = 8000;

    animationSections.forEach(section => {
        const slides = section.querySelectorAll('.text-slide');
        let currentSlide = 0;

        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, slideInterval);
        }
    });

    // 2. Intersection Observer to Trigger Logo Animations
    // We only want the complex CSS animations to play when the user scrolls down to that specific section.
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Trigger when 40% of the section is visible
    };

    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const logoContainer = entry.target.querySelector('.hero-logo');
                if (logoContainer && !logoContainer.classList.contains('play-anim')) {
                    // Add the trigger class
                    logoContainer.classList.add('play-anim');

                    // Special logic for Glitch to turn off pseudo elements after 1 second so it doesn't loop forever
                    if (logoContainer.classList.contains('logo-glitch')) {
                        setTimeout(() => {
                            logoContainer.classList.add('settled');
                        }, 1000);
                    }
                }
            }
        });
    }, observerOptions);

    animationSections.forEach(section => {
        logoObserver.observe(section);
    });

    // 3. SVG Draw-In Logic
    // We fetch the SVG dynamically so the HTML stays clean, then we measure its paths.
    const svgContainer = document.getElementById('svg-logo-container');
    if (svgContainer) {
        fetch('assets/images/logo/ankurit.svg')
            .then(res => res.text())
            .then(svgText => {
                svgContainer.innerHTML = svgText;
                const svg = svgContainer.querySelector('svg');
                
                if (svg) {
                    // Normalize dimensions to match other logos
                    svg.setAttribute('width', 'auto');
                    svg.setAttribute('height', '60');
                    svg.style.overflow = 'visible';
                    
                    // Iterate through all drawable elements to set up the draw-in stroke properties
                    const paths = svg.querySelectorAll('path, line, polyline, polygon, rect, circle, ellipse');
                    paths.forEach(path => {
                        let length = 0;
                        if (path.getTotalLength) {
                            length = path.getTotalLength();
                        } else {
                            length = 2000; // Fallback for basic shapes if getTotalLength fails
                        }
                        // Set dash array and offset to the exact length of the path
                        path.style.strokeDasharray = length;
                        path.style.strokeDashoffset = length;
                    });
                }
            })
            .catch(err => console.error('Failed to load SVG:', err));
    }
});
