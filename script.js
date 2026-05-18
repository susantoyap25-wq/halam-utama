// ===== DOM Content Loaded =====
document.addEventListener('DOMContentLoaded', () => {

// ===== Dark/Light Theme Toggle =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// ===== Hamburger Menu =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navBackdrop = document.getElementById('nav-backdrop');

function toggleMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    navBackdrop.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking on backdrop
navBackdrop.addEventListener('click', toggleMenu);

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===== Main Slider =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const sliderNavBtns = document.querySelectorAll('.slider-nav-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        sliderNavBtns[i].classList.remove('active');
    });
    
    slides[index].classList.add('active');
    sliderNavBtns[index].classList.add('active');
    currentSlide = index;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Event listeners for slider buttons
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
});

// Event listeners for navigation thumbnails
sliderNavBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        showSlide(index);
        resetAutoSlide();
    });
});

// Auto slide
let slideInterval = setInterval(nextSlide, 5000);

function resetAutoSlide() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

// ===== Music Player =====
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const musicIcon = musicToggle.querySelector('i');
let isPlaying = false;

// Set volume
bgMusic.volume = 0.3;

// Try to play (must be called after user gesture on most browsers)
function tryPlay() {
    bgMusic.play().then(() => {
        isPlaying = true;
        musicIcon.classList.remove('fa-play');
        musicIcon.classList.add('fa-pause');
        localStorage.setItem('musicPlaying', 'true');
        console.log('🎵 Music started playing!');
    }).catch(err => {
        console.warn('⚠️ Autoplay blocked - waiting for user interaction:', err.message);
    });
}

// Try autoplay on load
setTimeout(tryPlay, 500);
setTimeout(tryPlay, 1500);

// Enable audio on first user interaction (only once)
let musicUnlocked = false;
const unlockMusic = () => {
    if (!musicUnlocked) {
        musicUnlocked = true;
        tryPlay();
    }
};

// Listen for ANY user interaction
['click', 'touchstart', 'keydown', 'scroll', 'mousemove'].forEach(evt => {
    document.addEventListener(evt, unlockMusic, { once: true });
});

// Toggle button
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
        localStorage.setItem('musicPlaying', 'false');
    } else {
        bgMusic.play();
        musicIcon.classList.remove('fa-play');
        musicIcon.classList.add('fa-pause');
        localStorage.setItem('musicPlaying', 'true');
    }
    isPlaying = !isPlaying;
});

// ===== Album Slideshow =====
let albumCurrentIndex = 0;
const albumSlides = document.querySelectorAll('.album-slide');
const albumSlidesContainer = document.getElementById('album-slides');
const albumThumbs = document.querySelectorAll('.thumb');
const albumPrevBtn = document.getElementById('album-prev');
const albumNextBtn = document.getElementById('album-next');
const totalAlbumSlides = albumSlides.length;

function showAlbumSlide(index) {
    albumSlidesContainer.style.transform = `translateX(-${index * 100}%)`;
    
    albumThumbs.forEach((thumb, i) => {
        thumb.classList.remove('active');
        if (i === index) {
            thumb.classList.add('active');
        }
    });
    
    albumCurrentIndex = index;
}

function nextAlbumSlide() {
    albumCurrentIndex = (albumCurrentIndex + 1) % totalAlbumSlides;
    showAlbumSlide(albumCurrentIndex);
}

function prevAlbumSlide() {
    albumCurrentIndex = (albumCurrentIndex - 1 + totalAlbumSlides) % totalAlbumSlides;
    showAlbumSlide(albumCurrentIndex);
}

// Event listeners for album buttons
albumNextBtn.addEventListener('click', () => {
    nextAlbumSlide();
    resetAlbumAutoSlide();
});

albumPrevBtn.addEventListener('click', () => {
    prevAlbumSlide();
    resetAlbumAutoSlide();
});

// Event listeners for album thumbnails
albumThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        showAlbumSlide(index);
        resetAlbumAutoSlide();
    });
});

// Auto slide for album
let albumInterval = setInterval(nextAlbumSlide, 4000);

function resetAlbumAutoSlide() {
    clearInterval(albumInterval);
    albumInterval = setInterval(nextAlbumSlide, 4000);
}

// ===== Modal Functions =====
const modal = document.getElementById('modal');
const modalJurusan = document.getElementById('modal-jurusan');

if (modal && modalJurusan) {
    function openModal(jurusan) {
        modalJurusan.textContent = jurusan;
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Form submission
const daftarForm = document.querySelector('.daftar-form');
if (daftarForm) {
    daftarForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const formData = new FormData(daftarForm);

        // Show success message
        alert('Terima kasih! Pendaftaran Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.');

        // Reset form and close modal
        daftarForm.reset();
        closeModal();
    });
}

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Navbar Background on Scroll =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.jurusan-card, .misi-card, .tim-card, .visi-card, .guru-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Animated Counter for Statistics =====
function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    if (isNaN(target) || target <= 0) return;

    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(easeProgress * target);
        counter.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            counter.textContent = target;
        }
    };

    requestAnimationFrame(animate);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.statistik-number').forEach(counter => {
    counterObserver.observe(counter);
});

// ===== Initialize =====
highlightNavigation();

// ===== TKJ Messages WhatsApp Form Handler =====
const tkjWhatsappForm = document.getElementById('tkj-whatsapp-form');
const whatsappNumber = '628988535900'; // 0898-8535-900 in international format

if (tkjWhatsappForm) {
    tkjWhatsappForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const website = document.getElementById('tkj-website').value.trim();
        const name = document.getElementById('tkj-name').value.trim();
        const memory = document.getElementById('tkj-memory').value.trim();
        
        if (name && memory) {
            // Format the message as requested
            let whatsappMessage = `Website:\n${website || '-'}\n\nYour Name:\n${name}\n\nShare a memory about our TKJ journey, projects, or lessons learned...:\n${memory}`;
            
            // Encode the message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Optional: Reset form after sending
            // tkjWhatsappForm.reset();
        } else {
            alert('Mohon isi semua kolom yang wajib diisi!');
        }
    });
}

// ===== WhatsApp Form Handler (Share TKJ Experience) =====
const whatsappForm = document.getElementById('whatsapp-form');

if (whatsappForm) {
    whatsappForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('wa-name').value.trim();
        const message = document.getElementById('wa-message').value.trim();
        
        if (name && message) {
            // Format the message as requested
            const whatsappMessage = `Name:\n${name}\n\nMessage:\n${message}`;

            // Encode the message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');

            // Optional: Reset form after sending
            // whatsappForm.reset();
        } else {
            alert('Mohon isi semua kolom!');
        }
    });
}

}); // End DOMContentLoaded
