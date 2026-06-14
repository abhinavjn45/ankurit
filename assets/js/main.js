/* assets/js/main.js */
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize UI Interactions
    console.log('Ankurit Portfolio initialized.');
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Hero Carousel Logic
    const slides = document.querySelectorAll('.text-slide');
    const heroSection = document.getElementById('hero');
    let currentSlide = 0;
    const slideInterval = 8000; // 8 seconds, slower slide change

    function nextSlide() {
        // Remove the staggered intro class so it doesn't run on future cycles
        document.body.classList.remove('initial-load');
        
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        if (slides.length > 1) {
            setInterval(nextSlide, slideInterval);
        }
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });

    // Dynamic adjustment for sticky sections taller than viewport
    function adjustStickySections() {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.stack-section').forEach(section => {
                section.style.top = 'auto';
            });
            return;
        }

        const sections = document.querySelectorAll('.stack-section');
        sections.forEach(section => {
            const height = section.getBoundingClientRect().height;
            const viewportHeight = window.innerHeight;
            if (height > viewportHeight) {
                // Section is taller than viewport: allow scrolling completely before sticking
                section.style.top = `${viewportHeight - height}px`;
            } else {
                // Fits inside viewport: stick at the top
                section.style.top = '0px';
            }
        });
    }

    // Run after DOM content is loaded and elements have their sizes calculated
    setTimeout(adjustStickySections, 100);
    window.addEventListener('resize', adjustStickySections);
    window.addEventListener('load', adjustStickySections);

    // Animated timeline progress fill
    function updateTimelineProgress() {
        const timeline = document.querySelector('.timeline-container');
        if (!timeline) return;

        const progress = timeline.querySelector('.timeline-progress');
        if (!progress) return;

        const rect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const totalHeight = rect.height;

        // Start filling when the top of the timeline hits 70% of viewport height
        const startLimit = viewportHeight * 0.7;
        // Reach 100% exactly when the bottom of the timeline hits the bottom of the viewport (where scrolling ends)
        const endLimit = viewportHeight - totalHeight;

        let percent = (startLimit - rect.top) / (startLimit - endLimit);
        percent = Math.min(Math.max(percent * 100, 0), 100);

        progress.style.height = `${percent}%`;
    }

    window.addEventListener('scroll', updateTimelineProgress);
    window.addEventListener('resize', updateTimelineProgress);
    setTimeout(updateTimelineProgress, 150);

    // Testimonials Carousel Auto-Scroll Logic
    const track = document.querySelector('.carousel-track');
    const container = document.querySelector('.carousel-container');
    if (track && container) {
        const slides = document.querySelectorAll('.carousel-slide');
        let index = 0;
        let intervalId = null;

        function startCarousel() {
            if (intervalId) return;
            intervalId = setInterval(() => {
                index = (index + 1) % slides.length;
                track.style.transform = `translateX(-${index * 100}%)`;
            }, 6000); // Transition every 6 seconds
        }

        function stopCarousel() {
            clearInterval(intervalId);
            intervalId = null;
        }

        container.addEventListener('mouseenter', stopCarousel);
        container.addEventListener('mouseleave', startCarousel);
        container.addEventListener('touchstart', stopCarousel, { passive: true });
        container.addEventListener('touchend', startCarousel, { passive: true });

        startCarousel();
    }

    // 2. Load Dynamic Data from Google Sheets
    const dataContainer = document.getElementById('data-container');
    if (dataContainer) {
        // In a real scenario, you might want to specify which sub-sheet to load (e.g., 'Portfolio')
        const sheetData = await fetchSheetData('Portfolio');
        renderData(sheetData, dataContainer);
    }
});
