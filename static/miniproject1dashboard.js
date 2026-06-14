const user = localStorage.getItem("omniUser");

document.getElementById("welcome").innerHTML =
"Welcome " + user + " 🚀";

let loading=false;

// ================= STUDY PLANNER =================

const generateBtn=
document.getElementById("generateBtn");

generateBtn.addEventListener(
"click",

async function(){

if(loading) return;

loading=true;

const subject=
document.getElementById(
"subject"
).value;

const hours=
document.getElementById(
"hours"
).value;

if(subject==="" || hours===""){

document.getElementById(
"planOutput"
).innerHTML=
"Please fill all fields";

loading=false;
return;

}

document.getElementById(
"planOutput"
).innerHTML=
"Generating plan...";

try{

const response=
await fetch("/studyplan",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

subject:subject,
hours:hours

})

});

const data=
await response.json();

saveHistory("Study Plan → " + subject);

document.getElementById(
"planOutput"
).innerHTML=
data.result.replace(/\n/g,"<br>");
speakText(data.result);

}

catch{

document.getElementById(
"planOutput"
).innerHTML=
"Error generating plan";

}

loading=false;

});


// ================= TASKS =================

let tasks=[];

const addTaskBtn=
document.getElementById("addTaskBtn");

const taskInput=
document.getElementById("taskInput");

const taskList=
document.getElementById("taskList");

addTaskBtn.addEventListener(
"click",

function(){

const task=
taskInput.value;

if(task===""){
return;
}

const priority=
document.getElementById(
"priority"
).value;

const dueDate=
document.getElementById(
"dueDate"
).value;

tasks.push({

name:task,
priority:priority,
date:dueDate,
done:false

});

saveTasks();

displayTasks();

taskInput.value="";

});

function displayTasks(){

taskList.innerHTML="";

let completed=0;

tasks.forEach(function(task,index){

if(task.done){

completed++;

}

const li=
document.createElement("li");

li.innerHTML=`

${task.name}

<br>

${task.priority}

📅 ${task.date}

<button class="doneBtn">

Done

</button>

<button class="deleteBtn">

Delete

</button>

`;

if(task.done){

li.style.textDecoration=
"line-through";

li.style.opacity="0.6";

}

taskList.appendChild(li);


const doneBtn=
li.querySelector(".doneBtn");

doneBtn.addEventListener(
"click",

function(){

tasks[index].done=true;

saveTasks();

displayTasks();

});


const deleteBtn=
li.querySelector(".deleteBtn");

deleteBtn.addEventListener(
"click",

function(){

tasks.splice(index,1);

saveTasks();

displayTasks();

});

});


document.getElementById(
"totalTask"
).innerHTML=
tasks.length;


document.getElementById(
"completedTask"
).innerHTML=
completed;


let percent=0;

if(tasks.length>0){

percent=
(completed/tasks.length)
*100;

}

document.getElementById(
"progressBar"
).value=
percent;

}

function saveTasks(){

localStorage.setItem(

"omniTasks",

JSON.stringify(tasks)

);

}

const storedTasks=

JSON.parse(

localStorage.getItem(
"omniTasks"
)

);

if(storedTasks){

tasks=storedTasks;

displayTasks();

}


// ================= DARK MODE =================

const themeBtn=
document.getElementById(
"themeToggle"
);


if(localStorage.getItem(
"theme"
)==="light"){

document.body.classList.add(
"light-mode"
);

}


themeBtn.addEventListener(

"click",

function(){

document.body.classList.toggle(
"light-mode"
);

if(document.body.classList.contains(
"light-mode"
)){

localStorage.setItem(
"theme",
"light"
);

themeBtn.innerHTML=
"🌙";

}

else{

localStorage.setItem(
"theme",
"dark"
);

themeBtn.innerHTML=
"☀️";

}

});


// ================= LOGOUT =================

const logoutBtn=
document.getElementById(
"logoutBtn"
);

logoutBtn.addEventListener(

"click",

function(){

localStorage.removeItem(
"omniUser"
);

window.location.href="/";

});


const clearTaskBtn=
document.getElementById(
"clearTaskBtn"
);

clearTaskBtn.addEventListener(
"click",

function(){

const confirmClear =
confirm(
"Are you sure?\nClear all tasks?"
);

if(confirmClear){

tasks=[];

localStorage.removeItem(
"omniTasks"
);

displayTasks();

alert(
"All Tasks Cleared ✅"
);

}

else{

alert(
"Cancelled ❌"
);

}

});
// NOTIFICATION SETTINGS

