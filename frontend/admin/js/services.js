(function () {


const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.SERVICES;

let selectedServiceImage = null;
let currentDept = "all";
let editingServiceId = null;


document.addEventListener("DOMContentLoaded", () => {
  loadServices();
  setupServiceImagePreview();
  setupDeptTabs();

  document
    .getElementById("addServiceForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", document.getElementById("serviceTitle").value);
      formData.append("description", document.getElementById("serviceDescription").value);
      formData.append("serviceDepartment", document.getElementById("serviceDepartment").value);
      formData.append("price", document.getElementById("servicePrice").value);
      formData.append("duration", document.getElementById("serviceDuration").value);
      formData.append("keywords", document.getElementById("serviceKeywords").value);
      formData.append("category", document.getElementById("serviceCategory").value);


      const imageFile = document.getElementById("serviceImage").files[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      try {
          const url = editingServiceId ? `${API_URL}/${editingServiceId}` : API_URL;
          const method = editingServiceId ? "PUT" : "POST";
          const response = await fetch(url, { 
            method: method, 
            body: formData 
          });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error adding service");
        }

        alert(editingServiceId ? "✔ Service updated successfully!" : data.message);
        document.getElementById("addServiceForm").reset();
        document.getElementById("imagePreview").style.display = "none";
        document.getElementById("fileInputLabel").style.display = "block";
        selectedServiceImage = null;
        editingServiceId = null;
        document.getElementById("serviceSubmitBtn").textContent = "✔ Add Service";
        document.getElementById("serviceEditModeBar").style.display = "none";
        document.getElementById("cancelServiceEditBtn").style.display = "none";
        loadServices();

      } catch (error) {
        alert("Error: " + error.message);
      }
    });
});

function setupDeptTabs() {
    const tabs = document.querySelectorAll(".dept-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentDept = tab.dataset.dept;
            loadServices();
        });
    });
}

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
    const url = currentDept === "all" 
        ? API_URL 
        : `${API_URL}?serviceDepartment=${currentDept}`;
    const response = await fetch(url);
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
            ? `<img src="${service.image}" alt="${service.title}">`
            : `<div style="font-size:48px;text-align:center;">${service.icon || "🛠️"}</div>`
        }
        <div class="item-title">${service.title}</div>
        <div class="item-text">${service.description}</div>
        ${service.serviceDepartment
            ? `<div><strong>🏢 Department:</strong> ${service.serviceDepartment}</div>`
            : ""
        }
        ${
          service.price
            ? `<div><strong>💰 Price:</strong> ${service.price}</div>`
            : ""
        }
        <div class="item-actions">
          <button class="btn-edit" onclick="editService('${service._id}')">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteService('${service._id}')">🗑️ Delete</button>
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


async function editService(id) {
    try {
        const response = await fetch(API_URL);
        const services = await response.json();
        const service = services.find(s => s._id === id);
        if (!service) { alert("Service not found"); return; }

        editingServiceId = id;

        document.getElementById("serviceTitle").value = service.title || '';
        document.getElementById("serviceDescription").value = service.description || '';
        document.getElementById("serviceDepartment").value = service.serviceDepartment || '';
        document.getElementById("servicePrice").value = service.price || '';
        document.getElementById("serviceDuration").value = service.duration || '';
        document.getElementById("serviceKeywords").value = service.keywords ? service.keywords.join(', ') : '';
        document.getElementById("serviceCategory").value = service.category || '';

        // Show existing image
        if (service.image) {
            document.getElementById("previewImage").src = service.image;
            document.getElementById("imagePreview").style.display = "block";
            document.getElementById("fileInputLabel").style.display = "none";
        }

        document.getElementById("serviceSubmitBtn").textContent = "✔ Update Service";
        document.getElementById("serviceEditModeBar").style.display = "block";
        document.getElementById("cancelServiceEditBtn").style.display = "inline-block";

        setTimeout(() => {
            document.getElementById("addServiceForm").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);

    } catch (error) {
        console.error(error);
        alert("Error loading service");
    }
}

function cancelServiceEdit() {
    editingServiceId = null;
    document.getElementById("addServiceForm").reset();
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("fileInputLabel").style.display = "block";
    document.getElementById("serviceSubmitBtn").textContent = "✔ Add Service";
    document.getElementById("serviceEditModeBar").style.display = "none";
    document.getElementById("cancelServiceEditBtn").style.display = "none";
}

window.editService = editService;
window.cancelServiceEdit = cancelServiceEdit;

})();