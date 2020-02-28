/*fieldProperties = {
    'PARAMETERS': [
        {
            'key': 'A',
            'value': 1000
        },
        {
            'key': 'B',
            'value': 'ds'
        }
    ],
    'CURRENT_ANSWER': '323 32002'
}// Above for testing only */

var timerDisp = document.querySelector('#timer');
var ssButton = document.querySelector('#startstop');
var countDisp = document.querySelector('#count');
var restartButtons = document.querySelector('#restartbuttons');
var confirmation = document.querySelector('#confirmation');
var endEarlyButton = document.querySelector('#endearly');

var parameters = fieldProperties.PARAMETERS
var numParam = parameters.length

var timeStart;
var unit;
var round;
if (numParam == 0) {
    timeStart = 5000
    unit = ' ms';
}
else {
    timeStart = parameters[0].value; //Time limit on each field in milliseconds
    if (numParam >= 2) {
        unit = ' ' + fieldProperties.PARAMETERS[1].value;

        if (unit == ' cs') {
            round = 10;
        }
        else if (unit == ' ds') {
            round = 100;
        }
        else if (unit == ' s') {
            round = 1000;
        }
        else {
            unit = ' ms';
            round = 1;
        }
    }
    else {
        unit = ' ms';
        round = 1;
    }
}

var complete = false;
var timeLeft = timeStart; //Starts this way for the display.
var timePassed = 0; //Time passed so far
var counter = 0;

var timerRunning = false;

var startTime = 0; //This will get an actual value when the timer starts in startStopTimer();

if (fieldProperties.CURRENT_ANSWER != null) {
    let parts = fieldProperties.CURRENT_ANSWER.match(/[^ ]+/g);
    console.log(parts)
    counter = parseInt(parts[0]);
    timeLeft = parseInt(parts[1]);
    timePassed = timeStart - timeLeft;
    timerRunning = false;
}
countDisp.innerHTML = counter

setInterval(timer, 1);

function timer() {
    if (timerRunning) {
        timePassed = Date.now() - startTime;
        timeLeft = timeStart - timePassed;
    }

    if (timeLeft <= 0) { //Timer ended
        timeLeft = 0;
        timerRunning = false;
        ssButton.disabled = true;
        ssButton.classList.add('buttonstop');
        ssButton.innerHTML = "Stop!";
        restartButtons.style.display = '';
        endEarlyButton.style.display = 'none';
        setAns();
    }
    timerDisp.innerHTML = String(Math.ceil(timeLeft / round)) + unit;
}

function startStopTimer() {
    if (timerRunning) {
        restartButtons.style.display = '';
        timerRunning = false;
        ssButton.innerHTML = "Start";
    }
    else {
        restartButtons.style.display = 'none';
        confirmation.innerHTML = '';
        startTime = Date.now() - timePassed;
        timerRunning = true;
        ssButton.innerHTML = "Stop";
    }
}

function countup() {
    counter++;
    countDisp.innerHTML = counter;
    if (timeLeft == 0) {
        setAns();
    }
}

function countdown() {
    counter--;
    if (counter < 0) {
        counter = 0;
    }
    countDisp.innerHTML = counter;

    if (timeLeft == 0) {
        setAns();
    }
}

function restartconf(restarter) {
    let warningMessage = "Are sure you would like to restart the " + restarter + "?";

    warningMessage += '<br><button id="yes" class="whitebutton">Yes</button><button id="no" class="bluebutton">No</button>'

    confirmation.innerHTML = warningMessage;

    document.querySelector('#yes').addEventListener('click', function () {
        if (restarter == 'timer') {
            timerDisp.innerHTML = timeLeft = timeStart;
            timePassed = 0;
            ssButton.classList.remove('buttonstop');
            ssButton.innerHTML = "Start";
            ssButton.disabled = false;
            endEarlyButton.style.display = 'none';
        }
        else if (restarter == 'counter') {
            countDisp.innerHTML = counter = 0;
        }
        confirmation.innerHTML = null;
    });

    document.querySelector('#no').addEventListener('click', function () {
        confirmation.innerHTML = null;
    });
}

function endEarly() {
    let warningMessage = 'Are sure you would like to end early? The current time and counter value will be saved.' +
        '<br><button id="yes" class="whitebutton">Yes</button><button id="no" class="bluebutton">No</button>'

    confirmation.innerHTML = warningMessage;
    document.querySelector('#yes').addEventListener('click', function () {
        setAns();
        goToNextField();
    });

    document.querySelector('#no').addEventListener('click', function () {
        confirmation.innerHTML = null;
    });
}



function setAns() {
    setAnswer(String(counter) + ' ' + String(timeLeft)); //Final answer is the value of the counter and the time left
}

function clearAnswer() {
    if (timerRunning) {
        startStopTimer();
    }
    setAnswer(null);
    timePassed = 0;
    counter = 0;
}