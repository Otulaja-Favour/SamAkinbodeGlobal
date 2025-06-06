<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChristianBooks Library - Faith-Based Collection</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Floating Animation */
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

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
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

        /* Header */
        header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            animation: slideInLeft 1s ease;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
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

        .logo::before {
            content: "✝️";
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
            position: relative;
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
            text-decoration: none;
            display: inline-block;
            animation: glow 2s infinite;
        }

        .cta-button:hover {
            transform: translateY(-3px) scale(1.05);
        }

        /* Hero Section */
        .hero {
            padding: 140px 0 100px;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }

        .hero::before {
            content: '';
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: 20%;
            left: 10%;
            animation: float 6s ease-in-out infinite;
        }

        .hero::after {
            content: '';
            position: absolute;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            bottom: 20%;
            right: 15%;
            animation: float 8s ease-in-out infinite reverse;
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            font-weight: 700;
            animation: fadeInUp 1s ease;
        }

        .hero p {
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
            text-decoration: none;
            display: inline-block;
            animation: pulse 2s infinite;
        }

        .btn-primary:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
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
            text-decoration: none;
            display: inline-block;
        }

        .btn-secondary:hover {
            background: white;
            color: #1e3a8a;
            transform: translateY(-5px) scale(1.1);
        }

        /* Features Section */
        .features {
            padding: 100px 0;
            background: white;
            position: relative;
        }

        .section-title {
            text-align: center;
            font-size: 3rem;
            margin-bottom: 4rem;
            color: #333;
            animation: fadeInUp 1s ease;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 3rem;
            margin-top: 4rem;
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
        }

        .feature-card:nth-child(1) { animation-delay: 0.2s; }
        .feature-card:nth-child(2) { animation-delay: 0.4s; }
        .feature-card:nth-child(3) { animation-delay: 0.6s; }
        .feature-card:nth-child(4) { animation-delay: 0.8s; }

        .feature-card:hover {
            transform: translateY(-20px) scale(1.05);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
        }

        .feature-icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            display: block;
            animation: bounce 2s infinite;
        }

        .feature-card h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: #1e3a8a;
        }

        .feature-card p {
            color: #666;
            font-size: 1.1rem;
        }

        /* Stats Section */
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

        .stat-item {
            animation: fadeInUp 1s ease;
        }

        .stat-item:nth-child(1) { animation-delay: 0.2s; }
        .stat-item:nth-child(2) { animation-delay: 0.4s; }
        .stat-item:nth-child(3) { animation-delay: 0.6s; }

        .stat-item h3 {
            font-size: 4rem;
            margin-bottom: 1rem;
            font-weight: 700;
            animation: pulse 2s infinite;
        }

        .stat-item p {
            font-size: 1.3rem;
        }

        /* CTA Section */
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

        /* Footer */
        footer {
            background: #1a1a1a;
            color: white;
            padding: 60px 0 30px;
            text-align: center;
            animation: slideInLeft 1s ease;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
            margin-bottom: 3rem;
        }

        .footer-section h3 {
            margin-bottom: 1.5rem;
            color: #7c3aed;
            font-size: 1.3rem;
        }

        /* Book Animation */
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

        .book:nth-child(1) {
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }

        .book:nth-child(2) {
            top: 60%;
            right: 20%;
            animation-delay: 5s;
        }

        .book:nth-child(3) {
            bottom: 30%;
            left: 30%;
            animation-delay: 10s;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero p {
                font-size: 1.2rem;
            }
            
            .hero-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .nav-links {
                display: none;
            }

            .section-title {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <!-- Floating Books Background -->
    <div class="floating-books">
        <div class="book">📖</div>
        <div class="book">📚</div>
        <div class="book">📜</div>
    </div>

    <!-- Header -->
    <header>
        <nav class="container">
            <div class="logo">ChristianBooks</div>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#" class="cta-button">Create Account</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Christian Books Library</h1>
                <p>Discover Faith. Grow Spiritually.</p>
                <div class="hero-buttons">
                    <a href="#" class="btn-primary" onclick="createAccount()">Start Reading</a>
                    <a href="#features" class="btn-secondary">Learn More</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="container">
            <h2 class="section-title">Simple & Powerful</h2>
            <div class="features-grid">
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
            <h2 class="section-title" style="color: white;">Growing Together</h2>
            <div class="stats-grid">
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
    <section class="cta-section">
        <div class="container">
            <div class="cta-content">
                <h2>Ready to Start?</h2>
                <p>Join thousands of Christians growing in faith through reading.</p>
                <a href="#" class="cta-final-button" onclick="createAccount()">Create Account Now</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
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

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (this.getAttribute('href') !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Create account function
        function createAccount() {
            const button = event.target;
            const originalText = button.textContent;
            
            // Animate button
            button.style.transform = 'scale(0.95)';
            button.textContent = 'Creating...';
            
            setTimeout(() => {
                button.style.transform = 'scale(1)';
                alert('Welcome to ChristianBooks Library!\n\nYour account will be created and you can start exploring thousands of Christian books and resources.');
                button.textContent = originalText;
            }, 1500);
        }

        // Scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        });

        document.querySelectorAll('.feature-card, .stat-item, .cta-content').forEach(el => {
            observer.observe(el);
        });

        // Add more floating animations
        document.addEventListener('DOMContentLoaded', function() {
            // Random floating books
            setInterval(() => {
                const book = document.createElement('div');
                book.innerHTML = ['📖', '📚', '📜', '✝️'][Math.floor(Math.random() * 4)];
                book.style.position = 'fixed';
                book.style.left = Math.random() * 100 + '%';
                book.style.top = '100%';
                book.style.fontSize = '1.5rem';
                book.style.opacity = '0.1';
                book.style.zIndex = '-1';
                book.style.pointerEvents = 'none';
                book.style.transition = 'all 8s linear';
                
                document.body.appendChild(book);
                
                setTimeout(() => {
                    book.style.top = '-100px';
                    book.style.transform = 'rotate(360deg)';
                }, 100);
                
                setTimeout(() => {
                    book.remove();
                }, 8000);
            }, 3000);
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });
    </script>
</body>
</html>