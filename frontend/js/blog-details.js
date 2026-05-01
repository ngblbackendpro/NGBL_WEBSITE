// blog-details.js
// Handles loading and displaying a single blog article on blog-details.html

const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.BLOGS;

document.addEventListener("DOMContentLoaded", () => {
    loadBlogDetail();
});

async function loadBlogDetail() {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");
    const card = document.getElementById("blogDetailCard");
    const state = document.getElementById("blogDetailState");
    if (!blogId) {
        state.innerHTML = '<p class="blog-empty-state">Blog not found.</p>';
        card.hidden = true;
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(blogId)}`);
        if (!response.ok) throw new Error("Not found");
        const blog = await response.json();
        document.getElementById("blogDetailImage").src = blog.image ? (blog.image.startsWith("http") ? blog.image : `${BASE_URL}/uploads/${blog.image}`) : "img/ngblfav.png";
        document.getElementById("blogDetailImage").alt = blog.title || "Blog image";
        document.getElementById("blogDetailTitle").textContent = blog.title || "Untitled";
        document.getElementById("blogDetailDescription").textContent = blog.description || "";
        document.getElementById("blogDetailContent").innerHTML = blog.content || "";
        document.getElementById("blogDetailDate").innerHTML = `<i class='far fa-calendar'></i> ${new Date(blog.date || blog.createdAt || Date.now()).toLocaleDateString()}`;
        document.getElementById("blogDetailCategory").innerHTML = `<i class='fas fa-tag'></i> ${blog.category || "Insights"}`;
        document.getElementById("blogDetailAuthor").innerHTML = `<i class='far fa-user'></i> ${blog.author || "NGBL Team"}`;
        card.hidden = false;
        state.style.display = "none";
    } catch (e) {
        state.innerHTML = '<p class="blog-empty-state">Blog not found or failed to load.</p>';
        card.hidden = true;
    }
}
