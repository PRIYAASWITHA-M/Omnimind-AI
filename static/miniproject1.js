const text =
"Your Intelligent Personal Operating System";

let index = 0;

function typeEffect(){

document.getElementById("typing")
.innerHTML += text.charAt(index);

index++;

if(index < text.length){

setTimeout(typeEffect,80);

}

}

typeEffect();



const askBtn =
document.getElementById("askBtn");

askBtn.addEventListener(
"click",

async function(){

const input =
document.getElementById(
"userInput"
).value;

const response =
document.getElementById(
"response"
);

const loader =
document.getElementById(
"loader"
);

if(input===""){

response.innerHTML=
"Please ask something";

return;

}

response.innerHTML="";
loader.style.display=
"block";

try{

const result =
await fetch("/askai",{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

question:input

})

});

const data=
await result.json();

loader.style.display=
"none";

response.innerHTML=
data.result.replace(/\n/g,"<br>");

}

catch{

loader.style.display=
"none";

response.innerHTML=
"AI not responding";

}

});



const themeToggle=
document.getElementById(
"themeToggle"
);

themeToggle.addEventListener(
"click",

function(){

document.body.classList.toggle(
"light-mode"
);

if(
document.body.classList.contains(
"light-mode"
)
){

themeToggle.innerHTML=
"🌞";

}

else{

themeToggle.innerHTML=
"🌜";

}

});



const voiceBtn=
document.getElementById(
"voiceBtn"
);

voiceBtn.addEventListener(
"click",

function(){

const speech=
new SpeechSynthesisUtterance();

speech.text=
document.getElementById(
"response"
).innerText;

speech.lang=
"en-US";

window.speechSynthesis
.speak(speech);

});
const stopVoiceBtn = document.getElementById("stopVoiceBtn");
stopVoiceBtn.addEventListener("click",
    function(){
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        alert("Voice Stopped 🔇");
    });



document.getElementById(
"userInput"
)

.addEventListener(
"keypress",

function(event){

if(event.key==="Enter"){

askBtn.click();

}

});



function openDashboard(){

window.location.href=
"/dashboard";

}

































