const { BASE_URL, API } = window.APP_CONFIG;

const params = new URLSearchParams(window.location.search);
const type = params.get("type"); // faq / privacy / terms

if (type) {
    fetch(`${BASE_URL}/api/legal/${type}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("pageContent").innerHTML = `
                <h1>${type.toUpperCase()}</h1>
                <div>${data.content}</div>
            `;
        })
        .catch(err => console.error(err));
}