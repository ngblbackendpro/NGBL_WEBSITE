(function () {

    

const { BASE_URL, API } = window.APP_CONFIG;

 


function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                img.classList.add('lazy-loaded');
                lazyLoadObserver.unobserve(img);
            }
        });
    }, observerOptions);

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => lazyLoadObserver.observe(img));
}

/**
 * Smooth Scroll Behavior based on user preferences
 */
function initSmoothScroll() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'smooth';
    } else {
        document.documentElement.style.scrollBehavior = 'auto';
    }
}

/**
 * Home Page Slider (Hero Gallery)
 */
function initHomeSlider() {
    const homeSlider = document.querySelector('.about-slider');
    const homeSlides = homeSlider ? Array.from(homeSlider.querySelectorAll('.swiper-slide')) : [];
    const homePagination = homeSlider ? homeSlider.querySelector('.swiper-pagination') : null;

    if (!homeSlider || !homeSlides.length) return;

    const HOME_INTERVAL = 6000;
    let homeIndex = 0;
    let homeTimer;

    function setHomeSlide(index) {
        homeSlides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === index);
            slide.setAttribute('aria-hidden', idx !== index ? 'true' : 'false');
        });

        if (homePagination) {
            Array.from(homePagination.children).forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
                dot.setAttribute('aria-current', idx === index ? 'true' : 'false');
            });
        }
    }

    function startHomeTimer() {
        clearInterval(homeTimer);
        if (homeSlides.length > 1) {
            homeTimer = setInterval(() => {
                homeIndex = (homeIndex + 1) % homeSlides.length;
                setHomeSlide(homeIndex);
            }, HOME_INTERVAL);
        }
    }

    if (homePagination) {
        homePagination.innerHTML = '';
        homeSlides.forEach((_, idx) => {
            const bullet = document.createElement('button');
            bullet.className = 'bullet';
            bullet.setAttribute('aria-label', `Slide ${idx + 1}`);
            bullet.setAttribute('aria-current', idx === 0 ? 'true' : 'false');
            bullet.addEventListener('click', () => {
                homeIndex = idx;
                setHomeSlide(homeIndex);
                startHomeTimer();
            });
            homePagination.appendChild(bullet);
        });
    }

    homeSlider.addEventListener('mouseenter', () => clearInterval(homeTimer));
    homeSlider.addEventListener('mouseleave', () => startHomeTimer());

    setHomeSlide(0);
    startHomeTimer();
}

/**
 * Generic Slider Initializer (Brands, Reviews, etc.)
 */
