// // /**
// //  * NGBL Website - Projects Page Module
// //  * Handles project filtering, search, and pagination
// //  */

// // /**
// //  * Projects Module - Main functionality for projects page
// //  */
// // const ProjectsModule = {
// //     // Configuration
// //     config: {
// //         currentFilter: 'all',
// //         searchQuery: '',
// //         itemsPerPage: 6,
// //         currentPage: {
// //             upcoming: 1,
// //             completed: 1
// //         }
// //     },

// //     // DOM Elements
// //     elements: {
// //         searchInput: null,
// //         filterBtns: null,
// //         upcomingGrid: null,
// //         completedGrid: null,
// //         upcomingEmpty: null,
// //         completedEmpty: null,
// //         loadMoreBtn: null
// //     },

// //     /**
// //      * Initialize Projects Module
// //      */
// //     init() {
// //         if (!this.cacheElements()) return;
// //         this.bindEvents();
// //         this.displayProjects();
// //     },

// //     /**
// //      * Cache DOM Elements
// //      */
// //     cacheElements() {
// //         this.elements.searchInput = document.querySelector('#project-search');
// //         this.elements.filterBtns = document.querySelectorAll('.filter-btn');
// //         this.elements.upcomingGrid = document.querySelector('[data-project-type="upcoming"]');
// //         this.elements.completedGrid = document.querySelector('[data-project-type="completed"]');
// //         this.elements.loadMoreBtn = document.querySelector('#load-more-btn');

// //         // Get empty states
// //         const emptyStates = document.querySelectorAll('.projects-empty-state');
// //         if (emptyStates.length >= 2) {
// //             this.elements.upcomingEmpty = emptyStates[0];
// //             this.elements.completedEmpty = emptyStates[1];
// //         }

// //         return this.elements.searchInput && this.elements.upcomingGrid && this.elements.completedGrid;
// //     },

// //     /**
// //      * Bind Event Listeners
// //      */
// //     bindEvents() {
// //         // Search input
// //         if (this.elements.searchInput) {
// //             this.elements.searchInput.addEventListener('input', (e) => {
// //                 this.config.searchQuery = e.target.value.toLowerCase();
// //                 this.displayProjects();
// //             });
// //         }

// //         // Filter buttons
// //         if (this.elements.filterBtns) {
// //             this.elements.filterBtns.forEach(btn => {
// //                 btn.addEventListener('click', (e) => {
// //                     e.preventDefault();
// //                     this.config.currentFilter = btn.dataset.filter;
// //                     this.updateActiveFilter();
// //                     this.displayProjects();
// //                 });
// //             });
// //         }

// //         // Load more button
// //         if (this.elements.loadMoreBtn) {
// //             this.elements.loadMoreBtn.addEventListener('click', () => {
// //                 this.loadMoreProjects();
// //             });
// //         }
// //     },

// //     /**
// //      * Update Active Filter Button
// //      */
// //     updateActiveFilter() {
// //         this.elements.filterBtns.forEach(btn => {
// //             btn.classList.toggle('active', btn.dataset.filter === this.config.currentFilter);
// //         });
// //     },

// //     /**
// //      * Display Projects Based on Current Filter and Search
// //      */
// //     displayProjects() {
// //         const filter = this.config.currentFilter;

// //         if (filter === 'all') {
// //             this.displayUpcomingProjects();
// //             this.displayCompletedProjects();
// //         } else if (filter === 'upcoming') {
// //             this.displayUpcomingProjects();
// //             this.hideCompletedSection();
// //         } else if (filter === 'completed') {
// //             this.hideUpcomingSection();
// //             this.displayCompletedProjects();
// //         }
// //     },

// //     /**
// //      * Display Upcoming Projects
// //      */
// //     displayUpcomingProjects() {
// //         const projects = Array.from(this.elements.upcomingGrid.querySelectorAll('.project-card'));
// //         const filtered = this.filterProjects(projects);

// //         this.renderProjects(projects, filtered, this.elements.upcomingEmpty);
// //         this.showElement(this.elements.upcomingGrid.closest('.projects-section'));
// //     },

// //     /**
// //      * Display Completed Projects
// //      */
// //     displayCompletedProjects() {
// //         const projects = Array.from(this.elements.completedGrid.querySelectorAll('.project-card'));
// //         const filtered = this.filterProjects(projects);
        
// //         this.renderProjects(projects, filtered, this.elements.completedEmpty);
// //         this.updateLoadMoreButton(filtered.length);
// //         this.showElement(this.elements.completedGrid.closest('.projects-section'));
// //     },

