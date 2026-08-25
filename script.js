/* ============================================
   THREE.JS 3D BACKGROUND
   ============================================ */
function initThreeBackground() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Floating particles
  const particlesCount = 400;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

    // Purple-blue color palette
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      colors[i * 3] = 0.388; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.945; // Indigo
    } else if (colorChoice < 0.66) {
      colors[i * 3] = 0.545; colors[i * 3 + 1] = 0.361; colors[i * 3 + 2] = 0.965; // Violet
    } else {
      colors[i * 3] = 0.655; colors[i * 3 + 1] = 0.545; colors[i * 3 + 2] = 0.98; // Light Purple
    }
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Floating geometric shapes
  const shapes = [];
  const shapeMaterial = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  });

  // Icosahedrons
  for (let i = 0; i < 3; i++) {
    const geo = new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.5, 1);
    const mesh = new THREE.Mesh(geo, shapeMaterial.clone());
    mesh.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 20
    );
    mesh.material.opacity = Math.random() * 0.06 + 0.03;
    scene.add(mesh);
    shapes.push({
      mesh,
      rotSpeed: { x: Math.random() * 0.003, y: Math.random() * 0.003, z: Math.random() * 0.002 },
      floatSpeed: Math.random() * 0.0005 + 0.0002,
      floatOffset: Math.random() * Math.PI * 2,
    });
  }

  // Octahedrons
  for (let i = 0; i < 2; i++) {
    const geo = new THREE.OctahedronGeometry(Math.random() * 1 + 0.3, 0);
    const mesh = new THREE.Mesh(geo, shapeMaterial.clone());
    mesh.position.set(
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 15
    );
    mesh.material.opacity = Math.random() * 0.05 + 0.02;
    scene.add(mesh);
    shapes.push({
      mesh,
      rotSpeed: { x: Math.random() * 0.004, y: Math.random() * 0.003, z: Math.random() * 0.002 },
      floatSpeed: Math.random() * 0.0004 + 0.0002,
      floatOffset: Math.random() * Math.PI * 2,
    });
  }

  // Torus knots
  for (let i = 0; i < 1; i++) {
    const geo = new THREE.TorusKnotGeometry(0.6, 0.15, 64, 8, 2, 3);
    const mesh = new THREE.Mesh(geo, shapeMaterial.clone());
    mesh.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 15
    );
    mesh.material.opacity = Math.random() * 0.04 + 0.02;
    scene.add(mesh);
    shapes.push({
      mesh,
      rotSpeed: { x: Math.random() * 0.002, y: Math.random() * 0.003, z: Math.random() * 0.001 },
      floatSpeed: Math.random() * 0.0003 + 0.0001,
      floatOffset: Math.random() * Math.PI * 2,
    });
  }

  // Connecting lines between nearby particles
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.04,
  });
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  camera.position.z = 12;

  let mouseX = 0, mouseY = 0;
  let scrollY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Rotate particles based on mouse
    particles.rotation.x += 0.0003;
    particles.rotation.y += 0.0005;
    particles.rotation.x += mouseY * 0.0003;
    particles.rotation.y += mouseX * 0.0003;

    // Parallax on scroll
    particles.position.y = scrollY * 0.002;

    // Animate shapes
    shapes.forEach((s) => {
      s.mesh.rotation.x += s.rotSpeed.x;
      s.mesh.rotation.y += s.rotSpeed.y;
      s.mesh.rotation.z += s.rotSpeed.z;
      s.mesh.position.y += Math.sin(time * s.floatSpeed * 100 + s.floatOffset) * 0.003;
    });

    // Camera gentle sway
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link tracking
  const sections = document.querySelectorAll('.section, .hero');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   SKILL BAR ANIMATION
   ============================================ */
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const percent = target.getAttribute('data-percent');
        target.style.width = percent + '%';
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ============================================
   EXPANDABLE GALLERIES
   ============================================ */
function initExpandableGalleries() {
  document.querySelectorAll('.expand-gallery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const gallery = document.getElementById(targetId);

      if (gallery) {
        gallery.classList.toggle('expanded');
        btn.classList.toggle('active');

        const arrow = btn.querySelector('.arrow');
        if (gallery.classList.contains('expanded')) {
          btn.querySelector('.btn-text').textContent = 'Hide Photos';
        } else {
          btn.querySelector('.btn-text').textContent = 'View Photos';
        }
      }
    });
  });
}

