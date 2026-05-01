(function () {
    const { BASE_URL } = window.ADMIN_CONFIG;
    const MEDIA_API = BASE_URL + '/api/musicMedia';

    let editingId = null;

    // DOM Elements
    const form = document.getElementById('mediaForm');
    const mediaImage = document.getElementById('mediaImage');
    const mediaFileLabel = document.getElementById('mediaFileLabel');
    const mediaPreviewWrap = document.getElementById('mediaPreviewWrap');
    const mediaImagePreview = document.getElementById('mediaImagePreview');
    const mediaChangeBtn = document.getElementById('mediaChangeBtn');
    const mediaCancelBtn = document.getElementById('mediaCancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const mediaList = document.getElementById('mediaList');
    const formTitle = document.getElementById('formTitle');

    // ─── Image Preview ────────────────────────────────────────────────
    mediaImage.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            mediaImagePreview.src = e.target.result;
            mediaPreviewWrap.style.display = 'block';
            mediaFileLabel.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    mediaChangeBtn.addEventListener('click', function () {
        mediaImage.click();
    });

    mediaCancelBtn.addEventListener('click', function () {
        mediaImage.value = '';
        mediaImagePreview.src = '';
        mediaPreviewWrap.style.display = 'none';
        mediaFileLabel.style.display = 'block';
    });

    // ─── Load All Media ───────────────────────────────────────────────
    async function loadMedia() {
        try {
            mediaList.innerHTML = '<p class="empty-message">Loading...</p>';

            const response = await fetch(MEDIA_API);
            const data = await response.json();

            if (!data.length) {
                mediaList.innerHTML = '<p class="empty-message">No media uploaded yet.</p>';
                return;
            }

            mediaList.innerHTML = '';

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card media-card';
                card.innerHTML = `
                    <img src="${item.image}" alt="Media Image" class="media-thumb">
                    <div class="item-actions" style="margin-top: 12px;">
                        <button class="btn-edit edit-btn" data-id="${item._id}" data-img="${item.image}">✏️ Edit</button>
                        <button class="btn-delete delete-btn" data-id="${item._id}">🗑️ Delete</button>
                    </div>
                `;
                mediaList.appendChild(card);
            });

            // Attach listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteMedia(btn.dataset.id));
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => startEdit(btn.dataset.id, btn.dataset.img));
            });

        } catch (error) {
            mediaList.innerHTML = '<p class="empty-message">Failed to load media.</p>';
            console.error('Load error:', error);
        }
    }

    // ─── Create / Update ─────────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!mediaImage.files[0] && !editingId) {
            showFlashMessage('Please select an image to upload.', 'error');
            return;
        }

        // If editing but no new file selected, warn user
        if (editingId && !mediaImage.files[0]) {
            showFlashMessage('Please select a new image to replace the existing one.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('image', mediaImage.files[0]);

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = editingId ? '⏳ Updating...' : '⏳ Uploading...';

            const url = editingId ? `${MEDIA_API}/${editingId}` : MEDIA_API;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, { method, body: formData });
            const data = await response.json();

            if (response.ok) {
                showFlashMessage(editingId ? 'Media updated successfully!' : 'Media uploaded successfully!');
                resetForm();
                loadMedia();
            } else {
                showFlashMessage(data.message || 'Something went wrong', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Submit error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✔ Save Media';
        }
    });

    // ─── Delete ───────────────────────────────────────────────────────
    async function deleteMedia(id) {
        if (!confirm('Are you sure you want to delete this media?')) return;

        try {
            const response = await fetch(`${MEDIA_API}/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                showFlashMessage('Media deleted successfully!');
                loadMedia();
            } else {
                showFlashMessage(data.message || 'Delete failed', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Delete error:', error);
        }
    }

    // ─── Start Edit ───────────────────────────────────────────────────
    function startEdit(id, imgUrl) {
        editingId = id;

        // Show current image in preview
        mediaImagePreview.src = imgUrl;
        mediaPreviewWrap.style.display = 'block';
        mediaFileLabel.style.display = 'none';

        formTitle.textContent = '✏️ Replace Media Image';
        submitBtn.textContent = '✔ Update Media';
        cancelEditBtn.style.display = 'inline-block';

        form.scrollIntoView({ behavior: 'smooth' });
    }

    // ─── Cancel Edit ──────────────────────────────────────────────────
    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        editingId = null;
        form.reset();
        mediaImage.value = '';
        mediaImagePreview.src = '';
        mediaPreviewWrap.style.display = 'none';
        mediaFileLabel.style.display = 'block';
        formTitle.textContent = '➕ Upload New Media';
        submitBtn.textContent = '✔ Save Media';
        cancelEditBtn.style.display = 'none';
    }

    // ─── Init ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', loadMedia);

})();
