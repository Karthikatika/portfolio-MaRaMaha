// ======================
// Theme Toggle
// ======================
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    if (!themeToggle) {
        console.error('Theme toggle element not found');
        return;
    }

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation effect
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });

// ======================
// Mobile Menu Toggle
// ======================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
} else {
    console.warn('Mobile menu elements not found');
}

// Close mobile menu when clicking outside
if (navMenu && mobileMenuToggle) {
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

}); // End DOMContentLoaded

// ======================
// Smooth Scrolling
// ======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ======================
// Active Navigation Link
// ======================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ======================
// Navbar Scroll Effect
// ======================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ======================
// Intersection Observer for Animations
// ======================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
const animateElements = document.querySelectorAll('.skill-card, .service-card, .portfolio-item, .about-text, .contact-content');
animateElements.forEach(el => observer.observe(el));

// ======================
// Contact Form Handling
// ======================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Submit form to Formspree
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Show success message
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Show error message
        showNotification('Oops! There was a problem sending your message. Please try emailing directly.', 'error');
        console.error('Form submission error:', error);
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// ======================
// Notification System
// ======================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Set background color based on type
    let backgroundColor;
    switch(type) {
        case 'success':
            backgroundColor = '#10b981';
            break;
        case 'error':
            backgroundColor = '#ef4444';
            break;
        default:
            backgroundColor = '#ff6b35';
    }
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Append to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ======================
// Portfolio Item Click Handler
// ======================
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        // In a real application, this would open a modal or navigate to a detail page
        const title = item.querySelector('.portfolio-info h3').textContent;
        showNotification(`Opening project: ${title}`, 'info');
    });
});

// ======================
// Skills Progress Animation
// ======================
function animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 50);
    });
}

// Run animation when skills section is in view
const skillsSection = document.getElementById('skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillCards();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ======================
// Typing Effect for Hero Title (Optional)
// ======================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect on the hero title
// const heroTitle = document.querySelector('.hero-title .gradient-text');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 100);
// }

// ======================
// Lazy Loading Images
// ======================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ======================
// Performance: Reduce Motion for Users Who Prefer It
// ======================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// ======================
// Initialize on Page Load
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // Highlight current navigation on page load
    highlightNavigation();
    
    // Add smooth reveal animation to hero section
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroText.style.transition = 'all 1s ease-out';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateY(0)';
        }, 100);
    }
    
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            heroImage.style.transition = 'all 1s ease-out';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'scale(1)';
        }, 300);
    }
});

// ======================
// Portfolio Video Player
// ======================
document.querySelectorAll('.play-video-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const portfolioItem = btn.closest('.portfolio-item');
        const video = portfolioItem.querySelector('video');
        
        if (video) {
            // Create modal for video playback
            const modal = document.createElement('div');
            modal.className = 'video-modal';
            modal.innerHTML = `
                <div class="video-modal-content">
                    <button class="video-modal-close">&times;</button>
                    <button class="video-modal-back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Portfolio
                    </button>
                    <video controls autoplay>
                        <source src="${video.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Close modal handlers
            const closeModal = () => {
                modal.remove();
                document.body.style.overflow = '';
            };
            
            modal.querySelector('.video-modal-close').addEventListener('click', closeModal);
            modal.querySelector('.video-modal-back').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
            
            // Close on escape key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }
    });
});

// ======================
// Console Message
// ======================
console.log('%c👋 Hello! Welcome to Maha Prabu\'s Portfolio', 'font-size: 20px; font-weight: bold; color: #ff6b35;');
console.log('%cInterested in the code? Feel free to reach out!', 'font-size: 14px; color: #ff9f1c;');
