(function () {

    const { BASE_URL, API } = window.APP_CONFIG;

    async function loadTestimonials() {
        const grid = document.getElementById("testimonialGrid");
        if (!grid) return;

        try {
            const response = await fetch(BASE_URL + API.TESTIMONIALS);
            const testimonials = await response.json();

            grid.innerHTML = "";

            if (!testimonials.length) {
                grid.innerHTML = "<p>No testimonials available</p>";
                return;
            }

            testimonials.forEach(item => {
                const card = document.createElement("article");
                card.className = "testimonial-card";

                card.innerHTML = `
                    <p>"${item.quote}"</p><br><br>
                    <h3>${item.author}</h3>
                `;

                grid.appendChild(card);
            });

        } catch (error) {
            console.error("Error loading testimonials:", error);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadTestimonials);
    } else {
        loadTestimonials();
    }

})();