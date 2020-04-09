/*fieldProperties = {
    'PARAMETERS': [
        {
            'key': 'duration',
            'value': 1000
        },
        {
            'key': 'time-unit',
            'value': 'ds'
        }
    ],
    'CURRENT_ANSWER': '10 1000'
}

function getPluginParameter(param){
    for(let p of fieldProperties.PARAMETERS){
        let key = p.key
        if(key == param){
            return p.value;
        }
    }
    return;
}

function setAnswer(ans){
    console.log(ans);
}

// Above for testing only */
// get the UI elements
var timerDisp = document.querySelector('#stopwatch');
var unitDisp = document.querySelector('#unit');
var ssButton = document.querySelector('#startstop');
var countDisp = document.querySelector('#count');
var resetButtons = document.getElementsByClassName("restart-buttons");
var resetConfBox = document.getElementById('resetConfirmation');
var endEarlyButton = document.querySelector('#end-early');
var confMesDiv = document.querySelector('#resetConfirmation');
var confMessageP = document.querySelector('#confirmationMessage');
var endEarlyDiv = document.querySelector('#endEarlyConfirmation')

var metadata = getMetaData();

// get parameters info
var timeStart;
var timeUnit = getPluginParameter('time-unit');

if(metadata == null){
    timeStart = getPluginParameter('duration') * 1000;
}
else{
    timeStart = parseInt(metadata);
}

// set up the timer and counter variables
var round = 1000; //Default, may be changed
var timePassed = 0; //Time passed so far
var counter = 0;
var timerRunning = false;
var startTime = 0; //This will get an actual value when the timer starts in startStopTimer();
var timeLeft;

//// START stopwatch functions

// Define what happens when the user resets the stopwatch
function resetStopwatch() {
    if (timerRunning) {
        startStopTimer();
        timePassed = 0;
        startStopTimer();
    } else {
        timePassed = 0;
    }
    timerDisp.innerHTML = timePassed;
    setAnswer('');
    resetConfBox.style.display = "none";
    showResetButtons();
}
// Set up the stopwatch
setInterval(timer, 1);
function timer() {
    if (timerRunning) {
        timePassed = Date.now() - startTime;
        timeLeft = timeStart - timePassed;
        setMetaData(timeLeft);
    }

    if (timeLeft < 0) { //Timer ended
        timeLeft = 0;
        timerRunning = false;
        ssButton.disabled = true;
        ssButton.classList.add('buttonstop');
        ssButton.innerHTML = "Done!";
        endEarlyButton.style.display = 'none';
        setAns();
    }
    timerDisp.innerHTML = Math.floor(timeLeft / round);
}
// Defines what happens when the stopwatch button is pressed. This can function as either a 'start' button or a 'stop' button, depending on whether or not the stopwatch is currently running. 
function startStopTimer() {
    if (timerRunning) {
        timerRunning = false;
        ssButton.querySelector(".play-icon").style.display = "block";
        ssButton.querySelector(".pause-icon").style.display = "none";
    }
    else {
        startTime = Date.now() - timePassed;
        timerRunning = true;
        ssButton.querySelector(".play-icon").style.display = "none";
        ssButton.querySelector(".pause-icon").style.display = "block";
    }
}

//// END stopwatch functions

//// START counter functions

// Define what happens when the user resets the counter
function resetCounter() {
    counter = 0;
    countDisp.innerHTML = counter;
    if(timeLeft = 0){
        setAns();
    }
    resetConfBox.style.display = "none";
    document.getElementById("counterdown").classList.add("btn-secondary");
    showResetButtons();
}
// Define what happens when the user cancels a reset
function cancelReset() {
    resetConfBox.style.display = "none";
    showResetButtons();
}
// Increase the current "count"
function countup() {
    counter++;
    countDisp.innerHTML = counter;
    if (timeLeft = 0) {
        setAns();
    }
    if (counter > 0) {
        document.getElementById("counterdown").classList.remove("btn-secondary");
    }
}
// Decrease the current "count"
function countdown() {
    if (counter > 0) {
        counter--;
    }
    if (counter == 0) {
        document.getElementById("counterdown").classList.add("btn-secondary");
    }
    countDisp.innerHTML = counter;
    if (timeLeft = 0) {
        setAns();
    }
}

