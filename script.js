/**
 * Institute of Digital Risk - Main JavaScript
 * Handles navigation, smooth scrolling, form validation, and interactive elements
 */

class IDRWebsite {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.contactForm = document.getElementById('interestForm');
        
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.setupFormValidation();
        this.setupAnimations();
    }
    
    /**
     * Mobile Menu Toggle
     */
    setupMobileMenu() {
        if (!this.mobileMenuBtn) return;
        
        this.mobileMenuBtn.addEventListener('click', () => {
            this.mobileMenuBtn.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenuBtn.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.mobileMenuBtn.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    /**
     * Smooth Scrolling for Navigation Links
     */
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const navHeight = this.navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Scroll Spy - Update Active Navigation Link
     */
    setupScrollSpy() {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + this.navbar.offsetHeight + 100;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href').substring(1);
                if (href === current) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    /**
     * Form Validation and Submission
     */
    setupFormValidation() {
        if (!this.contactForm) return;
        
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const interest = document.getElementById('interest');
            const message = document.getElementById('message');
            
            if (this.validateForm(name, email)) {
                this.submitForm({
                    name: name.value,
                    email: email.value,
                    interest: interest.value,
                    message: message.value
                });
            }
        });
        
        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input[required], select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }
    
    validateForm(name, email) {
        let isValid = true;
        
        if (!name.value.trim()) {
            this.showError(name, 'Name is required');
            isValid = false;
        } else {
            this.clearError(name);
        }
        
        if (!email.value.trim()) {
            this.showError(email, 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email.value)) {
            this.showError(email, 'Please enter a valid email');
            isValid = false;
        } else {
            this.clearError(email);
        }
        
        return isValid;
    }
    
    validateInput(input) {
        if (input.hasAttribute('required') && !input.value.trim()) {
            this.showError(input, `${input.previousElementSibling.textContent} is required`);
        } else if (input.type === 'email' && input.value.trim()) {
            if (!this.isValidEmail(input.value)) {
                this.showError(input, 'Please enter a valid email');
            } else {
                this.clearError(input);
            }
        } else {
            this.clearError(input);
        }
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        input.style.borderColor = '#dc3545';
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        input.style.borderColor = '';
        
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    submitForm(formData) {
        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual fetch)
        setTimeout(() => {
            console.log('Form submitted:', formData);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.style.backgroundColor = '#d4edda';
            successMessage.style.color = '#155724';
            successMessage.style.padding = '1rem';
            successMessage.style.borderRadius = '8px';
            successMessage.style.marginTop = '1rem';
            successMessage.style.textAlign = 'center';
            successMessage.textContent = 'Thank you for your interest! We will contact you soon.';
            
            this.contactForm.appendChild(successMessage);
            
            // Reset form
            this.contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1500);
    }
    
    /**
     * Scroll Animations
     */
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Animate cards on scroll
        const animatedElements = document.querySelectorAll(
            '.about-card, .service-card, .group, .stat-bubble, .step'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IDRWebsite();
});

// Add sticky navigation background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navMenu && mobileMenuBtn) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});




document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function(e) {
e.preventDefault();
document.querySelector(this.getAttribute('href')).scrollIntoView({
behavior: 'smooth'
});
});
});