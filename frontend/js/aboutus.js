
// const BASE_URL = window.APP_CONFIG.BASE_URL;
// const API_URL = BASE_URL + window.APP_CONFIG.API.TEAM;

// const AboutUsModule = {

//     allMembers: [], 

//     async loadTeamMembers() {
//         const container = document.getElementById("teamContainer");

//         if (!container) return;

//         try {
//             const response = await fetch(API_URL);
//             let members = await response.json();

//             if (!members.length) {
//                 container.innerHTML = "<p>No team members available.</p>";
//                 return;
//             }

//             container.innerHTML = "";

//             // Show newest first (top)
//             members.reverse().forEach(member => {
//                 const card = document.createElement("article");
//                 card.className = "team-card";
//                 card.setAttribute("role", "listitem");

//                 card.innerHTML = `
//                     <div class="team-photo">
//                         <img src="${member.image}" 
//                              alt="${member.name}" 
//                              loading="lazy">
//                     </div>
//                     <div class="team-info">
//                         <h3 class="team-name">${member.name}</h3>
//                         <p class="team-role">${member.position}</p>
//                         <p class="team-description">${member.description}</p>
//                     </div>
//                 `;

//                 container.appendChild(card);
//             });
//             window.dispatchEvent(new Event("resize"));
//             // Reinitialize hover after dynamic load
//             this.initTeamHoverEffects();
//             this.initScrollAnimations();
            

//         } catch (error) {
//             console.error("Error loading team:", error);
//             container.innerHTML = "<p>Error loading team members.</p>";
//         }
//     },

//     initTeamHoverEffects() {
//         const teamCards = document.querySelectorAll(".team-card");

//         teamCards.forEach(card => {
//             card.addEventListener("mouseenter", () => {
//                 card.style.transform = "translateY(-8px)";
//                 card.style.transition = "all 0.3s ease";
//                 card.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
//             });

//             card.addEventListener("mouseleave", () => {
//                 card.style.transform = "translateY(0)";
//                 card.style.boxShadow = "none";
//             });
//         });
//     },

//     initScrollAnimations() {
//         const animatedElements = document.querySelectorAll(
//             ".team-card, .value-card, .about-section"
//         );
//         animatedElements.forEach(el => {
//             if (!el.hasAttribute("data-animate")) {
//                 el.setAttribute("data-animate", "");
//                 el.classList.add("is-visible");
//             }
//         });
//     },

//     initValueCards() {
//         const valueCards = document.querySelectorAll(".value-card");

//         valueCards.forEach(card => {
//             card.addEventListener("mouseenter", () => {
//                 card.style.transform = "scale(1.05)";
//                 card.style.transition = "all 0.3s ease";
//             });

//             card.addEventListener("mouseleave", () => {
//                 card.style.transform = "scale(1)";
//             });
//         });
//     },

//     init() {
//         this.loadTeamMembers();       // 🔥 Dynamic load
//         this.initScrollAnimations();  // Animations
//         this.initValueCards();        // Value card hover
//     }
// };

// document.addEventListener("DOMContentLoaded", () => {
//     AboutUsModule.init();
// });









const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.TEAM;

const AboutUsModule = {

    allMembers: [], // store all members in memory

    async loadTeamMembers() {
        const container = document.getElementById("teamContainer");
        if (!container) return;

        try {
            const response = await fetch(API_URL);
            let members = await response.json();

            if (!members.length) {
                container.innerHTML = "<p>No team members available.</p>";
                return;
            }

            // Store reversed list (newest first)
            this.allMembers = [...members].reverse();

            this.renderCards(this.allMembers);
            this.initFilterTabs();
            this.initScrollAnimations();

        } catch (error) {
            console.error("Error loading team:", error);
            container.innerHTML = "<p>Error loading team members.</p>";
        }
    },

    renderCards(members) {
        const container = document.getElementById("teamContainer");
        container.innerHTML = "";

        members.forEach(member => {
            const card = document.createElement("article");
            card.className = "team-card";
            card.setAttribute("role", "listitem");
            card.setAttribute("data-department", member.department || "");

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
        this.initTeamHoverEffects();
    },

    initFilterTabs() {
        const tabs = document.querySelectorAll(".filter-tab");

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // Update active tab
                tabs.forEach(t => {
                    t.classList.remove("active");
                    t.setAttribute("aria-selected", "false");
                });
                tab.classList.add("active");
                tab.setAttribute("aria-selected", "true");

                const filter = tab.getAttribute("data-filter");
                this.filterCards(filter);
            });
        });
    },

    filterCards(filter) {
        const container = document.getElementById("teamContainer");

        if (filter === "all") {
            // Re-render all (restores animation)
            this.renderCards(this.allMembers);
        } else {
            const filtered = this.allMembers.filter(m =>
                (m.department || "").toLowerCase() === filter.toLowerCase()
            );

            if (!filtered.length) {
                container.innerHTML = `<p style="color: rgba(255,255,255,0.5); text-align:center; grid-column: 1/-1;">No ${filter} team members found.</p>`;
                return;
            }

            this.renderCards(filtered);
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
        this.loadTeamMembers();
        this.initScrollAnimations();
        this.initValueCards();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    AboutUsModule.init();
});