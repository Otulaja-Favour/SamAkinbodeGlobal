<template>
  <div class="christian-books-app">
    <!-- Floating Books Background -->
    <div class="floating-books">
      <div class="book book-1">📖</div>
      <div class="book book-2">📚</div>
      <div class="book book-3">📜</div>
    </div>

    <!-- Header -->
    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-light nav-container">
        <div class="container">
          <a class="navbar-brand logo" href="#">
            <span class="logo-icon">✝</span> BookVault
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center">
              <li class="nav-item">
                <a class="nav-link" href="#features">Features</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#contact">Contact</a>
              </li>
              <li class="nav-item">
                <button class="btn cta-button bounce" @click="createAccount" :disabled="isCreatingAccount">
                  {{ isCreatingAccount ? 'Creating...' : 'Create Account' }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="container hero-container text-center">
        <h1 class="hero-title typing">Christian Books Library</h1>
        <p class="hero-subtitle typing">Discover Faith. Grow Spiritually.</p>
        <div class="hero-buttons d-flex justify-content-center gap-3 flex-wrap">
          <button class="btn btn-light btn-lg bounce" @click="createAccount" :disabled="isCreatingAccount">
            {{ isCreatingAccount ? 'Creating...' : 'Start Reading' }}
          </button>
          <button class="btn btn-outline-light btn-lg bounce">
            <a href="#features" class="learn-more">Learn More</a>
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features animate-section" id="features">
      <div class="container-fluid my-4">
        <h1 class="section-title text-center">Simple & Powerful</h1>
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon bounce">📚</span>
            <h3>Christian Books</h3>
            <p>Vast collection of Christian literature and educational materials.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon bounce">🔍</span>
            <h3>Easy Search</h3>
            <p>Find books by topic, author, or spiritual theme instantly.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon bounce">⛪</span>
            <h3>Church Library</h3>
            <p>Perfect for churches, schools, and ministry organizations.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon bounce">📱</span>
            <h3>Mobile Ready</h3>
            <p>Access your library anywhere, anytime on any device.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats animate-section">
      <div class="container">
        <h2 class="section-title">Growing Together</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <h3 class="pulse">10K+</h3>
            <p>Christian Books</p>
          </div>
          <div class="stat-item">
            <h3 class="pulse">500+</h3>
            <p>Churches</p>
          </div>
          <div class="stat-item">
            <h3 class="pulse">50K+</h3>
            <p>Happy Readers</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section animate-section" id="contact">
      <div class="container cta-container text-center">
        <h2>Ready to Start?</h2>
        <p>Join thousands of Christians growing in faith through reading.</p>
        <button class="btn cta-final-button pulse" @click="createAccount" :disabled="isCreatingAccount">
          {{ isCreatingAccount ? 'Creating...' : 'Create Account Now' }}
        </button>
      </div>
      <contact />
    </section>

    <!-- Footer -->
    <footer class="text-white text-center">
      <div class="container">
        <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import contact from '@/components/contact.vue';

export default {
  components: { contact },
  data() {
    return {
      isCreatingAccount: false,
      floatingBooksInterval: null,
    };
  },
  mounted() {
    this.startFloatingBooksAnimation();
    this.observeSections();
  },
  beforeUnmount() {
    if (this.floatingBooksInterval) clearInterval(this.floatingBooksInterval);
  },
  methods: {
    createAccount() {
      this.isCreatingAccount = true;
      toast.success('Proceeding . . .');
      setTimeout(() => {
        this.$router.push('/auth');
        this.isCreatingAccount = false;
      }, 1500);
    },
    startFloatingBooksAnimation() {
      this.floatingBooksInterval = setInterval(() => {
        const book = document.createElement('div');
        const icons = ['📖', '📚', '📜', '✝'];
        book.innerHTML = icons[Math.floor(Math.random() * 4)];
        book.className = 'dynamic-book';
        book.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}%;
          top: 100%;
          font-size: 1.5rem;
          opacity: 0.1;
          z-index: -1;
          pointer-events: none;
        `;
        document.body.appendChild(book);
        setTimeout(() => {
          book.style.top = '-100px';
          book.style.transform = 'rotate(360deg) scale(1.2)';
          book.style.opacity = '0.3';
        }, 100);
        setTimeout(() => book.remove(), 8000);
      }, 3000);
    },
    observeSections() {
      const sections = document.querySelectorAll('.animate-section');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.2 }
      );
      sections.forEach((section) => observer.observe(section));
    },
  },
};
</script>

<style scoped>
.christian-books-app {
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
  position: relative;
}

/* Floating Books */
.floating-books {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}
.book, .dynamic-book {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.1;
  animation: float-book 15s ease-in-out infinite;
}
.book-1 { top: 20%; left: 10%; animation-delay: 0s; }
.book-2 { top: 60%; right: 20%; animation-delay: 5s; }
.book-3 { bottom: 30%; left: 30%; animation-delay: 10s; }

/* Header */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e3a8a;
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-icon {
  font-size: 1.8rem;
  animation: pulse 2s infinite;
}
.cta-button {
  background: linear-gradient(45deg, #1e3a8a, #7c3aed);
  color: white;
  border-radius: 25px;
  font-weight: 600;
  padding: 10px 20px;
}
.cta-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Hero Section */
.hero {
  padding: 200px 0 80px;
  background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
  color: white;
  position: relative;
  overflow: hidden;
}
.floating-circle {
  position: absolute;
  border-radius: 50%;
  animation: float-circle 6s ease-in-out infinite;
}
.circle-1 {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  top: 20%;
  left: 10%;
}
.circle-2 {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.05);
  bottom: 20%;
  right: 15%;
  animation-direction: reverse;
}
.hero-title, .hero-subtitle {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}
.hero-title {
  font-size: 3rem;
  
  font-weight: 700;
  animation: typing 3s steps(30, end) forwards;
}
.hero-title::after, .hero-subtitle::after {
  content: '|';
  position: absolute;
  right: 0;
  animation: blink 0.7s infinite;
}
.hero-subtitle {
  font-size: 1.25rem;
  animation: typing 2s steps(30, end) 3s forwards;
}
.hero-buttons .btn {
  border-radius: 30px;
  transition: transform 0.3s ease;
}
.learn-more {
  text-decoration: none;
  color: inherit;
}

/* Features Section */
.features {
  padding: 40px 0;
}
.features-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 30%;
  min-width: 250px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.feature-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}
.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Stats Section */
.stats {
  padding: 80px 0;
  background: linear-gradient(135deg, #1e3a8a, #7c3aed);
  color: white;
  text-align: center;
}
.stats-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}
.stat-item {
  width: 30%;
  min-width: 200px;
}
.stat-item h3 {
  font-size: 3rem;
  font-weight: 700;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: #f8f9fa;
  text-align: center;
}
.cta-final-button {
  background: linear-gradient(45deg, #1e3a8a, #7c3aed);
  color: white;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.cta-final-button:hover:not(:disabled) {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 10px 30px rgba(30, 58, 138, 0.4);
}
.cta-final-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Footer */
footer {
  background-color: #1e3a8a;
  padding: 40px 0;
}

/* Animations */
@keyframes float-book {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(15deg); }
}
@keyframes float-circle {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}
@keyframes blink {
  50% { opacity: 0; }
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.bounce:hover:not(:disabled) {
  animation: bounce 0.6s ease;
}
.pulse {
  animation: pulse 2s infinite;
}
.animate-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.animate-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 900px) {
  .hero { padding: 150px 0 60px; }
  .hero-title { font-size: 25px; padding: 0px 0px; }
  .hero-subtitle { font-size: 1rem; }
  .features-grid, .stats-grid { flex-direction: column; align-items: center; }
  .feature-card, .stat-item { width: 100%; max-width: 350px; }
  .cta-final-button { padding: 12px 30px; font-size: 1rem; }
}
</style>