(function () {
    const BASE_URL = window.APP_CONFIG.BASE_URL;
    const MUSIC_CONTACT_API = BASE_URL + '/api/musicContact';
 
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('.music-work-form');
        if (!form) return;
 
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
 
            const submitBtn = form.querySelector('button[type="submit"]');
 
            // Collect all form values
            const payload = {
                name:            form.querySelector('[name="name"]').value.trim(),
                projectName:     form.querySelector('[name="projectName"]').value.trim(),
                role:            form.querySelector('[name="role"]').value,
                requirementType: form.querySelector('[name="requirementType"]').value,
                genreLanguage:   form.querySelector('[name="genreLanguage"]').value.trim(),
                budget:          form.querySelector('[name="budget"]').value.trim(),
                timeline:        form.querySelector('[name="timeline"]').value.trim(),
                contact:         form.querySelector('[name="contact"]').value.trim(),
                portfolio:       form.querySelector('[name="portfolio"]').value.trim(),
                brief:           form.querySelector('[name="brief"]').value.trim(),
            };
 
            // Basic frontend validation
            if (!payload.name || !payload.contact) {
                showMessage(form, 'Name and Contact are required.', 'error');
                return;
            }
 
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = '⏳ Submitting...';
 
                const response = await fetch(MUSIC_CONTACT_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
 
                const data = await response.json();
 
                if (response.ok) {
                    form.reset();
                    showMessage(form, '✅ Your inquiry has been submitted! We will get back to you soon.', 'success');
                } else {
                    showMessage(form, data.message || 'Something went wrong. Please try again.', 'error');
                }
 
            } catch (error) {
                showMessage(form, 'Server error. Please try again later.', 'error');
                console.error('Music contact form error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Music Inquiry';
            }
        });
    });
 
    // ─── Show inline message below form ──────────────────────────────
    function showMessage(form, message, type) {
        // Remove existing message if any
        const existing = form.parentNode.querySelector('.music-form-message');
        if (existing) existing.remove();
 
        const msg = document.createElement('p');
        msg.className = 'music-form-message';
        msg.textContent = message;
        msg.style.cssText = `
            margin-top: 14px;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;
 
        form.insertAdjacentElement('afterend', msg);
 
        // Auto remove after 5 seconds
        setTimeout(() => msg.remove(), 5000);
    }
 
})();