// const BASE_URL =
//     window.location.hostname === "localhost"
//         ? "http://localhost:5000"
//         : "https://yourdomain.com";


const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.SERVICES;

const ServicesModule = {
    config: {
        currentCategory: 'all',
        animationDelay: 50
    },

    elements: {
        categoryTabs: null,
        servicesGrid: null
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
                card.setAttribute("data-category", service.category || "all");
                card.setAttribute("role", "listitem");

                card.innerHTML = `
                    <div class="service-icon-modern">
                        ${service.image
                            ? `<img src="${BASE_URL}${service.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">`
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

                    <a href="index.html#contact" class="service-btn">
                        Learn More
                        <i class="fas fa-arrow-right"></i>
                    </a>
                `;


                this.elements.servicesGrid.appendChild(card);
            });

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
        const category = this.config.currentCategory;

        cards.forEach(card => {
            const cardCategory = card.dataset.category;

            if (category === "all" || cardCategory === category) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    ServicesModule.init();
});
