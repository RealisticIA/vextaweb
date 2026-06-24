/* ============================================
   VEXTA Landing Page - JavaScript
   ============================================ */

// Detect current language from page
function getCurrentLanguage() {
    const htmlLang = document.documentElement.lang;
    return htmlLang === 'en' ? 'en' : 'es';
}

// Translations for form messages
const translations = {
    es: {
        validationError: 'Por favor, complete todos los campos.',
        emailError: 'Por favor, ingrese un email válido.',
        sendingText: 'Enviando...',
        successMessage: '¡Gracias! Nos pondremos en contacto contigo pronto.',
        errorMessage: 'Hubo un error al enviar el formulario. Por favor, intenta nuevamente o contáctanos por WhatsApp.',
        readMoreText: 'Leer más →',
        backText: '← Volver'
    },
    en: {
        validationError: 'Please, complete all fields.',
        emailError: 'Please, enter a valid email.',
        sendingText: 'Sending...',
        successMessage: 'Thank you! We will contact you soon.',
        errorMessage: 'There was an error sending the form. Please try again or contact us via WhatsApp.',
        readMoreText: 'Read more →',
        backText: '← Back'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinkItems = navLinks.querySelectorAll('.nav-link');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scroll for Anchor Links (enhanced)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove background blur intensity based on scroll
        if (currentScrollY > 50) {
            header.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.9)';
        }

        lastScrollY = currentScrollY;

    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    const currentLang = getCurrentLanguage();
    const t = translations[currentLang];

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Remove any existing messages
            const existingMessage = contactForm.querySelector('.form-success, .form-error');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Get form data
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                solucion: document.getElementById('solucion').value
            };

            // Basic validation
            if (!formData.nombre || !formData.email || !formData.solucion) {
                showFormMessage(contactForm, t.validationError, 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage(contactForm, t.emailError, 'error');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="spinner"></span> ' + t.sendingText;
            submitBtn.disabled = true;

            try {
                // ============================================
                // ENVÍO DE FORMULARIO A NETLIFY (AJAX)
                // ============================================
                const formDataObj = new FormData(contactForm);

                // Add hidden field for language tracking
                formDataObj.set('site_language', currentLang);

                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formDataObj).toString()
                });

                if (response.ok) {
                    showFormMessage(contactForm, t.successMessage, 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Error en el servidor de Netlify');
                }

            } catch (error) {
                console.error('Error al enviar formulario:', error);

                // Mensaje de error más descriptivo
                showFormMessage(
                    contactForm,
                    t.errorMessage,
                    'error'
                );
            } finally {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Helper function to show form messages
    function showFormMessage(form, message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
        messageDiv.textContent = message;
        form.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link[href^="#"]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Performance: Lazy load images (optional enhancement)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Very subtle parallax effect on background
    const bgParallax = document.getElementById('bgParallax');
    if (bgParallax) {
        function applyBgParallax() {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            // Negative speed so background moves UP when scrolling down
            // This prevents white space from appearing at the top
            const speed = -0.02;
            bgParallax.style.transform = `translateY(${scrolled * speed}px)`;
        }
        window.addEventListener('scroll', applyBgParallax, { passive: true });
        applyBgParallax(); // Initial position
    }

    // Solution Toggle functionality (Leer más / Volver)
    const toggleButtons = document.querySelectorAll('.solucion-toggle-btn');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.closest('.solucion-content');
            const isExpanded = content.classList.contains('expanded');

            if (isExpanded) {
                // Collapse: show summary, hide detail
                content.classList.remove('expanded');
                this.textContent = t.readMoreText;
                this.setAttribute('data-action', 'expand');
            } else {
                // Expand: hide summary, show detail
                content.classList.add('expanded');
                this.textContent = t.backText;
                this.setAttribute('data-action', 'collapse');
            }
        });
    });

    console.log('VEXTA Landing Page loaded successfully');
});

// Utility function for throttling (if needed)
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}