// //     /**
// //      * Filter Projects Based on Search Query
// //      */
// //     filterProjects(projects) {
// //         if (!this.config.searchQuery) {
// //             return projects;
// //         }

// //         return projects.filter(project => {
// //             const title = project.querySelector('.project-title').textContent.toLowerCase();
// //             const description = project.querySelector('.project-description').textContent.toLowerCase();
// //             const category = project.querySelector('.project-category-tag').textContent.toLowerCase();

// //             return (
// //                 title.includes(this.config.searchQuery) ||
// //                 description.includes(this.config.searchQuery) ||
// //                 category.includes(this.config.searchQuery)
// //             );
// //         });
// //     },

// //     /**
// //      * Render Projects in Grid
// //      */
// //     renderProjects(allProjects, filteredProjects, emptyState) {
// //         // Hide all projects first
// //         allProjects.forEach(project => {
// //             project.classList.add('hidden');
// //         });

// //         if (filteredProjects.length === 0) {
// //             // Show empty state
// //             if (emptyState) {
// //                 emptyState.style.display = 'block';
// //             }
// //             return;
// //         }

// //         // Hide empty state
// //         if (emptyState) {
// //             emptyState.style.display = 'none';
// //         }

// //         // Show filtered projects
// //         filteredProjects.forEach((project, index) => {
// //             project.classList.remove('hidden');
// //             // Add animation delay
// //             project.style.animationDelay = `${index * 0.05}s`;
// //         });
// //     },

// //     /**
// //      * Load More Projects for Completed Section
// //      */
// //     loadMoreProjects() {
// //         const grid = this.elements.completedGrid;
// //         const allCards = Array.from(grid.querySelectorAll('.project-card:not(.hidden)'));
// //         const hiddenCards = allCards.filter(card => !card.classList.contains('hidden'));
        
// //         // Show additional cards
// //         const itemsToShow = 3;
// //         let shownCount = 0;
        
// //         for (let i = 0; i < allCards.length && shownCount < itemsToShow; i++) {
// //             const card = allCards[i];
// //             if (card.classList.contains('hidden')) {
// //                 card.classList.remove('hidden');
// //                 shownCount++;
// //             }
// //         }

// //         // Check if we should hide the load more button
// //         const remainingHidden = allCards.filter(card => card.classList.contains('hidden')).length;
// //         if (remainingHidden === 0) {
// //             this.elements.loadMoreBtn.disabled = true;
// //             this.elements.loadMoreBtn.textContent = 'All Projects Loaded';
// //         }
// //     },

// //     /**
// //      * Update Load More Button State
// //      */
// //     updateLoadMoreButton(visibleCount) {
// //         if (!this.elements.loadMoreBtn) return;

// //         const totalCompleted = this.elements.completedGrid.querySelectorAll('.project-card').length;
        
// //         if (visibleCount === 0 || this.config.searchQuery) {
// //             // Hide load more when searching or no results
// //             this.elements.loadMoreBtn.style.display = 'none';
// //         } else {
// //             this.elements.loadMoreBtn.style.display = 'block';
// //             this.elements.loadMoreBtn.disabled = false;
// //             this.elements.loadMoreBtn.innerHTML = '<i class="fas fa-arrow-down" aria-hidden="true"></i> Load More Projects';
// //         }
// //     },

// //     /**
// //      * Show Element
// //      */
// //     showElement(element) {
// //         if (element) {
// //             element.style.display = 'block';
// //         }
// //     },

// //     /**
// //      * Hide Element
// //      */
// //     hideElement(element) {
// //         if (element) {
// //             element.style.display = 'none';
// //         }
// //     },

// //     /**
// //      * Hide Upcoming Section
// //      */
// //     hideUpcomingSection() {
// //         const section = this.elements.upcomingGrid.closest('.projects-section');
// //         this.hideElement(section);
// //     },

// //     /**
// //      * Hide Completed Section
// //      */
// //     hideCompletedSection() {
// //         const section = this.elements.completedGrid.closest('.projects-section');
// //         this.hideElement(this.elements.loadMoreBtn.closest('.projects-pagination'));
// //         this.hideElement(section);
// //     }
// // };

// // /**
// //  * Initialize on DOM Ready
// //  */
// // DOM.onReady(() => {
// //     ProjectsModule.init();
// // });

// // /**
// //  * Add smooth scroll behavior for filter clicks
// //  */
// // document.addEventListener('DOMContentLoaded', () => {
// //     const filterBtns = document.querySelectorAll('.filter-btn');
    
