(function () {


const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.SERVICES;

let selectedServiceImage = null;


document.addEventListener("DOMContentLoaded", () => {
  loadServices();
  setupServiceImagePreview();

  document
    .getElementById("addServiceForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", document.getElementById("serviceTitle").value);
      formData.append("description", document.getElementById("serviceDescription").value);
      formData.append("price", document.getElementById("servicePrice").value);
      formData.append("duration", document.getElementById("serviceDuration").value);
      formData.append("keywords", document.getElementById("serviceKeywords").value);
      formData.append("category", document.getElementById("serviceCategory").value);


      const imageFile = document.getElementById("serviceImage").files[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error adding service");
        }

        alert(data.message);
        document.getElementById("addServiceForm").reset();
        document.getElementById("imagePreview").style.display = "none";
        document.getElementById("fileInputLabel").style.display = "block";
        selectedServiceImage = null;
        loadServices();

      } catch (error) {
        alert("Error: " + error.message);
      }
    });
});

function setupServiceImagePreview() {
  const fileInput = document.getElementById("serviceImage");
  const previewDiv = document.getElementById("imagePreview");
  const previewImg = document.getElementById("previewImage");
  const uploadBtn = document.getElementById("uploadImageBtn");
  const cancelBtn = document.getElementById("cancelImageBtn");
  const fileLabel = document.getElementById("fileInputLabel");

  if (!fileInput) return;

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        selectedServiceImage = file;
        previewImg.src = event.target.result;
        previewDiv.style.display = "block";
        fileLabel.style.display = "none";
      };

      reader.readAsDataURL(file);
    }
  });

  uploadBtn.addEventListener("click", function () {
    alert("✔ Image ready to upload!");
  });

  cancelBtn.addEventListener("click", function () {
    previewDiv.style.display = "none";
    fileLabel.style.display = "block";
    fileInput.value = "";
    selectedServiceImage = null;
  });
}


async function loadServices() {
  try {
    const response = await fetch(API_URL);
    const services = await response.json();

    const container = document.getElementById("servicesList");
    container.innerHTML = "";

    if (services.length === 0) {
      container.innerHTML =
        '<p class="empty-message">No services added yet.</p>';
      return;
    }

    services.forEach(service => {
      const card = document.createElement("div");
      card.className = "item-card";

      card.innerHTML = `
        ${
          service.image
            ? `<img src="${BASE_URL}${service.image}" alt="${service.title}">`
            : `<div style="font-size:48px;text-align:center;">${service.icon || "🛠️"}</div>`
        }
        <div class="item-title">${service.title}</div>
        <div class="item-text">${service.description}</div>
        ${
          service.price
            ? `<div><strong>💰 Price:</strong> ${service.price}</div>`
            : ""
        }
        <div class="item-actions">
          <button onclick="deleteService('${service._id}')">🗑️ Delete</button>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error(error);
  }
}

async function deleteService(id) {
  if (!confirm("Are you sure?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadServices();
  } catch (error) {
    alert("Error deleting service");
  }
}

window.deleteService = deleteService;

})();