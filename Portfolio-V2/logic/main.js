// Optimized Portfolio JavaScript
document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    setupTheme();
    setupForm();
    initProjectsAnimation();
});

// Projects Fan-to-Grid Animation
function initProjectsAnimation() {
    const container = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.project-card');
    const section = document.getElementById('projects');

    if (cards.length > 0 && typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "bottom top",
            onEnter: () => {
                gsap.to(cards, {
                    duration: 1.2,
                    rotation: 0,
                    y: 0,
                    margin: 0,
                    stagger: 0.05,
                    ease: "power2.out",
                    onComplete: () => {
                        container.classList.remove('fan-layout');
                        container.classList.add('grid-layout');
                    }
                });
            },
            onLeaveBack: () => {
                container.classList.remove('grid-layout');
                container.classList.add('fan-layout');
                gsap.set(cards, { clearProps: "all" });
            }
        });
    }
}

function setupUI() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                if (entry.target.classList.contains('skill-category')) {
                    entry.target.querySelectorAll('.skill-level').forEach((level, idx) => {
                        setTimeout(() => {
                            level.style.width = level.getAttribute('data-width') + '%';
                        }, idx * 200);
                    });
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up, .project-card, .skill-category, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Active nav
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
        
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('hidden', window.pageYOffset <= 300);
        }
    });

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Project filter
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active', 'bg-purple-600', 'text-white');
            });
            button.classList.add('active', 'bg-purple-600', 'text-white');
            
            document.querySelectorAll('.project-card').forEach(card => {
                const show = filter === 'all' || card.getAttribute('data-category') === filter;
                card.style.display = show ? 'block' : 'none';
            });
        });
    });
}

function setupTheme() {
    const toggleBtn = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    if (!toggleBtn) return;

    const getTheme = () => localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

        
    const setTheme = (theme, animate = false) => {
        if (animate) {
            html.classList.add('theme-switching');
            setTimeout(() => html.classList.remove('theme-switching'), 600);
        }
        
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        toggleBtn.setAttribute('aria-pressed', theme === 'dark');
    };

    setTheme(getTheme());
    
    toggleBtn.addEventListener('click', (e) => {
        const rect = toggleBtn.getBoundingClientRect();
        const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        
        html.style.setProperty('--mouse-x', x + '%');
        html.style.setProperty('--mouse-y', y + '%');
        
        const current = html.getAttribute('data-theme') || 'light';
        setTheme(current === 'light' ? 'dark' : 'light', true);
    });
}

function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        const btn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        btn.innerHTML = 'Sending...';
        btn.disabled = true;
        
        // Let the form submit naturally to FormSubmit
        // Don't prevent default - let FormSubmit handle it
    });
}

// Certificate Modal Functions
function openCertificateModal(type = 'certificate') {
    const modal = document.getElementById('certificateModal');
    const contentContainer = document.getElementById('certificateContent');
    
    if (modal && contentContainer) {
        // Set content based on certificate type
        if (type === 'certificate') {
            contentContainer.innerHTML = `
                <div class="modal-header">
                    <h3>UI/UX Design Certification</h3>
                    <p>Professional certification demonstrating expertise in user experience design</p>
                </div>
                <div class="modal-body">
                    <img src="./assets/images/certificate.jpg" alt="UI/UX Design Certificate" class="modal-certificate">
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="downloadDocument('certificate')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
        } else if (type === 'internship') {
            contentContainer.innerHTML = `
                <div class="modal-header">
                    <h3>Internship Completion Letter</h3>
                    <p>Official completion letter from Ceeras Technologies</p>
                </div>
                <div class="modal-body">
                    <img src="./assets/images/Internship.jpg" alt="Internship Completion Letter" class="modal-certificate">
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="downloadDocument('internship')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
        }
        
        // Ensure images are properly sized
        setTimeout(() => {
            const img = contentContainer.querySelector('.modal-certificate');
            if (img) {
                img.style.maxHeight = '70vh';
                img.style.width = 'auto';
                img.style.objectFit = 'contain';
            }
        }, 100);
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCertificateModal() {
    const modal = document.getElementById('certificateModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function downloadDocument(type = 'certificate') {
    const link = document.createElement('a');
    
    if (type === 'certificate') {
        link.href = './assets/images/certificate.jpg';
        link.download = 'Anuj_Dighe_UIUX_Certificate.jpg';
    } else if (type === 'internship') {
        link.href = './assets/images/Internship.jpg';
        link.download = 'Anuj_Dighe_Internship_Completion.jpg';
    }
    
    link.click();
}

function verifyCertificate() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerHTML = '<i class="fas fa-shield-check mr-2"></i><span>Certificate verified successfully!</span>';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// Certificate Card Center-Based Flip
function setupCertificateFlip() {
    const cards = document.querySelectorAll('.certificate-card');
    if (!cards.length) return;
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance from center
            const distanceFromCenter = Math.sqrt(
                Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
            );
            
            // Flip when cursor is within 50px of center
            if (distanceFromCenter < 50) {
                card.classList.add('flipped');
            } else {
                card.classList.remove('flipped');
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('flipped');
        });
    });
}

// Initialize certificate flip on page load
document.addEventListener('DOMContentLoaded', () => {
    setupCertificateFlip();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertificateModal();
    }
});
