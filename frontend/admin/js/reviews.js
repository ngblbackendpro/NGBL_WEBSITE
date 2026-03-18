(function () {

const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.REVIEWS;
let reviewSelectedImageData = null;

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
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert('✔ Review added successfully!');
                form.reset();
                reviewSelectedImageData = null;

                document.getElementById('reviewImagePreview').style.display = 'none';
                document.getElementById('reviewFileLabel').style.display = 'block';

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

})();