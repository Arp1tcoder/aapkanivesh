// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const menuOverlay = document.querySelector('.menu-overlay');
const backToTop = document.querySelector('.back-to-top');
const scrollProgress = document.querySelector('.scroll-progress');
const loading = document.querySelector('.loading');
const monthlyInvestmentInput = document.getElementById('monthlyInvestment');

// Loading Animation
window.addEventListener('load', () => {
    loading.classList.add('hidden');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 300);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-links a');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        body.classList.toggle('no-scroll');
    }

    // Add click feedback to menu items
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Add hover effect for desktop
        if (window.innerWidth > 768) {
            item.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
            });

            item.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
            });
        }
    });

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', toggleMenu);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        }, 250);
    });

    // Add touch swipe support for mobile menu
    let touchStartX = 0;
    let touchEndX = 0;

    navLinks.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    navLinks.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        }
    }

    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });

    // Add keyboard navigation support
    navLinks.addEventListener('keydown', function (e) {
        const items = Array.from(navItems);
        const currentIndex = items.indexOf(document.activeElement);

        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex].focus();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + items.length) % items.length;
                items[prevIndex].focus();
                break;
            case 'Escape':
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
                break;
        }
    });
});

// Photo Slideshow
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevButton = document.querySelector('.prev-slide');
const nextButton = document.querySelector('.next-slide');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

// Initialize slideshow if elements exist
if (slides.length > 0) {
    showSlide(currentSlide);
    startSlideShow();

    // Event listeners for slideshow controls
    if (prevButton) prevButton.addEventListener('click', () => {
        prevSlide();
        stopSlideShow();
        startSlideShow();
    });

    if (nextButton) nextButton.addEventListener('click', () => {
        nextSlide();
        stopSlideShow();
        startSlideShow();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlideShow();
            startSlideShow();
        });
    });

    // Pause slideshow on hover
    const slideshow = document.querySelector('.photo-slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', stopSlideShow);
        slideshow.addEventListener('mouseleave', startSlideShow);
    }
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic form validation
        const name = this.querySelector('#name').value.trim();
        const email = this.querySelector('#email').value.trim();
        const phone = this.querySelector('#phone').value.trim();
        const message = this.querySelector('#message').value.trim();

        if (!name || !email || !phone || !message) {
            showFormMessage('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            showFormMessage('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        // If validation passes, submit the form
        submitForm(this);
    });
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Simulate form submission (replace with actual form submission)
    setTimeout(() => {
        showFormMessage('Thank you for your message. We will contact you soon!', 'success');
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 1500);
}

// Intersection Observer for Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.feature-card, .benefit-item, .gallery-item').forEach(element => {
    observer.observe(element);
});

// Webinar Form Validation
function validateWebinarForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // Name validation
    if (name.length < 2) {
        alert('Please enter a valid name');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }

    // If all validations pass, allow form submission
    return true;
}

// Testimonial Slider
const testimonialSlider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.testimonial-slide'),
    dots: document.querySelectorAll('.testimonial-dot'),
    interval: null,

    init() {
        if (this.slides.length === 0) return;

        this.showSlide(0);
        this.startAutoSlide();
        this.addEventListeners();
    },

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current slide
        this.slides[index].classList.add('active');
        this.dots[index].classList.add('active');
        this.currentSlide = index;
    },

    nextSlide() {
        let next = this.currentSlide + 1;
        if (next >= this.slides.length) {
            next = 0;
        }
        this.showSlide(next);
    },

    prevSlide() {
        let prev = this.currentSlide - 1;
        if (prev < 0) {
            prev = this.slides.length - 1;
        }
        this.showSlide(prev);
    },

    startAutoSlide() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 3000);
    },

    stopAutoSlide() {
        clearInterval(this.interval);
    },

    addEventListeners() {
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoSlide();
                this.showSlide(index);
                this.startAutoSlide();
            });
        });

        // Pause on hover
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                this.stopAutoSlide();
            });

            slider.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
    }
};

// Initialize testimonial slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    testimonialSlider.init();
});

// SIP Calculator
document.addEventListener('DOMContentLoaded', function () {
    const sipCalculatorForm = document.getElementById('sipCalculatorForm');
    const monthlyInvestmentInput = document.getElementById('monthlyInvestment');
    const expectedReturnInput = document.getElementById('expectedReturn');
    const investmentDurationInput = document.getElementById('investmentDuration');
    const resultsSection = document.getElementById('resultsSection');
    const totalInvestmentSpan = document.getElementById('totalInvestment');
    const estimatedReturnsSpan = document.getElementById('estimatedReturns');
    const totalValueSpan = document.getElementById('totalValue');
    const sipChartCanvas = document.getElementById('sipChart');
    let sipChart;

    function formatCurrency(value) {
        return `₹${value.toLocaleString('en-IN')}`;
    }

    function calculateSIP() {
        const monthlyInvestment = parseFloat(monthlyInvestmentInput.value);
        const expectedReturn = parseFloat(expectedReturnInput.value) / 100;
        const investmentDuration = parseFloat(investmentDurationInput.value);

        if (isNaN(monthlyInvestment) || isNaN(expectedReturn) || isNaN(investmentDuration) || monthlyInvestment <= 0 || expectedReturn <= 0 || investmentDuration <= 0) {
            resultsSection.classList.remove('active');
            if (sipChart) {
                sipChart.destroy();
            }
            return;
        }

        const totalMonths = investmentDuration * 12;
        const monthlyReturnRate = expectedReturn / 12;

        let futureValue = 0;
        for (let i = 0; i < totalMonths; i++) {
            futureValue = (futureValue + monthlyInvestment) * (1 + monthlyReturnRate);
        }

        const totalInvestment = monthlyInvestment * totalMonths;
        const estimatedReturns = futureValue - totalInvestment;

        totalInvestmentSpan.textContent = formatCurrency(Math.round(totalInvestment));
        estimatedReturnsSpan.textContent = formatCurrency(Math.round(estimatedReturns));
        totalValueSpan.textContent = formatCurrency(Math.round(futureValue));

        resultsSection.classList.add('active');
        updateChart(totalInvestment, estimatedReturns);
    }

    function updateChart(totalInvestment, estimatedReturns) {
        const investedColor = '#36A2EB';
        const returnsColor = '#FF6384';

        if (sipChart) {
            sipChart.destroy();
        }

        sipChart = new Chart(sipChartCanvas, {
            type: 'pie',
            data: {
                labels: ['Total Invested', 'Estimated Returns'],
                datasets: [{
                    data: [totalInvestment, estimatedReturns],
                    backgroundColor: [investedColor, returnsColor],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(Math.round(context.parsed));
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    sipCalculatorForm.addEventListener('input', calculateSIP);
    sipCalculatorForm.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateSIP();
    });

    // Initial calculation when page loads if fields have values
    calculateSIP();
});