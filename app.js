class AnimatedPresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 15; // Updated from 10 to 15 slides
        this.currentBulletIndex = {};
        this.totalBullets = {};
        this.isTransitioning = false;
        
        // DOM elements
        this.slides = document.querySelectorAll('.slide');
        this.currentSlideDisplay = document.getElementById('current-slide');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progressFill = document.getElementById('progress-fill');
        this.bulletCounter = document.getElementById('bullet-counter');
        this.currentBulletDisplay = document.getElementById('current-bullet');
        this.totalBulletsDisplay = document.getElementById('total-bullets');
        this.loadingOverlay = document.getElementById('loading-overlay');
        
        this.init();
    }

    init() {
        // Initialize bullet point tracking for each slide
        this.initializeBulletTracking();
        
        // Set up event listeners
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handlePrevious();
        });
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleNext();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Initialize UI
        this.updateUI();
        this.updateProgress();
        this.updateButtonStates();
        
        // Initialize first slide animations
        this.initializeSlideAnimations(1);
        
        console.log('Enhanced animated presentation initialized with', this.totalSlides, 'slides');
        console.log('Bullet tracking:', this.totalBullets);
    }

    initializeBulletTracking() {
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            const bulletPoints = slide.querySelectorAll('.bullet-point');
            
            this.currentBulletIndex[slideNumber] = 0;
            this.totalBullets[slideNumber] = bulletPoints.length;
            
            // Hide all bullet points initially
            bulletPoints.forEach(bullet => {
                bullet.classList.remove('revealed');
            });
        });
    }

    handleKeyDown(event) {
        if (this.isTransitioning) return;

        // Prevent default behavior for navigation keys to avoid conflicts
        if (['ArrowRight', 'ArrowLeft', ' ', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
        }

        switch(event.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
                this.handleNext();
                break;
            case 'ArrowLeft':
                this.handlePrevious();
                break;
            case 'Home':
                this.goToSlide(1);
                break;
            case 'End':
                this.goToSlide(this.totalSlides);
                break;
            default:
                // Number keys for direct slide navigation (1-9)
                const slideNumber = parseInt(event.key);
                if (slideNumber >= 1 && slideNumber <= 9) {
                    event.preventDefault();
                    this.goToSlide(slideNumber);
                } else if (event.key === '0') {
                    event.preventDefault();
                    this.goToSlide(10);
                }
                // Additional support for slides 11-15 using Ctrl+number
                if (event.ctrlKey && slideNumber >= 1 && slideNumber <= 5) {
                    event.preventDefault();
                    this.goToSlide(slideNumber + 10);
                }
                break;
        }
    }

    handleNext() {
        if (this.isTransitioning) return;

        const currentSlideBullets = this.totalBullets[this.currentSlide];
        const currentBulletIndex = this.currentBulletIndex[this.currentSlide];

        console.log(`Next: Slide ${this.currentSlide}, Bullets: ${currentBulletIndex}/${currentSlideBullets}`);

        // If there are still bullet points to reveal
        if (currentBulletIndex < currentSlideBullets) {
            this.revealNextBulletPoint();
        } else if (this.currentSlide < this.totalSlides) {
            // Move to next slide
            this.goToSlide(this.currentSlide + 1);
        }
    }

    handlePrevious() {
        if (this.isTransitioning) return;

        const currentBulletIndex = this.currentBulletIndex[this.currentSlide];
        
        console.log(`Previous: Slide ${this.currentSlide}, Bullets: ${currentBulletIndex}/${this.totalBullets[this.currentSlide]}`);

        // If there are revealed bullet points on current slide, hide the last one
        if (currentBulletIndex > 0) {
            this.hidePreviousBulletPoint();
        } else if (this.currentSlide > 1) {
            // Move to previous slide and show all its bullet points
            this.goToSlide(this.currentSlide - 1, true);
        }
    }

    revealNextBulletPoint() {
        const slide = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        const bulletPoints = slide.querySelectorAll('.bullet-point');
        const currentIndex = this.currentBulletIndex[this.currentSlide];

        if (currentIndex < bulletPoints.length) {
            const bulletToReveal = bulletPoints[currentIndex];
            
            // Add reveal animation with slight delay for smoother effect
            setTimeout(() => {
                bulletToReveal.classList.add('revealed');
                this.playBulletRevealAnimation(bulletToReveal);
            }, 100);

            this.currentBulletIndex[this.currentSlide]++;
            this.updateUI();
            this.updateButtonStates();

            console.log(`Revealed bullet point ${this.currentBulletIndex[this.currentSlide]} on slide ${this.currentSlide}`);
        }
    }

    hidePreviousBulletPoint() {
        const slide = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        const bulletPoints = slide.querySelectorAll('.bullet-point');
        const currentIndex = this.currentBulletIndex[this.currentSlide];

        if (currentIndex > 0) {
            const bulletToHide = bulletPoints[currentIndex - 1];
            bulletToHide.classList.remove('revealed');

            this.currentBulletIndex[this.currentSlide]--;
            this.updateUI();
            this.updateButtonStates();

            console.log(`Hidden bullet point on slide ${this.currentSlide}, now ${this.currentBulletIndex[this.currentSlide]} revealed`);
        }
    }

    playBulletRevealAnimation(element) {
        // Add a subtle bounce effect
        element.style.transform = 'translateX(0) scale(1.05)';
        setTimeout(() => {
            element.style.transform = 'translateX(0) scale(1)';
        }, 200);

        // Trigger additional animations for special elements
        if (element.classList.contains('stat-card') || 
            element.classList.contains('impact-stat')) {
            this.playCardRevealAnimation(element);
        }
    }

    playCardRevealAnimation(card) {
        // Add number counting animation for stat cards
        const number = card.querySelector('.stat-number, .impact-number');
        if (number) {
            this.animateNumber(number);
        }
    }

    animateNumber(element) {
        const finalValue = element.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
        
        if (!isNaN(numericValue)) {
            let currentValue = 0;
            const increment = numericValue / 30; // 30 steps
            const prefix = finalValue.replace(/[\d.]/g, '').charAt(0) || '';
            const suffix = finalValue.replace(/^[^\d]*[\d.]+/, '') || '';

            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    element.textContent = finalValue;
                    clearInterval(counter);
                } else {
                    const displayValue = Math.floor(currentValue);
                    element.textContent = prefix + displayValue + suffix;
                }
            }, 50);
        }
    }

    async goToSlide(slideNumber, showAllBullets = false) {
        if (slideNumber < 1 || slideNumber > this.totalSlides || this.isTransitioning) {
            console.log(`Invalid slide navigation: ${slideNumber} (current: ${this.currentSlide})`);
            return;
        }

        if (slideNumber === this.currentSlide) {
            console.log(`Already on slide ${slideNumber}`);
            return;
        }

        console.log(`Navigating from slide ${this.currentSlide} to slide ${slideNumber}, showAllBullets: ${showAllBullets}`);

        this.isTransitioning = true;
        
        // Show loading overlay for major transitions
        if (Math.abs(slideNumber - this.currentSlide) > 1) {
            this.showLoadingOverlay();
        }

        // Remove active class from current slide
        const currentSlideElement = document.querySelector('.slide.active');
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
            currentSlideElement.classList.add('exiting');
            
            // Add transition class based on direction
            if (slideNumber > this.currentSlide) {
                currentSlideElement.classList.add('prev');
            }
        }

        // Update current slide number
        this.currentSlide = slideNumber;

        // Prepare new slide
        const newSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (newSlideElement) {
            // Remove any existing transition classes from all slides
            this.slides.forEach(slide => {
                slide.classList.remove('prev', 'entering', 'exiting', 'active');
            });
            
            newSlideElement.classList.add('entering');
            
            // Wait for transition
            await this.delay(300);
            
            newSlideElement.classList.remove('entering');
            newSlideElement.classList.add('active');
        }

        // Reset or set bullet points for new slide
        if (showAllBullets) {
            // Show all bullet points for previous navigation
            this.currentBulletIndex[slideNumber] = this.totalBullets[slideNumber];
            this.revealAllBulletPoints(slideNumber);
        } else {
            // Reset bullet points for forward navigation
            this.currentBulletIndex[slideNumber] = 0;
            this.hideAllBulletPoints(slideNumber);
        }

        // Initialize slide animations
        this.initializeSlideAnimations(slideNumber);

        // Update UI elements
        this.updateUI();
        this.updateProgress();
        this.updateButtonStates();

        // Hide loading overlay
        this.hideLoadingOverlay();

        this.isTransitioning = false;

        // Announce slide change for screen readers
        this.announceSlideChange();

        // Trigger custom event
        this.triggerSlideChangeEvent();

        console.log(`Successfully navigated to slide ${slideNumber}`);
    }

    revealAllBulletPoints(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        const bulletPoints = slide.querySelectorAll('.bullet-point');
        
        console.log(`Revealing all ${bulletPoints.length} bullet points for slide ${slideNumber}`);
        
        bulletPoints.forEach((bullet, index) => {
            setTimeout(() => {
                bullet.classList.add('revealed');
            }, index * 50); // Faster reveal for all bullets
        });
    }

    hideAllBulletPoints(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        const bulletPoints = slide.querySelectorAll('.bullet-point');
        
        console.log(`Hiding all bullet points for slide ${slideNumber}`);
        
        bulletPoints.forEach(bullet => {
            bullet.classList.remove('revealed');
        });
    }

    initializeSlideAnimations(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        const animateElements = slide.querySelectorAll('.animate-element');
        
        // Reset animations
        animateElements.forEach(element => {
            element.classList.remove('animate-in');
        });

        // Trigger animations with delays
        animateElements.forEach((element, index) => {
            const delay = parseInt(element.dataset.delay) || (index * 200);
            setTimeout(() => {
                element.classList.add('animate-in');
                
                // Special handling for chart containers
                if (element.classList.contains('chart-container')) {
                    this.triggerChartAnimation(element);
                }
            }, delay);
        });
    }

    triggerChartAnimation(chartContainer) {
        // Add special chart reveal animation
        const chartImage = chartContainer.querySelector('.chart-image');
        if (chartImage) {
            chartImage.style.opacity = '0';
            chartImage.style.transform = 'scale(0.9) translateY(20px)';
            
            setTimeout(() => {
                chartImage.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                chartImage.style.opacity = '1';
                chartImage.style.transform = 'scale(1) translateY(0)';
            }, 200);
        }
    }

    showLoadingOverlay() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        if (this.loadingOverlay) {
            setTimeout(() => {
                this.loadingOverlay.classList.add('hidden');
            }, 300);
        }
    }

    updateUI() {
        this.currentSlideDisplay.textContent = this.currentSlide;
        
        // Update bullet counter
        const totalBullets = this.totalBullets[this.currentSlide];
        const currentBullets = this.currentBulletIndex[this.currentSlide];

        if (totalBullets > 0) {
            this.bulletCounter.classList.remove('hidden');
            this.currentBulletDisplay.textContent = currentBullets;
            this.totalBulletsDisplay.textContent = totalBullets;
        } else {
            this.bulletCounter.classList.add('hidden');
        }
    }

    updateProgress() {
        // Calculate progress including bullet points
        let totalContent = 0;
        let revealedContent = 0;

        for (let i = 1; i <= this.totalSlides; i++) {
            totalContent += Math.max(1, this.totalBullets[i]); // At least 1 for slide itself
            
            if (i < this.currentSlide) {
                revealedContent += Math.max(1, this.totalBullets[i]);
            } else if (i === this.currentSlide) {
                revealedContent += Math.max(1, this.currentBulletIndex[i]);
            }
        }

        const progressPercentage = (revealedContent / totalContent) * 100;
        this.progressFill.style.width = `${progressPercentage}%`;
    }

    updateButtonStates() {
        const currentBullets = this.currentBulletIndex[this.currentSlide];
        const totalBullets = this.totalBullets[this.currentSlide];
        const isLastSlide = this.currentSlide === this.totalSlides;
        const allBulletsRevealed = currentBullets >= totalBullets;

        // Update Previous button
        const canGoPrevious = this.currentSlide > 1 || currentBullets > 0;
        this.prevBtn.disabled = !canGoPrevious;
        this.prevBtn.setAttribute('aria-disabled', !canGoPrevious);

        if (canGoPrevious) {
            if (currentBullets > 0) {
                this.prevBtn.textContent = `Hide Point ${currentBullets}`;
            } else {
                this.prevBtn.textContent = 'Previous Slide';
            }
        } else {
            this.prevBtn.textContent = 'Previous';
        }

        // Update Next button
        if (isLastSlide && allBulletsRevealed) {
            this.nextBtn.disabled = true;
            this.nextBtn.setAttribute('aria-disabled', 'true');
            this.nextBtn.textContent = 'End';
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.setAttribute('aria-disabled', 'false');
            
            if (currentBullets < totalBullets) {
                this.nextBtn.textContent = `Reveal Point ${currentBullets + 1}`;
            } else {
                this.nextBtn.textContent = 'Next Slide';
            }
        }
    }

    announceSlideChange() {
        let liveRegion = document.getElementById('slide-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'slide-announcer';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        const slideTitle = document.querySelector(`[data-slide="${this.currentSlide}"] h2, [data-slide="${this.currentSlide}"] h1`);
        const title = slideTitle ? slideTitle.textContent : `Slide ${this.currentSlide}`;
        const currentBullets = this.currentBulletIndex[this.currentSlide];
        const totalBullets = this.totalBullets[this.currentSlide];
        
        // Special announcement for chart slides
        const isChartSlide = document.querySelector(`[data-slide="${this.currentSlide}"]`).querySelector('.chart-slide');
        const chartInfo = isChartSlide ? ', data visualization slide' : '';
        
        if (totalBullets > 0) {
            liveRegion.textContent = `${title}${chartInfo}, slide ${this.currentSlide} of ${this.totalSlides}, ${currentBullets} of ${totalBullets} points revealed`;
        } else {
            liveRegion.textContent = `${title}${chartInfo}, slide ${this.currentSlide} of ${this.totalSlides}`;
        }
    }

    triggerSlideChangeEvent() {
        const event = new CustomEvent('slideChanged', {
            detail: {
                currentSlide: this.currentSlide,
                totalSlides: this.totalSlides,
                currentBullet: this.currentBulletIndex[this.currentSlide],
                totalBullets: this.totalBullets[this.currentSlide]
            }
        });
        document.dispatchEvent(event);
    }

    // Utility methods
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    getCurrentBulletInfo() {
        return {
            current: this.currentBulletIndex[this.currentSlide],
            total: this.totalBullets[this.currentSlide]
        };
    }

    // Method to jump to specific slide and bullet point
    goToSlideAndBullet(slideNumber, bulletIndex = 0) {
        this.goToSlide(slideNumber).then(() => {
            const targetBullets = Math.min(bulletIndex, this.totalBullets[slideNumber]);
            for (let i = 0; i < targetBullets; i++) {
                setTimeout(() => {
                    this.revealNextBulletPoint();
                }, i * 100);
            }
        });
    }

    // Reset presentation to beginning
    resetPresentation() {
        this.goToSlide(1);
    }

    // Auto-advance functionality (for demos)
    startAutoAdvance(intervalMs = 5000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide >= this.totalSlides && 
                this.currentBulletIndex[this.currentSlide] >= this.totalBullets[this.currentSlide]) {
                this.resetPresentation();
            } else {
                this.handleNext();
            }
        }, intervalMs);
    }

    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }

    // Method to get slide type information
    getSlideInfo(slideNumber = this.currentSlide) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (!slide) return null;

        const isChartSlide = slide.querySelector('.chart-slide') !== null;
        const isTitleSlide = slide.querySelector('.title-slide') !== null;
        const hasCharts = slide.querySelector('.chart-image') !== null;
        
        return {
            number: slideNumber,
            isChart: isChartSlide,
            isTitle: isTitleSlide,
            hasVisualizations: hasCharts,
            bulletPoints: this.totalBullets[slideNumber]
        };
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced focus management
function setupFocusManagement() {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(e) {
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) return;

        const focusableContent = activeSlide.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    document.addEventListener('keydown', trapFocus);
}

