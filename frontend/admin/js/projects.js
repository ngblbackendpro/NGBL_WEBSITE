(function () {

// ===============================
// ADMIN PROJECTS MANAGEMENT
// ===============================

const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.PROJECTS;

let upcomingSelectedImage = null;
let completedSelectedImage = null;
let currentUpcomingDept = "all";
let currentCompletedDept = "all";
let editingUpcomingId = null;
let editingCompletedId = null;


document.addEventListener("DOMContentLoaded", function () {
    setupFormListeners();
    setupProjectImagePreview();
    loadProjects("upcoming");
    loadProjects("completed");
    setupDeptTabs();
});

// ===============================
// FORM LISTENERS
// ===============================


function setupDeptTabs() {
    const tabs = document.querySelectorAll(".dept-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const status = tab.dataset.status;

            // Only remove active from same status group
            document.querySelectorAll(`.dept-tab[data-status="${status}"]`)
                .forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            if (status === "upcoming") {
                currentUpcomingDept = tab.dataset.dept;
            } else {
                currentCompletedDept = tab.dataset.dept;
            }

            loadProjects(status);
        });
    });
}


function setupFormListeners() {

    const upcomingForm = document.getElementById("upcomingProjectForm");
    const completedForm = document.getElementById("completedProjectForm");

    // ================= UPCOMING =================
    if (upcomingForm) {
        upcomingForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData();

            formData.append("title", document.getElementById("upcomingTitle").value);
            formData.append("heading", document.getElementById("upcomingHeading").value);
            formData.append("projectDepartment", document.getElementById("upcomingDepartment").value);
            formData.append("description", document.getElementById("upcomingDescription").value);
            formData.append("date", document.getElementById("upcomingDate").value);
            formData.append("status", "upcoming");
            formData.append("image", document.getElementById("upcomingImage").files[0]);

            try {
                const url = editingUpcomingId ? `${API_URL}/${editingUpcomingId}` : API_URL;
                const method = editingUpcomingId ? "PUT" : "POST";
                const response = await fetch(url, { 
                    method: method, 
                    body: formData 
                });

                const data = await response.json();

                if (response.ok) {
                    alert(editingUpcomingId ? "✔ Upcoming project updated!" : "✔ Upcoming project added successfully!");
                    upcomingForm.reset();
                    document.getElementById("upcomingPreview").style.display = "none";
                    document.getElementById("upcomingFileLabel").style.display = "block";
                    upcomingSelectedImage = null;
                    editingUpcomingId = null;
                    document.getElementById("upcomingSubmitBtn").textContent = "✔ Add Upcoming Project";
                    document.getElementById("upcomingEditModeBar").style.display = "none";
                    document.getElementById("cancelUpcomingEditBtn").style.display = "none";
                    loadProjects("upcoming");
                } else {
                    alert(data.message || "Error adding project", "error");
                }

            } catch (error) {
                showFlashMessage("Server error", "error");
            }
        });
    }

    // ================= COMPLETED =================
    if (completedForm) {
        completedForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData();

            formData.append("title", document.getElementById("completedTitle").value);
            formData.append("heading", document.getElementById("completedHeading").value);
            formData.append("projectDepartment", document.getElementById("completedDepartment").value);
            formData.append("description", document.getElementById("completedDescription").value);
            formData.append("date", document.getElementById("completedDate").value);
            formData.append("link", document.getElementById("completedLink").value);
            formData.append("status", "completed");
            formData.append("image", document.getElementById("completedImage").files[0]);

            try {
                const url = editingCompletedId ? `${API_URL}/${editingCompletedId}` : API_URL;
                const method = editingCompletedId ? "PUT" : "POST";
                const response = await fetch(url, { 
                    method : method, 
                    body: formData 
                });

                const data = await response.json();

                if (response.ok) {
                    alert(editingCompletedId ? "✔ Completed project updated!" : "✔ Completed project added successfully!");
                    completedForm.reset();
                    document.getElementById("completedPreview").style.display = "none";
                    document.getElementById("completedFileLabel").style.display = "block";
                    completedSelectedImage = null;
                    editingCompletedId = null;
                    document.getElementById("completedSubmitBtn").textContent = "✔ Add Completed Project";
                    document.getElementById("completedEditModeBar").style.display = "none";
                    document.getElementById("cancelCompletedEditBtn").style.display = "none";
                    loadProjects("completed");
                } else {
                    alert(data.message || "Error adding project", "error");
                }

            } catch (error) {
                showFlashMessage("Server error", "error");
            }
        });
    }
}



