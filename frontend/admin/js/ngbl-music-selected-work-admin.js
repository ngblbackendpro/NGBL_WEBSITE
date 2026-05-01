(function () {
    const { BASE_URL, API } = window.ADMIN_CONFIG;
    const MUSIC_BLOG_API = BASE_URL + '/api/musicBlog';

    let editingId = null;

    // DOM Elements
    const form = document.getElementById('selectedWorkForm');
    const workTitle = document.getElementById('workTitle');
    const workDescription = document.getElementById('workDescription');
    const workLink = document.getElementById('workLink');
    const workImage = document.getElementById('workImage');
    const workImageLabel = document.getElementById('workImageLabel');
    const workImagePreviewWrap = document.getElementById('workImagePreviewWrap');
    const workImagePreview = document.getElementById('workImagePreview');
    const workImageChangeBtn = document.getElementById('workImageChangeBtn');
    const workImageCancelBtn = document.getElementById('workImageCancelBtn');
    const submitBtn = document.getElementById('selectedWorkSubmitBtn');
    const cancelEditBtn = document.getElementById('selectedWorkCancelEdit');
    const selectedWorkList = document.getElementById('selectedWorkList');

    // ─── Image Preview ───────────────────────────────────────────────
    workImage.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            workImagePreview.src = e.target.result;
            workImagePreviewWrap.style.display = 'block';
            workImageLabel.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    workImageChangeBtn.addEventListener('click', function () {
        workImage.click();
    });

    workImageCancelBtn.addEventListener('click', function () {
        workImage.value = '';
        workImagePreview.src = '';
        workImagePreviewWrap.style.display = 'none';
        workImageLabel.style.display = 'block';
    });

    // ─── Load All Selected Work ───────────────────────────────────────
    async function loadSelectedWork() {
        try {
            selectedWorkList.innerHTML = '<p class="empty-message">Loading...</p>';

            const response = await fetch(MUSIC_BLOG_API);
            const data = await response.json();

            if (!data.length) {
                selectedWorkList.innerHTML = '<p class="empty-message">No selected work added yet.</p>';
                return;
            }

            selectedWorkList.innerHTML = '';

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <div class="item-info">
                        ${item.workImageLabel
                            ? `<img src="${item.workImageLabel}" alt="${item.workTitle}" class="item-thumbnail">`
                            : '<div class="item-thumbnail no-image">No Image</div>'
                        }
                        <div class="item-details">
                            <h3>${item.workTitle}</h3>
                            <p>${item.workDescription}</p>
                            <a href="${item.workLink}" target="_blank" class="item-link">🔗 View Project</a>
                        </div>
                    </div>
                    <div class="item-actions">
                        <button class="btn edit-btn" data-id="${item._id}">✏️ Edit</button>
                        <button class="btn-delete delete-btn" data-id="${item._id}">🗑️ Delete</button>
                    </div>
                `;
                selectedWorkList.appendChild(card);
            });

            // Attach delete listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteWork(btn.dataset.id));
            });

            // Attach edit listeners
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => startEdit(btn.dataset.id, data));
            });

        } catch (error) {
            selectedWorkList.innerHTML = '<p class="empty-message">Failed to load data.</p>';
            console.error('Load error:', error);
        }
    }

    // ─── Create / Update ─────────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('workTitle', workTitle.value.trim());
        formData.append('workDescription', workDescription.value.trim());
        formData.append('workLink', workLink.value.trim());

        if (workImage.files[0]) {
            formData.append('musicImg', workImage.files[0]);
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = editingId ? '⏳ Updating...' : '⏳ Saving...';

            const url = editingId ? `${MUSIC_BLOG_API}/${editingId}` : MUSIC_BLOG_API;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, { method, body: formData });
            const data = await response.json();

            if (response.ok) {
                showFlashMessage(editingId ? 'Work updated successfully!' : 'Work added successfully!');
                resetForm();
                loadSelectedWork();
            } else {
                showFlashMessage(data.message || 'Something went wrong', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Submit error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✔ Save Selected Work';
        }
    });

    // ─── Delete ───────────────────────────────────────────────────────
    async function deleteWork(id) {
        if (!confirm('Are you sure you want to delete this work?')) return;

        try {
            const response = await fetch(`${MUSIC_BLOG_API}/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                showFlashMessage('Work deleted successfully!');
                loadSelectedWork();
            } else {
                showFlashMessage(data.message || 'Delete failed', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Delete error:', error);
        }
    }

    // ─── Edit ─────────────────────────────────────────────────────────
    function startEdit(id, data) {
        const item = data.find(i => i._id === id);
        if (!item) return;

        editingId = id;

        workTitle.value = item.workTitle;
        workDescription.value = item.workDescription;
        workLink.value = item.workLink;

        // Show existing image in preview
        if (item.workImageLabel) {
            workImagePreview.src = item.workImageLabel;
            workImagePreviewWrap.style.display = 'block';
            workImageLabel.style.display = 'none';
        }

        submitBtn.textContent = '✔ Update Selected Work';
        cancelEditBtn.style.display = 'inline-block';

        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    // ─── Cancel Edit ──────────────────────────────────────────────────
    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        editingId = null;
        form.reset();
        workImagePreview.src = '';
        workImagePreviewWrap.style.display = 'none';
        workImageLabel.style.display = 'block';
        submitBtn.textContent = '✔ Save Selected Work';
        cancelEditBtn.style.display = 'none';
    }

    // ─── Init ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', loadSelectedWork);

})();