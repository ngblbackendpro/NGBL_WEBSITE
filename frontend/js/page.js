(function () {
const { BASE_URL, API } = window.APP_CONFIG;

const params = new URLSearchParams(window.location.search);
const type = document.body.dataset.pageType || params.get("type");

const pageMap = {
    faq: {
        title: "Frequently Asked Questions",
        api: API.FAQ,
        fallbackContent: `
            <h2>General Questions</h2>
            <p>NGBL partners with businesses on brand strategy, marketing execution, digital growth, creative production, and consulting engagements.</p>
            <h3>How do I get started?</h3>
            <p>You can contact the team through the website contact form or WhatsApp link to discuss your goals and preferred timeline.</p>
            <h3>Do you work with businesses of different sizes?</h3>
            <p>Yes. We support startups, growing teams, and established brands with solutions tailored to their current stage.</p>
            <h3>How are projects scoped?</h3>
            <p>Each engagement is reviewed based on business goals, deliverables, timeline, and required support so the proposed scope matches the work involved.</p>
        `
    },
    privacy: {
        title: "Privacy Policy",
        api: API.PRIVACY,
        fallbackContent: `
            <h2>Information We Collect</h2>
            <p>NGBL may collect contact details and project information you voluntarily provide through forms, direct messages, or service enquiries.</p>
            <h3>How Information Is Used</h3>
            <p>We use submitted information to respond to enquiries, manage service discussions, improve communication, and support ongoing client relationships.</p>
            <h3>Data Protection</h3>
            <p>Reasonable administrative and technical safeguards are applied to protect information from unauthorized access, misuse, or disclosure.</p>
            <h3>Third-Party Services</h3>
            <p>Some tools used for communication, analytics, or hosting may process limited information as part of delivering the website and related services.</p>
        `
    },
    terms: {
        title: "Terms and Conditions",
        api: API.TERMS,
        fallbackContent: `
            <h2>Use of This Website</h2>
            <p>By accessing this website, you agree to use it lawfully and in a manner that does not interfere with the availability or security of the service.</p>
            <h3>Service Information</h3>
            <p>Project descriptions, timelines, and service references are provided for general information and may change as offerings evolve.</p>
            <h3>Intellectual Property</h3>
            <p>Website content, branding, visuals, and related materials remain the property of NGBL or the relevant rights holders unless stated otherwise.</p>
            <h3>Contact</h3>
            <p>If you need clarification about these terms, please contact NGBL through the official contact channels listed on the website.</p>
        `
    }
};

if (type && pageMap[type]) {
    fetch(BASE_URL + pageMap[type].api)
        .then(res => res.json())
        .then(data => {
            const titleElement = document.getElementById("pageTitle");
            const contentElement = document.getElementById("pageContent");

            if (titleElement) {
                titleElement.textContent = pageMap[type].title;
                document.title = `${pageMap[type].title} - NGBL`;
            }

            if (contentElement) {
                const apiContent = data && typeof data.content === "string" ? data.content.trim() : "";
                contentElement.innerHTML = apiContent || pageMap[type].fallbackContent;
            }
        })
        .catch(err => {
            console.error(err);
            const contentElement = document.getElementById("pageContent");
            if (contentElement) {
                contentElement.innerHTML = pageMap[type].fallbackContent;
            }
        });
}

})();