const notifyToggle =
document.getElementById(
"notifyToggle"
);

const voiceToggle =
document.getElementById(
"voiceToggle"
);

notifyToggle.addEventListener(
"change",

function(){

if(this.checked){

Notification.requestPermission()
.then(permission=>{

if(permission==="granted"){

new Notification(
"OmniMind AI 🔔",
{
body:"Notifications Enabled Successfully"
}
);

}

else if(
permission==="denied"
){

alert(
"Notifications blocked ❌"
);

this.checked=false;

}

else{

alert(
"Notification cancelled");

this.checked=false;

}

});

}

else{

alert(
"Notifications Disabled");

}

});

let historyData =
JSON.parse(
localStorage.getItem(
"omniHistory"
)
) || [];

function saveHistory(text){

historyData.unshift(text);

if(historyData.length > 5){

historyData.pop();

}

localStorage.setItem(

"omniHistory",

JSON.stringify(
historyData
)

);

}


const historyBtn=
document.getElementById(
"historyBtn"
);

const historySelect =
document.getElementById(
"historySelect"
);

function loadHistory(){

historySelect.innerHTML =
'<option value="">Recent</option>';

historyData.forEach(function(item){

const option =
document.createElement("option");

option.value = item;

option.innerHTML = item;

historySelect.appendChild(option);

});

}

loadHistory();

historySelect.addEventListener(

"change",

function(){

const selected =
this.value;

if(selected.includes("Study Plan")){

document.getElementById(
"subject"
).value =

selected.replace(
"Study Plan → ",
""
);

}

if(selected.includes("Summary")){

document.getElementById(
"notesInput"
).value =

selected.replace(
"Summary → ",
""
);

}

if(selected.includes("Career")){

document.getElementById(
"careerInput"
).value =

selected.replace(
"Career → ",
""
);

}

});
// ================= AI VOICE =================

// ================= AI VOICE =================

voiceToggle.addEventListener(

"change",

function(){

if(this.checked){

alert(
"AI Voice ON 🎤"
);

}

else{

window.speechSynthesis.cancel();

alert(
"AI Voice OFF 🔇"
);

}

});

function speakText(text){

if(!voiceToggle.checked){
return;
}

// Stop previous voice before speaking new text
window.speechSynthesis.cancel();

const speech =
new SpeechSynthesisUtterance(text);

speech.lang = "en-US";
speech.volume = 1;
speech.rate = 1;
speech.pitch = 1;

window.speechSynthesis.speak(
speech
);

}
    const stopVoiceBtn =
document.getElementById("stopVoiceBtn");

if(stopVoiceBtn){

    stopVoiceBtn.addEventListener(
    "click",

    function(){

        window.speechSynthesis.cancel();

        alert("Voice Stopped 🔇");

    });

}
// ================= DATE TIME =================

setInterval(

function(){

const now=
new Date();

document.getElementById(
"dateTime"
).innerHTML=
now.toLocaleString();

},

1000

);


// ================= MOTIVATION =================

const quotes=[

"Small progress every day matters",

"Dream big and start small",

"Consistency beats motivation"

];

document.getElementById(
"quote"
).innerHTML=

quotes[

Math.floor(

Math.random()
*
quotes.length

)

];


// ================= SUMMARY =================

const summaryBtn=
document.getElementById(
"summaryBtn"
);

summaryBtn.addEventListener(

"click",

async function(){

const notes=
document.getElementById(
"notesInput"
).value;

const output=
document.getElementById(
"summaryOutput"
);

if(notes===""){

output.innerHTML=
"Please enter notes";

return;

}

output.innerHTML=
"Generating summary...";

try{

const response=
await fetch(

"/summary",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

topic:notes

})

}

);

const data=
await response.json();

saveHistory("Summary → " + notes);

output.innerHTML=
data.result.replace(
/\n/g,
"<br>"
);
speakText(data.result);

}

catch{

output.innerHTML=
"Error generating summary";

}

});


// ================= CAREER =================

const careerBtn=
document.getElementById(
"careerBtn"
);

careerBtn.addEventListener(

"click",

async function(){

const career=
document.getElementById(
"careerInput"
).value;

const output=
document.getElementById(
"careerOutput"
);

if(career===""){

output.innerHTML=
"Please enter career";

return;

}

output.innerHTML=
"Generating roadmap...";

try{

const response=
await fetch(

"/career",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

career:career

})

}

);

