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
  scrubberInterval = new AdjustingInterval(translate, 1000/68);
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
  reverseScrubberInterval = setInterval(reverseTranslate, 1);
}

/**
 * Stepwise translation of the scrubber back to the original position.
 */
function reverseTranslate() {
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
function translate() {
  let left = parseFloat(timelineScrubber.style.left);
  if (left <= totalTime*getTimelineElementWidth()) {
    timelineScrubber.style.left = (left+1) + 'px';
  } else {
    scrubberInterval.stop();
  }
}

