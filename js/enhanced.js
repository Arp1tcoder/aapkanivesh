// Image Lazy Loading
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const errors = validateForm(formData);

        if (Object.keys(errors).length === 0) {
            try {
                const response = await submitForm(formData);
                showToast('Form submitted successfully!', 'success');
                form.reset();
            } catch (error) {
                showToast('Error submitting form. Please try again.', 'error');
            }
        } else {
            Object.entries(errors).forEach(([field, message]) => {
                const formGroup = form.querySelector(`[name="${field}"]`).closest('.form-group');
                formGroup.classList.add('error');
                formGroup.querySelector('.error-message').textContent = message;
            });
        }
    });
});

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const menuOverlay = document.querySelector('.menu-overlay');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

// Touch Interactions
const swipeAreas = document.querySelectorAll('.swipe-area');
swipeAreas.forEach(area => {
    let startX, startY;

    area.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    area.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault();
            // Handle horizontal swipe
            if (diffX > 0) {
                // Swipe left
                area.dispatchEvent(new CustomEvent('swipeleft'));
            } else {
                // Swipe right
                area.dispatchEvent(new CustomEvent('swiperight'));
            }
        }
    });
});

// Page Transitions
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);

        setTimeout(() => {
            transition.classList.add('active');
            setTimeout(() => {
                window.location.href = link.href;
            }, 500);
        }, 0);
    }
});

// Pull to Refresh
let touchStart = 0;
let touchEnd = 0;
const pullThreshold = 100;

document.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    touchEnd = e.touches[0].clientY;
    const pullDistance = touchEnd - touchStart;

    if (window.scrollY === 0 && pullDistance > 0) {
        e.preventDefault();
        const pullIndicator = document.querySelector('.pull-to-refresh') || createPullIndicator();
        pullIndicator.style.transform = `translateY(${Math.min(pullDistance, pullThreshold)}px)`;
    }
});

document.addEventListener('touchend', () => {
    const pullIndicator = document.querySelector('.pull-to-refresh');
    if (pullIndicator) {
        const pullDistance = touchEnd - touchStart;
        if (pullDistance > pullThreshold) {
            pullIndicator.classList.add('active');
            // Trigger refresh
            window.location.reload();
        }
        pullIndicator.style.transform = '';
    }
});

function createPullIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'pull-to-refresh';
    indicator.textContent = 'Pull to refresh';
    document.body.appendChild(indicator);
    return indicator;
}

// Form Validation Helper
function validateForm(formData) {
    const errors = {};

    for (const [key, value] of formData.entries()) {
        if (!value.trim()) {
            errors[key] = 'This field is required';
        } else if (key === 'email' && !isValidEmail(value)) {
            errors[key] = 'Please enter a valid email address';
        } else if (key === 'phone' && !isValidPhone(value)) {
            errors[key] = 'Please enter a valid phone number';
        }
    }

    return errors;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

// Form Submission Helper
async function submitForm(formData) {
    // Replace with your actual form submission endpoint
    const response = await fetch('/submit-form', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Form submission failed');
    }

    return response.json();
} 