function initSlider(sliderEl, options = {}) {
    const windowEl = sliderEl.querySelector('.slider-window');
    const track = sliderEl.querySelector('.slider-track');
    let slides = Array.from(sliderEl.querySelectorAll('.slide'));
    const dotsWrap = sliderEl.querySelector('.slider-dots');
    const prevBtn = sliderEl.querySelector('.slider-btn.prev');
    const nextBtn = sliderEl.querySelector('.slider-btn.next');
    const { interval = 6000, autoplay = true } = options;

    let perView = 3;
    let index = 0;
    let timer;
    let isTransitioning = false;

    const originalSlides = [...slides];
    originalSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });
    slides = Array.from(track.querySelectorAll('.slide'));

    const computePerView = () => {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 1024) return 2;
        return 3;
    };

    const pageCount = () => Math.max(1, Math.ceil(originalSlides.length / perView));

    const buildDots = () => {
        if (!dotsWrap) return;
        dotsWrap.innerHTML = '';
        for (let i = 0; i < pageCount(); i++) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => {
                index = i;
                update(true);
                restart();
            });
            dotsWrap.appendChild(dot);
        }
    };

    const update = (animate = true) => {
        if (!windowEl || !track) return;
        const viewportWidth = windowEl.clientWidth;
        perView = computePerView();
        const slideWidth = viewportWidth / perView;

        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });

        const step = slideWidth * perView;

        if (!animate) {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${index * step}px)`;

        if (!animate) {
            setTimeout(() => {
                track.style.transition = 'transform 0.45s ease';
            }, 50);
        }

        if (dotsWrap) {
            const dotIndex = index % pageCount();
            Array.from(dotsWrap.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === dotIndex);
                dot.setAttribute('aria-current', i === dotIndex ? 'true' : 'false');
            });
        }
    };

    const next = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        index++;
        update(true);

        setTimeout(() => {
            if (index >= pageCount()) {
                index = 0;
                update(false);
            }
            isTransitioning = false;
        }, 450);
    };

    const prev = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (index <= 0) {
            index = pageCount();
            update(false);
            setTimeout(() => {
                index--;
                update(true);
                setTimeout(() => {
                    isTransitioning = false;
                }, 450);
            }, 50);
        } else {
            index--;
            update(true);
            setTimeout(() => {
                isTransitioning = false;
            }, 450);
        }
    };

    const restart = () => {
        if (!autoplay) return;
        clearInterval(timer);
        timer = setInterval(next, interval);
    };

    buildDots();
    update(false);

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prev();
        restart();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        next();
        restart();
    });

    sliderEl.addEventListener('mouseenter', () => clearInterval(timer));
    sliderEl.addEventListener('mouseleave', restart);
    window.addEventListener('resize', () => {
        buildDots();
        update(false);
    });

    restart();
}

/**
 * Initialize All Generic Sliders
 */
function initSliders() {
    const brandSlider = document.querySelector('[data-slider="brands"]');
    if (brandSlider) initSlider(brandSlider, { interval: 6000 });
}

/**
 * Mobile Menu - Close on link click
 */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }
}

/**
 * Keyboard Navigation - Accessibility
 */
function initKeyboardNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navToggle.checked) {
                navToggle.checked = false;
            }
        });
    }
}

/**
 * Stats Counter Animation - Optimized
 */

function animateCounter(element) {

    const targetAttr = element.getAttribute('data-target');
    if (!targetAttr) return;

    const target = parseInt(targetAttr);
    if (isNaN(target)) return;

    const duration = 2000; // all counters finish in 2 seconds
    const startTime = performance.now();

    function update(currentTime) {

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0 → 1

        const value = Math.floor(progress * target);

        if (progress < 1) {
            element.textContent = value;
            requestAnimationFrame(update);
        } else {
            if (element.dataset.showPlus === "true") {
                element.textContent = target + "+";
            } else {
                element.textContent = target;
            }

            element.setAttribute('aria-live', 'polite');
        }
    }

    requestAnimationFrame(update);
}

function startStatsAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        counters.forEach(counter => animateCounter(counter));
    }
}

function initStatsAnimation() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                startStatsAnimation();
                observer.disconnect();
            }
        });
    }, { threshold: 0.2, rootMargin: '50px' });

    observer.observe(statsSection);
}

/**
 * Resource Optimization
 */
function initResourceOptimization() {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = 'css/style.css';
    document.head.appendChild(link);
}

/**
 * Performance Monitoring
 */
function initPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        });
    }
}

/**
 * Contact Form Validation
 */
/**
 * Contact Form - Send To Backend
 */
function initContactFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        if (!data.name || !data.email || !data.message) {
            alert('Please fill all required fields');
            return;
        }

        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch(BASE_URL + API.CONTACT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                submitBtn.innerHTML = '<span>Message Sent!</span>';
                submitBtn.style.background = '#10b981';
                this.reset();
            } else {
                alert(result.message || "Error sending message");
                submitBtn.innerHTML = originalText;
            }

        } catch (error) {
            console.error("Contact Form Error:", error);
            alert("Server error");
            submitBtn.innerHTML = originalText;
        }

        submitBtn.disabled = false;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    });
}


/**
 * Load Brands From Backend
 */
async function loadBrandsFromAPI() {
    const sliderTrack = document.querySelector('.slider-track');
    if (!sliderTrack) return;

    try {
        const response = await fetch(BASE_URL + API.BRANDS);
        const brands = await response.json();
        // console.log("Brands:", brands);

        if (!brands.length) {
            sliderTrack.innerHTML = '<p style="text-align:center;">No brands available</p>';
            return;
        }

        // Clear existing static slides
        sliderTrack.innerHTML = '';

        brands.forEach(brand => {
            const slide = document.createElement('div');
            slide.className = 'slide';

            slide.innerHTML = `
                <div class="brand-card brand-layer">
                    <img src="${BASE_URL}/${brand.image.replace(/\\/g, '/')}" 
                         alt="${brand.name}" 
                         loading="lazy" 
                         width="200" 
                         height="100">
                </div>
            `;

            sliderTrack.appendChild(slide);
        });

        // Initialize the slider after adding dynamic slides
        const brandSlider = document.querySelector('[data-slider="brands"]');
        if (brandSlider) {
            initSlider(brandSlider, { interval: 6000 });
        }

    } catch (error) {
        console.error('Error loading brands:', error);
    }
}



/**
 * Load Reviews From Backend
 */
async function loadReviewsFromAPI() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;

    try {
        const response = await fetch(BASE_URL + API.REVIEWS);
        const reviews = await response.json();   // ✅ FIXED
        // console.log(reviews);
        // console.log("for testing review should show before this")
        track.innerHTML = '';

        if (!reviews.length) {
            track.innerHTML = '<p style="text-align:center;">No reviews available</p>';
            return;
        }

        reviews.forEach(review => {
            const slide = document.createElement('div');
            slide.className = 'slide';

            slide.innerHTML = `
                <article class="review-card">
                    <div class="review-top">
                        ${review.image 
                            ? `<img src="${BASE_URL}/${review.image.replace(/\\/g, '/')}" 
                                   alt="${review.name}" 
                                   style="width:60px;height:60px;border-radius:50%;object-fit:cover;margin-right:15px;">`
                            : `<div class="avatar">${review.name.charAt(0)}</div>`
                        }
                        <div>
                            <h3 class="review-name">${review.name}</h3>
                            <p class="review-location">${review.title || ''}</p>
                        </div>
                        <i class="fas fa-quote-right quote-mark"></i>
                    </div>
                    <p class="review-text">"${review.description}"</p>
                </article>
            `;

            track.appendChild(slide);
        });

        const reviewSlider = document.querySelector('[data-slider="reviews"]');
        if (reviewSlider) {
            initSlider(reviewSlider, { interval: 6000 });
        }

    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}


async function loadHomeDataFromAPI() {
    try {
        const response = await fetch(BASE_URL + API.HOME);
        const data = await response.json();

        // console.log("Home Data:", data);

        /* =============================
           Update Stats Section
        ============================= */

        // Experience Years
        if (data.expYears !== undefined) {
            const expCounter = document.querySelector('.stat-card-orange .counter');
            if (expCounter) {
                expCounter.textContent = data.expYears;
                expCounter.setAttribute("data-target", data.expYears);
            }
        }
        

                // Total Projects
                // Total Projects
        // if (data.totalProjects !== undefined) {
        //     const projectCounter = document.querySelector('.stat-card-cyan .counter');

        //     if (projectCounter) {

        //         const realCount = data.totalProjects;
        //         const displayCount = realCount > 100 ? "100+" : realCount;

        //         projectCounter.textContent = displayCount;

        //         // IMPORTANT: Only animate if <= 100
        //         if (realCount <= 100) {
        //             projectCounter.setAttribute("data-target", realCount);
        //         } else {
        //             projectCounter.removeAttribute("data-target");
        //         }
        //     }
        // }


        if (data.totalProjects !== undefined) {
            const projectCounter = document.querySelector('.stat-card-cyan .counter');

            if (projectCounter) {

                const realCount = data.totalProjects;

                // Always animate up to 100 if >100
                const animationTarget = realCount > 100 ? 100 : realCount;

                projectCounter.setAttribute("data-target", animationTarget);

                // If more than 100 → show "+" after animation
                if (realCount > 100) {
                    projectCounter.dataset.showPlus = "true";
                } else {
                    delete projectCounter.dataset.showPlus;
                }
            }
        }

        // Offices Count
        if (data.offices && data.offices.length) {

    // Update counter
    const officeCounter = document.querySelector('.stat-card-purple .counter');
    if (officeCounter) {
        officeCounter.textContent = data.offices.length;
        officeCounter.setAttribute("data-target", data.offices.length);
    }

    // Update locations text
    const officeText = document.getElementById('officeLocations');
    if (officeText) {
        const locations = data.offices.map(office => office.location);
        officeText.textContent = locations.join(', ');
    }
}


        /* =============================
           Update Footer Branches
        ============================= */

        const branchList = document.getElementById('footerBranches');
        if (branchList && data.offices) {
            branchList.innerHTML = '';

            data.offices.forEach(office => {
                branchList.innerHTML += `
                    <li>
                        <i class="fas fa-map-pin"></i>
                        <a href="#">${office.location}</a>
                    </li>
                `;
            });



            /* =============================
                Update Footer Contact Info
                ============================= */

                if (data.companyInfo) {

                    const phoneEl = document.getElementById("footerPhone");
                    const emailEl = document.getElementById("footerEmail");
                    const addressEl = document.getElementById("footerAddress");

                    if (phoneEl && data.companyInfo.phone) {
                        phoneEl.textContent = data.companyInfo.phone;
                        phoneEl.href = `tel:${data.companyInfo.phone}`;
                    }

                    if (emailEl && data.companyInfo.email) {
                        emailEl.textContent = data.companyInfo.email;
                        emailEl.href = `mailto:${data.companyInfo.email}`;
                    }

                    if (addressEl && data.companyInfo.address) {
                        addressEl.textContent = data.companyInfo.address;
                    }
                }
            /* =============================
            Update Social Media Icons
            ============================= */

            if (data.socialLinks) {

                const facebook = document.getElementById('facebookIcon');
                const twitter = document.getElementById('twitterIcon');
                const instagram = document.getElementById('instagramIcon');
                const linkedin = document.getElementById('linkedinIcon');
                const youtube = document.getElementById('youtubeIcon');

                if (facebook) facebook.href = data.socialLinks.facebook || "#";
                if (twitter) twitter.href = data.socialLinks.twitter || "#";
                if (instagram) instagram.href = data.socialLinks.instagram || "#";
                if (linkedin) linkedin.href = data.socialLinks.linkedin || "#";
                if (youtube) youtube.href = data.socialLinks.youtube || "#";
            }
        }

    } catch (error) {
        console.error("Error loading home data:", error);
    }
}


async function loadProjectsFromAPI() {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;

    try {
        const response = await fetch(BASE_URL + API.PROJECTS);
        const projects = await response.json();

        // console.log("Projects:", projects);

        if (!projects.length) {
            workGrid.innerHTML = '<p>No projects available</p>';
            return;
        }

        workGrid.innerHTML = '';

        projects.forEach(project => {
            const item = document.createElement('figure');
            item.className = 'work-item';
            item.innerHTML = `
                <img src="${BASE_URL}/${project.image.replace(/\\/g, '/')}" 
                     alt="${project.title}" 
                     loading="lazy" 
                     width="400" 
                     height="400">
                <figcaption class="work-overlay">
                    <p class="project-category">${project.category}</p>
                </figcaption>
            `;
            workGrid.appendChild(item);
        });

    } catch (error) {
        console.error("Error loading projects:", error);
    }
}


async function loadFooterPages() {
    const links = [
        { id: "footerPrivacyPolicy", api: API.PRIVACY },
        { id: "footerFAQ", api: API.FAQ },
        { id: "footerTerms", api: API.TERMS }
    ];

    for (const item of links) {
        try {
            const el = document.getElementById(item.id);
            if (!el) continue;

            const response = await fetch(BASE_URL + item.api);
            if (!response.ok) throw new Error("Failed to fetch page");

            const data = await response.json();

            // Set the href dynamically
            if (data.slug) {
                el.href = `${window.location.origin}/page.html?type=${data.slug}`; // or `/pages/${data.slug}`
            } else if (data.content) {
                // optional: directly link to content page
                el.href = data.content;
            }
        } catch (error) {
            console.error(`Error loading ${item.id}:`, error);
        }
    }
}

/**
 * Initialize All Common Functionality
 */
function initCommonScripts() {
    initLazyLoading();
    initSmoothScroll();
    initResourceOptimization();
    initPerformanceMonitoring();
    initStatsAnimation();
}

/**
 * DOM Ready Event Listeners
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCommonScripts();
        initMobileMenu();
        initKeyboardNavigation();
        initHomeSlider();
        // initSliders();
        initContactFormValidation();
        loadReviewsFromAPI();
        loadBrandsFromAPI();
        loadHomeDataFromAPI();
        loadWorksFromAPI();
        loadFooterPages();



    });
} else {
    initCommonScripts();
    initMobileMenu();
    initKeyboardNavigation();
    initHomeSlider();
    initSliders();
    initContactFormValidation();
    loadReviewsFromAPI();
    loadBrandsFromAPI();
    loadHomeDataFromAPI();
    loadWorksFromAPI();
    loadFooterPages();


}

// Window Load Event
window.addEventListener('load', function() {
    setTimeout(() => {
        initStatsAnimation();
    }, 300);
});


async function loadWorksFromAPI() {
    const workGrid = document.querySelector('.work-grid');
    if (!workGrid) return;

    try {
        const response = await fetch(BASE_URL + API.WORKS);
        const works = await response.json();

        // console.log("Works:", works);

        if (!works.length) {
            workGrid.innerHTML = '<p>No work available</p>';
            return;
        }

        workGrid.innerHTML = '';

        works.forEach(work => {
            const item = document.createElement('figure');
            item.className = 'work-item';

            item.innerHTML = `
                <img src="${BASE_URL}/${work.image.replace(/\\/g, '/')}" 
                     alt="${work.title}" 
                     loading="lazy"
                     width="400"
                     height="400">

                <figcaption class="work-overlay">
                    <h3>${work.title}</h3>
                    <p>${work.category}</p>
                    ${work.link ? `<a href="${work.link}" target="_blank">View Project</a>` : ''}
                </figcaption>
            `;

            workGrid.appendChild(item);
        });

    } catch (error) {
        console.error("Error loading works:", error);
    }
}

})();



