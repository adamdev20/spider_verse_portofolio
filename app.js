/* ==========================================================================
   SPIDER-MAN: MILES MORALES COMIC-BOOK THEME - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. NAVBAR INTERSECT OBSERVER & SMOOTH SCROLL
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main.hero-section, section.page-section');

    // Toggle Mobile Menu
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth Scroll Interception for navbar links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 74; // Subtract navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer to highlight active Nav Link on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies core viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    /* ==========================================================================
       2. DYNAMIC CLICK-SPAWN VISUAL COMIC SFX
       ========================================================================== */
    const comicWords = ["THWIP!", "BOOM!", "POW!", "ZAP!", "BAM!", "SPIN!", "SPLASH!", "THWIP!", "KRAK!"];
    const popColors = ["pop-red", "pop-gold", "pop-cyan"];

    document.body.addEventListener('click', (event) => {
        // Prevent spawning bubbles if clicking form fields, buttons, or nav links
        const targetTag = event.target.tagName.toLowerCase();
        if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'button' || event.target.closest('a') || event.target.closest('button')) {
            return;
        }

        // Create the pop span element
        const pop = document.createElement('span');
        pop.classList.add('comic-pop');
        
        // Pick a random word and color class
        const randomWord = comicWords[Math.floor(Math.random() * comicWords.length)];
        const randomColor = popColors[Math.floor(Math.random() * popColors.length)];
        
        pop.textContent = randomWord;
        pop.classList.add(randomColor);

        // Position at click coordinates
        pop.style.left = `${event.clientX}px`;
        pop.style.top = `${event.clientY}px`;

        // Slight random angle adjustment for extra dynamic feel
        const randomRotation = Math.random() * 20 - 10; // -10deg to 10deg
        pop.style.transform = `translate(-50%, -50%) rotate(${randomRotation}deg)`;

        document.body.appendChild(pop);

        // Destroy after animation completes
        setTimeout(() => {
            pop.remove();
        }, 550);
    });


    /* ==========================================================================
       3. TYPEWRITER EFFECT (NEON GLOW CYCLE)
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const words = ["WEB DEVELOPER", "UI/UX DESIGNER", "TECH ENTHUSIAST"];
    const glowClasses = ["neon-glow-red", "neon-glow-gold", "neon-glow-cyan"];
    
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 120;

    function typeWriter() {
        const currentWord = words[wordIdx];
        const currentGlowClass = glowClasses[wordIdx];
        
        // Apply dynamic styling classes for different words
        if (typewriterElement) {
            typewriterElement.className = currentGlowClass;

            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
                typeDelay = 60; // Erasing speed
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIdx + 1);
                charIdx++;
                typeDelay = 120; // Typing speed
            }

            if (!isDeleting && charIdx === currentWord.length) {
                typeDelay = 2000; // Pause after typing
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                typeDelay = 500; // Pause before next word
            }
        }

        setTimeout(typeWriter, typeDelay);
    }

    if (typewriterElement) {
        setTimeout(typeWriter, 1000);
    }


    /* ==========================================================================
       4. INTERACTIVE CANVAS PARTICLE ENGINE (BIO-ELECTRIC SPARKS)
       ========================================================================== */
    const canvas = document.getElementById('gravity-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        const mouse = {
            x: null,
            y: null,
            radius: 130, // deflection radius
            isActive: false
        };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            mouse.isActive = true;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
            mouse.isActive = false;
        });

        // Bio-electric Spark Particle
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                
                // Square or circular particles (comic dots style)
                this.size = Math.random() * 3 + 1;
                this.shapeSquare = Math.random() > 0.5; // Alternating circles and squares
                
                // Stepped motion vectors
                this.baseSpeedY = -(Math.random() * 0.5 + 0.15); 
                this.speedY = this.baseSpeedY;
                this.speedX = (Math.random() * 0.3 - 0.15);
                
                // Miles Morales Color Palette: Gold (Venom), Red (Suit), Cyan (Glitch)
                const colors = [
                    '#ffb700', // Gold
                    '#ff003c', // Red
                    '#ffb700', // Gold
                    'rgba(0, 243, 255, 0.4)' // Cyan Glitch
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                // Opacity pulsing parameter
                this.alpha = Math.random() * 0.6 + 0.4;
                this.pulseSpeed = Math.random() * 0.02 + 0.005;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                
                // Draw drop shadow for glowing effect
                ctx.shadowBlur = 4;
                ctx.shadowColor = this.color;

                ctx.beginPath();
                if (this.shapeSquare) {
                    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                } else {
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                    ctx.fill();
                }
                ctx.restore();
            }

            update() {
                // Decay and pulse transparency
                this.alpha += this.pulseSpeed;
                if (this.alpha > 0.95 || this.alpha < 0.25) {
                    this.pulseSpeed = -this.pulseSpeed;
                }

                // Baseline speeds
                this.speedY = this.baseSpeedY;

                // Gravitational/Deflection mouse reaction
                if (mouse.isActive && mouse.x !== null && mouse.y !== null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        // Push particles away (glitch force)
                        this.x += directionX * force * 3.5;
                        this.y += directionY * force * 3.5;
                    }
                }

                // Normal drift movement
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset when floating off top
                if (this.y < -10) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                    this.speedY = this.baseSpeedY;
                }
                
                // Horizontal edge wrap
                if (this.x < -10) this.x = canvas.width + 10;
                else if (this.x > canvas.width + 10) this.x = -10;
            }
        }

        function initParticles() {
            particlesArray = [];
            // Calculate density
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
            const maxParticles = Math.min(numberOfParticles, 100); // Caps particle density
            
            for (let i = 0; i < maxParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();
    }


    /* ==========================================================================
       5. INTERACTIVE 3D PARALLAX TILT (FOR COMIC CARDS)
       ========================================================================== */
    const comicPanels = [
        { element: document.getElementById('main-glass-card'), intensity: 12 },
        { element: document.getElementById('float-orb'), intensity: 18 },
        { element: document.getElementById('float-stats'), intensity: 22 }
    ];

    comicPanels.forEach(({ element, intensity }) => {
        if (!element) return;

        element.addEventListener('mousemove', (e) => {
            // Pause CSS floating stepped animation
            element.style.animationPlayState = 'paused';

            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalized coordinate system (-0.5 to 0.5)
            const centerX = x / rect.width - 0.5;
            const centerY = y / rect.height - 0.5;
            
            // Calculate tilt angle in degrees
            const tiltX = -centerY * intensity;
            const tiltY = centerX * intensity;

            // Apply 3D rotation
            element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.04, 1.04, 1.04)`;
            element.style.transition = 'transform 0.08s ease';
        });

        element.addEventListener('mouseleave', () => {
            // Smoothly reset
            element.style.transition = 'transform 0.4s ease';
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            
            // Resume CSS floating
            setTimeout(() => {
                element.style.animationPlayState = 'running';
                element.style.transform = '';
                element.style.transition = '';
            }, 400);
        });
    });

});