//// END counter functions

//// START global functions

// define how to save the field's value in the form data
function setAns(){
    setAnswer(String(counter) + ' ' + String(timeLeft));
}

// define what happens when the user attempts to clear the response 
function clearAnswer() {
    if (timerRunning) {
        startStopTimer();
    }
    resetStopwatch()
    resetCounter();
    setAnswer('');
}

// Hide the reset buttons from the UI
function hideResetButtons() {
    for (var i = 0; i < resetButtons.length; i++) {
        resetButtons[i].style.display = "none";
    }
}
// Show the reset buttons in the UI
function showResetButtons() {
    for (var i = 0; i < resetButtons.length; i++) {
        resetButtons[i].style.display = "block";
    }
    endEarlyButton.style.display - 'block'
}
// Define the 'reset' function to allow either the stopwatch or the counter to use the same confirmation box
function restartconf(restarter) {
    let warningMessage = "Are sure you would like to reset the <strong>" + restarter + "</strong>?";
    confMessageP.innerHTML = warningMessage;
    hideResetButtons();
    resetConfBox.style.display = "block";
    if (restarter == "timer") {
        document.getElementById("confirmReset").removeEventListener("click", resetCounter);
        document.getElementById("confirmReset").addEventListener("click", resetStopwatch);
    } else if (restarter == "counter") {
        document.getElementById("confirmReset").removeEventListener("click", resetStopwatch);
        document.getElementById("confirmReset").addEventListener("click", resetCounter);
    }
}

function endEarly() {
    endEarlyDiv.style.display = 'block';

    document.querySelector('#cancelEnd').addEventListener('click', function(){
        endEarlyDiv.style.display = 'none'
    });

    document.querySelector('#confirmEnd').addEventListener('click', function () {
        setAns();
        goToNextField();
    });
}

//// END global functions

//// START field setup/loading

// If the field label or hint contain any HTML that isn't in the form definition, then the < and > characters will have been replaced by their HTML character entities, and the HTML won't render. We need to turn those HTML entities back to actual < and > characters so that the HTML renders properly. This will allow you to render HTML from field references in your field label or hint.
function unEntity(str){
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}



if (fieldProperties.LABEL) {
    document.querySelector(".label").innerHTML = unEntity(fieldProperties.LABEL);
}
if (fieldProperties.HINT) {
    document.querySelector(".hint").innerHTML = unEntity(fieldProperties.HINT);
}

// If the 'time-unit' parameter was supplied, make the appropriate adjustments
if (timeUnit) {
    if (timeUnit == 'ms') {
        round = 1;
    } else if (timeUnit == 'cs') {
        round = 10;
    } else if (timeUnit == 'ds') {
        round = 100;
    } else {
        round = 1000;
    }
}

if(timeStart == null){
    timeStart = 10000;
}
timeLeft = timeStart;

// When loading the field, check to see if there is already a stored value. If yes, update the appropriate variables.
if (fieldProperties.CURRENT_ANSWER != null) {
    let parts = fieldProperties.CURRENT_ANSWER.match(/[^ ]+/g);
    counter = parseInt(parts[0]);
    timePassed = parseInt(parts[1]);
    timerRunning = false;
}

// If the current value of 'count' is above 0 when the field loads, the 'decrease count' button should be blue 
if (counter > 0) {
    document.getElementById("counterdown").classList.remove("btn-secondary");
}

// Show the current counter value
countDisp.innerHTML = counter;

// Show the current stopwatch value
unitDisp.innerHTML = timeUnit;

//// END field setup/loading