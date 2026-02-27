document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("page-enter", "motion-enhanced");

    loadComponent("header-container", "components/header.html");
    loadComponent("footer-container", "components/footer.html");

    initPreloader();
    initScrollAnimations();
    initNavbarScrollState();
    initAnchorSmoothScroll();
    sanitizeHomeHashOnLoad();

    initScrollProgress();
    initTextMaskReveal();
    initMagneticButtons();
    initCardTilt();
    initParallaxDepth();
    initCursorGlow();
    ensureHeroMotionLayers();

    setTimeout(setActiveLink, 150);
    setTimeout(refreshMotionEnhancements, 260);
});

window.addEventListener("load", function () {
    sanitizeHomeHashOnLoad();
    document.body.classList.remove("page-enter");
    document.body.classList.add("page-ready");
    hidePreloader();
    refreshMotionEnhancements();
});

window.addEventListener("pageshow", function () {
    sanitizeHomeHashOnLoad();
    refreshMotionEnhancements();
});

function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            if (id === "footer-container" && typeof loadHomeDataFromAPI === "function") {
                loadHomeDataFromAPI();
            }

            refreshMotionEnhancements();
            if (id === "header-container") {
                setActiveLink();
            }
        })
        .catch(error => console.error(error));
}

function refreshMotionEnhancements() {
    ensureHeroMotionLayers();
    initMagneticButtons();
    initCardTilt();
    initParallaxDepth();
    initScrollProgress();
}

function isMotionReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsFinePointer() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function isDesktopMotionAllowed() {
    return window.innerWidth > 991 && supportsFinePointer() && !isMotionReduced();
}

function isPublicPage() {
    return !window.location.pathname.toLowerCase().includes("/admin/");
}

function setActiveLink() {
    const links = document.querySelectorAll(".nav-menu a");
    const current = window.location.pathname.split("/").pop() || "index.html";

    links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        const normalized = href.split("#")[0];
        if (normalized === current || (current === "" && normalized === "index.html")) {
            link.classList.add("active");
        }
    });
}

function isHomePage() {
    const path = window.location.pathname.toLowerCase();
    return path.endsWith("/") || path.endsWith("/index.html") || path === "";
}

