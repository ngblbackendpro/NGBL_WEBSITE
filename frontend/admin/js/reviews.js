(function () {

const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.REVIEWS;

let editMode = false;
let editReviewId = null;
let reviewSelectedImageData = null;

function showFlashMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flash-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    setupFormListener();
    setupReviewImagePreview();
    displayReviews();
});

function setupReviewImagePreview() {
    const fileInput = document.getElementById('reviewerImage');
    const previewDiv = document.getElementById('reviewImagePreview');
    const previewImg = document.getElementById('reviewPreviewImg');
    const uploadBtn = document.getElementById('reviewUploadBtn');
    const cancelBtn = document.getElementById('reviewCancelBtn');
    const fileInputLabel = document.getElementById('reviewFileLabel');

    if (!fileInput) return;

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                reviewSelectedImageData = event.target.result;
                previewImg.src = reviewSelectedImageData;
                previewDiv.style.display = 'block';
                fileInputLabel.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    if (uploadBtn) {
        uploadBtn.addEventListener('click', function (e) {
            e.preventDefault();
            uploadBtn.style.display = 'none';
            cancelBtn.textContent = '✕ Change Image';
            showFlashMessage('✅ Image selected successfully!', 'success');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function (e) {
            e.preventDefault();
            previewDiv.style.display = 'none';
            fileInputLabel.style.display = 'block';
            reviewSelectedImageData = null;
            fileInput.value = '';
        });
    }
}

function setupFormListener() {
    const form = document.getElementById('addReviewForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('reviewerName').value;
        const title = document.getElementById('reviewerTitle').value;
        const description = document.getElementById('reviewDescription').value;
        const rating = document.getElementById('reviewRating').value;
        const email = document.getElementById('reviewerEmail').value;
        const imageFile = document.getElementById('reviewerImage').files[0];

        if (!name || !title || !description || !rating) {
            showFlashMessage('Please fill all required fields', 'error');
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("rating", rating);
        formData.append("email", email);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const url = editMode ? `${API_URL}/${editReviewId}` : API_URL;
            const method = editMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert(editMode ? "✔ Review has Updated" : '✔ Review added successfully!');
                form.reset();
                reviewSelectedImageData = null;

                document.getElementById('reviewImagePreview').style.display = 'none';
                document.getElementById('reviewFileLabel').style.display = 'block';

                    editMode = false;
                    editReviewId = null;
                    document.getElementById('submitBtn').textContent = '✔ Add Review';
                    const cancelEditBtn = document.getElementById('cancelEditBtn');
                    if (cancelEditBtn) cancelEditBtn.style.display = 'none'; // 
                    displayReviews();
            } else {
                alert(data.message || 'Error adding review', 'error');
            }

        } catch (error) {
            console.error(error);
            showFlashMessage('Server error. Please try again.', 'error');
        }
    });
}

async function displayReviews() {
    const container = document.getElementById('reviewsList');
    container.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        const reviews = await response.json();

        if (!reviews.length) {
            container.innerHTML = '<p class="empty-message">No reviews added yet.</p>';
            return;
        }

        reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'item-card';

            card.innerHTML = `
                ${review.image 
                    ? `<img src="${review.image}" 
                        alt="${review.name}" 
                        style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px;">` 
                    : ''
                }

                <div class="item-title">${review.name}</div>
                <div class="item-text"><strong>${review.title}</strong></div>
                <div style="color: #f39c12; margin: 8px 0;">
                    ${'⭐'.repeat(review.rating)}
                </div>
                <div class="item-text">${review.description}</div>
                <div class="item-meta">
                    <span>Added: ${new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editReview('${review._id}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteReview('${review._id}')">🗑️ Delete</button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="empty-message">Error loading reviews.</p>';
    }
}

async function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (data.success) {
            showFlashMessage('✔ Review deleted successfully!');
            displayReviews();
        } else {
            showFlashMessage('Error deleting review', 'error');
        }

    } catch (error) {
        console.error(error);
        showFlashMessage('Server error. Please try again.', 'error');
    }
}

window.deleteReview = deleteReview;


async function editReview(id) {
    try {
        const response = await fetch(API_URL);
        const reviews = await response.json();
        const review = reviews.find(r => r._id === id);
        if (!review) return;

        document.getElementById('reviewerName').value = review.name;
        document.getElementById('reviewerTitle').value = review.title;
        document.getElementById('reviewDescription').value = review.description;
        document.getElementById('reviewRating').value = review.rating;
        document.getElementById('reviewerEmail').value = review.email || '';

        editMode = true;
        editReviewId = id;

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.textContent = '✔ Update Review';

        // Show cancel button
        let cancelEditBtn = document.getElementById('cancelEditBtn');
        if (!cancelEditBtn) {
            cancelEditBtn = document.createElement('button');
            cancelEditBtn.type = 'button';
            cancelEditBtn.id = 'cancelEditBtn';
            cancelEditBtn.className = 'btn';
            cancelEditBtn.style.backgroundColor = '#dc3545';
            cancelEditBtn.style.marginLeft = '10px';
            cancelEditBtn.textContent = '✕ Cancel Edit';
            cancelEditBtn.addEventListener('click', cancelEditMode);
            submitBtn.parentNode.insertBefore(cancelEditBtn, submitBtn.nextSibling);
        }
        cancelEditBtn.style.display = 'inline-block';

        // Scroll AFTER DOM updates
        setTimeout(() => {
            document.getElementById('addReviewForm').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);

        showFlashMessage("✏️ Edit mode Enabled", "success");

    } catch (error) {
        console.error(error);
    }
}
window.editReview = editReview


function cancelEditMode() {
    editMode = false;
    editReviewId = null;

    document.getElementById('addReviewForm').reset();
    document.getElementById('reviewImagePreview').style.display = 'none';
    document.getElementById('reviewFileLabel').style.display = 'block';
    document.getElementById('submitBtn').textContent = '✔ Add Review';

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) cancelEditBtn.style.display = 'none';

    showFlashMessage("✕ Edit cancelled", "error");
}

})();