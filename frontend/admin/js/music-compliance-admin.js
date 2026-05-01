(function () {
    const { BASE_URL } = window.ADMIN_CONFIG;
    const COMPLIANCE_API = BASE_URL + '/api/musicCompliance';

    let editingKey = null;

    // DOM Elements
    const form = document.getElementById('complianceForm');
    const sectionKeyInput = document.getElementById('sectionKeyInput');
    const contentInput = document.getElementById('contentInput');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const sectionsList = document.getElementById('sectionsList');
    const formTitle = document.getElementById('formTitle');

    // ─── Load All Sections ────────────────────────────────────────────
    async function loadSections() {
        try {
            sectionsList.innerHTML = '<p class="empty-message">Loading...</p>';

            const response = await fetch(COMPLIANCE_API);
            const data = await response.json();

            if (!data.length) {
                sectionsList.innerHTML = '<p class="empty-message">No sections added yet.</p>';
                return;
            }

            sectionsList.innerHTML = '';

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <div class="item-info">
                        <p class="compliance-section-badge">${item.sectionKey}</p>
                        <p class="item-text">${item.content}</p>
                    </div>
                    <div class="item-actions" style="margin-top: 12px;">
                        <button class="btn-edit edit-btn" data-key="${item.sectionKey}">✏️ Edit</button>
                        <button class="btn-delete delete-btn" data-key="${item.sectionKey}">🗑️ Delete</button>
                    </div>
                `;
                sectionsList.appendChild(card);
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteSection(btn.dataset.key));
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => startEdit(btn.dataset.key, data));
            });

        } catch (error) {
            sectionsList.innerHTML = '<p class="empty-message">Failed to load sections.</p>';
            console.error('Load error:', error);
        }
    }

    // ─── Create / Update ─────────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const sectionKey = sectionKeyInput.value.trim();
        const content = contentInput.value.trim();

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = editingKey ? '⏳ Updating...' : '⏳ Saving...';

            let response;

            if (editingKey) {
                // PUT — only content, key is in the URL
                response = await fetch(`${COMPLIANCE_API}/${editingKey}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });
            } else {
                // POST — both sectionKey and content
                response = await fetch(COMPLIANCE_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sectionKey, content })
                });
            }

            const data = await response.json();

            if (response.ok) {
                showFlashMessage(editingKey ? 'Section updated successfully!' : 'Section added successfully!');
                resetForm();
                loadSections();
            } else {
                showFlashMessage(data.message || 'Something went wrong', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Submit error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✔ Save Section';
        }
    });

    // ─── Delete ───────────────────────────────────────────────────────
    async function deleteSection(key) {
        if (!confirm(`Are you sure you want to delete "${key}"?`)) return;

        try {
            const response = await fetch(`${COMPLIANCE_API}/${key}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                showFlashMessage('Section deleted successfully!');
                loadSections();
            } else {
                showFlashMessage(data.message || 'Delete failed', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Delete error:', error);
        }
    }

    // ─── Start Edit ───────────────────────────────────────────────────
    function startEdit(key, data) {
        const item = data.find(i => i.sectionKey === key);
        if (!item) return;

        editingKey = key;
        sectionKeyInput.value = key;
        contentInput.value = item.content;

        // Make key readonly during edit — can't change sectionKey
        sectionKeyInput.readOnly = true;
        sectionKeyInput.style.background = '#f0f0f0';
        sectionKeyInput.style.cursor = 'not-allowed';

        formTitle.textContent = '✏️ Edit Section';
        submitBtn.textContent = '✔ Update Section';
        cancelEditBtn.style.display = 'inline-block';

        form.scrollIntoView({ behavior: 'smooth' });
    }

    // ─── Cancel Edit ──────────────────────────────────────────────────
    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        editingKey = null;
        form.reset();

        // Re-enable the key input
        sectionKeyInput.readOnly = false;
        sectionKeyInput.style.background = '';
        sectionKeyInput.style.cursor = '';

        formTitle.textContent = '➕ Add New Compliance Section';
        submitBtn.textContent = '✔ Save Section';
        cancelEditBtn.style.display = 'none';
    }

    // ─── Init ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', loadSections);

})();
