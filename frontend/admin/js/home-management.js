(function () {
// API CONFIG
const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.HOME;

document.addEventListener('DOMContentLoaded', function () {
    loadHomeData();
    setupFormListeners();
});

// ===============================
// SETUP FORM LISTENERS
// ===============================
function setupFormListeners() {

    // Experience
    const experienceForm = document.getElementById('experienceForm');
    if (experienceForm) {
        experienceForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const expYears = document.getElementById('expYears').value;

            await fetch(`${API_URL}/experience`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expYears })
            });

            showFlashMessage("✔ Experience years updated successfully!");
            this.reset();
        });
    }

    // Projects
    const projectsForm = document.getElementById('projectsForm');
    if (projectsForm) {
        projectsForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const totalProjects = document.getElementById('projectsCount').value;

            await fetch(`${API_URL}/projects`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ totalProjects })
            });

            showFlashMessage("✔ Project count updated successfully!");
            this.reset();
        });
    }

    // Add Office
    const officeForm = document.getElementById('officeForm');
    if (officeForm) {
        officeForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const officeData = {
                location: document.getElementById('officeLocation').value,
                address: document.getElementById('officeAddress').value,
                email: document.getElementById('officeEmail').value,
                phone: document.getElementById('officePhone').value
            };

            await fetch(`${API_URL}/offices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(officeData)
            });

            showFlashMessage("✔ Office added successfully!");
            this.reset();
            loadHomeData();
        });
    }


            // Company Info
        const companyForm = document.getElementById('companyForm');
        if (companyForm) {
            companyForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const companyInfo = {
                    phone: document.getElementById('companyPhone').value,
                    email: document.getElementById('companyEmail').value,
                    address: document.getElementById('companyAddress').value
                };

                await fetch(`${API_URL}/company-info`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(companyInfo)
                });

                showFlashMessage("✔ Company info updated successfully!");
            });
        }

    // Social Links
    const socialForm = document.getElementById('socialForm');
    if (socialForm) {
        socialForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const socialLinks = {
                facebook: document.getElementById('facebook').value,
                twitter: document.getElementById('twitter').value,
                linkedin: document.getElementById('linkedin').value,
                instagram: document.getElementById('instagram').value,
                youtube: document.getElementById('youtube').value
            };

            await fetch(`${API_URL}/social`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(socialLinks)
            });

            showFlashMessage("✔ Social media links updated successfully!");
        });
    }
}

// ===============================
// LOAD HOME DATA FROM BACKEND
// ===============================
async function loadHomeData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // Fill Experience
        if (data.expYears !== undefined) {
            const expInput = document.getElementById('expYears');
            if (expInput) expInput.value = data.expYears;
        }

        // Fill Projects
        if (data.totalProjects !== undefined) {
            const projectInput = document.getElementById('projectsCount');
            if (projectInput) projectInput.value = data.totalProjects;
        }

        // Fill Company Info
        if (data.companyInfo) {
            document.getElementById('companyPhone').value = data.companyInfo.phone || "";
            document.getElementById('companyEmail').value = data.companyInfo.email || "";
            document.getElementById('companyAddress').value = data.companyInfo.address || "";
        }

        // Fill Social Links
        if (data.socialLinks) {
            document.getElementById('facebook').value = data.socialLinks.facebook || "";
            document.getElementById('twitter').value = data.socialLinks.twitter || "";
            document.getElementById('linkedin').value = data.socialLinks.linkedin || "";
            document.getElementById('instagram').value = data.socialLinks.instagram || "";
            document.getElementById('youtube').value = data.socialLinks.youtube || "";
        }

        // Display Offices
        displayOffices(data.offices || []);

    } catch (err) {
        console.error("Error loading home data:", err);
    }
}

// ===============================
// DISPLAY OFFICES
// ===============================
function displayOffices(offices) {
    const container = document.getElementById('officesContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!offices.length) {
        container.innerHTML = '<p style="color:#999;">No offices added yet.</p>';
        return;
    }

    offices.forEach(office => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-title">${office.location}</div>
            <div class="item-text"><strong>Address:</strong> ${office.address}</div>
            <div class="item-text"><strong>Email:</strong> ${office.email}</div>
            <div class="item-text"><strong>Phone:</strong> ${office.phone}</div>
            <div class="item-actions">
                <button class="btn-delete" onclick="deleteOffice('${office._id}')">🗑️ Delete</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ===============================
// DELETE OFFICE
// ===============================
async function deleteOffice(id) {
    if (!confirm("Are you sure you want to delete this office?")) return;

    const res = await fetch(`${API_URL}/offices/${id}`, {
    method: "DELETE"
    });

    if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Delete failed");
        return;
    }

    showFlashMessage("✔ Office deleted successfully!");
    loadHomeData();
}

window.deleteOffice = deleteOffice;

})();