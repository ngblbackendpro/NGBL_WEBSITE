(function () {


const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.TEAM;;

let teamSelectedImageData = null;
let currentDept = "all";
let editingMemberId = null;


document.addEventListener("DOMContentLoaded", () => {
    setupFormListener();
    setupDeptTabs();
    setupTeamImagePreview();
    loadTeam();
});

// ─── Department Tabs ───────────────────────────────────────────
function setupDeptTabs() {
    const tabs = document.querySelectorAll(".dept-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentDept = tab.dataset.dept;
            loadTeam();
        });
    });
}

function setupFormListener() {
    const form = document.getElementById("addTeamForm");
    if (!form) return;


    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", document.getElementById("memberName").value);
        formData.append("position", document.getElementById("memberPosition").value);
        formData.append("department", document.getElementById("memberDepartment").value); 
        formData.append("description", document.getElementById("memberDescription").value);
        formData.append("email", document.getElementById("memberEmail").value);
        formData.append("phone", document.getElementById("memberPhone").value);
        formData.append("linkedin", document.getElementById("memberLinkedin").value);
        const imageFile = document.getElementById("memberImage").files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const url = editingMemberId ? `${API_URL}/${editingMemberId}` : API_URL;
            const method = editingMemberId ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data);
                throw new Error(data.error || "Upload failed");
            }

            alert(editingMemberId ? "✔ Member updated!" : "✔ Team member added!");
            form.reset();
            teamSelectedImageData = null;
            editingMemberId = null;

            const preview = document.getElementById('teamImagePreview');
            const label = document.getElementById('teamFileLabel');
            if (preview) preview.style.display = 'none';
            if (label) label.style.display = 'block';

            document.getElementById('teamSubmitBtn').textContent = '✔ Add Member';
            document.getElementById('editModeBar').style.display = 'none';
            document.getElementById('cancelTeamEditBtn').style.display = 'none';

            loadTeam();
        } catch (error) {
            console.error("UPLOAD ERROR:", error);
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

                if (previewImg) previewImg.src = teamSelectedImageData;

                if (previewDiv) previewDiv.style.display = "block";
                if (fileLabel) fileLabel.style.display = "none";
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

            if (previewImg) previewImg.src = "";

            if (previewDiv) previewDiv.style.display = "none";
            if (fileLabel) fileLabel.style.display = "block";
        });
}


async function loadTeam() {
    const container = document.getElementById("teamList");
    container.innerHTML = "<p class='empty-message'>Loading...</p>";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch");

        const allMembers = await response.json();

        // Filter by active department tab
        const members = currentDept === "all" 
            ? allMembers 
            : allMembers.filter(m => m.department === currentDept);
        container.innerHTML = "";

        if (!members.length) {
            container.innerHTML = `<p class="empty-message">No ${currentDept} team members found.</p>`;
            return;
        }

        members.reverse().forEach(member => {
            const card = document.createElement("div");
            card.className = "item-card";

            card.innerHTML = `
                <img src="${getMemberImage(member)}" alt="${member.name}" />
                <div class="item-title">${member.name}</div>
                <div class="item-text"><strong>${member.position}</strong></div>
                <div class="item-text">${member.description}</div>
                <span style="
                    display:inline-block;
                    margin: 6px 0 10px;
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    background: ${member.department === 'IT' ? '#dbeafe' : '#fce7f3'};
                    color: ${member.department === 'IT' ? '#1d4ed8' : '#be185d'};
                ">
                    ${member.department === 'IT' ? '💻 IT Team' : '🎵 Music Team'}
                </span>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editMember('${member._id}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteMember('${member._id}')">🗑 Delete</button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p class='empty-message'>Error loading team members.</p>";
    }
}

function getMemberImage(member) {
    if (!member.image) {
        return "img/default-user.png";
    }

    // ✅ Cloudinary image
    if (/^https?:\/\//i.test(member.image)) {
        return member.image;
    }

    // ❌ old local images fallback (optional)
    return BASE_URL + "/" + member.image;
}

async function deleteMember(id) {
    if (!confirm("Delete this member?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTeam();
}

window.deleteMember = deleteMember;

async function editMember(id) {
    try {
        const response = await fetch(API_URL);
        const allMembers = await response.json();
        const member = allMembers.find(m => m._id === id);
        if (!member) { alert("Member not found"); return; }

        editingMemberId = id;

        document.getElementById('memberName').value = member.name || '';
        document.getElementById('memberPosition').value = member.position || '';
        document.getElementById('memberDepartment').value = member.department || 'IT';
        document.getElementById('memberDescription').value = member.description || '';
        document.getElementById('memberEmail').value = member.email || '';
        document.getElementById('memberPhone').value = member.phone || '';
        document.getElementById('memberLinkedin').value = member.linkedin || '';

        // Show existing image
        if (member.image) {
            document.getElementById('teamPreviewImg').src = getMemberImage(member);
            document.getElementById('teamImagePreview').style.display = 'block';
            document.getElementById('teamFileLabel').style.display = 'none';
        }

        document.getElementById('teamSubmitBtn').textContent = '✔ Update Member';
        document.getElementById('editModeBar').style.display = 'block';
        document.getElementById('cancelTeamEditBtn').style.display = 'inline-block';

        setTimeout(() => {
            document.getElementById('addTeamForm').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);

    } catch (error) {
        console.error(error);
        alert("Error loading member");
    }
}

function cancelTeamEdit() {
    editingMemberId = null;
    document.getElementById('addTeamForm').reset();
    document.getElementById('teamImagePreview').style.display = 'none';
    document.getElementById('teamFileLabel').style.display = 'block';
    document.getElementById('teamSubmitBtn').textContent = '✔ Add Member';
    document.getElementById('editModeBar').style.display = 'none';
    document.getElementById('cancelTeamEditBtn').style.display = 'none';
}

window.editMember = editMember;
window.cancelTeamEdit = cancelTeamEdit;

})();