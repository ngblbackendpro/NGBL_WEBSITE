(function () {
    const BASE_URL = window.APP_CONFIG.BASE_URL;
    const COMPLIANCE_API = BASE_URL + '/api/musicCompliance';

    document.addEventListener('DOMContentLoaded', async function () {
        const list = document.getElementById('complianceLinks');
        if (!list) return;

        try {
            const response = await fetch(COMPLIANCE_API);
            const sections = await response.json();

            if (!sections.length) {
                list.innerHTML = '<li><p style="color:#888;">No sections available.</p></li>';
                return;
            }

            list.innerHTML = sections.map(section => {
                // Convert "Compliance in Brand Shoot" → "compliance-in-brand-shoot"
                const slug = section.sectionKey
                    .toLowerCase()
                    .replace(/\s+/g, '-')        // spaces to hyphens
                    .replace(/[^a-z0-9-]/g, ''); // remove special chars

                return `
                    <li>
                        <a href="music-compliance.html#${slug}">
                            ${escapeHtml(section.sectionKey)}
                        </a>
                    </li>
                `;
            }).join('');

        } catch (error) {
            console.error('Failed to load compliance links:', error);
            list.innerHTML = '';
        }
    });

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();