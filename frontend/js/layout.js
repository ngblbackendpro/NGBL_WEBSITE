document.addEventListener("DOMContentLoaded", function () {
    resetPageTransitionState();
    document.body.classList.add("motion-enhanced");

    loadComponent("header-container", "components/header.html");
    loadComponent("footer-container", "components/footer.html");
    ensureWhatsAppButton();

    initScrollAnimations();
    initNavbarScrollState();
    initAnchorSmoothScroll();
    initPageTransitions();
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
    scheduleInitialHashScroll();
});

window.addEventListener("load", function () {
    sanitizeHomeHashOnLoad();
    resetPageTransitionState();
    removeLegacyPreloader();
    ensureWhatsAppButton();
    scheduleInitialHashScroll();
    refreshMotionEnhancements();
});

window.addEventListener("pageshow", function () {
    sanitizeHomeHashOnLoad();
    resetPageTransitionState();
    removeLegacyPreloader();
    ensureWhatsAppButton();
    scheduleInitialHashScroll();
    refreshMotionEnhancements();
});

window.addEventListener("hashchange", function () {
    if (!isHomePage()) {
        return;
    }

    ensureHashTargetVisible("smooth");
});

function resetPageTransitionState() {
    document.body.classList.remove("page-enter", "page-leaving");
    document.body.classList.add("page-ready");
}

function loadComponent(id, file) {
    const target = document.getElementById(id);
    if (!target) {
        return;
    }

    const COMPONENT_CACHE_VERSION = "v5";
    const COMPONENT_FILE_VERSION = "20260420";
    if (window.sessionStorage) {
        const storedVersion = sessionStorage.getItem("component-cache-version");
        if (storedVersion !== COMPONENT_CACHE_VERSION) {
            Object.keys(sessionStorage).forEach((key) => {
                if (key.startsWith("component-cache:")) {
                    sessionStorage.removeItem(key);
                }
            });
            sessionStorage.setItem("component-cache-version", COMPONENT_CACHE_VERSION);
        }
    }

    const cacheKey = `component-cache:${COMPONENT_CACHE_VERSION}:${COMPONENT_FILE_VERSION}:${file}`;
    const componentUrl = `${file}?v=${COMPONENT_FILE_VERSION}`;
    const cachedMarkup = window.sessionStorage ? sessionStorage.getItem(cacheKey) : null;

    if (window.sessionStorage && !window.__legacyComponentCacheCleared) {
        sessionStorage.removeItem(`component-cache:components/header.html`);
        sessionStorage.removeItem(`component-cache:components/footer.html`);
        window.__legacyComponentCacheCleared = true;
    }

    const applyComponent = (markup) => {
        target.innerHTML = markup;

        normalizeContactLinks(target);

        if (id === "footer-container" && typeof loadHomeDataFromAPI === "function") {
            loadHomeDataFromAPI();
        }

        refreshMotionEnhancements();
        if (id === "header-container") {
            initNavDropdowns();
            setActiveLink();
        }
    };

    if (cachedMarkup) {
        applyComponent(cachedMarkup);
        return;
    }

    fetch(componentUrl)
        .then(response => response.text())
        .then(data => {
            applyComponent(data);
            if (window.sessionStorage) {
                sessionStorage.setItem(cacheKey, data);
            }
        })
        .catch(error => console.error(error));
}

function normalizeContactLinks(scope) {
    if (!scope || !scope.querySelectorAll) {
        return;
    }

    scope.querySelectorAll('a[href="index.html#reviews"], a[href="#reviews"]').forEach((link) => {
        const title = (link.getAttribute("title") || "").toLowerCase();
        const text = (link.textContent || "").toLowerCase();
        if (title.includes("contact") || text.includes("contact")) {
            link.setAttribute("href", "index.html?scroll=contact");
        }
    });
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
    const current = normalizeNavPath(window.location.pathname.split("/").pop() || "index.html");

    links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        const normalized = normalizeNavPath(href.split("#")[0]);
        if (normalized === current || (current === "" && normalized === "index.html")) {
            link.classList.add("active");
        }
    });

    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        const dropdownLinks = dropdown.querySelectorAll(".nav-dropdown-menu a");
        const dropdownToggle = dropdown.querySelector(".nav-dropdown-toggle");
        const hasActiveChild = Array.from(dropdownLinks).some((link) => link.classList.contains("active"));

        if (hasActiveChild && dropdownToggle) {
            dropdownToggle.classList.add("active");
        }
    });
}

