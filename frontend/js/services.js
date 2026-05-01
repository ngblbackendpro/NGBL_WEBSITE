

const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.SERVICES;

const ServicesModule = {
    config: {
        currentCategory: 'all',
        animationDelay: 50,
        categoryAliases: {
            strategy: ['strategy', 'brand strategy', 'branding', 'positioning', 'market research'],
            digital: ['digital', 'seo', 'social media', 'performance', 'ppc', 'web', 'website', 'technology', 'it'],
            creative: ['creative', 'design', 'content', 'video', 'graphic', 'copywriting', 'ui', 'ux'],
            consulting: ['consulting', 'consultancy', 'advisory', 'business', 'operations', 'management']
        }
    },

    elements: {
        categoryTabs: null,
        servicesGrid: null
    },
    applyDeptFromURL() {
    const dept = new URLSearchParams(window.location.search).get("dept");
    if (!dept) return;

    const cards = document.querySelectorAll(".service-card-modern");
    cards.forEach(card => {
        const cardDept = (card.dataset.department || "").toLowerCase();
        if (cardDept === dept.toLowerCase()) {
            card.style.display = "flex";
            card.classList.add("is-visible");
        } else {
            card.style.display = "none";
        }
    });
},

    async init() {
        this.cacheElements();
        await this.loadServices();
        this.bindEvents();
    },

    cacheElements() {
        this.elements.categoryTabs = document.querySelectorAll('.category-tab');
        this.elements.servicesGrid = document.getElementById('servicesGrid');
    },

    normalizeText(value) {
        return (value || '')
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    },

    async loadServices() {
        try {
            const response = await fetch(API_URL);
            const services = await response.json();

            if (!services.length) {
                this.elements.servicesGrid.innerHTML =
                    "<p>No services available.</p>";
                return;
            }

            this.elements.servicesGrid.innerHTML = "";

            services.forEach((service, index) => {
                const card = document.createElement("article");
                card.className = "service-card-modern";
                const normalizedCategory = this.normalizeText(service.category || 'all');
                const normalizedKeywords = this.normalizeText(
                    service.keywords ? service.keywords.join(', ') : ''
                );
                const normalizedTitle = this.normalizeText(service.title || '');
                const normalizedDescription = this.normalizeText(service.description || '');

                card.setAttribute("data-category", normalizedCategory);
                card.setAttribute("data-department", (service.serviceDepartment || "").toLowerCase());
                card.setAttribute("data-keywords", normalizedKeywords);
                card.setAttribute(
                    "data-search",
                    [normalizedCategory, normalizedKeywords, normalizedTitle, normalizedDescription].join(' ')
                );

                card.innerHTML = `
                    <div class="service-icon-modern">
                        ${service.image
                            ? `<img src="${service.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">`
                            : `<span style="font-size:40px;">🛠️</span>`
                        }
                    </div>

                    <h3 class="service-title-modern">${service.title}</h3>

                    <p class="service-description-modern">
                        ${service.description}
                    </p>

                    <!-- 🔥 Service Meta Info -->
                    <div class="service-meta">
                        ${service.price ? `<span class="service-price">💰 ${service.price}</span>` : ""}
                        ${service.duration ? `<span class="service-duration">⏱ ${service.duration} Days</span>` : ""}
                        ${service.category ? `<span class="service-category">📂 ${service.category}</span>` : ""}
                    </div>

                    ${
                    service.keywords && service.keywords.length > 0
                        ? `
                        <div class="service-keywords">
                            ${service.keywords
                            .flatMap(keyword =>
                                keyword.split(",").map(k => k.trim())
                            )
                            .filter(Boolean)
                            .slice(0, 3)
                            .map(k =>
                                `<span class="feature-tag">✔ ${k}</span>`
                            )
                            .join("")}
                        </div>
                        `
                        : ""
                    }

                    <a href="index.html?scroll=contact" class="service-btn">
                        Learn More
                        <i class="fas fa-arrow-right"></i>
                    </a>
                `;


                this.elements.servicesGrid.appendChild(card);
            });

            const dept = new URLSearchParams(window.location.search).get("dept");
            if (dept) {
                this.applyDeptFromURL();
            } else {
                this.filterServices();
            }

        } catch (error) {
            console.error("Error loading services:", error);
            this.elements.servicesGrid.innerHTML =
                "<p>Error loading services.</p>";
        }
    },

    bindEvents() {
        this.elements.categoryTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                this.config.currentCategory = tab.dataset.category;

                this.elements.categoryTabs.forEach(t =>
                    t.classList.remove("active")
                );
                tab.classList.add("active");

                this.filterServices();
            });
        });
    },

    filterServices() {
        const cards = document.querySelectorAll(".service-card-modern");
        const category = this.normalizeText(this.config.currentCategory);
        const aliasTerms = this.config.categoryAliases[category] || [category];

        cards.forEach(card => {
            const cardCategory = this.normalizeText(card.dataset.category || '');
            const searchableText = this.normalizeText(card.dataset.search || '');

            const isMatch = aliasTerms.some(term => {
                const normalizedTerm = this.normalizeText(term);
                return normalizedTerm && searchableText.includes(normalizedTerm);
            });

            if (category === "all" || cardCategory === category || isMatch) {
                card.style.display = "flex";
                card.classList.add("is-visible");
            } else {
                card.style.display = "none";
            }
        });
    }
};


document.addEventListener("DOMContentLoaded", () => {
    ServicesModule.init();
});
