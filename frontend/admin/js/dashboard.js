(function () {
// Dashboard Shared JavaScript
const { BASE_URL, API } = window.ADMIN_CONFIG;

const CONTACT_API = BASE_URL + API.CONTACT;
const DASHBOARD_API = BASE_URL + API.DASHBOARD;

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}


document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    checkLogin();
    
    // Update current date
    updateCurrentDate();
    
    // Load dashboard statistics
    loadDashboardStats();
    
    // Handle sidebar toggle
    setupSidebarToggle();

    loadNotifications();
    setupNotificationBell();
    setInterval(loadNotifications, 5000);
});

function checkLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
    }
}

function updateCurrentDate() {
    const dateElements = document.querySelectorAll('#currentDate');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    
    dateElements.forEach(el => {
        el.textContent = dateString;
    });
}

async function loadDashboardStats() {
    try {
        const response = await fetch(DASHBOARD_API + "/stats");

        if (!response.ok) {
            throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();

        updateElement('expYears', data.expYears);
        updateElement('projectCount', data.projectCount);
        updateElement('blogCount', data.blogCount);
        updateElement('reviewCount', data.reviewCount);
        updateElement('serviceCount', data.serviceCount);
        updateElement('contactCount', data.contactCount);
        updateElement('officeCount', data.officeCount);

    } catch (error) {
        console.error("Error loading dashboard stats:", error);
    }
}

async function loadContactCount() {
    try {
        const response = await fetch(CONTACT_API);
        const contacts = await response.json();

        const countElement = document.getElementById("contactCount");
        if (countElement) {
            countElement.textContent = contacts.length;
        }

    } catch (error) {
        console.error("Error loading contact count:", error);
    }
}

function updateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function setupSidebarToggle() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    window.location.href = 'index.html';
}

// Setup logout button for all pages
document.addEventListener('DOMContentLoaded', function () {
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    });
});

// Utility function to generate unique IDs
function generateID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Utility function to display flash messages
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

// Add CSS animation for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


async function loadNotifications() {
    try {
        const countEl = document.getElementById("notificationCount");
        const list = document.getElementById("notificationList");
        const dropdown = document.getElementById("notificationDropdown");

        // 🛑 STOP if elements not found (prevents error)
        if (!countEl || !list || !dropdown) return;

        const response = await fetch(CONTACT_API + "/notifications");
        const notifications = await response.json();

        list.innerHTML = "";
        // dropdown.innerHTML = "";

        if (!notifications.length) {
            countEl.textContent = "0";
            list.innerHTML = "<p class='empty-message'>No new messages</p>";
            return;
        }

        countEl.textContent = notifications.length;

        notifications.forEach(contact => {

            const item = document.createElement("div");
            item.className = "notification-item";

            item.innerHTML = `
                <div class="notification-content">
                    <strong>${contact.name}</strong><br>
                    <small>${contact.email}</small>
                </div>
            `;

            const markBtn = document.createElement("button");
            markBtn.textContent = "Mark as Read";
            markBtn.className = "mark-read-btn";

            markBtn.onclick = async () => {
            markBtn.disabled = true;
            markBtn.innerHTML = "⏳ Marking...";

            try {
                await fetch(CONTACT_API + "/notifications/read/" + contact._id, {
                    method: "PUT"
                });

                // Remove notification instantly from UI
                item.remove();

                // Update count manually
                const currentCount = parseInt(countEl.textContent);
                countEl.textContent = currentCount - 1;

                // If no notifications left
                if (parseInt(countEl.textContent) <= 0) {
                    countEl.textContent = "0";
                    list.innerHTML = "<p class='empty-message'>No new messages</p>";
                }

            } catch (error) {
                markBtn.innerHTML = "Mark as Read";
                markBtn.disabled = false;
                alert("Failed. Try again.");
            }
        };

            item.appendChild(markBtn);
            list.appendChild(item);
        });

    } catch (error) {
        console.error("Notification error:", error);
    }
}


function setupNotificationBell() {
    const bell = document.getElementById("notificationBell");
    const dropdown = document.getElementById("notificationDropdown");

    if (!bell || !dropdown) return;

    // Toggle on bell click
    bell.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent window click
        dropdown.classList.toggle("active");
    });

    // Close when clicking outside
    window.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target) && !bell.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("downloadContacts");

    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            window.open(CONTACT_API + "/download", "_blank");
        });
    }
});

})();