/* ============================================
   LIGHTBOX
   ============================================ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  document.querySelectorAll('.gallery-thumb img, .project-image-container, .cert-image').forEach(el => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      let imgSrc;
      if (el.tagName === 'IMG') {
        imgSrc = el.src;
      } else {
        const img = el.querySelector('img');
        if (img) imgSrc = img.src;
      }
      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   RESUME MODAL
   ============================================ */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('[data-resume]');
  const closeBtn = document.getElementById('modal-close');
  const downloadBtn = document.getElementById('download-resume-btn');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadResume();
    });
  }

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function downloadResume() {
  // Generate resume content as a text blob and trigger download
  const resumeContent = document.querySelector('.resume-preview');

  // Create a styled HTML version for download
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Resume - Your Name</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 2rem; color: #1a1a2e; line-height: 1.6; }
    h1 { font-size: 1.75rem; margin-bottom: 0.25rem; color: #1a1a2e; }
    h2 { font-size: 1rem; color: #6366f1; font-weight: 600; margin: 1.5rem 0 0.75rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; text-transform: uppercase; letter-spacing: 1px; }
    h3 { font-size: 0.95rem; margin-bottom: 0.25rem; }
    p { font-size: 0.85rem; color: #4b5563; margin-bottom: 0.5rem; }
    .contact-info { color: #6b7280; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .item { margin-bottom: 1rem; padding-left: 1rem; border-left: 2px solid #e5e7eb; }
    .date { font-size: 0.8rem; color: #9ca3af; }
    ul { padding-left: 1.5rem; }
    ul li { font-size: 0.85rem; color: #4b5563; margin-bottom: 0.25rem; }
  </style>
</head>
<body>
  ${resumeContent.innerHTML}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Resume.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ============================================
   CONTACT FORM  — powered by EmailJS
   ─────────────────────────────────────────────
   SETUP (one-time, ~5 minutes):
   1. Go to https://www.emailjs.com/ → sign up free
   2. Add Email Service (Gmail) → copy the Service ID
   3. Create an Email Template → copy the Template ID
      Template variables to use: {{from_name}}, {{from_email}}, {{role}}, {{message}}
   4. Go to Account → API Keys → copy your Public Key
   5. Paste the three values into the constants below
   ============================================ */
const EMAILJS_SERVICE_ID = 'service_csmq6ou';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_bp9we9b';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY = 'qhb0V6cSJwljoB6pn';   // e.g. 'AbCdEfGhIjKlMnOp'

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Initialise EmailJS with your public key
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const roleSelect = document.getElementById('contact-role');
  const messageInput = document.getElementById('contact-message');

  if (roleSelect && messageInput) {
    roleSelect.addEventListener('change', () => {
      const val = roleSelect.value;
      if (val === 'recruiter') {
        messageInput.placeholder = 'Tell me about the role, project, or opportunity...';
      } else if (val === 'student') {
        messageInput.placeholder = "Tell me what you're working on or what you'd like to chat about...";
      } else {
        messageInput.placeholder = 'Message';
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('contact-role').value;
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const submitBtn = form.querySelector('.submit-btn-v2') || form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Guard: alert if credentials haven't been filled in yet
    if (
      EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
      EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
    ) {
      alert('⚠️ EmailJS is not configured yet.\nPlease add your Service ID, Template ID, and Public Key to script.js.');
      return;
    }

    // Show sending state
    submitBtn.textContent = '⏳ Sending...';
    submitBtn.disabled = true;

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        role: role,
        message: message,
        to_name: 'Abhiram',
      });

      // Success
      submitBtn.textContent = '✅ Message sent!';
      submitBtn.style.background = '#22c55e';
      submitBtn.style.color = '#ffffff';
      form.reset();

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 4000);

    } catch (error) {
      console.error('EmailJS error:', error);
      submitBtn.textContent = '❌ Failed to send. Try again.';
      submitBtn.style.background = '#ef4444';
      submitBtn.style.color = '#ffffff';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 4000);
    }
  });
}

/* ============================================
   TYPED TEXT EFFECT (HERO)
   ============================================ */
function initTypedEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const texts = ['Student Developer', 'Tech Enthusiast', 'Problem Solver', 'Creative Thinker'];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = texts[textIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = Math.ceil(target / 60);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ============================================
   PROJECT FILTERS
   ============================================ */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================
   3D TILT & SPOTLIGHT EFFECT
   ============================================ */
function init3DTiltAndSpotlight() {
  const targets = document.querySelectorAll('.project-card, .skill-category, .edu-card');

  targets.forEach(target => {
    target.addEventListener('mousemove', (e) => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);

      const width = rect.width;
      const height = rect.height;
      const rotateX = ((y / height) - 0.5) * -10;
      const rotateY = ((x / width) - 0.5) * 10;

      target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    target.addEventListener('mouseleave', () => {
      target.style.transform = '';
      target.style.setProperty('--mouse-x', '0px');
      target.style.setProperty('--mouse-y', '0px');
    });
  });
}

/* ============================================
   BACK TO TOP WITH SCROLL PROGRESS
   ============================================ */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircleFill = document.querySelector('.progress-circle-fill');
  if (!backToTopBtn) return;

  const r = 20;
  const circumference = 2 * Math.PI * r;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / (docHeight || 1);
    const offset = circumference - (progress * circumference);

    if (progressCircleFill) {
      progressCircleFill.style.strokeDashoffset = offset;
    }

    if (scrollTop > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ============================================
   CERTIFICATE CAROUSEL/SLIDERS
   ============================================ */
function initCertSliders() {
  const sliders = document.querySelectorAll('.cert-slider');
  sliders.forEach(slider => {
    const slides = slider.querySelector('.cert-slides');
    const prevBtn = slider.querySelector('.cert-slider-btn.prev');
    const nextBtn = slider.querySelector('.cert-slider-btn.next');
    let currentIndex = 0;
    const totalSlides = slides ? slides.querySelectorAll('img').length : 2;
    const slideWidth = 100 / totalSlides;

    if (slides && prevBtn && nextBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        slides.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      });
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        slides.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      });
    }
  });
}

/* ============================================
   INITIALIZE
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initThreeBackground();
  initNavbar();
  initScrollReveal();
  initSkillBars();
  initExpandableGalleries();
  initLightbox();
  initResumeModal();
  initContactForm();
  initTypedEffect();
  initCounters();
  initProjectFilters();
  init3DTiltAndSpotlight();
  initBackToTop();
  initCertSliders();
});
