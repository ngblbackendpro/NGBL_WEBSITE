(function () {
    const BASE_URL = window.APP_CONFIG.BASE_URL;
    const COMPLIANCE_API = BASE_URL + '/api/musicCompliance';

    document.addEventListener('DOMContentLoaded', async function () {
        const contentArea = document.getElementById('complianceContent');
        const sideNav = document.getElementById('complianceSideNav');

        if (!contentArea) return;

        try {
            const response = await fetch(COMPLIANCE_API);
            const sections = await response.json();

            if (!sections.length) {
                contentArea.innerHTML = '<p style="color:#888;">No compliance sections available yet.</p>';
                return;
            }

            // Build slug for each section
            const sectionsWithSlugs = sections.map(section => ({
                ...section,
                slug: section.sectionKey
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
            }));

            // ── Render sidebar nav links ──────────────────────────────
            if (sideNav) {
                sideNav.innerHTML = sectionsWithSlugs.map(s => `
                    <a href="#${s.slug}" class="compliance-nav-link" data-slug="${s.slug}">
                        ${escapeHtml(s.sectionKey)}
                    </a>
                `).join('');

                // Highlight active link on click
                sideNav.querySelectorAll('.compliance-nav-link').forEach(link => {
                    link.addEventListener('click', function () {
                        sideNav.querySelectorAll('.compliance-nav-link')
                            .forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
            }

            // ── Determine which section to show ───────────────────────
            // Get hash from URL e.g. #compliance-brand-shoot
            const currentHash = window.location.hash.replace('#', '');

            // Find matching section or default to first
            const activeSection = sectionsWithSlugs.find(s => s.slug === currentHash)
                || sectionsWithSlugs[0];

            // ── Render only the active section ────────────────────────
            showSection(activeSection, contentArea, sideNav);

            // ── Listen for hash changes (when user clicks sidebar) ────
            window.addEventListener('hashchange', function () {
                const newHash = window.location.hash.replace('#', '');
                const target = sectionsWithSlugs.find(s => s.slug === newHash)
                    || sectionsWithSlugs[0];
                showSection(target, contentArea, sideNav);
            });

        } catch (error) {
            console.error('Failed to load compliance sections:', error);
            if (contentArea) {
                contentArea.innerHTML = '<p style="color:#888;">Failed to load content. Please try again.</p>';
            }
        }
    });

    // ── Show a single section, hide others ───────────────────────────
    function showSection(section, contentArea, sideNav) {
        contentArea.innerHTML = `
            <section id="${section.slug}" class="compliance-section-block">
                <h2>${escapeHtml(section.sectionKey)}</h2>
                <p>${escapeHtml(section.content)}</p>
            </section>
        `;

        // Highlight matching sidebar link
        if (sideNav) {
            sideNav.querySelectorAll('.compliance-nav-link').forEach(link => {
                link.classList.toggle('active', link.dataset.slug === section.slug);
            });
        }

            // ✅ Replace with this — scrolls to top of page when section changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();
