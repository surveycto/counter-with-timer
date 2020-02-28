var timerDisp = document.querySelector('#timer');
var changer = document.querySelector('#buttonsst');
var ssButton = document.querySelector('#startstop');
var countDisp = document.querySelector('#count');

var parameters = fieldProperties.PARAMETERS
var numParam = parameters.length

var timeStart;
var unit;
var round;
if(numParam == 0){
    timeStart = 5000
    unit = ' ms';
}
else{
    timeStart =  parameters[0].value; //Time limit on each field in milliseconds
    if(numParam >= 2){
        unit = ' ' + fieldProperties.PARAMETERS[1];

        if(unit == ' cs'){
            round = 10;
        }
        else if(unit == ' ds'){
            round = 100;
        }
        else if(unit == ' s'){
            round = 1000;
        }
        else{
            unit = ' ms';
            round = 1;
        }
    }
}



var complete = false;
var timeLeft = timeStart; //Starts this way for the display.
var timePassed = 0; //Time passed so far
var counter = 0;

var timerRunning = false;

var startTime = 0; //This will get an actual value when the timer starts in startStopTimer();

if(fieldProperties.CURRENT_ANSWER != null){
    timeLeft = 0;
    timerRunning = false;
    counter = fieldProperties.CURRENT_ANSWER;
    changer.classList.add('buttonstop');
    changer.innerHTML = "Stop!";
}

setInterval(timer, 1);

function timer() {
    if(timerRunning){
        timePassed = Date.now() - startTime;
        timeLeft = timeStart - timePassed;
    }

    if(timeLeft <= 0){
        timeLeft = 0;
        timerRunning = false;
        changer.classList.add('buttonstop');
        changer.innerHTML = "Stop!";
        setAnswer(counter); //Final answer is the value of the counter
    }
    timerDisp.innerHTML = String(timeLeft/round) + unit;
}

function startStopTimer() {
    if(timerRunning){
        timerRunning = false;
        ssButton.innerHTML = "Start"
    }
    else{
        startTime = Date.now() - timePassed;
        timerRunning = true;
        ssButton.innerHTML = "Stop";
    }
}

function countup(){
    counter++;
    countDisp.innerHTML = counter;
}

function countdown(){
    counter--;
    if(counter < 0){
        counter = 0;
    }
    countDisp.innerHTML = counter;
}

function clearAnswer() {
    if(timerRunning){
        startStopTimer();
    }
    setAnswer(null);
    timePassed = 0;
    counter = 0;
}