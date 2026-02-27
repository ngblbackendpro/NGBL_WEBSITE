(function () {

const { BASE_URL, API } = window.ADMIN_CONFIG;

const API_URL = BASE_URL + API.LEGAL;    

const params = new URLSearchParams(window.location.search);
const pageType = params.get("type");

const pageTitle = document.getElementById("pageTitle");

// Change title
if (pageType === "faq") pageTitle.innerText = "Edit FAQ";
if (pageType === "terms") pageTitle.innerText = "Edit Terms & Conditions";
if (pageType === "privacy") pageTitle.innerText = "Edit Privacy Policy";

// Load Content
async function loadPage() {
  const res = await fetch(`${API_URL}/${pageType}`);
  const data = await res.json();

  if (data.content) {
    CKEDITOR.instances.pageContent.setData(data.content);
  }
}

// Save Content
async function savePage() {
  const content = CKEDITOR.instances.pageContent.getData();

  await fetch(`${API_URL}/${pageType}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content })
  });

  alert("Content saved successfully!");
}

window.savePage = savePage;
window.onload = loadPage;


})();