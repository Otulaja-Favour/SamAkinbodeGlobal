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
                <button class="btn cta-button" @click="createAccount" :disabled="isCreatingAccount">
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
        <h1 class="hero-title">Christian Books Library</h1>
        <p class="hero-subtitle">Discover Faith. Grow Spiritually.</p>
        <div class="hero-buttons d-flex justify-content-center gap-3 flex-wrap">
          <button class="btn btn-light btn-lg" @click="createAccount" :disabled="isCreatingAccount" style="border-radius: 30px;">
            {{ isCreatingAccount ? 'Creating...' : 'Start Reading' }}
          </button>
          <button class="btn btn-outline-light btn-lg"  style="border-radius: 30px;">
           <a href="#features" style="text-decoration: none; color: black;"> Learn More</a>
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Books Carousel Section -->
   

    <!-- Features Section -->
    <section class="features" id="features" style="margin: 40px 0px">
      <div class="container-fluid my-4">
        <h1 class="section-title text-center">Simple & Powerful</h1>
        <div class="features-grid" style="display: flex; flex-wrap: wrap; flex-direction: row">
          <div class="feature-card">
            <span class="feature-icon">📚</span>
            <h3>Christian Books</h3>
            <p>Vast collection of Christian literature and educational materials.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🔍</span>
            <h3>Easy Search</h3>
            <p>Find books by topic, author, or spiritual theme instantly.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">⛪</span>
            <h3>Church Library</h3>
            <p>Perfect for churches, schools, and ministry organizations.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📱</span>
            <h3>Mobile Ready</h3>
            <p>Access your library anywhere, anytime on any device.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="container">
        <h2 class="section-title" style="color: white">Growing Together</h2>
        <div class="stats-grid my-4" style="display: flex; justify-content: center">
          <div class="stat-item">
            <h3>10K+</h3>
            <p>Christian Books</p>
          </div>
          <div class="stat-item">
            <h3>500+</h3>
            <p>Churches</p>
          </div>
          <div class="stat-item">
            <h3>50K+</h3>
            <p>Happy Readers</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" id="contact">
      <div class="container cta-container text-center">
        <h2>Ready to Start?</h2>
        <p>Join thousands of Christians growing in faith through reading.</p>
        <button class="btn cta-final-button" @click="createAccount" :disabled="isCreatingAccount">
          {{ isCreatingAccount ? 'Creating...' : 'Create Account Now' }}
        </button>
      </div>
    </section>
<!-- <div class="ctasec"> -->
  <contact />
<!-- </div> -->

    <!-- Footer -->
    <footer
      class="text-white text-center mt-5"
      style="background-color: #1e3a8a; padding: 40px 0px"
    >
      <div class="container">
        <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import contact from '@/components/contact.vue'

export default {
  components:{contact},
  // name: 'BookVault',
  data() {
    return {
      isCreatingAccount: false,
    }
  },

  mounted() {
    this.startFloatingBooksAnimation()
  },
  beforeUnmount() {
    if (this.floatingBooksInterval) clearInterval(this.floatingBooksInterval)
  },
  methods: {
    createAccount() {
      this.isCreatingAccount = true
      toast.success('Proceeding . . .')
      setTimeout(() => {
        this.$router.push('/auth')
        this.isCreatingAccount = false
      }, 1500)
    },
    startFloatingBooksAnimation() {
      this.floatingBooksInterval = setInterval(() => {
        const book = document.createElement('div')
        const icons = ['📖', '📚', '📜', '✝']
        book.innerHTML = icons[Math.floor(Math.random() * 4)]
        book.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}%;
          top: 100%;
          font-size: 1.5rem;
          opacity: 0.1;
          z-index: -1;
          pointer-events: none;
          transition: all 8s linear;
        `
        document.body.appendChild(book)
        setTimeout(() => {
          book.style.top = '-100px'
          book.style.transform = 'rotate(360deg)'
        }, 100)
        setTimeout(() => book.remove(), 8000)
      }, 3000)
    },
  },
}
</script>

<style scoped>
.christian-books-app {
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
}

.feature-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.5s ease;
  transform: translateY(50px);
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  width: 30%;
  margin: 15px;
}

.stats {
  padding: 100px 0;
  background: linear-gradient(135deg, #1e3a8a, #7c3aed);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.stats::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  top: -150px;
  right: -150px;
  animation: float 10s ease-in-out infinite;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
  position: relative;
  z-index: 2;
}

.cta-section {
  padding: 100px 0;
  background: #f8f9fa;
  text-align: center;
}

.cta-content {
  animation: fadeInUp 1s ease;
}

.cta-content h2 {
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #333;
}

.cta-content p {
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 3rem;
}

.cta-final-button {
  background: linear-gradient(45deg, #1e3a8a, #7c3aed);
  color: white;
  padding: 20px 50px;
  border: none;
  border-radius: 30px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  animation: glow 2s infinite;
}

.cta-final-button:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 20px 50px rgba(30, 58, 138, 0.4);
}

.feature-card:nth-child(1) {
  animation-delay: 0.2s;
}
.feature-card:nth-child(2) {
  animation-delay: 0.4s;
}
.feature-card:nth-child(3) {
  animation-delay: 0.6s;
}
.feature-card:nth-child(4) {
  animation-delay: 0.8s;
}

.feature-card:hover {
  transform: translateY(-20px) scale(1.05);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bookFlip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-15deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

/* Floating Books Background */
.floating-books {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.book {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.1;
  animation: float 15s ease-in-out infinite;
}

.book-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}
.book-2 {
  top: 60%;
  right: 20%;
  animation-delay: 5s;
}
.book-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: 10s;
}

/* Header */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: block;
  animation: bounce 2s infinite;
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
  transition: all 0.3s ease;
}

.cta-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
}

.cta-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Hero Section */
.hero {
  padding: 250px 0 80px;
  background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
}

.circle-1 {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  top: 20%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.05);
  bottom: 20%;
  right: 15%;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  top: -100px;
  right: -100px;
  animation: float 10s ease-in-out infinite;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  animation: fadeInUp 1s ease;
}

.hero-subtitle {
  font-size: 1.25rem;
  animation: fadeInUp 1s ease 0.3s both;
}
.stat-item {
  animation: fadeInUp 1s ease;
  width: 30%;
}

.stat-item:nth-child(1) {
  animation-delay: 0.2s;
}
.stat-item:nth-child(2) {
  animation-delay: 0.4s;
}
.stat-item:nth-child(3) {
  animation-delay: 0.6s;
}

.stat-item h3 {
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: 700;
  animation: pulse 2s infinite;
}

.stat-item p {
  font-size: 1.3rem;
}
.ctasec{
  display: flex;
}

/* Footer */

/* Responsive Adjustments */
@media (max-width: 900px) {
  .hero-title {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .feature-card {
    width: 100%;
  }
  .stats-grid {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .ctasec{
    flex-direction: column;
  }
}
</style>
