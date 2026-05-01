(function () {
    const { BASE_URL } = window.ADMIN_CONFIG;
    const PARTNERS_API = BASE_URL + '/api/musicPartner';

    // DOM Elements
    const form = document.getElementById('partnerForm');
    const partnerImage = document.getElementById('partnerImage');
    const partnerFileLabel = document.getElementById('partnerFileLabel');
    const partnerPreviewWrap = document.getElementById('partnerPreviewWrap');
    const partnerImagePreview = document.getElementById('partnerImagePreview');
    const partnerChangeBtn = document.getElementById('partnerChangeBtn');
    const partnerCancelBtn = document.getElementById('partnerCancelBtn');
    const submitBtn = document.getElementById('submitBtn');
    const partnersList = document.getElementById('partnersList');

    // ─── Image Preview ────────────────────────────────────────────────
    partnerImage.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            partnerImagePreview.src = e.target.result;
            partnerPreviewWrap.style.display = 'block';
            partnerFileLabel.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    partnerChangeBtn.addEventListener('click', function () {
        partnerImage.click();
    });

    partnerCancelBtn.addEventListener('click', function () {
        partnerImage.value = '';
        partnerImagePreview.src = '';
        partnerPreviewWrap.style.display = 'none';
        partnerFileLabel.style.display = 'block';
    });

    // ─── Load All Partners ────────────────────────────────────────────
    async function loadPartners() {
        try {
            partnersList.innerHTML = '<p class="empty-message">Loading...</p>';

            const response = await fetch(PARTNERS_API);
            const data = await response.json();

            if (!data.length) {
                partnersList.innerHTML = '<p class="empty-message">No partner logos uploaded yet.</p>';
                return;
            }

            partnersList.innerHTML = '';

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card media-card partner-card';
                card.innerHTML = `
                    <img src="${item.image}" alt="Partner Logo" class="media-thumb partner-thumb">
                    <div class="item-actions" style="margin-top: 12px;">
                        <button class="btn-delete delete-btn" data-id="${item._id}">🗑️ Delete</button>
                    </div>
                `;
                partnersList.appendChild(card);
            });

            // Attach delete listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deletePartner(btn.dataset.id));
            });

        } catch (error) {
            partnersList.innerHTML = '<p class="empty-message">Failed to load partners.</p>';
            console.error('Load error:', error);
        }
    }

    // ─── Create ───────────────────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!partnerImage.files[0]) {
            showFlashMessage('Please select a logo image to upload.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('image', partnerImage.files[0]);

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Uploading...';

            const response = await fetch(PARTNERS_API, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showFlashMessage('Partner logo uploaded successfully!');
                resetForm();
                loadPartners();
            } else {
                showFlashMessage(data.message || 'Something went wrong', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Submit error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✔ Save Partner Logo';
        }
    });

    // ─── Delete ───────────────────────────────────────────────────────
    async function deletePartner(id) {
        if (!confirm('Are you sure you want to delete this partner logo?')) return;

        try {
            const response = await fetch(`${PARTNERS_API}/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                showFlashMessage('Partner logo deleted successfully!');
                loadPartners();
            } else {
                showFlashMessage(data.message || 'Delete failed', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Delete error:', error);
        }
    }

    // ─── Reset Form ───────────────────────────────────────────────────
    function resetForm() {
        form.reset();
        partnerImage.value = '';
        partnerImagePreview.src = '';
        partnerPreviewWrap.style.display = 'none';
        partnerFileLabel.style.display = 'block';
    }

    // ─── Init ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', loadPartners);

})();