// Performance monitoring
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Enhanced presentation loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
}

// Theme detection and handling
function setupThemeHandling() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleThemeChange(e) {
        console.log('Theme changed to:', e.matches ? 'dark' : 'light');
        // Could trigger re-animation of certain elements if needed
    }

    mediaQuery.addEventListener('change', handleThemeChange);
    handleThemeChange(mediaQuery);
}

// Chart slide specific functionality
function setupChartSlideHandling() {
    document.addEventListener('slideChanged', (event) => {
        const slideInfo = window.presentationApp.getSlideInfo(event.detail.currentSlide);
        
        if (slideInfo && slideInfo.isChart) {
            console.log(`Entered chart slide ${event.detail.currentSlide}:`, slideInfo);
            
            // Add any chart-specific handling here
            const chartSlide = document.querySelector(`[data-slide="${event.detail.currentSlide}"]`);
            const chartImages = chartSlide.querySelectorAll('.chart-image');
            
            chartImages.forEach((img, index) => {
                // Ensure chart images are loaded
                if (!img.complete) {
                    img.addEventListener('load', () => {
                        console.log(`Chart image ${index + 1} loaded for slide ${event.detail.currentSlide}`);
                    });
                }
            });
        }
    });
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for required elements
    const requiredElements = ['current-slide', 'prev-btn', 'next-btn', 'progress-fill'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements);
        return;
    }

    // Initialize the enhanced animated presentation app
    window.presentationApp = new AnimatedPresentationApp();

    // Setup additional features
    setupFocusManagement();
    setupPerformanceMonitoring();
    setupThemeHandling();
    setupChartSlideHandling();

    // Add keyboard shortcuts information
    const shortcuts = [
        'Arrow Keys/Space: Navigate slides and reveal bullet points',
        'Home: First slide',
        'End: Last slide', 
        'Number Keys (1-9, 0): Jump to specific slide (1-10)',
        'Ctrl + Number Keys (1-5): Jump to slides 11-15'
    ];

    console.log('Enhanced keyboard shortcuts:', shortcuts);

    // Handle window resize
    const handleResize = debounce(() => {
        const slideInfo = window.presentationApp.getSlideInfo();
        console.log('Window resized, current slide info:', slideInfo);
        // Could trigger layout recalculations if needed
    }, 250);

    window.addEventListener('resize', handleResize);

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.presentationApp.stopAutoAdvance();
        }
    });

    // Print functionality
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('printing');
        // Reveal all bullet points for printing
        for (let i = 1; i <= window.presentationApp.totalSlides; i++) {
            window.presentationApp.revealAllBulletPoints(i);
        }
    });

    window.addEventListener('afterprint', () => {
        document.body.classList.remove('printing');
        // Reset presentation state after printing
        window.presentationApp.initializeBulletTracking();
        window.presentationApp.updateUI();
    });

    // Add global methods for debugging/external control
    window.presentationControls = {
        goToSlide: (slide, bullet) => window.presentationApp.goToSlideAndBullet(slide, bullet),
        reset: () => window.presentationApp.resetPresentation(),
        autoStart: (interval) => window.presentationApp.startAutoAdvance(interval),
        autoStop: () => window.presentationApp.stopAutoAdvance(),
        getSlideInfo: (slide) => window.presentationApp.getSlideInfo(slide),
        getCurrentInfo: () => ({
            slide: window.presentationApp.getCurrentSlide(),
            total: window.presentationApp.getTotalSlides(),
            bullets: window.presentationApp.getCurrentBulletInfo(),
            slideInfo: window.presentationApp.getSlideInfo()
        })
    };

    console.log('Enhanced presentation controls available:', Object.keys(window.presentationControls));
    console.log('Total slides in enhanced presentation:', window.presentationApp.getTotalSlides());
});