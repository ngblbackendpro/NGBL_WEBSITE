(function () {


const { BASE_URL } = window.ADMIN_CONFIG;

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    try{
        const response = await fetch(BASE_URL + "/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })

        });
        const data = await response.json();

        if(response.ok) {
            localStorage.setItem("token", data.token)
            showMessage("Login Success", "Success")
            setTimeout(()=>{
                window.location.href = "dashboard.html"
            })

        }else{
            showMessage(data.message, "error")
        }
    } catch (error) {
        showMessage("Sever Error", "error")
    }
})

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    }
}


})();