
const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.TEAM;

const AboutUsModule = {

    async loadTeamMembers() {
        const container = document.getElementById("teamContainer");

        if (!container) return;

        try {
            const response = await fetch(API_URL);
            const members = await response.json();

            if (!members.length) {
                container.innerHTML = "<p>No team members available.</p>";
                return;
            }

            container.innerHTML = "";

            members.forEach(member => {
                const card = document.createElement("article");
                card.className = "team-card";
                card.setAttribute("role", "listitem");

                card.innerHTML = `
                    <div class="team-photo">
                        <img src="${member.image}" 
                             alt="${member.name}" 
                             loading="lazy">
                    </div>
                    <div class="team-info">
                        <h3 class="team-name">${member.name}</h3>
                        <p class="team-role">${member.position}</p>
                        <p class="team-description">${member.description}</p>
                    </div>
                `;

                container.appendChild(card);
            });
            window.dispatchEvent(new Event("resize"));
            // Reinitialize hover after dynamic load
            this.initTeamHoverEffects();
            this.initScrollAnimations();
            

        } catch (error) {
            console.error("Error loading team:", error);
            container.innerHTML = "<p>Error loading team members.</p>";
        }
    },

    initTeamHoverEffects() {
        const teamCards = document.querySelectorAll(".team-card");

        teamCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                card.style.transform = "translateY(-8px)";
                card.style.transition = "all 0.3s ease";
                card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "translateY(0)";
                card.style.boxShadow = "none";
            });
        });
    },

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            ".team-card, .value-card, .about-section"
        );
        animatedElements.forEach(el => {
            if (!el.hasAttribute("data-animate")) {
                el.setAttribute("data-animate", "");
                el.classList.add("is-visible");
            }
        });
    },

    initValueCards() {
        const valueCards = document.querySelectorAll(".value-card");

        valueCards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                card.style.transform = "scale(1.05)";
                card.style.transition = "all 0.3s ease";
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "scale(1)";
            });
        });
    },

    init() {
        this.loadTeamMembers();       // 🔥 Dynamic load
        this.initScrollAnimations();  // Animations
        this.initValueCards();        // Value card hover
    }
};

document.addEventListener("DOMContentLoaded", () => {
    AboutUsModule.init();
});
