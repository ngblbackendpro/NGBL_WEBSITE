(function () {

    const { BASE_URL } = window.APP_CONFIG;

    async function loadSelectedWork() {
        const grid = document.getElementById("selectedWorkGrid");
        if (!grid) return;

        try {
            const response = await fetch(`${BASE_URL}/api/musicBlog`);

            if (!response.ok) {
                throw new Error("Failed to fetch selected work");
            }

            const works = await response.json();

            grid.innerHTML = "";

            if (!Array.isArray(works) || works.length === 0) {
                grid.innerHTML = "<p>No work available</p>";
                return;
            }

            works.forEach(item => {
                const card = document.createElement("div");
                card.className = "selected-work-card";

                const imageUrl = item.workImageLabel
                    ? `${BASE_URL}/${item.workImageLabel.replace(/\\/g, '/')}`
                    : "";

                card.innerHTML = `
                    <div class="work-image">
                        ${imageUrl 
                            ? `<img src="${imageUrl}" alt="${item.workTitle}" loading="lazy">`
                            : `<div class="no-image">No Image</div>`
                        }
                    </div>

                    <div class="work-content">
                        <h3>${item.workTitle || "Untitled"}</h3>
                        <p>${item.workDescription || ""}</p>

                        ${item.workLink 
                            ? `<a href="${item.workLink}" target="_blank" rel="noopener noreferrer">View Project</a>`
                            : ""
                        }
                    </div>
                `;

                grid.appendChild(card);
            });

        } catch (error) {
            console.error("Error loading selected work:", error);
            grid.innerHTML = "<p>Failed to load work</p>";
        }
    }

    document.addEventListener("DOMContentLoaded", loadSelectedWork);

})();