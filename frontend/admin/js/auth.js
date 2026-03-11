(function () {

const { BASE_URL } = window.APP_CONFIG;

loginForm.addEventListner("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username")
    const password = document.getElementById("password")

    try{
        const response = await fetch(BASE_URL + "api/auth/login", {
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
                window.location.href = getDashboardStats.html
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