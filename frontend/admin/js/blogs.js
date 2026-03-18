(function () {

const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.BLOGS;

let blogSelectedImageData = null;


document.addEventListener('DOMContentLoaded', function () {
    setupFormListener();
    setupBlogImagePreview();
    displayBlogs();
});

function setupFormListener() {
    const form = document.getElementById('addBlogForm');
    
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const title = document.getElementById('blogTitle').value;
            const author = document.getElementById('blogAuthor').value;
            const date = document.getElementById('blogDate').value;
            const category = document.getElementById('blogCategory').value;
            const description = document.getElementById('blogDescription').value;
            const content = document.getElementById('blogContent').value;
            const tags = document.getElementById('blogTags').value;
            const imageFile = document.getElementById('blogImage').files[0];

            if (!title || !author || !date || !category || !description || !content || !imageFile) {
                showFlashMessage('Please fill all required fields', 'error');
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("author", author);
            formData.append("date", date);
            formData.append("category", category);
            formData.append("description", description);
            formData.append("content", content);
            formData.append("tags", tags);
            formData.append("image", imageFile);

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showFlashMessage('✔ Blog published successfully!');
                    form.reset();
                    blogSelectedImageData = null;
                    document.getElementById('blogImagePreview').style.display = 'none';
                    document.getElementById('blogFileLabel').style.display = 'block';
                    displayBlogs();
                } else {
                    showFlashMessage(data.error || "Error publishing blog", 'error');
                }

            } catch (error) {
                showFlashMessage("Server error. Please try again.", 'error');
            }
        });
    }
}


function setupBlogImagePreview() {
    const fileInput = document.getElementById('blogImage');
    const previewDiv = document.getElementById('blogImagePreview');
    const previewImg = document.getElementById('blogPreviewImg');
    const fileLabel = document.getElementById('blogFileLabel');
    const changeBtn = document.getElementById('changeBlogImage');
    const cancelBtn = document.getElementById('cancelBlogImage');

    if (!fileInput) return;

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                blogSelectedImageData = event.target.result;
                previewImg.src = blogSelectedImageData;

                previewDiv.style.display = 'block';
                fileLabel.style.display = 'none';
            };

            reader.readAsDataURL(file);
        }
    });

    // Change Image
    changeBtn.addEventListener('click', function () {
        fileInput.click();
    });

    // Cancel Image
    cancelBtn.addEventListener('click', function () {
        fileInput.value = '';
        blogSelectedImageData = null;
        previewImg.src = '';

        previewDiv.style.display = 'none';
        fileLabel.style.display = 'block';
    });
}


async function displayBlogs() {
    const container = document.getElementById('blogsList');
    container.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        const blogs = await response.json();

        if (!blogs.length) {
            container.innerHTML = '<p class="empty-message">No blogs published yet. Publish your first blog above!</p>';
            return;
        }

        blogs.forEach(blog => {
            const card = document.createElement('div');
            card.className = 'item-card';

            card.innerHTML = `
                ${blog.image 
                    ? `<img src="${blog.image}" alt="${blog.title}">`
                    : `<div style="height:200px;background:#eee;display:flex;align-items:center;justify-content:center;">No Image</div>`
                }

                <div class="item-title">${blog.title}</div>
                <div class="item-text"><strong>Author:</strong> ${blog.author}</div>
                <div class="item-text">
                    <strong>Category:</strong> 
                    <span style="background:#667eea;color:white;padding:2px 8px;border-radius:3px;font-size:12px;">
                        ${blog.category}
                    </span>
                </div>
                <div class="item-text">${blog.description}</div>

                ${blog.tags && blog.tags.length > 0 
                    ? `<div class="item-text"><strong>Tags:</strong> ${blog.tags.join(', ')}</div>` 
                    : ''
                }

                <div class="item-meta">
                    <span>📅 ${new Date(blog.date).toLocaleDateString()}</span>
                    <span>Published: ${new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>

                <div class="item-actions">
                    <button class="btn-edit" onclick="viewBlog('${blog._id}')">👁️ View</button>
                    <button class="btn-delete" onclick="deleteBlog('${blog._id}')">🗑️ Delete</button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = '<p class="empty-message">Error loading blogs.</p>';
    }
}

async function deleteBlog(id) {
    if (confirm('Are you sure you want to delete this blog?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                showFlashMessage('✔ Blog deleted successfully!');
                displayBlogs();
            } else {
                showFlashMessage('Error deleting blog', 'error');
            }

        } catch (error) {
            showFlashMessage('Server error. Please try again.', 'error');
        }
    }
}

window.deleteBlog = deleteBlog;
window.viewBlog = viewBlog;

async function viewBlog(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const blog = await response.json();

        if (!blog) {
            showFlashMessage("Blog not found", "error");
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            padding: 20px;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 30px;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        `;

        content.innerHTML = `
            <button onclick="this.closest('div').parentElement.remove()" 
                style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:24px;cursor:pointer;">
                ✕
            </button>

            <h1 style="margin-bottom:10px;">${blog.title}</h1>

            <div style="color:#666;margin-bottom:15px;">
                <strong>Author:</strong> ${blog.author} | 
                <strong>Date:</strong> ${new Date(blog.date).toLocaleDateString()} | 
                <strong>Category:</strong> ${blog.category}
            </div>

            ${blog.image 
                ? `<img src="${blog.image}" 
                    alt="${blog.title}" 
                    style="width:100%;height:250px;object-fit:cover;border-radius:5px;margin-bottom:15px;">`
                : ''
            }

            <div style="line-height:1.8;color:#333;white-space:pre-wrap;">
                ${blog.content}
            </div>

            ${blog.tags && blog.tags.length > 0 
                ? `<div style="margin-top:15px;padding-top:15px;border-top:1px solid #eee;">
                    <strong>Tags:</strong>
                    ${blog.tags.map(tag => 
                        `<span style="background:#f0f0f0;padding:4px 8px;border-radius:3px;margin-right:5px;font-size:12px;">
                            ${tag}
                        </span>`
                    ).join('')}
                </div>`
                : ''
            }
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

    } catch (error) {
        showFlashMessage("Error loading blog", "error");
    }
}

})();