function closeAllNavDropdowns(exceptDropdown) {
    document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
        if (exceptDropdown && dropdown === exceptDropdown) {
            return;
        }

        dropdown.classList.remove("open");
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

function initNavDropdowns() {
    const dropdowns = document.querySelectorAll(".nav-dropdown");
    if (!dropdowns.length) {
        return;
    }

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        const menu = dropdown.querySelector(".nav-dropdown-menu");
        if (!toggle || !menu || toggle.dataset.dropdownBound === "1") {
            return;
        }

        toggle.dataset.dropdownBound = "1";
        toggle.setAttribute("role", "button");
        toggle.setAttribute("aria-expanded", "false");

        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            const isOpen = dropdown.classList.contains("open");

            closeAllNavDropdowns(isOpen ? null : dropdown);

            if (!isOpen) {
                dropdown.classList.add("open");
                toggle.setAttribute("aria-expanded", "true");
            }
        });
    });

    document.querySelectorAll(".nav-dropdown-menu a").forEach((link) => {
        if (link.dataset.dropdownLinkBound === "1") {
            return;
        }

        link.dataset.dropdownLinkBound = "1";
        link.addEventListener("click", () => {
            closeAllNavDropdowns();
            const navToggle = document.getElementById("nav-toggle");
            if (navToggle) {
                navToggle.checked = false;
            }
        });
    });

    document.querySelectorAll(".nav-menu a:not(.nav-dropdown-toggle)").forEach((link) => {
        if (link.dataset.navLinkCloseBound === "1") {
            return;
        }

        link.dataset.navLinkCloseBound = "1";
        link.addEventListener("click", () => {
            closeAllNavDropdowns();
            const navToggle = document.getElementById("nav-toggle");
            if (navToggle) {
                navToggle.checked = false;
            }
        });
    });

    if (!window.__navDropdownOutsideClickBound) {
        document.addEventListener("click", (event) => {
            const insideDropdown = event.target.closest(".nav-dropdown");
            if (!insideDropdown) {
                closeAllNavDropdowns();
            }
        });
        window.__navDropdownOutsideClickBound = true;
    }

    if (!window.__navDropdownEscapeBound) {
        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") {
                return;
            }

            closeAllNavDropdowns();
            const navToggle = document.getElementById("nav-toggle");
            if (navToggle) {
                navToggle.checked = false;
            }
        });
        window.__navDropdownEscapeBound = true;
    }
}

function normalizeNavPath(path) {
    try {
        return decodeURIComponent((path || "").trim().toLowerCase());
    } catch (error) {
        return (path || "").trim().toLowerCase();
    }
}

function isHomePage() {
    const path = window.location.pathname.toLowerCase();
    return path.endsWith("/") || path.endsWith("/index.html") || path === "";
}

function isHomePath(pathname) {
    const path = (pathname || "").toLowerCase();
    return path.endsWith("/") || path.endsWith("/index.html") || path === "";
}

let activeScrollAnimationFrame = 0;
let activeScrollAnimationToken = 0;
let lastHandledHash = "";
let lastHandledHashAt = 0;
let pendingHashScrollTimer = 0;
let pendingHashScrollToken = 0;
let waitingForHomeDataScroll = false;

