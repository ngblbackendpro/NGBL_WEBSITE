(function () {


const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.TEAM;;

let teamSelectedImageData = null;


document.addEventListener("DOMContentLoaded", () => {
    setupFormListener();
    setupTeamImagePreview();
    loadTeam();
});

function setupFormListener() {
    const form = document.getElementById("addTeamForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", document.getElementById("memberName").value);
        formData.append("position", document.getElementById("memberPosition").value);
        formData.append("description", document.getElementById("memberDescription").value);
        formData.append("email", document.getElementById("memberEmail").value);
        formData.append("phone", document.getElementById("memberPhone").value);
        formData.append("linkedin", document.getElementById("memberLinkedin").value);
        formData.append("image", document.getElementById("memberImage").files[0]);

        try {
            await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            alert("Team member added!");
            form.reset();
            teamSelectedImageData = null;
            document.getElementById('teamImagePreview').style.display = 'none';
            document.getElementById('teamFileLabel').style.display = 'block';
            loadTeam();

        } catch (error) {
            alert("Error adding member");
        }
    });
}

function setupTeamImagePreview() {
    const fileInput = document.getElementById("memberImage");
    const previewDiv = document.getElementById("teamImagePreview");
    const previewImg = document.getElementById("teamPreviewImg");
    const fileLabel = document.getElementById("teamFileLabel");
    const changeBtn = document.getElementById("changeTeamImage");
    const cancelBtn = document.getElementById("cancelTeamImage");

    if (!fileInput) return;

    fileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                teamSelectedImageData = event.target.result;
                previewImg.src = teamSelectedImageData;

                previewDiv.style.display = "block";
                fileLabel.style.display = "none";
            };

            reader.readAsDataURL(file);
        }
    });

    // Change button
    changeBtn.addEventListener("click", () => {
        fileInput.click();
    });

    // Cancel button
    cancelBtn.addEventListener("click", () => {
        fileInput.value = "";
        teamSelectedImageData = null;
        previewImg.src = "";

        previewDiv.style.display = "none";
        fileLabel.style.display = "block";
    });
}


async function loadTeam() {
    const container = document.getElementById("teamList");

    const response = await fetch(API_URL);
    const members = await response.json();

    container.innerHTML = "";

    if (!members.length) {
        container.innerHTML = "<p>No team members found</p>";
        return;
    }

    members.forEach(member => {
        const card = document.createElement("div");
        card.className = "item-card";

        card.innerHTML = `
            <img src="${member.image}" />
            <div class="item-title">${member.name}</div>
            <div class="item-text">${member.position}</div>
            <div class="item-text">${member.description}</div>
            <button onclick="deleteMember('${member._id}')">Delete</button>
        `;

        container.appendChild(card);
    });
}

async function deleteMember(id) {
    if (!confirm("Delete this member?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTeam();
}

window.deleteMember = deleteMember;

})();