// //     filterBtns.forEach(btn => {
// //         btn.addEventListener('click', (e) => {
// //             const filter = btn.dataset.filter;
            
// //             // Smooth scroll to appropriate section
// //             if (filter === 'upcoming') {
// //                 document.querySelector('#upcoming-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
// //             } else if (filter === 'completed') {
// //                 document.querySelector('#completed-projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
// //             }
// //         });
// //     });
// // });

// // ===============================
// // PROJECT MANAGEMENT (BACKEND VERSION)
// // ===============================

// // const BASE_URL = window.location.hostname === "localhost"
// //     ? "http://localhost:5000"
// //     : "https://yourdomain.com";

// const BASE_URL = "http://localhost:5000";
// const API_URL = `${BASE_URL}/api/projects`;

// let upcomingSelectedImageData = null;
// let completedSelectedImageData = null;

// document.addEventListener("DOMContentLoaded", function () {
//     setupFormListeners();
//     displayUpcomingProjects();
//     displayCompletedProjects();
// });


// // ===============================
// // FORM LISTENERS
// // ===============================

// function setupFormListeners() {

//     const upcomingForm = document.getElementById("upcomingProjectForm");
//     const completedForm = document.getElementById("completedProjectForm");

//     // 🚀 ADD UPCOMING PROJECT
//     if (upcomingForm) {
//         upcomingForm.addEventListener("submit", async function (e) {
//             e.preventDefault();

//             const title = document.getElementById("upcomingTitle").value;
//             const heading = document.getElementById("upcomingHeading").value;
//             const description = document.getElementById("upcomingDescription").value;
//             const date = document.getElementById("upcomingDate").value;
//             const imageFile = document.getElementById("upcomingImage").files[0];

//             if (!title || !heading || !description || !date || !imageFile) {
//                 showFlashMessage("Please fill all required fields", "error");
//                 return;
//             }

//             const formData = new FormData();
//             formData.append("title", title);
//             formData.append("heading", heading);
//             formData.append("description", description);
//             formData.append("date", date);
//             formData.append("status", "upcoming");
//             formData.append("image", imageFile);

//             try {
//                 const response = await fetch(API_URL, {
//                     method: "POST",
//                     body: formData
//                 });

//                 const data = await response.json();

//                 if (response.ok) {
//                     showFlashMessage("✔ Upcoming project added successfully!");
//                     upcomingForm.reset();
//                     displayUpcomingProjects();
//                 } else {
//                     showFlashMessage(data.message || "Error adding project", "error");
//                 }

//             } catch (error) {
//                 showFlashMessage("Server error. Please try again.", "error");
//             }
//         });
//     }

//     // ✅ ADD COMPLETED PROJECT
//     if (completedForm) {
//         completedForm.addEventListener("submit", async function (e) {
//             e.preventDefault();

//             const title = document.getElementById("completedTitle").value;
//             const heading = document.getElementById("completedHeading").value;
//             const description = document.getElementById("completedDescription").value;
//             const date = document.getElementById("completedDate").value;
//             const link = document.getElementById("completedLink").value;
//             const imageFile = document.getElementById("completedImage").files[0];

//             if (!title || !heading || !description || !date || !link || !imageFile) {
//                 showFlashMessage("Please fill all required fields", "error");
//                 return;
//             }

//             const formData = new FormData();
//             formData.append("title", title);
//             formData.append("heading", heading);
//             formData.append("description", description);
//             formData.append("date", date);
//             formData.append("link", link);
//             formData.append("status", "completed");
//             formData.append("image", imageFile);

//             try {
//                 const response = await fetch(API_URL, {
//                     method: "POST",
//                     body: formData
//                 });

//                 const data = await response.json();

//                 if (response.ok) {
//                     showFlashMessage("✔ Completed project added successfully!");
//                     completedForm.reset();
//                     displayCompletedProjects();
//                 } else {
//                     showFlashMessage(data.message || "Error adding project", "error");
//                 }

//             } catch (error) {
//                 showFlashMessage("Server error. Please try again.", "error");
//             }
//         });
//     }
// }


// // ===============================
// // DISPLAY UPCOMING PROJECTS
// // ===============================

// async function displayUpcomingProjects() {

//     const container = document.getElementById("upcomingList");
//     container.innerHTML = "";

//     try {
//         const response = await fetch(`${API_URL}?status=upcoming`);
//         const projects = await response.json();

//         if (!projects.length) {
//             container.innerHTML = '<p class="empty-message">No upcoming projects added yet.</p>';
//             return;
//         }