function setupProjectImagePreview() {

    // ================= UPCOMING =================
    const upcomingInput = document.getElementById("upcomingImage");
    const upcomingPreview = document.getElementById("upcomingPreview");
    const upcomingImg = document.getElementById("upcomingPreviewImg");
    const upcomingLabel = document.getElementById("upcomingFileLabel");
    const upcomingChangeBtn = document.getElementById("upcomingChangeBtn");
    const upcomingCancelBtn = document.getElementById("upcomingCancelBtn");

    if (upcomingInput) {

        upcomingInput.addEventListener("change", function (e) {
            const file = e.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    upcomingSelectedImage = file;
                    upcomingImg.src = event.target.result;
                    upcomingPreview.style.display = "block";
                    upcomingLabel.style.display = "none";
                };

                reader.readAsDataURL(file);
            }
        });

        upcomingChangeBtn.addEventListener("click", function () {
            upcomingInput.click();
        });

        upcomingCancelBtn.addEventListener("click", function () {
            upcomingInput.value = "";
            upcomingSelectedImage = null;
            upcomingPreview.style.display = "none";
            upcomingLabel.style.display = "block";
        });
    }

    // ================= COMPLETED =================
    const completedInput = document.getElementById("completedImage");
    const completedPreview = document.getElementById("completedPreview");
    const completedImg = document.getElementById("completedPreviewImg");
    const completedLabel = document.getElementById("completedFileLabel");
    const completedChangeBtn = document.getElementById("completedChangeBtn");
    const completedCancelBtn = document.getElementById("completedCancelBtn");

    if (completedInput) {

        completedInput.addEventListener("change", function (e) {
            const file = e.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    completedSelectedImage = file;
                    completedImg.src = event.target.result;
                    completedPreview.style.display = "block";
                    completedLabel.style.display = "none";
                };

                reader.readAsDataURL(file);
            }
        });

        completedChangeBtn.addEventListener("click", function () {
            completedInput.click();
        });

        completedCancelBtn.addEventListener("click", function () {
            completedInput.value = "";
            completedSelectedImage = null;
            completedPreview.style.display = "none";
            completedLabel.style.display = "block";
        });
    }
}


// ===============================
// LOAD PROJECTS FROM DATABASE
// ===============================

