let timerDisplay = document.querySelector('.timer');
let startTime;
let updatedTime;
let difference;
let tInterval;
let running = 0;

/**
 * Starts the timer element by getting the current system time and calling the setInterval method every second.
 */
export function startTimer() {
  if(!running){
    startTime = new Date().getTime();
    // Update timer every second (1000 ms)  
    tInterval = setInterval(getShowTime, 1000);
    running = 1;
    timerDisplay.style.cursor = "auto";
  }
}

/**
 * Resets the timer by clearing the interval and setting the display to zero time.
 */
export function resetTimer() {
  clearInterval(tInterval);
  difference = 0;
  running = 0;
  timerDisplay.innerHTML = '00:00:00';
}

/**
 * Updates the HTML timer element.
 */
function getShowTime() {
  updatedTime = new Date().getTime();
  difference =  updatedTime - startTime;

  // let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((difference % (1000 * 60)) / 1000);
  // let milliseconds = Math.floor((difference % (1000 * 60)) / 100);
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  // milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
  // timerDisplay.innerHTML = hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
  timerDisplay.innerHTML = hours + ':' + minutes + ':' + seconds
}

