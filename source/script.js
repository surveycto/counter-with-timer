/* fieldProperties = {
  'PARAMETERS': [
    {
      'key': 'duration',
      'value': 10
    },
    {
      'key': 'time-unit',
      'value': 'ds'
    }
  ],
  'CURRENT_ANSWER': '10 1000',
  'METADATA': '10 1000' // ow much time was left last time
}

function getMetaData(){
  return fieldProperties.METADATA
}

function setMetaData(value){
  fieldProperties.METADATA = value
}

function getPluginParameter(param){
  for(let p of fieldProperties.PARAMETERS){
    let key = p.key
    if(key == param){
      return p.value
    }
  }
  return
}

function setAnswer(ans){
  console.log('Set answer to: ' + ans)
}

function goToNextField(){
  console.log('Moved to next field')
}

// Above for testing only */

/* global getPluginParameter, getMetaData, setAnswer, setMetaData, fieldProperties, goToNextField */

function timer () {
  if (timerRunning) {
    timePassed = Date.now() - startTime
  }

  timeLeft = timeStart - timePassed
  setMeta()

  if (timeLeft < 0) { // imer ended
    timeLeft = 0
    timerRunning = false
    ssButton.disabled = true
    ssButton.classList.add('btn-secondary')
    endEarlyButton.style.display = 'none'
    setAns()
  }
  timerDisp.innerHTML = Math.floor(timeLeft / round)
}
// Defines what happens when the stopwatch button is pressed. This can function as either a 'start' button or a 'stop' button, depending on whether or not the stopwatch is currently running.
function startStopTimer (startOrStop) {
  if (timerRunning || (startOrStop === 0)) {
    timerRunning = false
    ssButton.querySelector('.play-icon').style.display = 'block'
    ssButton.querySelector('.pause-icon').style.display = 'none'
  } else {
    startTime = Date.now() - timePassed
    timerRunning = true
    ssButton.querySelector('.play-icon').style.display = 'none'
    ssButton.querySelector('.pause-icon').style.display = 'block'
  }
}

// / END stopwatch functions

// / START counter functions

// Define what happens when the user resets the counter
function resetCounter () {
  counter = 0
  countDisp.innerHTML = counter
  if (timeLeft === 0) {
    setAns()
  }
  resetConfBox.style.display = 'none'
  document.getElementById('counterdown').classList.add('btn-secondary')
  showResetButtons()
}
// Define what happens when the user cancels a reset
function cancelReset () {
  resetConfBox.style.display = 'none'
  showResetButtons()
}
// Increase the current 'count'
function countup () {
  counter++
  countDisp.innerHTML = counter
  if (timeLeft === 0) {
    setAns()
  }
  if (counter > 0) {
    document.getElementById('counterdown').classList.remove('btn-secondary')
  }
  setMeta()
}
// Decrease the current 'count'
function countdown () {
  if (counter > 0) {
    counter--
  }
  if (counter === 0) {
    document.getElementById('counterdown').classList.add('btn-secondary')
  }
  countDisp.innerHTML = counter
  if (timeLeft === 0) {
    setAns()
  }
  setMeta()
}

// / END counter functions

// / START global functions

// define what happens when the user attempts to clear the response
function clearAnswer () {
  resetStopwatch()
  resetCounter()
  setAnswer('')
}

// define how to save the field's value in the form data
function setAns () {
  const ans = String(counter) + ' ' + String(timeLeft)
  setMetaData(ans)
  setAnswer(ans)
}

function setMeta () {
  const ans = String(counter) + ' ' + String(timeLeft)
  setMetaData(ans)
}

// Hide the reset buttons from the UI
function hideResetButtons () {
  for (var i = 0; i < resetButtons.length; i++) {
    resetButtons[i].style.display = 'none'
  }
}
// Show the reset buttons in the UI
function showResetButtons () {
  for (var i = 0; i < resetButtons.length; i++) {
    resetButtons[i].style.display = 'block'
  }
  endEarlyButton.style.display = ''
}
// Define the 'reset' function to allow either the stopwatch or the counter to use the same confirmation box
function restartconf (restarter) {
  const warningMessage = 'Are sure you would like to reset the <strong>' + restarter + '</strong>?'
  confMessageP.innerHTML = warningMessage
  hideResetButtons()
  resetConfBox.style.display = 'block'
  if (restarter === 'timer') {
    document.getElementById('confirmReset').removeEventListener('click', resetCounter)
    document.getElementById('confirmReset').addEventListener('click', resetStopwatch)
  } else if (restarter === 'counter') {
    document.getElementById('confirmReset').removeEventListener('click', resetStopwatch)
    document.getElementById('confirmReset').addEventListener('click', resetCounter)
  }
}