function sanitizeHomeHashOnLoad() {
    if (!isHomePage()) {
        return;
    }

    if (window.location.hash) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function initAnchorSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (!anchorLinks.length) {
        return;
    }

    anchorLinks.forEach((link) => {
        if (link.dataset.anchorBound === "1") {
            return;
        }

        link.dataset.anchorBound = "1";
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            if (!href || href.length <= 1) {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function initPreloader() {
    if (document.getElementById("page-preloader")) {
        return;
    }

    const preloader = document.createElement("div");
    preloader.id = "page-preloader";
    preloader.innerHTML = `
        <div class="preloader-orbit" aria-hidden="true"></div>
        <div class="preloader-streaks" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="preloader-inner">
            <img class="preloader-logo" src="img/NGBL_Logo-removebg-preview.png" alt="NGBL" />
            <div class="preloader-spinner" aria-hidden="true"></div>
        </div>
    `;

    document.body.classList.add("preloader-active");
    document.body.appendChild(preloader);
}

function hidePreloader() {
    const preloader = document.getElementById("page-preloader");
    if (!preloader || document.body.classList.contains("preloader-hidden")) {
        return;
    }

    setTimeout(() => {
        document.body.classList.add("preloader-hidden");
        document.body.classList.remove("preloader-active");

        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 300);
    }, 1000);
}

function initScrollAnimations() {
    const candidates = document.querySelectorAll(
        "section, .section-header, .service-card, .service-card-modern, .work-item, .stat-card, .review-card, .brand-card, .value-card, .team-card, .blog-card, .project-card"
    );

    candidates.forEach((el, index) => {
        if (!el.hasAttribute("data-animate")) {
            el.setAttribute("data-animate", "");
        }

        const parent = el.parentElement;
        if (parent) {
            const siblingSet = parent.querySelectorAll(
                ".service-card, .service-card-modern, .work-item, .stat-card, .review-card, .brand-card, .value-card, .team-card, .blog-card, .project-card"
            );

            if (siblingSet.length > 1) {
                const siblingIndex = Array.from(siblingSet).indexOf(el);
                if (siblingIndex >= 0) {
                    el.style.transitionDelay = `${Math.min(siblingIndex, 6) * 70}ms`;
                }
            } else {
                el.style.transitionDelay = `${Math.min(index, 4) * 40}ms`;
            }
        }
    });

    if (!("IntersectionObserver" in window)) {
        candidates.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    candidates.forEach((el) => observer.observe(el));
}

function initNavbarScrollState() {
    if (window.__headerStateBound) {
        return;
    }

    const updateHeaderState = () => {
        const header = document.querySelector(".header");
        if (!header) {
            return;
        }

        if (window.scrollY > 16) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };

    window.addEventListener("scroll", updateHeaderState, { passive: true });
    setTimeout(updateHeaderState, 200);
    window.__headerStateBound = true;
}

function initScrollProgress() {
    if (document.getElementById("scroll-progress")) {
        return;
    }

    const progress = document.createElement("div");
    progress.id = "scroll-progress";
    document.body.appendChild(progress);

    const updateProgress = () => {
        const scrollTop = window.scrollY || window.pageYOffset;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    };

    let rafId = 0;
    const requestUpdate = () => {
        if (rafId) {
            return;
        }

        rafId = window.requestAnimationFrame(() => {
            updateProgress();
            rafId = 0;
        });
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
}

function initTextMaskReveal() {
    if (isMotionReduced()) {
        return;
    }

    const targets = document.querySelectorAll(
        ".about-hero-title, .about-hero-subtitle, .about-hero-description, .section-title, .section-subtitle"
    );

    if (!targets.length) {
        return;
    }

    document.body.classList.add("text-reveal-enabled");

    targets.forEach((el) => {
        if (el.dataset.textRevealReady === "1") {
            return;
        }

        const rawText = (el.textContent || "").trim();
        if (!rawText || rawText.split(/\s+/).length < 2) {
            return;
        }

        el.dataset.textRevealReady = "1";
        el.classList.add("text-mask-reveal");
        el.setAttribute("data-text-reveal", "");
        el.setAttribute("aria-label", rawText);

        const words = rawText.split(/\s+/);
        el.innerHTML = "";

        words.forEach((word, index) => {
            const span = document.createElement("span");
            span.className = "reveal-word";
            span.setAttribute("aria-hidden", "true");
            span.style.setProperty("--word-delay", `${index * 55}ms`);
            span.textContent = word;
            el.appendChild(span);

            if (index < words.length - 1) {
                el.appendChild(document.createTextNode(" "));
            }
        });
    });

    const revealTargets = document.querySelectorAll("[data-text-reveal]");

    if (!("IntersectionObserver" in window)) {
        revealTargets.forEach((el) => el.classList.add("is-revealed"));
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.28,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    revealTargets.forEach((el) => {
        if (el.closest(".about-hero")) {
            setTimeout(() => el.classList.add("is-revealed"), 220);
            return;
        }

        revealObserver.observe(el);
    });
}

function initMagneticButtons() {
    if (!isPublicPage() || !supportsFinePointer() || isMotionReduced()) {
        return;
    }

    const ctas = document.querySelectorAll(
        ".btn, .btn-primary, .btn-secondary, .view-more-btn, .service-btn, .load-more-btn"
    );

    ctas.forEach((button) => {
        if (button.dataset.magneticBound === "1") {
            return;
        }

        button.dataset.magneticBound = "1";
        button.classList.add("magnetic-enabled");

        const onMove = (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - (rect.left + rect.width / 2);
            const y = event.clientY - (rect.top + rect.height / 2);
            const dx = Math.max(-6, Math.min(6, x * 0.14));
            const dy = Math.max(-4, Math.min(4, y * 0.14));
            button.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0)`;
        };

        const onLeave = () => {
            button.style.transform = "";
        };

        button.addEventListener("pointermove", onMove);
        button.addEventListener("pointerleave", onLeave);
        button.addEventListener("pointercancel", onLeave);
    });
}

function initCardTilt() {
    if (!isPublicPage() || !supportsFinePointer() || isMotionReduced()) {
        return;
    }

    const cards = document.querySelectorAll(
        ".service-card, .service-card-modern, .work-item, .review-card, .brand-card, .value-card, .team-card, .blog-card, .project-card"
    );

    cards.forEach((card) => {
        if (card.dataset.tiltBound === "1") {
            return;
        }

        card.dataset.tiltBound = "1";
        card.classList.add("tilt-active");

        const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * 8;
            const rotateX = (0.5 - py) * 6;

            card.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
            card.style.boxShadow = "0 14px 34px rgba(0, 0, 0, 0.28)";
        };

        const onLeave = () => {
            card.style.transform = "";
            card.style.boxShadow = "";
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        card.addEventListener("pointercancel", onLeave);
    });
}

function initParallaxDepth() {
    if (!isPublicPage() || !document.body) {
        return;
    }

    const parallaxTargets = [
        [".about-hero .hero-particles", 0.08],
        [".about-hero .hero-geometry", 0.12],
        [".about-hero .hero-floaters", 0.16],
        [".about-slider", 0.05],
        [".about-hero-content, .home .hero-content", 0.03],
        [".service-card img, .service-card-modern img, .work-item img, .blog-card img, .project-card img", 0.04]
    ];

    const layers = [];
    parallaxTargets.forEach(([selector, speed]) => {
        document.querySelectorAll(selector).forEach((el) => {
            if (el.dataset.parallaxBound !== "1") {
                el.dataset.parallaxBound = "1";
                el.dataset.parallaxSpeed = String(speed);
                el.classList.add("parallax-layer");
            }
            layers.push(el);
        });
    });

    if (!layers.length) {
        return;
    }

    window.__parallaxLayers = layers;

    if (!isDesktopMotionAllowed()) {
        layers.forEach((layer) => layer.style.setProperty("--parallax-y", "0px"));
        return;
    }

    if (window.__parallaxBound) {
        if (typeof window.__parallaxOnFrame === "function") {
            window.__parallaxOnFrame();
        }
        return;
    }

    const updateParallax = () => {
        const viewportCenter = window.scrollY + window.innerHeight / 2;

        (window.__parallaxLayers || []).forEach((layer) => {
            const rect = layer.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            const layerCenter = absoluteTop + rect.height / 2;
            const distance = viewportCenter - layerCenter;
            const speed = parseFloat(layer.dataset.parallaxSpeed || "0.04");
            const offset = Math.max(-18, Math.min(18, distance * speed * -0.06));
            layer.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
        });
    };

    let rafId = 0;
    const onFrame = () => {
        if (rafId) {
            return;
        }

        rafId = window.requestAnimationFrame(() => {
            updateParallax();
            rafId = 0;
        });
    };

    window.addEventListener("scroll", onFrame, { passive: true });
    window.addEventListener("resize", onFrame);
    window.__parallaxOnFrame = onFrame;
    onFrame();
    window.__parallaxBound = true;
}

function initCursorGlow() {
    if (!isPublicPage() || !isDesktopMotionAllowed()) {
        return;
    }

    if (document.getElementById("cursor-glow")) {
        return;
    }

    const glow = document.createElement("div");
    glow.id = "cursor-glow";
    document.body.appendChild(glow);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const animateGlow = () => {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate3d(-50%, -50%, 0)`;
        window.requestAnimationFrame(animateGlow);
    };

    window.addEventListener("pointermove", (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        document.body.classList.add("cursor-glow-active");
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
        document.body.classList.remove("cursor-glow-active");
    });

    animateGlow();
}

function ensureHeroMotionLayers() {
    const hero = document.querySelector(".about-hero");
    if (!hero) {
        return;
    }

    if (!hero.querySelector(".hero-particles")) {
        const particles = document.createElement("div");
        particles.className = "hero-particles";
        hero.appendChild(particles);
    }

    if (!hero.querySelector(".hero-geometry")) {
        const geometry = document.createElement("div");
        geometry.className = "hero-geometry";
        hero.appendChild(geometry);
    }

    if (!hero.querySelector(".hero-floaters")) {
        const floaterLayer = document.createElement("div");
        floaterLayer.className = "hero-floaters";

        const floaters = [
            { top: "16%", left: "18%", size: "18px", duration: "20s", delay: "0s" },
            { top: "24%", left: "74%", size: "24px", duration: "24s", delay: "-5s" },
            { top: "64%", left: "12%", size: "20px", duration: "26s", delay: "-9s" },
            { top: "72%", left: "78%", size: "16px", duration: "21s", delay: "-3s" },
            { top: "44%", left: "52%", size: "14px", duration: "28s", delay: "-11s" }
        ];

        floaters.forEach((item) => {
            const shape = document.createElement("span");
            shape.style.top = item.top;
            shape.style.left = item.left;
            shape.style.setProperty("--float-size", item.size);
            shape.style.setProperty("--float-duration", item.duration);
            shape.style.setProperty("--float-delay", item.delay);
            floaterLayer.appendChild(shape);
        });

        hero.appendChild(floaterLayer);
    }
}
