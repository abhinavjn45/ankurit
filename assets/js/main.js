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
    const slideInterval = 5000; // 5 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        if (slides.length > 1) {
            setInterval(nextSlide, slideInterval);
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
