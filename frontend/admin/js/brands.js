(function () {

// ===============================
// API CONFIG
// ===============================
const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.BRANDS;

document.addEventListener('DOMContentLoaded', function () {
    setupFormListener();
    setupBrandImagePreview();
    displayBrands();
});

// ===================================
// IMAGE PREVIEW
// ===================================
function setupBrandImagePreview() {
    const fileInput = document.getElementById('brandImage');
    const previewDiv = document.getElementById('brandImagePreview');
    const previewImg = document.getElementById('brandPreviewImg');
    const uploadBtn = document.getElementById('brandUploadBtn');
    const cancelBtn = document.getElementById('brandCancelBtn');
    const fileInputLabel = document.getElementById('brandFileLabel');

    if (!fileInput) return;

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                previewImg.src = event.target.result;
                previewDiv.style.display = 'block';
                fileInputLabel.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    uploadBtn.addEventListener('click', function (e) {
        e.preventDefault();
        uploadBtn.style.display = 'none';
        cancelBtn.textContent = '✕ Change Image';
        showFlashMessage('✅ Image selected successfully!', 'success');
    });

    cancelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        previewDiv.style.display = 'none';
        fileInputLabel.style.display = 'block';
        fileInput.value = '';
    });
}

// ===================================
// ADD BRAND (POST API)
// ===================================
function setupFormListener() {
    const form = document.getElementById('addBrandForm');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('brandName').value.trim();
        const description = document.getElementById('brandDescription').value.trim();
        const imageFile = document.getElementById('brandImage').files[0];

        if (!name || !imageFile) {
            alert('Please fill all required fields and select an image', 'error');
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image", imageFile);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("✔ Brand added successfully!");
                form.reset();
                resetImagePreview();
                displayBrands();
            } else {
                alert(data.message || "Error adding brand", "error");
            }

        } catch (error) {
            console.error("Add Brand Error:", error);
            alert("Server error", "error");
        }
    });
}

// ===================================
// DISPLAY BRANDS (GET API)
// ===================================
async function displayBrands() {
    const container = document.getElementById('brandsList');
    container.innerHTML = "<p>Loading brands...</p>";

    try {
        const response = await fetch(API_URL);
        const brands = await response.json();

        container.innerHTML = "";

        if (!brands.length) {
            container.innerHTML = '<p class="empty-message">No brands added yet.</p>';
            return;
        }

        brands.forEach(brand => {
            const card = document.createElement('div');
            card.className = 'item-card';

            card.innerHTML = `
                <img src="${brand.image || 'img/ngblfav.png'}" 
                     alt="${brand.name}" 
                     style="height: 100px; object-fit: contain;">
                <div class="item-title">${brand.name}</div>
                ${brand.description ? `<div class="item-text">${brand.description}</div>` : ''}
                <div class="item-meta">
                    <span>Added: ${new Date(brand.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn-delete" onclick="deleteBrand('${brand._id}')">
                        🗑️ Remove
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Fetch Brands Error:", error);
        container.innerHTML = "<p>Error loading brands</p>";
    }
}

// ===================================
// DELETE BRAND (DELETE API)
// ===================================
async function deleteBrand(id) {
    if (!confirm('Are you sure you want to remove this brand?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok) {
            showFlashMessage("✔ Brand removed successfully!");
            displayBrands();
        } else {
            showFlashMessage(data.message || "Error deleting brand", "error");
        }

    } catch (error) {
        console.error("Delete Brand Error:", error);
        showFlashMessage("Server error", "error");
    }
}

window.deleteBrand = deleteBrand;

// ===================================
// RESET IMAGE PREVIEW
// ===================================
function resetImagePreview() {
    const previewDiv = document.getElementById('brandImagePreview');
    const fileInputLabel = document.getElementById('brandFileLabel');
    const uploadBtn = document.getElementById('brandUploadBtn');

    previewDiv.style.display = 'none';
    fileInputLabel.style.display = 'block';
    uploadBtn.style.display = 'inline-block';
}

})();