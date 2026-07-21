// ===== Mobile Navigation Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== Active Navigation Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== Skill Bar Animation on Scroll =====
const skillBars = document.querySelectorAll('.skill-progress');
let skillAnimated = false;

function animateSkillBars() {
    if (skillAnimated) return;
    
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }
    });
    
    // Check if all bars are visible
    let allVisible = true;
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top > window.innerHeight - 50) {
            allVisible = false;
        }
    });
    
    if (allVisible) {
        skillAnimated = true;
    }
}

window.addEventListener('scroll', animateSkillBars);
// Initial check on load
window.addEventListener('load', () => {
    setTimeout(animateSkillBars, 300);
});

// ===== Stat Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    
    statNumbers.forEach(stat => {
        const rect = stat.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const increment = Math.ceil(target / 40);
            const duration = 1500;
            const stepTime = duration / 40;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                stat.textContent = current;
            }, stepTime);
        }
    });
    
    // Check if all stats are visible
    let allVisible = true;
    statNumbers.forEach(stat => {
        const rect = stat.getBoundingClientRect();
        if (rect.top > window.innerHeight - 50) {
            allVisible = false;
        }
    });
    
    if (allVisible) {
        statsAnimated = true;
    }
}

window.addEventListener('scroll', animateStats);
window.addEventListener('load', () => {
    setTimeout(animateStats, 500);
});

// ===== Contact Form Submission =====
const contactForm = document.getElementById('contactForm');

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Success message
        alert('Thank you for your message! I will get back to you soon.');
    });
}