const data=
await response.json();
saveHistory( "Career → " + career );

output.innerHTML=
data.result.replace(
/\n/g,
"<br>"
);
speakText(data.result);

}

catch{

output.innerHTML=
"Error generating roadmap";

}

})
// ================= QUIZ GENERATOR =================

const quizBtn =
document.getElementById("quizBtn");

quizBtn.addEventListener(

"click",

async function(){

const subject =
document.getElementById(
"quizinput"
).value;

const output =
document.getElementById(
"quizOutput"
);

if(subject===""){

output.innerHTML =
"Please enter a subject";

return;

}

output.innerHTML =
"Generating Quiz...";

try{

const response =
await fetch(

"/quiz",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

subject:subject

})

}

);

const data =
await response.json();

output.innerHTML =
data.result.replace(
/\n/g,
"<br>"
);

speakText(data.result);

}

catch{

output.innerHTML =
"Error generating quiz";

}

});

const flashcardBtn =
document.getElementById("flashcardBtn");

flashcardBtn.addEventListener(

"click",

async function(){

const topic =
document.getElementById(
"flashcardInput"
).value;

const output =
document.getElementById(
"flashcardOutput"
);

output.innerHTML =
"Generating Flashcards...";

const response =
await fetch("/flashcards",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
topic:topic
})

});

const data =
await response.json();

output.innerHTML =
data.result.replace(/\n/g,"<br>");

speakText(data.result);

});

// ================= POMODORO TIMER =================

let timeLeft = 25 * 60;

let timerInterval;

const timerDisplay =
document.getElementById(
"timerDisplay"
);

const startTimerBtn =
document.getElementById(
"startTimerBtn"
);

const resetTimerBtn =
document.getElementById(
"resetTimerBtn"
);

function updateTimer(){

const minutes =
Math.floor(timeLeft / 60);

const seconds =
timeLeft % 60;

timerDisplay.innerHTML =
`${minutes}:${seconds
.toString()
.padStart(2,"0")}`;

}

startTimerBtn.addEventListener(
"click",

function(){

if(timerInterval) return;

timerInterval =
setInterval(function(){

timeLeft--;

updateTimer();

if(timeLeft <= 0){

clearInterval(
timerInterval
);

timerInterval = null;

alert(
"Study Session Complete 🎉"
);

}

},1000);

});

resetTimerBtn.addEventListener(
"click",

function(){

clearInterval(
timerInterval
);

timerInterval = null;

timeLeft = 25 * 60;

updateTimer();

});

updateTimer();

// ================= RESUME BUILDER =================

const resumeBtn =
document.getElementById("resumeBtn");

resumeBtn.addEventListener(

"click",

async function(){

const name =
document.getElementById(
"resumeName"
).value;

const skills =
document.getElementById(
"resumeSkills"
).value;

const education =
document.getElementById(
"resumeEducation"
).value;

const projects =
document.getElementById(
"resumeProjects"
).value;

const output =
document.getElementById(
"resumeOutput"
);

output.innerHTML =
"Generating Resume...";

try{

const response =
await fetch("/resume",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name:name,
skills:skills,
education:education,
projects:projects

})

});

const data =
await response.json();

output.innerHTML =
data.result.replace(
/\n/g,
"<br>"
);

localStorage.setItem(
"resumeData",
data.result
);

speakText(data.result);

}

catch{

output.innerHTML =
"Error generating resume";

}

});

const downloadResumeBtn =
document.getElementById(
"downloadResumeBtn"
);

if(downloadResumeBtn){

downloadResumeBtn.addEventListener(

"click",

function(){

const resume =

localStorage.getItem(
"resumeData"
);

if(!resume){

alert(
"Generate resume first!"
);

return;

}

const blob = new Blob(
[resume],
{type:"text/plain"}
);

const a =
document.createElement("a");

a.href =
URL.createObjectURL(blob);

a.download =
"MyResume.txt";

a.click();

});

}

const interviewBtn =
document.getElementById(
"interviewBtn"
);

interviewBtn.addEventListener(

"click",

async function(){

const role =
document.getElementById(
"interviewInput"
).value;

const output =
document.getElementById(
"interviewOutput"
);

output.innerHTML =
"Generating Questions...";

const response =
await fetch("/interview",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
role:role
})

});

const data =
await response.json();

output.innerHTML =
data.result.replace(
/\n/g,
"<br>"
);

speakText(data.result);

});