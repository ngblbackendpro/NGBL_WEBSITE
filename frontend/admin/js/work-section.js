(function () {


// Work Section JavaScript

const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.WORKS;

let workSelectedImageData = null;


document.addEventListener('DOMContentLoaded', function () {
    setupFormListener();
    setupWorkImagePreview();
    displayWorks();
});

// ---------- IMAGE PREVIEW ----------
function setupWorkImagePreview() {
    const fileInput = document.getElementById('workImage');
    const previewDiv = document.getElementById('workImagePreview');
    const previewImg = document.getElementById('workPreviewImg');
    const uploadBtn = document.getElementById('workUploadBtn');
    const cancelBtn = document.getElementById('workCancelBtn');
    const fileInputLabel = document.getElementById('workFileLabel');

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                workSelectedImageData = file; // store File object for FormData
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
        showFlashMessage('✅ Image ready to upload!', 'success');
    });

    cancelBtn.addEventListener('click', function (e) {
        e.preventDefault();
        previewDiv.style.display = 'none';
        fileInputLabel.style.display = 'block';
        workSelectedImageData = null;
        fileInput.value = '';
    });
}

// ---------- FORM SUBMISSION ----------
function setupFormListener() {
    const form = document.getElementById('addWorkForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById('workTitle').value;
        const category = document.getElementById('workCategory').value;
        const description = document.getElementById('workDescription').value;
        const link = document.getElementById('workLink').value;

        if (!title || !category || !description || !workSelectedImageData) {
            alert('Please fill all required fields and select an image', 'error');
            return;
        }

        // FormData for Multer
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('link', link);
        formData.append('image', workSelectedImageData);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert('✔ Work added successfully!');
            form.reset();
            workSelectedImageData = null;
            document.getElementById('workImagePreview').style.display = 'none';
            document.getElementById('workFileLabel').style.display = 'block';
            displayWorks();
        } catch (err) {
            console.error(err);
            alert('Failed to add work', 'error');
        }
    });
}

// ---------- DISPLAY WORKS ----------
async function displayWorks() {
    const container = document.getElementById('worksList');
    try {
        const res = await fetch(API_URL);
        const works = await res.json();
        container.innerHTML = '';

        if (!works.length) {
            container.innerHTML = '<p class="empty-message">No works added yet. Add your first work above!</p>';
            return;
        }

        works.forEach(work => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <img src="${work.image}" alt="${work.title}">
                <div class="item-title">${work.title}</div>
                <div class="item-text"><strong>Category:</strong> ${work.category}</div>
                <div class="item-text">${work.description}</div>
                ${work.link ? `<div class="item-text"><strong>Link:</strong> <a href="${work.link}" target="_blank">${work.link}</a></div>` : ''}
                <div class="item-meta">
                    <span>Added: ${new Date(work.date).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editWork('${work._id}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteWork('${work._id}')">🗑️ Delete</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="empty-message">Failed to load works from server.</p>';
    }
}

// ---------- DELETE WORK ----------
async function deleteWork(id) {
    if (!confirm('Are you sure you want to delete this work?')) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        showFlashMessage('✔ Work deleted successfully!');
        displayWorks();
    } catch (err) {
        console.error(err);
        showFlashMessage('Failed to delete work', 'error');
    }
}

window.deleteWork = deleteWork;

// ---------- EDIT WORK ----------
async function editWork(id) {
    try {
        const res = await fetch(API_URL);
        const works = await res.json();
        const work = works.find(w => w._id === id);
        if (!work) return;

        document.getElementById('workTitle').value = work.title;
        document.getElementById('workCategory').value = work.category;
        document.getElementById('workDescription').value = work.description;
        document.getElementById('workLink').value = work.link || '';
        document.getElementById('addWorkForm').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('workTitle').focus();

        showFlashMessage('Edit the work details below. Submit to save changes.', 'success');

        // On submit, update work
        document.getElementById('addWorkForm').onsubmit = async function (e) {
            e.preventDefault();

            const updatedFormData = new FormData();
            updatedFormData.append('title', document.getElementById('workTitle').value);
            updatedFormData.append('category', document.getElementById('workCategory').value);
            updatedFormData.append('description', document.getElementById('workDescription').value);
            updatedFormData.append('link', document.getElementById('workLink').value);

            // Only append new image if changed
            const newFile = document.getElementById('workImage').files[0];
            if (newFile) updatedFormData.append('image', newFile);

            try {
                const updateRes = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    body: updatedFormData
                });
                const data = await updateRes.json();
                if (!updateRes.ok) throw new Error(data.message);

                showFlashMessage('✔ Work updated successfully!');
                workSelectedImageData = null;
                displayWorks();
                this.reset();
            } catch (err) {
                console.error(err);
                showFlashMessage('Failed to update work', 'error');
            }
        };

    } catch (err) {
        console.error(err);
    }
}

window.editWork = editWork

// ---------- FLASH MESSAGE ----------
function showFlashMessage(msg, type = 'success') {
    const div = document.createElement('div');
    div.textContent = msg;
    div.className = `flash-message ${type}`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

})();