//         projects.forEach(project => {

//             const card = document.createElement("div");
//             card.className = "item-card";

//             card.innerHTML = `
//                 ${project.image 
//                     ? `<img src="${BASE_URL}/${project.image}" alt="${project.title}">`
//                     : `<div style="height:200px;background:#eee;display:flex;align-items:center;justify-content:center;">No Image</div>`
//                 }

//                 <div style="background:#e74c3c;color:white;padding:4px 8px;border-radius:3px;font-size:11px;margin-bottom:10px;font-weight:600;">
//                     🚀 UPCOMING
//                 </div>

//                 <div class="item-title">${project.title}</div>
//                 <div class="item-text"><strong>Project:</strong> ${project.heading}</div>
//                 <div class="item-text">${project.description}</div>

//                 <div class="item-meta">
//                     <span>📅 ${new Date(project.date).toLocaleDateString()}</span>
//                     <span>Added: ${new Date(project.createdAt).toLocaleDateString()}</span>
//                 </div>

//                 <div class="item-actions">
//                     <button class="btn-delete" onclick="deleteProject('${project._id}')">🗑️ Delete</button>
//                 </div>
//             `;

//             container.appendChild(card);
//         });

//     } catch (error) {
//         container.innerHTML = '<p class="empty-message">Error loading projects.</p>';
//     }
// }


// // ===============================
// // DISPLAY COMPLETED PROJECTS
// // ===============================

// async function displayCompletedProjects() {

//     const container = document.getElementById("completedList");
//     container.innerHTML = "";

//     try {
//         const response = await fetch(`${API_URL}?status=completed`);
//         const projects = await response.json();

//         if (!projects.length) {
//             container.innerHTML = '<p class="empty-message">No completed projects added yet.</p>';
//             return;
//         }

//         projects.forEach(project => {

//             const card = document.createElement("div");
//             card.className = "item-card";

//             card.innerHTML = `
//                 ${project.image 
//                     ? `<img src="${BASE_URL}/${project.image}" alt="${project.title}">`
//                     : `<div style="height:200px;background:#eee;display:flex;align-items:center;justify-content:center;">No Image</div>`
//                 }

//                 <div style="background:#27ae60;color:white;padding:4px 8px;border-radius:3px;font-size:11px;margin-bottom:10px;font-weight:600;">
//                     ✅ COMPLETED
//                 </div>

//                 <div class="item-title">${project.title}</div>
//                 <div class="item-text"><strong>Project:</strong> ${project.heading}</div>
//                 <div class="item-text">${project.description}</div>

//                 <div class="item-text">
//                     <strong>Link:</strong> 
//                     <a href="${project.link}" target="_blank" style="color:#667eea;">
//                         ${project.link}
//                     </a>
//                 </div>

//                 <div class="item-meta">
//                     <span>📅 ${new Date(project.date).toLocaleDateString()}</span>
//                     <span>Added: ${new Date(project.createdAt).toLocaleDateString()}</span>
//                 </div>

//                 <div class="item-actions">
//                     <button class="btn-edit" onclick="visitProject('${project.link}')">🔗 Visit</button>
//                     <button class="btn-delete" onclick="deleteProject('${project._id}')">🗑️ Delete</button>
//                 </div>
//             `;

//             container.appendChild(card);
//         });

//     } catch (error) {
//         container.innerHTML = '<p class="empty-message">Error loading projects.</p>';
//     }
// }


// // ===============================
// // DELETE PROJECT
// // ===============================

// async function deleteProject(id) {

//     if (confirm("Are you sure you want to delete this project?")) {
//         try {

//             const response = await fetch(`${API_URL}/${id}`, {
//                 method: "DELETE"
//             });

//             if (response.ok) {
//                 showFlashMessage("✔ Project deleted successfully!");
//                 displayUpcomingProjects();
//                 displayCompletedProjects();
//             } else {
//                 showFlashMessage("Error deleting project", "error");
//             }

//         } catch (error) {
//             showFlashMessage("Server error. Please try again.", "error");
//         }
//     }
// }


// // ===============================
// // VISIT PROJECT
// // ===============================

// function visitProject(link) {
//     window.open(link, "_blank");
// }

// ===============================
// MAIN WEBSITE PROJECTS FETCH
// ===============================

// const BASE_URL = window.location.hostname === "localhost"
//     ? "http://localhost:5000"
//     : "https://yourdomain.com";   

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
                            src="${BASE_URL}/${project.image}" 
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