function sanitizeHomeHashOnLoad() {
    if (!isHomePage()) {
        return;
    }

    // Keep hash targets (e.g., index.html#contact) so deep links from other pages work.
    if (window.location.hash) {
        return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function scheduleInitialHashScroll() {
    if (!isHomePage()) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedTarget = params.get("scroll");
    const initialBehavior = requestedTarget ? "auto" : "smooth";
    if (requestedTarget && !window.location.hash) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${requestedTarget}`);
    }

    if (requestedTarget && !window.__homeDataReady) {
        if (!waitingForHomeDataScroll) {
            waitingForHomeDataScroll = true;

            const resumeAfterData = () => {
                waitingForHomeDataScroll = false;
                if (pendingHashScrollTimer) {
                    window.clearTimeout(pendingHashScrollTimer);
                    pendingHashScrollTimer = 0;
                }
                scheduleInitialHashScroll();
            };

            window.addEventListener("home-data-ready", resumeAfterData, { once: true });
            pendingHashScrollTimer = window.setTimeout(resumeAfterData, 1800);
        }
        return;
    }

    if (!window.location.hash) {
        return;
    }

    const currentHash = window.location.hash;
    const now = Date.now();
    const isRecentDuplicate = currentHash === lastHandledHash && (now - lastHandledHashAt) < 4000;
    if (isRecentDuplicate) {
        return;
    }

    let attempts = 0;
    const maxAttempts = 8;

    const tryScroll = () => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        const target = id ? document.getElementById(id) : null;

        if (target) {
            queueStableHashScroll(target, currentHash, initialBehavior);
            return;
        }

        attempts += 1;
        if (attempts < maxAttempts) {
            window.setTimeout(tryScroll, 120);
        }
    };

    window.requestAnimationFrame(tryScroll);
}

function queueStableHashScroll(target, hashValue, behavior) {
    if (!target) {
        return;
    }

    if (pendingHashScrollTimer) {
        window.clearTimeout(pendingHashScrollTimer);
        pendingHashScrollTimer = 0;
    }

    pendingHashScrollToken += 1;
    lastHandledHash = hashValue;
    lastHandledHashAt = Date.now();
    ensureHashTargetVisible(behavior || "smooth");
}

function ensureHashTargetVisible(behavior) {
    if (!isHomePage() || !window.location.hash) {
        return;
    }

    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
        return;
    }

    const target = document.getElementById(id);
    if (!target) {
        return;
    }

    scrollToElementWithOffset(target, behavior || "auto");
}

function ensureWhatsAppButton() {
    if (!isPublicPage()) {
        return;
    }

    const existingButton = document.querySelector(".whatsapp-button");
    const button = existingButton || document.createElement("a");
    const defaultMessage = "Hello, I visited your website and need more information.";
    const waUrl = `https://wa.me/919810119009?text=${encodeURIComponent(defaultMessage)}`;

    button.href = waUrl;
    button.className = "whatsapp-button";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute("aria-label", "Chat with us on WhatsApp");
    button.title = "Chat on WhatsApp";
    button.innerHTML = `
        <span class="whatsapp-icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false" aria-hidden="true">
                <path fill="currentColor" d="M19.11 17.42c-.27-.14-1.57-.77-1.81-.85-.24-.09-.42-.14-.6.14-.18.27-.68.85-.83 1.03-.15.18-.3.2-.56.07-.27-.14-1.11-.41-2.11-1.31-.78-.69-1.3-1.54-1.46-1.8-.15-.27-.02-.42.11-.55.12-.12.27-.3.41-.45.14-.15.18-.25.27-.41.09-.18.05-.33-.02-.46-.07-.14-.6-1.45-.83-1.98-.22-.53-.44-.45-.6-.45l-.51-.01c-.18 0-.46.07-.7.33-.24.27-.91.89-.91 2.16s.93 2.5 1.07 2.68c.14.18 1.82 2.78 4.41 3.89.61.27 1.09.43 1.46.55.61.2 1.16.17 1.6.11.49-.07 1.57-.64 1.79-1.25.22-.6.22-1.12.15-1.24-.06-.11-.24-.18-.51-.32z"/>
                <path fill="currentColor" d="M16.02 4.02c-6.62 0-12 5.38-12 12 0 2.12.55 4.2 1.6 6.03L4 28l6.12-1.6c1.75.95 3.7 1.45 5.9 1.45h.01c6.62 0 12-5.38 12-12s-5.39-11.83-12.01-11.83zm0 21.67h-.01c-1.82 0-3.6-.49-5.15-1.43l-.36-.21-3.63.95.97-3.54-.24-.37a9.78 9.78 0 01-1.5-5.21c0-5.39 4.39-9.78 9.79-9.78 2.62 0 5.08 1.02 6.92 2.86a9.71 9.71 0 012.86 6.92c0 5.4-4.39 9.81-9.65 9.81z"/>
            </svg>
        </span>
    `;

    if (!existingButton) {
        document.body.appendChild(button);
    }
}

function scrollToElementWithOffset(target, behavior) {
    if (!target) {
        return;
    }

    const header = document.querySelector(".header");
    const headerOffset = header ? header.getBoundingClientRect().height + 12 : 92;
    const destination = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);

    if (behavior === "smooth" && !isMotionReduced()) {
        animateScrollTo(destination, 620);
        return;
    }

    cancelActiveScrollAnimation();

    window.scrollTo({ top: destination, left: 0, behavior: "auto" });
}

function cancelActiveScrollAnimation() {
    activeScrollAnimationToken += 1;
    if (activeScrollAnimationFrame) {
        window.cancelAnimationFrame(activeScrollAnimationFrame);
        activeScrollAnimationFrame = 0;
    }
}

function animateScrollTo(destination, durationMs) {
    cancelActiveScrollAnimation();

    const start = window.scrollY || window.pageYOffset;
    const distance = destination - start;
    const dynamicDuration = Math.min(520, Math.max(240, Math.abs(distance) * 0.32));
    const duration = Math.max(220, durationMs || dynamicDuration);
    const startTime = performance.now();
    const token = activeScrollAnimationToken;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
        if (token !== activeScrollAnimationToken) {
            return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(progress);
        window.scrollTo(0, start + distance * eased);

        if (progress < 1) {
            activeScrollAnimationFrame = window.requestAnimationFrame(step);
        } else {
            activeScrollAnimationFrame = 0;
        }
    };

    activeScrollAnimationFrame = window.requestAnimationFrame(step);
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
            scrollToElementWithOffset(target, "smooth");
        });
    });
}

