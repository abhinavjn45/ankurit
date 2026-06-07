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

    // Theme Update Function
    function updateNavbarTheme(slide) {
        if (!navbar) return;
        if (slide.classList.contains('slide-founders')) {
            navbar.classList.remove('theme-dark');
            navbar.classList.add('theme-light');
        } else if (slide.classList.contains('slide-investors')) {
            navbar.classList.remove('theme-light');
            navbar.classList.add('theme-dark');
        }
    }

    // Hero Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        updateNavbarTheme(slides[currentSlide]); // Initialize first slide
        
        if (slides.length > 1) {
            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
                updateNavbarTheme(slides[currentSlide]);
            }, 5000); // Change slide every 5 seconds
        }
    }

    // 2. Load Dynamic Data from Google Sheets
    const dataContainer = document.getElementById('data-container');
    if (dataContainer) {
        // In a real scenario, you might want to specify which sub-sheet to load (e.g., 'Portfolio')
        const sheetData = await fetchSheetData('Portfolio');
        renderData(sheetData, dataContainer);
    }
});
