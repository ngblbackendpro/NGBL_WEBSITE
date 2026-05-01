const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.PROJECTS;

const ProjectFilters = {
    currentFilter: "all",
    searchTerm: ""
};

document.addEventListener("DOMContentLoaded", function () {
    initProjectControls();
    loadProjects("upcoming");
    loadProjects("completed");
    applyDeptFromURL();
});

function initProjectControls() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const searchInput = document.getElementById("project-search");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            ProjectFilters.currentFilter = button.dataset.filter || "all";

            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            applyProjectFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            ProjectFilters.searchTerm = (event.target.value || "").trim().toLowerCase();
            applyProjectFilters();
        });
    }
}

// ===============================
// LOAD PROJECTS
// ===============================

async function loadProjects(status) {

    const grid = document.querySelector(`[data-project-type="${status}"]`);
    if (!grid) return;

    grid.innerHTML = "";

    try {

        const dept = new URLSearchParams(window.location.search).get("dept");
        const url = dept
            ? `${API_URL}?status=${status}&projectDepartment=${dept}`
            : `${API_URL}?status=${status}`;
        const response = await fetch(url);
        const projects = await response.json();

        if (!projects.length) {
            grid.innerHTML = `
                <div class="projects-empty-state">
                    <p>No ${status} projects found.</p>
                </div>
            `;
            return;
        }

        projects.forEach(project => {

            const card = document.createElement("article");
            card.className = `project-card ${status}-card`;
            card.dataset.status = status;
            card.dataset.search = [
                project.title || "",
                project.heading || "",
                card.dataset.department = (project.projectDepartment || ""),
                project.description || ""
            ]
                .join(" ")
                .toLowerCase();

            card.innerHTML = `
                <div class="project-image-wrapper">
                    ${project.image 
                        ? `<img 
                            src="${getProjectImage(project)}" 
                            alt="${project.title}" 
                            class="project-image"
                            loading="lazy"
                        >`
                        : `<div style="height:250px;background:#eee;display:flex;align-items:center;justify-content:center;">
                            No Image
                        </div>`
                    }

                    ${
                        status === "upcoming"
                        ? `<div class="project-status-badge">Coming Soon</div>`
                        : `<div class="project-completed-badge">
                            <i class="fas fa-check-circle"></i> Completed
                           </div>`
                    }
                </div>

                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-category-tag">${project.heading}</p>
                    <p class="project-description">${project.description}</p>

                    <div class="project-meta">
                        <span>
                            <i class="fas fa-calendar"></i>
                            ${status === "upcoming" ? "Expected" : "Completed"}: 
                            ${new Date(project.date).toLocaleDateString()}
                        </span>
                    </div>

                    ${
                        status === "completed" && project.link
                        ? `<div class="project-links">
                            <a href="${project.link}" 
                               target="_blank" 
                               class="project-link">
                                View Project 
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                           </div>`
                        : ""
                    }
                </div>
            `;

            grid.appendChild(card);
        });

        applyProjectFilters();

    } catch (error) {
        grid.innerHTML = `<p>Error loading projects.</p>`;
    }
}


function applyDeptFromURL() {
    const dept = new URLSearchParams(window.location.search).get("dept");
    if (!dept) return;

    const allCards = document.querySelectorAll(".project-card");
    allCards.forEach(card => {
        const cardDept = (card.dataset.department || "").toLowerCase();
        if (cardDept === dept.toLowerCase()) {
            card.classList.remove("hidden");
            card.classList.add("is-visible");
        } else {
            card.classList.add("hidden");
        }
    });
}


function applyProjectFilters() {
    const filter = ProjectFilters.currentFilter;
    const searchTerm = ProjectFilters.searchTerm;

    const upcomingSection = document.getElementById("upcoming-projects");
    const completedSection = document.getElementById("completed-projects");

    const showUpcomingByFilter = filter === "all" || filter === "upcoming";
    const showCompletedByFilter = filter === "all" || filter === "completed";

    const visibleUpcoming = filterProjectSection(upcomingSection, showUpcomingByFilter, searchTerm);
    const visibleCompleted = filterProjectSection(completedSection, showCompletedByFilter, searchTerm);

    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
        loadMoreBtn.style.display = visibleCompleted > 0 && showCompletedByFilter ? "inline-flex" : "none";
    }
}

function filterProjectSection(section, allowSection, searchTerm) {
    if (!section) return 0;

    const cards = Array.from(section.querySelectorAll(".project-card"));
    const emptyState = section.querySelector(".projects-empty-state");

    if (!allowSection) {
        section.style.display = "none";
        if (emptyState) emptyState.style.display = "none";
        return 0;
    }

    let visibleCount = 0;

    cards.forEach((card) => {
        const searchIndex = (card.dataset.search || "").toLowerCase();
        const matchesSearch = !searchTerm || searchIndex.includes(searchTerm);

        card.classList.toggle("hidden", !matchesSearch);
        if (matchesSearch) visibleCount += 1;
    });

    section.style.display = visibleCount > 0 || !searchTerm ? "block" : "none";

    if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }

    return visibleCount;
}

function getProjectImage(project) {
    if (!project.image) {
        return "img/placeholder.png"; // fallback
    }

    // ✅ Cloudinary or external URL
    if (/^https?:\/\//i.test(project.image)) {
        return project.image;
    }

    // ✅ Old local uploads
    return `${BASE_URL}/${project.image}`;
}