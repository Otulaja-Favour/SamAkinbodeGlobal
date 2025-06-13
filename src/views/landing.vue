<template>
  <div class="christian-books-app">
    <div class="floating-books">
      <div class="book book-1">📖</div>
      <div class="book book-2">📚</div>
      <div class="book book-3">📜</div>
    </div>

    <header class="header">
      <nav class="navbar navbar-expand-lg navbar-light nav-container">
        <div class="container">
          <a class="navbar-brand logo" href="#"> <span class="logo-icon">✝</span> BookVault </a>
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
                <button
                  class="btn cta-button bounce"
                  @click="createAccount"
                  :disabled="isCreatingAccount"
                >
                  {{ isCreatingAccount ? 'Creating...' : 'Create Account' }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <section class="hero">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="container hero-container text-center">
        <h1 class="hero-title typing">Christian Books Library</h1>
        <p class="hero-subtitle typing">Discover Faith. Grow Spiritually.</p>
        <div class="hero-buttons d-flex justify-content-center gap-3 flex-wrap">
          <button
            class="btn btn-light btn-lg bounce"
            @click="createAccount"
            :disabled="isCreatingAccount"
          >
            {{ isCreatingAccount ? 'Creating...' : 'Start Reading' }}
          </button>
          <button class="btn btn-outline-light btn-lg bounce">
            <a href="#features" class="learn-more">Learn More</a>
          </button>
        </div>
      </div>
    </section>

    <section class="about-me animate-section my-4">
      <div class="container">
        <div class="row align-items-center about-me-content">
          <div class="col-md-6 order-md-2"> <img src="../assets/images/akin.jpg" class="img-fluid about-me-img" alt="Sam Akinbode" />
          </div>
          <div class="col-md-6 order-md-1 about-me-text"> <h2>About Me</h2>
            <p>Hello, I'm Sam Akinbode</p>
            <p>
              As a global educationist, dynamic public speaker, creative writer, and seasoned
              business & financial strategist, I'm passionate about empowering individuals and
              organizations to reach their full potential. My vision is to raise Kingdom-driven
              agents of change who will transform every facet of human endeavor. I'm committed to
              turning followers into leaders and leaders into agents of transformation.
            </p>
            <p>
              With a wealth of experience in education, public speaking, and business strategy, I've
              had the privilege of working with diverse groups, from students to corporate
              executives. My approach is centered on equipping individuals with the knowledge,
              skills, and values necessary to excel in their chosen fields and make a meaningful
              impact in their communities.
            </p>
            <p>
              Through my work, I aim to inspire a new generation of leaders who are not only skilled
              and knowledgeable but also driven by purpose and integrity. I believe that true
              leadership is about serving others and creating a lasting legacy that transcends
              borders and generations.
            </p>
            <p>
              Let's connect and shape a brighter future together. Whether you're looking to develop
              your leadership skills, improve your organization's performance, or simply learn from
              my experiences, I'm here to support and empower you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </section>
    

    <section class="carousel-section animate-section my-4">
      <div class="container">
        <div class="motivational-quotes-track" id="motivationalCarouselTrack">
          <div class="carousel-image-wrapper">
            <img
              src="../assets/images/moti1.jpg"
              class="d-block w-100"
              alt="Motivational Quote 1"
            />
          </div>
          <div class="carousel-image-wrapper">
            <img
              src="../assets/images/moti2.jpg"
              class="d-block w-100"
              alt="Motivational Quote 2"
            />
          </div>
          <div class="carousel-image-wrapper">
            <img
              src="../assets/images/moti3.jpg"
              class="d-block w-100"
              alt="Motivational Quote 3"
            />
          </div>
          <div class="carousel-image-wrapper">
            <img
              src="../assets/images/moti4.jpg"
              class="d-block w-100"
              alt="Motivational Quote 4"
            />
          </div>
          <div class="carousel-image-wrapper">
            <img
              src="../assets/images/moti5.jpg"
              class="d-block w-100"
              alt="Motivational Quote 5"
            />
          </div>
          <div class="carousel-image-wrapper">
            <img
              src="../assets/images/moti6.jpg"
              class="d-block w-100"
              alt="Motivational Quote 6"
            />
          </div>
        </div>
      </div>
    </section>

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

    <section class="cta-section animate-section" id="contact">
      <div class="container cta-container text-center">
        <h2>Ready to Start?</h2>
        <p>Join thousands of Christians growing in faith through reading.</p>
        <button
          class="btn cta-final-button pulse"
          @click="createAccount"
          :disabled="isCreatingAccount"
        >
          {{ isCreatingAccount ? 'Creating...' : 'Create Account Now' }}
        </button>
      </div>
      <contact />
    </section>

    <footer class="text-white text-center">
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
  components: { contact },
  data() {
    return {
      isCreatingAccount: false,
      floatingBooksInterval: null,
      carouselInterval: null,
      updateCarouselItemWidthRef: null, 
    }
  },
  mounted() {
    this.startFloatingBooksAnimation()
    this.observeSections()
    this.$nextTick(() => {
      this.startCarouselAutoScroll()
    })
  },
  beforeUnmount() {
    if (this.floatingBooksInterval) clearInterval(this.floatingBooksInterval)
    if (this.carouselInterval) cancelAnimationFrame(this.carouselInterval)
    if (this.updateCarouselItemWidthRef) {
      window.removeEventListener('resize', this.updateCarouselItemWidthRef); 
    }
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
        book.className = 'dynamic-book'
        book.style.cssText = `
          position: fixed;
          left: ${Math.random() * 100}%;
          top: 100%;
          font-size: 1.5rem;
          opacity: 0.1;
          z-index: -1;
          pointer-events: none;
        `
        document.body.appendChild(book)
        setTimeout(() => {
          book.style.top = '-100px'
          book.style.transform = 'rotate(360deg) scale(1.2)'
          book.style.opacity = '0.3'
        }, 100)
        setTimeout(() => book.remove(), 8000)
      }, 3000)
    },
    observeSections() {
      const sections = document.querySelectorAll('.animate-section')
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.2 },
      )
      sections.forEach((section) => observer.observe(section))
    },
    updateCarouselItemWidth() {
        const carouselTrack = document.querySelector('#motivationalCarouselTrack');
        if (!carouselTrack) return;

        const items = Array.from(carouselTrack.children);
        if (items.length === 0) return;

        const containerWidth = carouselTrack.parentElement.offsetWidth;
        let itemsToShow = 3; // Default for desktop (>= 993px)

        if (window.innerWidth <= 768) { // Mobile (<= 768px)
            itemsToShow = 1;
        } else if (window.innerWidth > 768 && window.innerWidth <= 992) { // Tablets (769px to 992px)
            itemsToShow = 2;
        }

        const itemWidth = containerWidth / itemsToShow;

        items.forEach((item) => {
            item.style.width = `${itemWidth}px`;
            item.style.minWidth = `${itemWidth}px`; 
        });
    },
    startCarouselAutoScroll() {
      const carouselTrack = document.querySelector('#motivationalCarouselTrack')
      if (!carouselTrack) {
        console.error('Carousel track element not found')
        return
      }

      let items = Array.from(carouselTrack.children) 
      if (items.length === 0) {
        console.warn('No carousel items found.')
        return
      }

      // Store the function reference to remove it later
      this.updateCarouselItemWidthRef = this.updateCarouselItemWidth.bind(this);
      
      this.updateCarouselItemWidthRef();
      window.addEventListener('resize', this.updateCarouselItemWidthRef);

      // Clone items for seamless looping
      const numOriginalItems = items.length;
      const numClones = numOriginalItems * 2; 
      for (let i = 0; i < numClones; i++) {
        const clone = items[i % numOriginalItems].cloneNode(true);
        carouselTrack.appendChild(clone);
      }
      // Re-get items after cloning to include clones
      items = Array.from(carouselTrack.children);


      let currentTranslateX = 0
      const scrollSpeed = 0.5 
      let animationFrameId

      const animate = () => {
        currentTranslateX -= scrollSpeed
        const singleOriginalItemWidth = items[0].offsetWidth; 
        const totalOriginalWidth = numOriginalItems * singleOriginalItemWidth;

        if (Math.abs(currentTranslateX) >= totalOriginalWidth) {
          currentTranslateX += totalOriginalWidth 
        }
        carouselTrack.style.transform = `translateX(${currentTranslateX}px)`
        animationFrameId = requestAnimationFrame(animate)
      }

      animationFrameId = requestAnimationFrame(animate)

      // Pause on hover
      carouselTrack.addEventListener('mouseenter', () => cancelAnimationFrame(animationFrameId))
      carouselTrack.addEventListener('mouseleave', () => {
        animationFrameId = requestAnimationFrame(animate)
      })

      this.carouselInterval = animationFrameId
    },
  },
}
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
.book,
.dynamic-book {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.1;
  animation: float-book 15s ease-in-out infinite;
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
.hero-title,
.hero-subtitle {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}
.hero-title {
  font-size: 3rem;
  font-weight: 700;
  animation: typing 3s steps(30, end) forwards;
}
.hero-title::after,
.hero-subtitle::after {
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

/* About Me Section - Desktop/Default Styles */
.about-me .container {
  padding: 20px;
}
.about-me-content {
  align-items: center;
}
.about-me-img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
.about-me-text {
  padding-right: 20px;
}
.about-me-text h2 {
  margin-bottom: 1rem;
  color: #1e3a8a;
}
.about-me-text p {
  line-height: 1.8;
  margin-bottom: 1rem;
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
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
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

/* Carousel Section */
.carousel-section {
  overflow: hidden; 
  padding: 20px 0;
  width: 100%;
  min-height: 250px;
}

.motivational-quotes-track {
  display: flex;
  flex-wrap: nowrap; 
  width: fit-content; 
  transition: transform 0.1s linear; 
}

.carousel-image-wrapper {
  min-width: 0; 
  display: block;
  height: 400px;
  padding: 0 10px; 
  box-sizing: border-box; 
}
.carousel-image-wrapper img {
  width: 500px;
  height: 250px; 
  object-fit: cover; 
  display: block;
}

/* Animations (unchanged) */
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
.bounce:hover:not(:disabled) { animation: bounce 0.6s ease; }
.pulse { animation: pulse 2s infinite; }
.animate-section {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}
.animate-section.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */

/* Media query for smaller screens (mobile phones) */
@media (max-width: 768px) {
  .hero {
    padding: 150px 0 60px;
  }
  .hero-title {
    font-size: 25px;
    padding: 0px 0px;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .features-grid,
  .stats-grid {
    flex-direction: column;
    align-items: center;
  }
  .feature-card,
  .stat-item {
    width: 100%;
    max-width: 350px;
  }
  .cta-final-button {
    padding: 12px 30px;
    font-size: 1rem;
  }

  /* About Me Section for Mobile */
  .about-me-content {
    flex-direction: column; 
  }
  .col-md-6.order-md-2 {
    order: 1; 
    margin-bottom: 20px;
  }
  .col-md-6.order-md-1 {
    order: 2; 
    text-align: center; 
    padding-left: 0;
    padding-right: 0; 
  }
  .about-me-text {
    padding-right: 0; 
  }


  /* Carousel specific for mobile */
  .carousel-section {
    min-height: 200px; 
  }
  .carousel-image-wrapper {
    height: 200px; 
  }
}

/* Media query for tablets (between 769px and 992px) */
@media (min-width: 769px) and (max-width: 992px) {
  
  .about-me-text {
    padding-right: 15px;
  }
  .about-me-img {
    margin-left: 15px;
  }

  /* Carousel specific for tablets */
  .carousel-section {
    min-height: 220px;
  }
  .carousel-image-wrapper {
    height: 220px; 
  }
}

/* Desktop styles (min-width: 993px and up) */
@media (min-width: 993px) {
  .carousel-section {
    min-height: 250px; 
  }
  .carousel-image-wrapper {
    height: 250px; 
  }
}
</style>