 

const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.PROJECTS;

document.addEventListener("DOMContentLoaded", function () {
    loadProjects("upcoming");
    loadProjects("completed");
});

// ===============================
// LOAD PROJECTS
// ===============================

async function loadProjects(status) {

    const grid = document.querySelector(`[data-project-type="${status}"]`);
    if (!grid) return;

    grid.innerHTML = "";

    try {

        const response = await fetch(`${API_URL}?status=${status}`);
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

    } catch (error) {
        grid.innerHTML = `<p>Error loading projects.</p>`;
    }
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