const loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click",function(){
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");
    if(username ===""|| email===""|| password===""){
        message.innerHTML= "please fill all fields";
        return;
    }
    localStorage.setItem("omniUser",username);
    message.innerHTML="login Successful";
    alert("Going to next page")
        window.location.href = "/home";
});       