async function loadProjects(status) {

    const container = document.getElementById(
        status === "upcoming" ? "upcomingList" : "completedList"
    );

    container.innerHTML = "";

    try {

        const dept = status === "upcoming" ? currentUpcomingDept : currentCompletedDept;
        const url = dept === "all"
            ? `${API_URL}?status=${status}`
            : `${API_URL}?status=${status}&projectDepartment=${dept}`;
        const response = await fetch(url);
        const projects = await response.json();

        if (!projects.length) {
            container.innerHTML = `<p class="empty-message">No ${status} projects added yet.</p>`;
            return;
        }

        projects.forEach(project => {

            const card = document.createElement("div");
            card.className = "item-card";

            card.innerHTML = `
                <img src="${getProjectImage(project)}" alt="${project.title}">

                <div style="background:${status === "upcoming" ? "#e74c3c" : "#27ae60"};
                            color:white;
                            padding:4px 8px;
                            border-radius:3px;
                            display:inline-block;
                            font-size:11px;
                            margin-bottom:10px;
                            font-weight:600;">
                    ${status === "upcoming" ? "🚀 UPCOMING" : "✅ COMPLETED"}
                </div>

                <div class="item-title">${project.title}</div>
                <div class="item-text"><strong>Project:</strong> ${project.heading}</div>
                ${project.projectDepartment ? `
                <span style="
                    display:inline-block;
                    margin: 4px 0 8px;
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    background: ${project.projectDepartment === 'IT' ? '#dbeafe' : '#fce7f3'};
                    color: ${project.projectDepartment === 'IT' ? '#1d4ed8' : '#be185d'};
                ">
                    ${project.projectDepartment === 'IT' ? '💻 IT' : '🎵 Music'}
                </span>` : ""}
                <div class="item-text">${project.description}</div>

                ${
                    status === "completed"
                    ? `<div class="item-text">
                        <strong>Link:</strong>
                        <a href="${project.link}" target="_blank">${project.link}</a>
                      </div>`
                    : ""
                }

                <div class="item-meta">
                    <span>📅 ${new Date(project.date).toLocaleDateString()}</span>
                </div>

                <div class="item-actions">
                    <button class="btn-edit" onclick="editProject('${project._id}', '${status}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteProject('${project._id}')">🗑️ Delete</button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = `<p>Error loading projects</p>`;
    }
}



function getProjectImage(project) {
    if (!project.image) {
        return "img/placeholder.png"; // fallback image
    }

    // ✅ If Cloudinary or external URL
    if (/^https?:\/\//i.test(project.image)) {
        return project.image;
    }

    // ✅ If old local image
    return `${BASE_URL}/${project.image}`;
}

// ===============================
// DELETE PROJECT
// ===============================

async function deleteProject(id) {

    if (!confirm("Are you sure you want to delete this project?")) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showFlashMessage("✔ Project deleted successfully!");
            loadProjects("upcoming");
            loadProjects("completed");
        }

    } catch (error) {
        showFlashMessage("Error deleting project", "error");
    }
}

window.deleteProject = deleteProject;

async function editProject(id, status) {
    try {
        const response = await fetch(`${API_URL}?status=${status}`);
        const projects = await response.json();
        const project = projects.find(p => p._id === id);
        if (!project) { alert("Project not found"); return; }

        if (status === "upcoming") {
            editingUpcomingId = id;

            document.getElementById("upcomingTitle").value = project.title || '';
            document.getElementById("upcomingHeading").value = project.heading || '';
            document.getElementById("upcomingDepartment").value = project.projectDepartment || '';
            document.getElementById("upcomingDescription").value = project.description || '';
            document.getElementById("upcomingDate").value = project.date ? project.date.split('T')[0] : '';

            if (project.image) {
                document.getElementById("upcomingPreviewImg").src = getProjectImage(project);
                document.getElementById("upcomingPreview").style.display = "block";
                document.getElementById("upcomingFileLabel").style.display = "none";
            }

            document.getElementById("upcomingSubmitBtn").textContent = "✔ Update Upcoming Project";
            document.getElementById("upcomingEditModeBar").style.display = "block";
            document.getElementById("cancelUpcomingEditBtn").style.display = "inline-block";

            setTimeout(() => {
                document.getElementById("upcomingProjectForm").scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);

        } else {
            editingCompletedId = id;

            document.getElementById("completedTitle").value = project.title || '';
            document.getElementById("completedHeading").value = project.heading || '';
            document.getElementById("completedDepartment").value = project.projectDepartment || '';
            document.getElementById("completedDescription").value = project.description || '';
            document.getElementById("completedDate").value = project.date ? project.date.split('T')[0] : '';
            document.getElementById("completedLink").value = project.link || '';

            if (project.image) {
                document.getElementById("completedPreviewImg").src = getProjectImage(project);
                document.getElementById("completedPreview").style.display = "block";
                document.getElementById("completedFileLabel").style.display = "none";
            }

            document.getElementById("completedSubmitBtn").textContent = "✔ Update Completed Project";
            document.getElementById("completedEditModeBar").style.display = "block";
            document.getElementById("cancelCompletedEditBtn").style.display = "inline-block";

            setTimeout(() => {
                document.getElementById("completedProjectForm").scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }

    } catch (error) {
        console.error(error);
        alert("Error loading project");
    }
}

function cancelProjectEdit(status) {
    if (status === "upcoming") {
        editingUpcomingId = null;
        document.getElementById("upcomingProjectForm").reset();
        document.getElementById("upcomingPreview").style.display = "none";
        document.getElementById("upcomingFileLabel").style.display = "block";
        document.getElementById("upcomingSubmitBtn").textContent = "✔ Add Upcoming Project";
        document.getElementById("upcomingEditModeBar").style.display = "none";
        document.getElementById("cancelUpcomingEditBtn").style.display = "none";
    } else {
        editingCompletedId = null;
        document.getElementById("completedProjectForm").reset();
        document.getElementById("completedPreview").style.display = "none";
        document.getElementById("completedFileLabel").style.display = "block";
        document.getElementById("completedSubmitBtn").textContent = "✔ Add Completed Project";
        document.getElementById("completedEditModeBar").style.display = "none";
        document.getElementById("cancelCompletedEditBtn").style.display = "none";
    }
}

window.editProject = editProject;
window.cancelProjectEdit = cancelProjectEdit;

})();