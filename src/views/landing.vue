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
        <nav class="nav-container">
          <div class="logo">
            <span class="logo-icon">✝</span>
            ChristianBooks
          </div>
          <ul class="nav-links">
            <li><a href="#" @click.prevent="scrollToSection('features')">Features</a></li>
            <li><a href="#" @click.prevent="scrollToSection('books')">Books</a></li>
            <li><a href="#" @click.prevent="scrollToSection('about')">About</a></li>
            <li><a href="#" @click.prevent="scrollToSection('contact')">Contact</a></li>
            <li>
              <button 
                class="cta-button" 
                @click="createAccount"
                :disabled="isCreatingAccount"
              >
                {{ isCreatingAccount ? 'Creating...' : 'Create Account' }}
              </button>
            </li>
          </ul>
        </nav>
      </header>
  
      <!-- Hero Section -->
      <section class="hero" ref="heroSection">
        <div class="floating-circle circle-1"></div>
        <div class="floating-circle circle-2"></div>
        
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">Christian Books Library</h1>
            <p class="hero-subtitle">Discover Faith. Grow Spiritually.</p>
            <div class="hero-buttons">
              <button 
                class="btn-primary" 
                @click="createAccount"
                :disabled="isCreatingAccount"
              >
                {{ isCreatingAccount ? 'Creating...' : 'Start Reading' }}
              </button>
              <button 
                class="btn-secondary" 
                @click="scrollToSection('features')"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Featured Books Carousel Section -->
      <section id="books" class="books-section">
        <div class="books-container">
          <h2 class="section-title">Featured Christian Books</h2>
          
          <div class="carousel-wrapper">
            <div class="carousel-container" ref="carousel">
              <div 
                class="carousel-track" 
                :style="{ transform: `translateX(${-(currentSlide * slideWidth)}px)` }"

                >
                <div 
                  v-for="book in books" 
                  :key="book.id" 
                  class="book-card"
                >
                  <div class="book-cover">
                    <div class="book-spine"></div>
                    <div class="book-front">
                      <div class="book-icon">{{ book.icon }}</div>
                      <h4 class="book-title">{{ book.title }}</h4>
                      <p class="book-author">{{ book.author }}</p>
                    </div>
                  </div>
                  <div class="book-info">
                    <p class="book-description">{{ book.description }}</p>
                    <div class="book-category">{{ book.category }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Carousel Controls -->
            <button 
              class="carousel-btn carousel-btn-prev" 
              @click="prevSlide"
              :disabled="currentSlide === 0"
            >
              ‹
            </button>
            <button 
              class="carousel-btn carousel-btn-next" 
              @click="nextSlide"
              :disabled="currentSlide >= maxSlides"
            >
              ›
            </button>
            
            <!-- Carousel Indicators -->
            <div class="carousel-indicators">
              <button
                v-for="(slide, index) in totalSlides"
                :key="index"
                class="indicator"
                :class="{ active: currentSlide === index }"
                @click="goToSlide(index)"
              ></button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section id="features" class="features">
        <div class="features-container">
          <h2 class="section-title">Simple & Powerful</h2>
          <div class="features-grid">
            <div 
              v-for="(feature, index) in features" 
              :key="feature.id"
              class="feature-card"
              :style="{ animationDelay:` ${index * 0.2}s` }"
            >
              <span class="feature-icon">{{ feature.icon }}</span>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Stats Section -->
      <section class="stats">
        <div class="floating-circle circle-3"></div>
        
        <div class="stats-container">
          <h2 class="section-title white-title">Growing Together</h2>
          <div class="stats-grid">
            <div 
              v-for="(stat, index) in stats" 
              :key="stat.id"
              class="stat-item"
              :style="{ animationDelay:` ${index * 0.2}s` }"
            >
              <h3>{{ stat.value }}</h3>
              <p>{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-container">
          <div class="cta-content">
            <h2>Ready to Start?</h2>
            <p>Join thousands of Christians growing in faith through reading.</p>
            <button 
              class="cta-final-button" 
              @click="createAccount"
              :disabled="isCreatingAccount"
            >
              {{ isCreatingAccount ? 'Creating...' : 'Create Account Now' }}
            </button>
          </div>
        </div>
      </section>
  
      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>ChristianBooks</h3>
              <p>Building faith through reading.</p>
            </div>
            <div class="footer-section">
              <h3>Contact</h3>
              <p>Email: hello@christianbooks.com</p>
              <p>Phone: (555) 123-BOOK</p>
            </div>
          </div>
          <p>&copy; 2025 ChristianBooks. Blessed Reading.</p>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
  export default {
    name: 'ChristianBooksLibrary',
    
    data() {
      return {
        isCreatingAccount: false,
        currentSlide: 0,
        slideWidth: 320,
        slidesToShow: 3,
        
        books: [
          {
            id: 1,
            title: 'The Purpose Driven Life',
            author: 'Rick Warren',
            description: 'Discover God\'s amazing plan for your life in this bestselling Christian book.',
            category: 'Spiritual Growth',
            icon: '📖'
          },
          {
            id: 2,
            title: 'Jesus Calling',
            author: 'Sarah Young',
            description: 'Daily devotions for a deeper relationship with Christ.',
            category: 'Devotional',
            icon: '🙏'
          },
          {
            id: 3,
            title: 'Mere Christianity',
            author: 'C.S. Lewis',
            description: 'A timeless exploration of the Christian faith and its foundations.',
            category: 'Apologetics',
            icon: '✝'
          },
          {
            id: 4,
            title: 'The Screwtape Letters',
            author: 'C.S. Lewis',
            description: 'A masterful work of religious satire and spiritual insight.',
            category: 'Fiction',
            icon: '📚'
          },
          {
            id: 5,
            title: 'Crazy Love',
            author: 'Francis Chan',
            description: 'Overwhelmed by a relentless God who loves us deeply.',
            category: 'Spiritual Growth',
            icon: '❤'
          },
          {
            id: 6,
            title: 'The Case for Christ',
            author: 'Lee Strobel',
            description: 'A journalist\'s personal investigation of the evidence for Jesus.',
            category: 'Apologetics',
            icon: '🔍'
          },
          {
            id: 7,
            title: 'Desiring God',
            author: 'John Piper',
            description: 'Meditations of a Christian hedonist on finding joy in God.',
            category: 'Theology',
            icon: '⭐'
          },
          {
            id: 8,
            title: 'The Pursuit of Holiness',
            author: 'Jerry Bridges',
            description: 'A classic on living a life that honors God.',
            category: 'Spiritual Growth',
            icon: '🏔'
          }
        ],
        
        features: [
          {
            id: 1,
            icon: '📚',
            title: 'Christian Books',
            description: 'Vast collection of Christian literature and educational materials.'
          },
          {
            id: 2,
            icon: '🔍',
            title: 'Easy Search',
            description: 'Find books by topic, author, or spiritual theme instantly.'
          },
          {
            id: 3,
            icon: '⛪',
            title: 'Church Library',
            description: 'Perfect for churches, schools, and ministry organizations.'
          },
          {
            id: 4,
            icon: '📱',
            title: 'Mobile Ready',
            description: 'Access your library anywhere, anytime on any device.'
          }
        ],
        
        stats: [
          {
            id: 1,
            value: '10K+',
            label: 'Christian Books'
          },
          {
            id: 2,
            value: '500+',
            label: 'Churches'
          },
          {
            id: 3,
            value: '50K+',
            label: 'Happy Readers'
          }
        ]
      }
    },
    
    computed: {
      maxSlides() {
        return Math.max(0, this.books.length - this.slidesToShow);
      },
      
      totalSlides() {
        return Math.ceil(this.books.length / this.slidesToShow);
      }
    },
    
    mounted() {
      this.initializeAnimations();
      this.setupScrollEffects();
      this.startFloatingBooksAnimation();
      this.updateCarouselSettings();
      window.addEventListener('resize', this.updateCarouselSettings);
    },
    
    beforeUnmount() {
      if (this.floatingBooksInterval) {
        clearInterval(this.floatingBooksInterval);
      }
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.updateCarouselSettings);
    },
    
    methods: {
      createAccount() {
        this.isCreatingAccount = true;
        
        toast.success('Proceeding . . .');
        setTimeout(() => {
        this.$router.push('/auth')
        ;
          this.isCreatingAccount = false;
        }, 1500);
      },
      
      scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      },
      
      nextSlide() {
        if (this.currentSlide < this.maxSlides) {
          this.currentSlide++;
        }
      },
      
      prevSlide() {
        if (this.currentSlide > 0) {
          this.currentSlide--;
        }
      },
      
      goToSlide(index) {
        this.currentSlide = Math.min(index, this.maxSlides);
      },
      
      updateCarouselSettings() {
        const width = window.innerWidth;
        if (width < 768) {
          this.slidesToShow = 1;
          this.slideWidth = 280;
        } else if (width < 1024) {
          this.slidesToShow = 2;
          this.slideWidth = 300;
        } else {
          this.slidesToShow = 3;
          this.slideWidth = 320;
        }
        
        // Reset slide if needed
        if (this.currentSlide > this.maxSlides) {
          this.currentSlide = this.maxSlides;
        }
      },
      
      initializeAnimations() {
        // Initialize intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.animationPlayState = 'running';
            }
          });
        });
  
        this.$nextTick(() => {
          document.querySelectorAll('.feature-card, .stat-item, .cta-content, .book-card').forEach(el => {
            observer.observe(el);
          });
        });
      },
      
      setupScrollEffects() {
        this.handleScroll = () => {
          const scrolled = window.pageYOffset;
          if (this.$refs.heroSection) {
            const speed = scrolled * 0.5;
            this.$refs.heroSection.style.transform = translateY(`${speed}px`);
          }
        };
        
        window.addEventListener('scroll', this.handleScroll);
      },
      
      startFloatingBooksAnimation() {
        this.floatingBooksInterval = setInterval(() => {
          const book = document.createElement('div');
          const icons = ['📖', '📚', '📜', '✝'];
          book.innerHTML = icons[Math.floor(Math.random() * 4)];
          book.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            top: 100%;
            font-size: 1.5rem;
            opacity: 0.1;
            z-index: -1;
            pointer-events: none;
            transition: all 8s linear;
          `;
          
          document.body.appendChild(book);
          
          setTimeout(() => {
            book.style.top = '-100px';
            book.style.transform = 'rotate(360deg)';
          }, 100);
          
          setTimeout(() => {
            book.remove();
          }, 8000);
        }, 3000);
      }
    }
  }
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .christian-books-app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
  }
  
  /* Animations */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
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
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    25% { transform: translateY(-10px); }
    75% { transform: translateY(-5px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.3); }
    50% { box-shadow: 0 0 40px rgba(124, 58, 237, 0.6); }
  }
  
  @keyframes bookFlip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(-15deg); }
    100% { transform: rotateY(0deg); }
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
    font-size: 2rem;
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
    animation: slideInLeft 1s ease;
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 20px;
  }
  
  .logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: #1e3a8a;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: bounce 2s infinite;
  }
  
  .logo-icon {
    font-size: 2rem;
    animation: pulse 2s infinite;
  }
  
  .nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
    align-items: center;
  }
  
  .nav-links a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .nav-links a:hover {
    color: #1e3a8a;
    transform: translateY(-2px);
  }
  
  .cta-button {
    background: linear-gradient(45deg, #1e3a8a, #7c3aed);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: glow 2s infinite;
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
    padding: 140px 0 100px;
    text-align: center;
    color: white;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
  }
  
  .floating-circle {
    position: absolute;
    border-radius: 50%;
  }
  
  .circle-1 {
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    top: 20%;
    left: 10%;
    animation: float 6s ease-in-out infinite;
  }
  
  .circle-2 {
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.05);
    bottom: 20%;
    right: 15%;
    animation: float 8s ease-in-out infinite reverse;
  }
  
  .circle-3 {
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    top: -150px;
    right: -150px;
    animation: float 10s ease-in-out infinite;
  }
  
  .hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 2;
  }
  
  .hero-title {
    font-size: 4rem;
    margin-bottom: 1rem;
    font-weight: 700;
    animation: fadeInUp 1s ease;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    animation: fadeInUp 1s ease 0.3s both;
  }
  
  .hero-buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeInUp 1s ease 0.6s both;
  }
  
  .btn-primary {
    background: white;
    color: #1e3a8a;
    padding: 18px 40px;
    border: none;
    border-radius: 30px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
  
  .btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background: transparent;
    color: white;
    padding: 18px 40px;
    border: 2px solid white;
    border-radius: 30px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-secondary:hover {
    background: white;
    color: #1e3a8a;
    transform: translateY(-5px) scale(1.1);
  }
  
  /* Books Carousel Section */
  .books-section {
    padding: 100px 0;
    background: #f8f9fa;
    position: relative;
  }
  
  .books-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .carousel-wrapper {
    position: relative;
    margin-top: 4rem;
  }
  
  .carousel-container {
    overflow: hidden;
    border-radius: 20px;
  }
  
  .carousel-track {
    display: flex;
    transition: transform 0.5s ease;
    gap: 20px;
    padding: 20px;
  }
  
  .book-card {
    min-width: 300px;
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(50px);
    animation: fadeInUp 0.8s ease forwards;
  }
  
  .book-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
  
  .book-cover {
    position: relative;
    width: 100%;
    height: 200px;
    margin-bottom: 15px;
    perspective: 1000px;
  }
  
  .book-spine {
    position: absolute;
    left: -5px;
    top: 5px;
    width: 10px;
    height: 190px;
    background: linear-gradient(135deg, #8b5cf6, #1e3a8a);
    border-radius: 2px 0 0 2px;
    transform: rotateY(-15deg);
  }
  
  .book-front {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .book-card:hover .book-front {
    animation: bookFlip 0.6s ease;
  }
  
  .book-icon {
    font-size: 3rem;
    margin-bottom: 10px;
  }
  
  .book-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 5px
  }
    .book-info {
  padding: 15px;
}

.book-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.book-category {
  font-size: 0.8rem;
  color: #999;
  text-transform: uppercase;
}
</style>
