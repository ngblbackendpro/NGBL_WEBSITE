// const BASE_URL = window.location.hostname === "localhost"
//     ? "http://localhost:5000"
//     : "https://yourdomain.com";
const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.BLOGS;


document.addEventListener("DOMContentLoaded", () => {
    loadArticles();
});

async function loadArticles() {
    const container = document.getElementById("articlesContainer");

    try {
        const response = await fetch(API_URL);
        const blogs = await response.json();

        if (!blogs.length) {
            container.innerHTML = "<p>No articles available.</p>";
            return;
        }

        container.innerHTML = "";

        blogs.forEach(blog => {
            const card = document.createElement("article");
            card.className = "blog-card";
            card.setAttribute("data-id", blog._id);

            card.innerHTML = `
                <div class="blog-image-wrapper">
                    <img src="${BASE_URL}/uploads/${blog.image}" 
                         alt="${blog.title}" 
                         class="blog-image">
                    <div class="blog-overlay">
                        <span class="read-more-badge">Read More</span>
                    </div>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="far fa-calendar"></i> 
                            ${new Date(blog.date).toLocaleDateString()}
                        </span>
                        <span class="blog-category">${blog.category}</span>
                    </div>
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.description}</p>
                </div>
            `;

            card.addEventListener("click", () => openModal(blog._id));

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = "<p>Error loading articles.</p>";
    }
}

async function openModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const blog = await response.json();

        document.getElementById("modalImage").src =
            `${BASE_URL}/uploads/${blog.image}`;
        document.getElementById("modalTitle").textContent = blog.title;
        document.getElementById("modalDate").innerHTML =
            '<i class="far fa-calendar"></i> ' +
            new Date(blog.date).toLocaleDateString();
        document.getElementById("modalCategory").textContent = blog.category;
        document.getElementById("modalContent").innerHTML = blog.content;

        document.getElementById("blogModal").classList.add("active");
        document.body.style.overflow = "hidden";

    } catch (error) {
        alert("Error loading blog");
    }
}

document.querySelector(".blog-modal-close").addEventListener("click", () => {
    document.getElementById("blogModal").classList.remove("active");
    document.body.style.overflow = "";
});

document.querySelector(".blog-modal-overlay").addEventListener("click", () => {
    document.getElementById("blogModal").classList.remove("active");
    document.body.style.overflow = "";
});