// Define what happens when the user resets the stopwatch
function resetStopwatch () {
  startStopTimer(0)
  timePassed = 0

  timePassed = 0
  timeStart = startTotal
  timerDisp.innerHTML = timeStart
  setAnswer('')
  resetConfBox.style.display = 'none'
  ssButton.classList.remove('btn-secondary')
  ssButton.disabled = false
  ssButton.querySelector('.play-icon').style.display = 'block'
  ssButton.querySelector('.pause-icon').style.display = 'none'
  showResetButtons()
}

function endEarly () {
  endEarlyDiv.style.display = 'block'

  document.querySelector('#cancelEnd').addEventListener('click', function () {
    endEarlyDiv.style.display = 'none'
  })

  document.querySelector('#confirmEnd').addEventListener('click', function () {
    setAns()
    goToNextField()
  })
}

// / END global functions

// / START field setup/loading

// If the field label or hint contain any HTML that isn't in the form definition, then the < and > characters will have been replaced by their HTML character entities, and the HTML won't render. We need to turn those HTML entities back to actual < and > characters so that the HTML renders properly. This will allow you to render HTML from field references in your field label or hint.
function unEntity (str) {
  return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

// get the UI elements
var timerDisp = document.querySelector('#stopwatch')
var unitDisp = document.querySelector('#unit')
var ssButton = document.querySelector('#startstop')
var countDisp = document.querySelector('#count')
var resetButtons = document.getElementsByClassName('restart-buttons')
var resetConfBox = document.getElementById('resetConfirmation')
var endEarlyButton = document.querySelector('#end-early')
var confMessageP = document.querySelector('#confirmationMessage')
var endEarlyDiv = document.querySelector('#endEarlyConfirmation')

// get parameters info
var startTotal = getPluginParameter('duration') * 1000 // Start time set by parameter
if (startTotal == null) {
  startTotal = 10000
}

var timeUnit = getPluginParameter('time-unit')
if (timeUnit == null) {
  timeUnit = 's'
}

// set up the timer and counter variables
var timeStart // How much time should start with, which is less than usual if there is metadata
var round = 1000 // Default, may be changed
var timePassed = 0 // Time passed so far
var counter = 0
var timerRunning = false
var startTime = 0 // This will get an actual value when the timer starts in startStopTimer()
var timeLeft

var metadata = getMetaData()

// When loading the field, check to see if there is already a stored value. If yes, update the appropriate variables.
if (metadata == null) {
  timeStart = startTotal
} else {
  const parts = metadata.match(/[^ ]+/g)
  counter = parseInt(parts[0])
  timeStart = parseInt(parts[1])

  if (timeStart === 0) {
    ssButton.disabled = true
    ssButton.classList.add('btn-secondary')
    endEarlyButton.style.display = 'none'
  }
}
timeLeft = timeStart

if (fieldProperties.LABEL) {
  document.querySelector('.label').innerHTML = unEntity(fieldProperties.LABEL)
}
if (fieldProperties.HINT) {
  document.querySelector('.hint').innerHTML = unEntity(fieldProperties.HINT)
}

// If the 'time-unit' parameter was supplied, make the appropriate adjustments
if (timeUnit === 'ms') {
  round = 1
} else if (timeUnit === 'cs') {
  round = 10
} else if (timeUnit === 'ds') {
  round = 100
} else {
  round = 1000
}

// If the current value of 'count' is above 0 when the field loads, the 'decrease count' button should be blue
if (counter > 0) {
  document.getElementById('counterdown').classList.remove('btn-secondary')
}

// Show the current counter value
countDisp.innerHTML = counter

// Show the current stopwatch value
unitDisp.innerHTML = timeUnit

// Set up the stopwatch
setInterval(timer, 1)

// / END field setup/loading
