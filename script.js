/**
 * Jerslin Silviya's Cinematic Birthday Wishes Website - v3
 * Audio Synth, Evasive Games, Bible Games, Daily Bread & Secure Gemini API
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - General
    const splashScreen = document.getElementById('splash-screen');
    const enterBtn = document.getElementById('enter-btn');
    const appContainer = document.getElementById('app-container');
    const audioToggle = document.getElementById('audio-toggle');
    const audioToggleIcon = audioToggle.querySelector('i');
    const audioToggleText = audioToggle.querySelector('span');
    
    // Tab Navigation Elements removed for scrolling layout

    // Left Panel - Carousel Elements
    const carouselItems = document.querySelectorAll('.carousel-item');
    const carouselDots = document.querySelectorAll('.carousel-dots .dot');
    const prevVerseBtn = document.getElementById('prev-verse');
    const nextVerseBtn = document.getElementById('next-verse');
    let currentVerseIndex = 0;
    let carouselInterval = null;

    // Left Panel - Daily Bread Elements
    const breadBasket = document.getElementById('bread-basket');
    const breadCardDisplay = document.getElementById('bread-card-display');
    const drawnVerseText = document.getElementById('drawn-verse-text');
    const drawnVerseRef = document.getElementById('drawn-verse-ref');
    const drawnVerseBlessing = document.getElementById('drawn-verse-blessing');
    const breadDrawAgain = document.getElementById('bread-draw-again');
    let drawingBread = false;

    // Left Panel - AI Prayer Chamber Elements
    const aiMoodInput = document.getElementById('ai-mood-input');
    const generateAiBtn = document.getElementById('generate-ai-btn');
    const aiResponseBox = document.getElementById('ai-response-box');
    const aiResponseContent = document.getElementById('ai-response-content');

    // Right Panel - Cake & Candle Elements
    const candleFlame = document.getElementById('candle-flame');
    const cakeWrapper = document.getElementById('cake-wrapper');
    const cakeInstruction = document.getElementById('cake-instruction');
    const sparklesContainer = document.getElementById('sparkles-container');
    const personalLetter = document.getElementById('personal-letter');
    let candleBlown = false;

    // Evasive Button Elements & Parent Reference
    const evasiveBtn = document.getElementById('evasive-btn');
    const evasiveParent = evasiveBtn ? evasiveBtn.closest('.glass-card') : null;

    // Modals
    const acceptBtn = document.getElementById('accept-btn');
    const acceptModal = document.getElementById('accept-modal');
    const closeAcceptModal = document.getElementById('close-accept-modal');
    const forbiddenModal = document.getElementById('forbidden-modal');
    const closeForbiddenModal = document.getElementById('close-forbidden-modal');

    // Canvas Background
    const starfieldCanvas = document.getElementById('starfield');
    const starfieldCtx = starfieldCanvas.getContext('2d');
    
    // Canvas Confetti
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');


    // ==========================================
    // 1. SCROLL REVEAL ENTRY ANIMATIONS & EFFECTS
    // ==========================================
    const revealSections = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                
                // Play light chime on section reveal for a magical atmosphere
                if (typeof playChime === 'function') {
                    playChime(scale[Math.floor(Math.random() * scale.length)], 0, 0.6, 0.02);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    revealSections.forEach(section => {
        revealObserver.observe(section);
    });


    // ==========================================
    // 2. STARFIELD CANVAS ANIMATION
    // ==========================================
    let stars = [];
    const numStars = 55;

    function resizeStarfield() {
        starfieldCanvas.width = window.innerWidth;
        starfieldCanvas.height = window.innerHeight;
    }

    class Star {
        constructor() {
            this.reset();
            this.y = Math.random() * starfieldCanvas.height;
        }

        reset() {
            this.x = Math.random() * starfieldCanvas.width;
            this.y = -10;
            this.size = Math.random() * 1.8 + 0.4;
            this.speed = Math.random() * 0.35 + 0.1;
            this.alpha = Math.random() * 0.8 + 0.2;
            this.pulseSpeed = Math.random() * 0.015 + 0.005;
            this.pulseDir = 1;
            const colors = ['#ffd700', '#00f5d4', '#4d3bc9', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speed;
            this.alpha += this.pulseSpeed * this.pulseDir;
            if (this.alpha > 0.9) this.pulseDir = -1;
            else if (this.alpha < 0.2) this.pulseDir = 1;

            if (this.y > starfieldCanvas.height) {
                this.reset();
            }
        }

        draw() {
            starfieldCtx.save();
            starfieldCtx.globalAlpha = this.alpha;
            starfieldCtx.fillStyle = this.color;
            starfieldCtx.beginPath();
            starfieldCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            starfieldCtx.shadowBlur = this.size * 3;
            starfieldCtx.shadowColor = this.color;
            starfieldCtx.fill();
            starfieldCtx.restore();
        }
    }

    function initStarfield() {
        resizeStarfield();
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }

    function animateStarfield() {
        starfieldCtx.fillStyle = '#020b18';
        starfieldCtx.fillRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animateStarfield);
    }

    window.addEventListener('resize', resizeStarfield);
    initStarfield();
    animateStarfield();


    // ==========================================
    // 3. AMBIENT WEB AUDIO SYNTHESIZER
    // ==========================================
    let audioCtx = null;
    let isMuted = false;
    let chimeTimeout = null;

    const scale = [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00]; // F major pentatonic
    const chords = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [130.81, 196.00, 261.63, 329.63], // Cmaj
        [146.83, 220.00, 293.66, 349.23], // Dmin7
        [116.54, 233.08, 293.66, 349.23]  // Bbmaj7
    ];
    let currentChordIndex = 0;

    function initAudio() {
        if (audioCtx) return;
        
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        playDroneLoop();
        playChimeLoop();
    }

    function playChime(frequency, delay, duration, gainAmount = 0.08) {
        if (isMuted || !audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, audioCtx.currentTime + delay);
        filter.Q.setValueAtTime(1, audioCtx.currentTime + delay);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(gainAmount, audioCtx.currentTime + delay + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
    }

    function playChimeLoop() {
        if (isMuted) return;

        const notesCount = Math.floor(Math.random() * 3) + 2; 
        let timeOffset = 0;

        for (let i = 0; i < notesCount; i++) {
            const noteIndex = Math.floor(Math.random() * scale.length);
            const freq = scale[noteIndex];
            timeOffset += Math.random() * 0.4 + 0.2;
            const duration = Math.random() * 2.5 + 2.0;
            playChime(freq, timeOffset, duration, 0.04);
        }

        const nextClusterDelay = Math.random() * 5000 + 6000;
        chimeTimeout = setTimeout(playChimeLoop, nextClusterDelay);
    }

    function playDroneLoop() {
        if (isMuted || !audioCtx) {
            setTimeout(playDroneLoop, 3000);
            return;
        }

        const chord = chords[currentChordIndex];
        currentChordIndex = (currentChordIndex + 1) % chords.length;
        const chordDuration = 8.0;

        chord.forEach(freq => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(350, audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.012, audioCtx.currentTime + 3.0);
            gainNode.gain.setValueAtTime(0.012, audioCtx.currentTime + chordDuration - 3.0);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + chordDuration);

            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.start(osc.context.currentTime);
            osc.stop(osc.context.currentTime + chordDuration);
        });

        setTimeout(playDroneLoop, (chordDuration - 0.2) * 1000);
    }

    function playCelebrationSound() {
        if (isMuted || !audioCtx) return;
        const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        arpeggio.forEach((freq, index) => {
            playChime(freq, index * 0.1, 1.8, 0.08);
        });
    }

    function playWhooshSound() {
        if (isMuted || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
    }

    // Toggle Audio
    audioToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            audioToggleIcon.className = 'fa-solid fa-volume-xmark';
            audioToggleText.innerText = 'Sound Off';
            if (chimeTimeout) clearTimeout(chimeTimeout);
        } else {
            audioToggleIcon.className = 'fa-solid fa-volume-high';
            audioToggleText.innerText = 'Sound On';
            initAudio();
            playChimeLoop();
        }
    });


    // ==========================================
    // 4. SPLASH SCREEN TRANSITION
    // ==========================================
    enterBtn.addEventListener('click', () => {
        initAudio();
        
        playChime(523.25, 0.1, 2.5, 0.15); // C5
        playChime(659.25, 0.3, 2.5, 0.15); // E5
        playChime(783.99, 0.5, 3.0, 0.15); // G5
        playChime(1046.50, 0.8, 3.5, 0.2); // C6

        splashScreen.classList.add('fade-out');
        
        setTimeout(() => {
            splashScreen.style.display = 'none';
            appContainer.classList.remove('hidden');
            resizeStarfield();
            resizeConfetti();
        }, 1200);

        startCarouselAutoPlay();
    });


    // ==========================================
    // 5. BIBLE VERSE CAROUSEL
    // ==========================================
    function showVerse(index) {
        carouselItems[currentVerseIndex].classList.remove('active');
        carouselDots[currentVerseIndex].classList.remove('active');
        currentVerseIndex = (index + carouselItems.length) % carouselItems.length;
        carouselItems[currentVerseIndex].classList.add('active');
        carouselDots[currentVerseIndex].classList.add('active');
        playChime(scale[currentVerseIndex % scale.length] * 1.3, 0, 1.2, 0.02);
    }

    function startCarouselAutoPlay() {
        if (carouselInterval) clearInterval(carouselInterval);
        carouselInterval = setInterval(() => {
            showVerse(currentVerseIndex + 1);
        }, 9500);
    }

    prevVerseBtn.addEventListener('click', () => {
        showVerse(currentVerseIndex - 1);
        startCarouselAutoPlay();
    });

    nextVerseBtn.addEventListener('click', () => {
        showVerse(currentVerseIndex + 1);
        startCarouselAutoPlay();
    });

    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showVerse(index);
            startCarouselAutoPlay();
        });
    });


    // ==========================================
    // 6. CONFETTI & SMOKE CANVASES
    // ==========================================
    let confettiList = [];
    let smokeParticles = [];
    let confettiTimer = null;

    function resizeConfetti() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    class Confetti {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 5;
            this.color = `hsl(${Math.random() * 360}, 80%, 65%)`;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 11 + 5;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity - 4;
            this.gravity = 0.22;
            this.friction = 0.97;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 6 - 3;
            this.opacity = 1.0;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            
            if (this.y > confettiCanvas.height - 100) {
                this.opacity -= 0.02;
            }
        }

        draw() {
            confettiCtx.save();
            confettiCtx.translate(this.x, this.y);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.globalAlpha = Math.max(0, this.opacity);
            confettiCtx.fillStyle = this.color;
            if (Math.random() > 0.5) {
                confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            } else {
                confettiCtx.beginPath();
                confettiCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                confettiCtx.fill();
            }
            confettiCtx.restore();
        }
    }

    function spawnConfettiExplosion(x, y) {
        resizeConfetti();
        for (let i = 0; i < 120; i++) {
            confettiList.push(new Confetti(x, y));
        }
        if (!confettiTimer) animateConfetti();
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        confettiList.forEach((c, index) => {
            c.update();
            c.draw();
            if (c.opacity <= 0 || c.x < -50 || c.x > confettiCanvas.width + 50) {
                confettiList.splice(index, 1);
            }
        });

        smokeParticles.forEach((p, index) => {
            p.y += p.vy;
            p.x += p.vx;
            p.opacity -= 0.015;
            confettiCtx.save();
            confettiCtx.globalAlpha = Math.max(0, p.opacity);
            confettiCtx.fillStyle = 'rgba(210, 210, 220, 0.4)';
            confettiCtx.beginPath();
            confettiCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            confettiCtx.fill();
            confettiCtx.restore();
            if (p.opacity <= 0) smokeParticles.splice(index, 1);
        });

        if (confettiList.length > 0 || smokeParticles.length > 0) {
            confettiTimer = requestAnimationFrame(animateConfetti);
        } else {
            confettiTimer = null;
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    function blowCandle(event) {
        if (candleBlown) return;
        candleBlown = true;
        candleFlame.classList.add('blown');
        playWhooshSound();

        const rect = cakeWrapper.getBoundingClientRect();
        const candleX = rect.left + rect.width / 2;
        const candleY = rect.top + rect.height * 0.25;

        for (let i = 0; i < 18; i++) {
            smokeParticles.push({
                x: candleX,
                y: candleY,
                vx: Math.random() * 1.6 - 0.8,
                vy: Math.random() * -1.2 - 0.4,
                size: Math.random() * 5 + 3,
                opacity: 0.8
            });
        }

        setTimeout(() => {
            playCelebrationSound();
            spawnConfettiExplosion(candleX, candleY);
        }, 120);

        cakeInstruction.innerHTML = "✨ Your wish has flown to heaven! ✨";
        cakeInstruction.style.color = "var(--accent-gold)";

        setTimeout(() => {
            personalLetter.classList.remove('hidden');
            personalLetter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 800);
    }

    candleFlame.addEventListener('click', blowCandle);
    cakeWrapper.addEventListener('click', blowCandle);


    // ==========================================
    // 7. EVASIVE FUN BUTTON LOGIC
    // ==========================================
    function moveEvasiveButton(e) {
        let clientX, clientY;
        if (e.type.startsWith('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const buttonRect = evasiveBtn.getBoundingClientRect();
        const panelRect = evasiveParent ? evasiveParent.getBoundingClientRect() : buttonRect;
        const padding = 20;
        
        if (evasiveBtn.style.position !== 'absolute') {
            const relativeLeft = buttonRect.left - panelRect.left;
            const relativeTop = buttonRect.top - panelRect.top;
            evasiveBtn.style.width = buttonRect.width + 'px';
            evasiveBtn.style.height = buttonRect.height + 'px';
            evasiveBtn.style.left = relativeLeft + 'px';
            evasiveBtn.style.top = relativeTop + 'px';
            evasiveBtn.style.position = 'absolute';
            evasiveBtn.style.margin = '0';
            evasiveBtn.style.zIndex = '50';
        }

        const mouseXInPanel = clientX - panelRect.left;
        const mouseYInPanel = clientY - panelRect.top;
        const maxX = panelRect.width - buttonRect.width - padding;
        const maxY = panelRect.height - buttonRect.height - padding;

        let newX = Math.random() * maxX;
        let newY = Math.random() * maxY;

        let safetyCounter = 0;
        while (safetyCounter < 15) {
            const distance = Math.hypot(newX + buttonRect.width/2 - mouseXInPanel, newY + buttonRect.height/2 - mouseYInPanel);
            if (distance > 130) break;
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;
            safetyCounter++;
        }

        if (newX < padding) newX = padding;
        if (newY < padding) newY = padding;
        if (newX > maxX) newX = maxX;
        if (newY > maxY) newY = maxY;

        evasiveBtn.style.left = `${newX}px`;
        evasiveBtn.style.top = `${newY}px`;

        playChime(1100, 0, 0.2, 0.03);
    }

    evasiveBtn.addEventListener('mouseover', moveEvasiveButton);
    evasiveBtn.addEventListener('mouseenter', moveEvasiveButton);
    evasiveBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveEvasiveButton(e);
    });

    evasiveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        forbiddenModal.classList.remove('hidden');
        playChime(380, 0, 0.5, 0.08);
        playChime(290, 0.12, 0.5, 0.08);
    });


    // ==========================================
    // 8. DAILY BREAD PROMISE MECHANICS 🍞
    // ==========================================
    const breadPromises = [
        {
            verse: "Jeremiah 17:7 — 'Blessed is the man who trusts in the Lord, whose trust is the Lord.'",
            blessing: "May your confidence be rooted deep in God's promises, bringing you stability and glorious spiritual growth this year."
        },
        {
            verse: "Isaiah 43:2 — 'When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you.'",
            blessing: "No storm will overpower you, Jerslin. God's hand is holding yours, keeping you safe above the waves in every trial."
        },
        {
            verse: "Psalm 37:4 — 'Delight yourself in the Lord, and he will give you the desires of your heart.'",
            blessing: "Seek His presence first, Jerslin, and watch Him align and fulfill your deepest dreams beautifully as you turn 19."
        },
        {
            verse: "Zephaniah 3:17 — 'The Lord your God is in your midst, a mighty one who will save; he will rejoice over you with gladness; he will quiet you by his love; he will exult over you with loud singing.'",
            blessing: "You are the absolute delight of God's heart. May His quiet love wash away all worries and fill you with peace today."
        },
        {
            verse: "Philippians 4:19 — 'And my God will supply every need of yours according to his riches in glory in Christ Jesus.'",
            blessing: "May you walk with zero lack this year, trusting that the provider of the universe is looking after your beautiful path."
        },
        {
            verse: "Romans 8:31 — 'If God is for us, who can be against us?'",
            blessing: "You stand in victory, Jerslin! With the King of Kings backing your dreams, nothing in this world can hold you back."
        }
    ];

    breadBasket.addEventListener('click', () => {
        if (drawingBread) return;
        drawingBread = true;

        // Play shaking chimes
        playChime(440, 0, 0.3, 0.08);
        playChime(523, 0.1, 0.3, 0.08);
        playChime(659, 0.2, 0.4, 0.08);

        // Add shake animation
        breadBasket.style.animation = "shake 0.5s ease";

        setTimeout(() => {
            // Select random promise
            const roll = Math.floor(Math.random() * breadPromises.length);
            const promise = breadPromises[roll];

            // Load data
            drawnVerseText.innerText = `"${promise.verse.split(' — ')[1]}"`;
            drawnVerseRef.innerText = `— ${promise.verse.split(' — ')[0]}`;
            drawnVerseBlessing.innerText = promise.blessing;

            // Hide basket, show card
            breadBasket.classList.add('hidden');
            breadCardDisplay.classList.remove('hidden');

            // Sound celebration & confetti
            playCelebrationSound();
            const rect = breadBasket.getBoundingClientRect();
            spawnConfettiExplosion(rect.left + rect.width/2, rect.top + rect.height/2);

            drawingBread = false;
        }, 500);
    });

    breadDrawAgain.addEventListener('click', () => {
        breadBasket.style.animation = "";
        breadCardDisplay.classList.add('hidden');
        breadBasket.classList.remove('hidden');
        playChime(440, 0, 0.4, 0.05);
    });


    // ==========================================
    // 9. GEMINI AI INTEGRATION (Via Secure Backend)
    // ==========================================
    const fallbackPrayers = {
        peace: {
            verse: "John 14:27 — 'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.'",
            prayer: "Dear Lord, on Jerslin Silviya's 19th birthday, we pray that your divine peace that surpasses all understanding guards her heart and mind. Let her rest in the comfort of your love, secure in your sovereign plans. Lead her away from anxiety and guide her path with gentle assurances today and always.",
            story: "Consider Moses who stood peacefully before the roaring Red Sea, trusting entirely in the Lord's provision. God parted the waters, showing that stillness in faith leads to absolute deliverance."
        },
        joy: {
            verse: "Nehemiah 8:10 — 'Do not grieve, for the joy of the Lord is your strength.'",
            prayer: "Gracious Father, we ask that you fill Jerslin's life with bubbling, radiant joy on her birthday. May her heart laugh, and may she find reasons to praise you in every circumstance. Let her strength be renewed daily by the happiness that comes from knowing she is yours.",
            story: "Consider King David, who danced with pure joy before the Ark of the Covenant, celebrating God's grace with abandon, proving that joy in the Lord builds unbreakable spirit."
        },
        courage: {
            verse: "Joshua 1:9 — 'Have I not commanded you? Be strong and courageous. Do not be frightened, and do not be dismayed, for the Lord your God is with you wherever you go.'",
            prayer: "Mighty God, grant Jerslin Silviya the courage of a warrior as she enters her 19th year. Help her to face any challenge, question, or change with absolute confidence in your presence. Remove all fear from her tomorrow, and let her shine your light boldly.",
            story: "Consider Esther, who courageously went before the king, placing her life in peril to save her people, showing that God prepares us for 'such a time as this.'"
        },
        patience: {
            verse: "Galatians 6:9 — 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up.'",
            prayer: "Patient Shepherd, help Jerslin to trust in your perfect timing. As she grows and pursues her dreams, grant her the grace of patience to wait on your promises. Keep her heart stable, and let her find peace in the quiet moments of preparation.",
            story: "Consider Joseph, who patiently endured years of trials, betrayal, and imprisonment, before God raised him to leadership, showing that patience blooms into glorious destiny."
        },
        strength: {
            verse: "Isaiah 40:31 — 'But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.'",
            prayer: "Heavenly Father, pour out your physical, emotional, and spiritual strength upon Jerslin today. When she feels weak, be her fortress and rock. Let her soar high above circumstances, energized by your Holy Spirit for the beautiful year ahead.",
            story: "Consider Samson, who in his weakest hour cried out to God, and was granted the spiritual strength to defeat his foes, demonstrating that our weaknesses showcase His great power."
        }
    };

    async function generateAIPrayer(mood) {
        const cleanMood = mood.toLowerCase().trim();

        // Show loading state
        aiResponseBox.classList.remove('hidden');
        aiResponseContent.innerHTML = `
            <div class="ai-loading-container">
                <i class="fa-solid fa-spinner fa-spin text-gold" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                <p>Connecting to the heavens, writing your blessing... ✨</p>
            </div>
        `;
        playChime(587.33, 0, 0.8, 0.05); // D5

        try {
            // Fetch securely from the backend API endpoint
            const url = `/api/blessing?mood=${encodeURIComponent(mood)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("API call failed");
            }

            const data = await response.json();
            const textResponse = data.text;
            
            // Format markdown-like newlines to HTML paragraphs
            const paragraphs = textResponse.split('\n\n').filter(p => p.trim());
            let htmlContent = "";
            paragraphs.forEach((p, idx) => {
                if (idx === 0) {
                    htmlContent += `<p style="font-style: italic; border-left: 2px solid var(--accent-rose); padding-left: 10px; margin-bottom: 15px; color:#ffffff;">${p}</p>`;
                } else if (idx === 1) {
                    htmlContent += `<p style="margin-bottom: 15px; font-weight: 300;">${p}</p>`;
                } else {
                    htmlContent += `<p style="font-size: 0.82rem; color: var(--accent-gold);">${p}</p>`;
                }
            });

            animateResponseText(htmlContent);

        } catch (error) {
            console.warn("Backend API error, loading local fallback: ", error);
            
            // Look for matching local fallback, otherwise default to "peace"
            let fallbackKey = "peace";
            for (let key in fallbackPrayers) {
                if (cleanMood.includes(key)) {
                    fallbackKey = key;
                    break;
                }
            }
            
            const fallback = fallbackPrayers[fallbackKey];
            const htmlContent = `
                <p style="font-style: italic; border-left: 2px solid var(--accent-rose); padding-left: 10px; margin-bottom: 15px; color:#ffffff;">"${fallback.verse}"</p>
                <p style="margin-bottom: 15px; font-weight: 300;">${fallback.prayer}</p>
                <p style="font-size: 0.82rem; color: var(--accent-gold);">${fallback.story}</p>
            `;
            
            setTimeout(() => {
                animateResponseText(htmlContent);
            }, 800);
        }
    }

    function animateResponseText(htmlText) {
        aiResponseContent.innerHTML = htmlText;
        playCelebrationSound();
        const rect = generateAiBtn.getBoundingClientRect();
        spawnConfettiExplosion(rect.left + rect.width/2, rect.top);
    }

    generateAiBtn.addEventListener('click', () => {
        const val = aiMoodInput.value.trim();
        if (val) {
            generateAIPrayer(val);
        }
    });

    aiMoodInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = aiMoodInput.value.trim();
            if (val) generateAIPrayer(val);
        }
    });


    // ==========================================
    // 10. BIBLE TRIVIA QUIZ GAME
    // ==========================================
    const quizQuestions = [
        {
            q: "Who defeated the giant Goliath with a single stone and a slingshot?",
            choices: ["Noah", "David", "Daniel", "Samson"],
            correct: 1,
            exp: "Correct! David trusted in the name of the Lord to defeat the giant, and he later became King of Israel."
        },
        {
            q: "What did God send to keep Jonah safe after he was thrown into the stormy sea?",
            choices: ["A wooden raft", "A giant fish/whale", "A flock of seagulls", "A group of dolphins"],
            correct: 1,
            exp: "Correct! Jonah spent 3 days inside the fish before obeying God's command to go to Nineveh."
        },
        {
            q: "Which Bible hero parted the Red Sea with his staff to help his people escape?",
            choices: ["Abraham", "Moses", "Joshua", "Elijah"],
            correct: 1,
            exp: "Correct! Moses raised his staff, and God sent a strong east wind to divide the waters."
        },
        {
            q: "Who was thrown into a fiery furnace but was protected by God and walked out unharmed?",
            choices: ["Shadrach, Meshach, & Abednego", "Peter & Paul", "David & Jonathan", "Abraham & Isaac"],
            correct: 0,
            exp: "Correct! The three friends refused to bow to idols, and God stood with them in the flames."
        },
        {
            q: "Which brave queen risked her life by going before the king to save her people from destruction?",
            choices: ["Ruth", "Esther", "Mary", "Deborah"],
            correct: 1,
            exp: "Correct! Queen Esther declared, 'If I perish, I perish,' showing incredible faith in God."
        }
    ];

    let currentQuestionIndex = 0;
    let quizScore = 0;

    const quizProgressText = document.getElementById('quiz-progress-val');
    const quizProgressBar = document.getElementById('quiz-progress-bar');
    const quizScoreText = document.getElementById('quiz-score-val');
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizChoicesGrid = document.getElementById('quiz-choices-grid');
    const quizFeedbackRow = document.getElementById('quiz-feedback-row');
    const quizFeedbackText = document.getElementById('quiz-feedback-text');
    const quizNextBtn = document.getElementById('quiz-next-btn');
    const quizRetryBtn = document.getElementById('quiz-retry-btn');
    
    const quizGameBox = document.getElementById('quiz-game-box');
    const quizResultPanel = document.getElementById('quiz-result-panel');
    const quizRankTitle = document.getElementById('quiz-rank-title');
    const quizResultText = document.getElementById('quiz-result-text');

    function loadQuizQuestion() {
        quizFeedbackRow.classList.add('hidden');
        
        const qData = quizQuestions[currentQuestionIndex];
        quizQuestionText.innerText = qData.q;
        quizProgressText.innerText = `Question: ${currentQuestionIndex + 1}/${quizQuestions.length}`;
        quizProgressBar.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
        quizScoreText.innerText = `Score: ${quizScore}/${quizQuestions.length}`;

        quizChoicesGrid.innerHTML = "";
        qData.choices.forEach((choice, idx) => {
            const btn = document.createElement('button');
            btn.className = "quiz-choice-btn";
            btn.innerText = choice;
            btn.addEventListener('click', () => handleQuizAnswer(idx));
            quizChoicesGrid.appendChild(btn);
        });
    }

    function handleQuizAnswer(choiceIndex) {
        const qData = quizQuestions[currentQuestionIndex];
        const buttons = quizChoicesGrid.querySelectorAll('.quiz-choice-btn');
        
        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === qData.correct) {
                btn.classList.add('correct');
            }
        });

        if (choiceIndex === qData.correct) {
            quizScore++;
            quizScoreText.innerText = `Score: ${quizScore}/${quizQuestions.length}`;
            quizFeedbackText.innerText = qData.exp;
            playChime(659.25, 0, 0.4, 0.08); // E5
            playChime(783.99, 0.1, 0.6, 0.08); // G5
        } else {
            buttons[choiceIndex].classList.add('incorrect');
            quizFeedbackText.innerText = `Incorrect. ${qData.exp}`;
            playChime(220, 0, 0.5, 0.1); // A3 fail sound
        }

        quizFeedbackRow.classList.remove('hidden');
    }

    quizNextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            loadQuizQuestion();
        } else {
            showQuizResults();
        }
    });

    function showQuizResults() {
        quizGameBox.classList.add('hidden');
        quizResultPanel.classList.remove('hidden');
        
        let rank = "";
        let feedback = "";
        if (quizScore === 5) {
            rank = "👑 Scripture Sage 👑";
            feedback = `Perfect score! Congratulations, Jerslin Silviya! You are a true Scripture Sage. May God's word continue to light up your daily paths!`;
            playCelebrationSound();
            const rect = quizResultPanel.getBoundingClientRect();
            spawnConfettiExplosion(rect.left + rect.width/2, rect.top + 80);
        } else if (quizScore >= 3) {
            rank = "🕊️ Faith Explorer 🕊️";
            feedback = `Wonderful job! You scored ${quizScore} out of 5. You have a great understanding of these legendary Bible victories!`;
            playChime(783.99, 0, 1.2, 0.08);
        } else {
            rank = "📖 Bible Searcher 📖";
            feedback = `Good attempt! You scored ${quizScore} out of 5. The Bible is full of exciting mysteries to discover, try again!`;
        }

        quizRankTitle.innerText = rank;
        quizResultText.innerText = feedback;
    }

    quizRetryBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        quizScore = 0;
        quizResultPanel.classList.add('hidden');
        quizGameBox.classList.remove('hidden');
        loadQuizQuestion();
    });

    loadQuizQuestion();


    // ==========================================
    // 11. EMOJI STORY GUESSING GAME
    // ==========================================
    const emojiLevels = [
        {
            emojis: "🚢 🐳 🌧️",
            clue: "A prophet tried to run from God's mission, got caught in a storm, and stayed in a giant beast.",
            choices: ["Jonah & the Whale", "Noah's Ark", "Moses Crossing", "Elijah & Raven"],
            correct: 0,
            summary: "Jonah learned that we can't hide from God's presence. When he repented, God commanded the fish to vomit him safely onto dry land."
        },
        {
            emojis: "🌈 🚢 🦁",
            clue: "A righteous builder made a floating home for family and animal pairs to survive a global deluge.",
            choices: ["Moses Ark", "Noah's Ark", "Solomon's temple", "Jericho Wall"],
            correct: 1,
            summary: "Noah built in obedience before rain ever fell. God saved them and placed a rainbow in the clouds as His eternal covenant promise."
        },
        {
            emojis: "🧱 🎺 🔊",
            clue: "Massive stone fortress walls collapsed after the army marched, shouted, and blew rams' horns.",
            choices: ["Tower of Babel", "Temple of Solomon", "Wall of Jericho", "Gates of Rome"],
            correct: 2,
            summary: "The Fall of Jericho showed that simple obedience to God's plans can shatter the most impossible barriers in your path."
        },
        {
            emojis: "🦁 🍖 🔥",
            clue: "A faithful official refused to stop praying, got thrown into a beast den, but woke up completely untouched.",
            choices: ["Daniel & Lions Den", "Samson & Lion", "David & Goliath", "Paul's Shipwreck"],
            correct: 0,
            summary: "Daniel kept praying despite threat of death. God sent His angel to shut the lions' mouths, converting the king to worship the true God."
        }
    ];

    let currentEmojiLevel = 0;
    const emojiProgressText = document.getElementById('emoji-progress-val');
    const emojiDisplay = document.getElementById('emoji-display-box');
    const emojiClue = document.getElementById('emoji-riddle-clue');
    const emojiChoicesGrid = document.getElementById('emoji-choices-grid');
    const emojiFeedbackRow = document.getElementById('emoji-feedback-row');
    const emojiStorySummary = document.getElementById('emoji-story-summary');
    const emojiNextBtn = document.getElementById('emoji-next-btn');
    const emojiRetryBtn = document.getElementById('emoji-retry-btn');
    const emojiGameBox = document.getElementById('emoji-game-box');
    const emojiResultPanel = document.getElementById('emoji-result-panel');

    function loadEmojiLevel() {
        emojiFeedbackRow.classList.add('hidden');
        
        const lvlData = emojiLevels[currentEmojiLevel];
        emojiDisplay.innerText = lvlData.emojis;
        emojiClue.innerText = lvlData.clue;
        emojiProgressText.innerText = `Level: ${currentEmojiLevel + 1}/${emojiLevels.length}`;

        emojiChoicesGrid.innerHTML = "";
        lvlData.choices.forEach((choice, idx) => {
            const btn = document.createElement('button');
            btn.className = "quiz-choice-btn";
            btn.innerText = choice;
            btn.addEventListener('click', () => handleEmojiGuess(idx));
            emojiChoicesGrid.appendChild(btn);
        });
    }

    function handleEmojiGuess(choiceIndex) {
        const lvlData = emojiLevels[currentEmojiLevel];
        const buttons = emojiChoicesGrid.querySelectorAll('.quiz-choice-btn');

        buttons.forEach((btn, idx) => {
            btn.disabled = true;
            if (idx === lvlData.correct) {
                btn.classList.add('correct');
            }
        });

        if (choiceIndex === lvlData.correct) {
            emojiStorySummary.innerText = lvlData.summary;
            playChime(659.25, 0, 0.4, 0.08); // E5
            playChime(880.00, 0.1, 0.6, 0.08); // A5 success
        } else {
            buttons[choiceIndex].classList.add('incorrect');
            emojiStorySummary.innerText = `Wrong guess. But look! ${lvlData.summary}`;
            playChime(220, 0, 0.5, 0.1);
        }

        emojiFeedbackRow.classList.remove('hidden');
    }

    emojiNextBtn.addEventListener('click', () => {
        currentEmojiLevel++;
        if (currentEmojiLevel < emojiLevels.length) {
            loadEmojiLevel();
        } else {
            showEmojiResults();
        }
    });

    function showEmojiResults() {
        emojiGameBox.classList.add('hidden');
        emojiResultPanel.classList.remove('hidden');
        playCelebrationSound();
        const rect = emojiResultPanel.getBoundingClientRect();
        spawnConfettiExplosion(rect.left + rect.width/2, rect.top + 80);
    }

    emojiRetryBtn.addEventListener('click', () => {
        currentEmojiLevel = 0;
        emojiResultPanel.classList.add('hidden');
        emojiGameBox.classList.remove('hidden');
        loadEmojiLevel();
    });

    loadEmojiLevel();


    // ==========================================
    // 12. GENERAL MODALS CLOSING
    // ==========================================
    
    // Accept Modal
    acceptBtn.addEventListener('click', () => {
        acceptModal.classList.remove('hidden');
        const rect = acceptBtn.getBoundingClientRect();
        spawnConfettiExplosion(rect.left + rect.width/2, rect.top + rect.height/2);
        
        playChime(523.25, 0, 1.5, 0.15); // C5
        playChime(659.25, 0.2, 1.5, 0.15); // E5
        playChime(783.99, 0.4, 2.0, 0.15); // G5
        playChime(987.77, 0.6, 2.5, 0.2); // B5 (Maj7 chord finish)
    });

    closeAcceptModal.addEventListener('click', () => {
        acceptModal.classList.add('hidden');
    });

    // Forbidden Modal
    closeForbiddenModal.addEventListener('click', () => {
        forbiddenModal.classList.add('hidden');
        evasiveBtn.style.position = 'relative';
        evasiveBtn.style.left = '0';
        evasiveBtn.style.top = '0';
        evasiveBtn.style.width = 'auto';
        evasiveBtn.style.height = 'auto';
        evasiveBtn.style.margin = 'initial';
    });

    // Close on overlay clicks
    window.addEventListener('click', (e) => {
        if (e.target === acceptModal) {
            acceptModal.classList.add('hidden');
        }
        if (e.target === forbiddenModal) {
            forbiddenModal.classList.add('hidden');
            evasiveBtn.style.position = 'relative';
            evasiveBtn.style.left = '0';
            evasiveBtn.style.top = '0';
            evasiveBtn.style.width = 'auto';
            evasiveBtn.style.height = 'auto';
            evasiveBtn.style.margin = 'initial';
        }
    });
});
