const BASE_URL = window.APP_CONFIG.BASE_URL;
const API_URL = BASE_URL + window.APP_CONFIG.API.BLOGS;

document.addEventListener("DOMContentLoaded", () => {
    loadArticles();
});

function sortBlogsNewestFirst(blogs) {
    return [...blogs].sort((left, right) => {
        const leftDate = new Date(left.createdAt || left.date || 0).getTime();
        const rightDate = new Date(right.createdAt || right.date || 0).getTime();
        return rightDate - leftDate;
    });
}

function buildBlogImageUrl(blog) {
    if (!blog.image) {
        return "img/ngblfav.png";
    }

    if (/^https?:\/\//i.test(blog.image)) {
        return blog.image;
    }

    return `${BASE_URL}/uploads/${String(blog.image).replace(/^\/+/, "")}`;
}

function buildBlogDetailUrl(blogId) {
    return `blog-details.html?id=${encodeURIComponent(blogId)}`;
}

function buildBlogCard(blog) {
    const article = document.createElement("article");
    const detailUrl = buildBlogDetailUrl(blog._id);

    article.className = "blog-card";
    article.setAttribute("data-id", blog._id);
    article.tabIndex = 0;
    article.setAttribute("role", "link");
    article.setAttribute("aria-label", `Read blog: ${blog.title}`);

    article.innerHTML = `
        <div class="blog-image-wrapper">
            <img src="${buildBlogImageUrl(blog)}"
                 alt="${blog.title}"
                 class="blog-image"
                 loading="lazy">
            <div class="blog-overlay"></div>
        </div>
        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-date">
                    <i class="far fa-calendar"></i>
                    ${new Date(blog.date || blog.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <span class="blog-category">${blog.category || "Insights"}</span>
            </div>
            <h3 class="blog-title">${blog.title}</h3>
            <p class="blog-excerpt">${blog.description || "Read the full story for more details."}</p>
            <div class="blog-card-actions">
                <a href="${detailUrl}" class="blog-read-more" aria-label="Read more about ${blog.title}">
                    Read More
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    `;

    const goToDetail = () => {
        window.location.href = detailUrl;
    };

    article.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            return;
        }

        goToDetail();
    });

    article.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            goToDetail();
        }
    });

    return article;
}

async function loadArticles() {
    const container = document.getElementById("articlesContainer");
    if (!container) {
        return;
    }

    const limit = Number.parseInt(container.dataset.limit || "0", 10);
    const skip = Number.parseInt(container.dataset.skip || "0", 10);

    try {
        const response = await fetch(API_URL);
        const blogs = sortBlogsNewestFirst(await response.json());
        const visibleBlogs = blogs.slice(skip, limit > 0 ? skip + limit : undefined);

        if (!visibleBlogs.length) {
            container.innerHTML = '<p class="blog-empty-state">No blogs available right now.</p>';
            return;
        }

        container.innerHTML = "";

        visibleBlogs.forEach((blog) => {
            container.appendChild(buildBlogCard(blog));
        });

    } catch (error) {
        container.innerHTML = '<p class="blog-empty-state">Error loading blogs.</p>';
    }
}
