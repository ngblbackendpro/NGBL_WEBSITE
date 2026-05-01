(function () {
    const { BASE_URL } = window.ADMIN_CONFIG;
    const TESTIMONIALS_API = BASE_URL + '/api/testimonial';

    let editingId = null;

    // DOM Elements
    const form = document.getElementById('testimonialForm');
    const quoteInput = document.getElementById('quoteInput');
    const authorInput = document.getElementById('authorInput');
    const submitBtn = document.getElementById('submitBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const testimonialsList = document.getElementById('testimonialsList');
    const formTitle = document.getElementById('formTitle');

    // ─── Load All Testimonials ────────────────────────────────────────
    async function loadTestimonials() {
        try {
            testimonialsList.innerHTML = '<p class="empty-message">Loading...</p>';

            const response = await fetch(TESTIMONIALS_API);
            const data = await response.json();

            if (!data.length) {
                testimonialsList.innerHTML = '<p class="empty-message">No testimonials added yet.</p>';
                return;
            }

            testimonialsList.innerHTML = '';

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <div class="item-info">
                        <div class="testimonial-quote-icon">❝</div>
                        <p class="item-text">${item.quote}</p>
                        <p class="item-title">— ${item.author}</p>
                    </div>
                    <div class="item-actions" style="margin-top: 15px;">
                        <button class="btn-edit edit-btn" data-id="${item._id}">✏️ Edit</button>
                        <button class="btn-delete delete-btn" data-id="${item._id}">🗑️ Delete</button>
                    </div>
                `;
                testimonialsList.appendChild(card);
            });

            // Attach listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteTestimonial(btn.dataset.id));
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => startEdit(btn.dataset.id, data));
            });

        } catch (error) {
            testimonialsList.innerHTML = '<p class="empty-message">Failed to load testimonials.</p>';
            console.error('Load error:', error);
        }
    }

    // ─── Create / Update ─────────────────────────────────────────────
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const payload = {
            quote: quoteInput.value.trim(),
            author: authorInput.value.trim()
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = editingId ? '⏳ Updating...' : '⏳ Saving...';

            const url = editingId ? `${TESTIMONIALS_API}/${editingId}` : TESTIMONIALS_API;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                showFlashMessage(editingId ? 'Testimonial updated successfully!' : 'Testimonial added successfully!');
                resetForm();
                loadTestimonials();
            } else {
                showFlashMessage(data.message || 'Something went wrong', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Submit error:', error);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = editingId ? '✔ Update Testimonial' : '✔ Save Testimonial';
        }
    });

    // ─── Delete ───────────────────────────────────────────────────────
    async function deleteTestimonial(id) {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const response = await fetch(`${TESTIMONIALS_API}/${id}`, { method: 'DELETE' });
            const data = await response.json();

            if (response.ok) {
                showFlashMessage('Testimonial deleted successfully!');
                loadTestimonials();
            } else {
                showFlashMessage(data.message || 'Delete failed', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Try again.', 'error');
            console.error('Delete error:', error);
        }
    }

    // ─── Start Edit ───────────────────────────────────────────────────
    function startEdit(id, data) {
        const item = data.find(i => i._id === id);
        if (!item) return;

        editingId = id;
        quoteInput.value = item.quote;
        authorInput.value = item.author;

        formTitle.textContent = '✏️ Edit Testimonial';
        submitBtn.textContent = '✔ Update Testimonial';
        cancelEditBtn.style.display = 'inline-block';

        form.scrollIntoView({ behavior: 'smooth' });
    }

    // ─── Cancel Edit ──────────────────────────────────────────────────
    cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        editingId = null;
        form.reset();
        formTitle.textContent = '➕ Add New Testimonial';
        submitBtn.textContent = '✔ Save Testimonial';
        cancelEditBtn.style.display = 'none';
    }

    // ─── Init ─────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', loadTestimonials);

})();
