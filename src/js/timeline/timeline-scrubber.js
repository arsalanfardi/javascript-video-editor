import { AdjustingInterval } from './adjusting-interval.js';
import { totalTime, getTimelineElementWidth } from './timeline.js';

const timelineScrubber = document.querySelector('.timeline-scrubber');
let scrubberInterval;
let reverseScrubberInterval;

// Original position
timelineScrubber.style.left = '0';

/**
 * Starts the scrubber by instantiating a new AdjustingInterval class.
 */
export function startScrubber() {
  scrubberInterval = new AdjustingInterval(translateScrubber, 1000/68);
  scrubberInterval.start();
}

/**
 * Stops the interval but maintains the scrubber position.
 */
export function pauseScrubber() {
  scrubberInterval.stop();
}

/**
 * Stops the interval and resets the scrubber position.
 */
export function resetScrubber() {
  scrubberInterval.stop();
  reverseScrubberInterval = setInterval(reverseTranslateScrubber, 1);
}

export function moveScrubberByAmount(amount) {
  let left = parseFloat(timelineScrubber.style.left);
  timelineScrubber.style.left = (left + amount) + 'px';
}

/**
 * Moves scrubber to a specific pixel position.
 */
export function moveScrubberToPosition(position) {
  timelineScrubber.style.left = position;
}

/**
 * Stepwise translation of the scrubber back to the original position.
 */
function reverseTranslateScrubber() {
  let left = parseFloat(timelineScrubber.style.left);
  if (left <= 0) {
    clearInterval(reverseScrubberInterval);
    timelineScrubber.style.left = '0';
  } else {
    timelineScrubber.style.left = (left-6.8*2) + 'px';
  }
}

/**
 * Moves the scrubber forward by one pixel.
 */
function translateScrubber() {
  let left = parseFloat(timelineScrubber.style.left);
  if (left <= totalTime*getTimelineElementWidth()) {
    timelineScrubber.style.left = (left+1) + 'px';
  } else {
    scrubberInterval.stop();
  }
}

