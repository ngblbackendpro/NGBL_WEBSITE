(function () {

    const { BASE_URL, API } = window.APP_CONFIG;

    async function loadMedia() {
        const grid = document.getElementById("mediaGrid");
        if (!grid) return;

        try {
            const response = await fetch(BASE_URL + API.MEDIA);

            if (!response.ok) {
                throw new Error("Failed to fetch media");
            }

            const media = await response.json();

            grid.innerHTML = "";

            if (!Array.isArray(media) || media.length === 0) {
                grid.innerHTML = "<p>No media available</p>";
                return;
            }

            media.forEach(item => {
                const tile = document.createElement("div");
                tile.className = "logo-tile";

                tile.innerHTML = `
                    <img 
                        src="${BASE_URL}/${item.image.replace(/\\/g, '/')}" 
                        alt="Media Logo"
                        loading="lazy"
                        style="max-width:100%; height:auto;"
                    >
                `;

                grid.appendChild(tile);
            });

        } catch (error) {
            console.error("Error loading media:", error);
            grid.innerHTML = "<p>Failed to load media</p>";
        }
    }

    document.addEventListener("DOMContentLoaded", loadMedia);

})();