function removeLegacyPreloader() {
    const preloader = document.getElementById("page-preloader");
    if (!preloader) {
        return;
    }

    document.body.classList.remove("preloader-active", "preloader-hidden");
    if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
    }
}

function initScrollAnimations() {
    if (window.__scrollAnimationsBound) {
        return;
    }

    const candidates = document.querySelectorAll(
        "section, .section-header, .service-card, .service-card-modern, .work-item, .stat-card, .review-card, .brand-card, .value-card, .team-card, .blog-card, .project-card, .domain-card"
    );

    candidates.forEach((el, index) => {
        if (!el.hasAttribute("data-animate")) {
            el.setAttribute("data-animate", "");
        }

        const parent = el.parentElement;
        if (parent) {
            const siblingSet = parent.querySelectorAll(
                ".service-card, .service-card-modern, .work-item, .stat-card, .review-card, .brand-card, .value-card, .team-card, .blog-card, .project-card, .domain-card"
            );

            if (siblingSet.length > 1) {
                const siblingIndex = Array.from(siblingSet).indexOf(el);
                if (siblingIndex >= 0) {
                    const stagger = isHomePage() ? 0 : 55;
                    el.style.setProperty("--reveal-delay", `${Math.min(siblingIndex, 6) * stagger}ms`);
                }
            } else {
                const stagger = isHomePage() ? 0 : 35;
                el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * stagger}ms`);
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
        isHomePage()
            ? { threshold: 0.03, rootMargin: "0px 0px -2% 0px" }
            : { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    candidates.forEach((el) => observer.observe(el));
    window.__scrollAnimationsBound = true;
}

function initPageTransitions() {
    if (window.__pageTransitionBound) {
        return;
    }

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a[href]");
        if (!link) {
            return;
        }

        const href = link.getAttribute("href") || "";
        if (!href || href.startsWith("#") || link.target === "_blank" || link.hasAttribute("download")) {
            return;
        }

        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        let destination;
        try {
            destination = new URL(href, window.location.href);
        } catch (error) {
            return;
        }

        if (destination.origin !== window.location.origin) {
            return;
        }

        if (
            !isHomePage() &&
            isHomePath(destination.pathname) &&
            destination.hash === "#contact"
        ) {
            destination.hash = "";
            destination.searchParams.set("scroll", "contact");
        }

        const isContactRouteToHome =
            isHomePath(destination.pathname) &&
            destination.searchParams.get("scroll") === "contact";

        if (isContactRouteToHome) {
            return;
        }

        const isHashOnlyNavigation =
            destination.pathname === window.location.pathname &&
            destination.search === window.location.search &&
            destination.hash !== window.location.hash;

        if (isHashOnlyNavigation) {
            return;
        }

        if (destination.href === window.location.href) {
            return;
        }

        event.preventDefault();
        document.body.classList.add("page-leaving");

        window.setTimeout(() => {
            window.location.href = destination.href;
        }, 210);
    });

    window.__pageTransitionBound = true;
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
    if (isMotionReduced() || isHomePage()) {
        return;
    }

    const targets = document.querySelectorAll(".section-title, .section-subtitle");

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
    if (!isPublicPage() || !isDesktopMotionAllowed() || isHomePage()) {
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
