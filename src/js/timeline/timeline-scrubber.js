import { isPlaying } from '../playback/playback.js';
import { AdjustingInterval } from './adjusting-interval.js';
import { totalTime, getTimelineElementWidth } from './timeline.js';
import { dragElement } from '../user-video/draggable.js';

const timelineScrubber = document.querySelector('.timeline-scrubber');
dragElement(timelineScrubber)
let scrubberInterval;
let reverseScrubberInterval;
let timelineElementWidth;

// Original position
timelineScrubber.style.left = '0';

/**
 * Starts the scrubber by instantiating a new AdjustingInterval class.
 */
export function startScrubber() {
  timelineElementWidth = getTimelineElementWidth();
  scrubberInterval = new AdjustingInterval(translateScrubber, 1000/(timelineElementWidth/2));
  scrubberInterval.start();
}

/**
 * Stops the interval but maintains the scrubber position.
 */
export function pauseScrubber() {
  if (scrubberInterval) {
    scrubberInterval.stop();
  }
}

/**
 * Stops the interval and resets the scrubber position.
 */
export function resetScrubber() {
  if (scrubberInterval) {
    scrubberInterval.stop();
  }
  reverseScrubberInterval = setInterval(reverseTranslateScrubber, 1);
}

/**
 * Moves the scrubber position by a specified amount.
 * @param {*} amount 
 */
export function moveScrubberByAmount(amount) {
  const left = parseFloat(timelineScrubber.style.left);
  timelineScrubber.style.left = (left + amount) + 'px';
}

/**
 * Moves scrubber to a specific pixel position.
 */
export function moveScrubberToPosition(position) {
  timelineScrubber.style.left = position;
}

/**
 * Recalculates the scrubber position based on the current timeline
 * element width, and update the interval if the playing status is true.
 */
export function recalculateScrubberPosition() {
  const currentPosition = parseFloat(timelineScrubber.style.left);
  // The current time is the current position divided by the previous timeline element width
  const currentTime = currentPosition/timelineElementWidth;
  // Calculate new position based on the current timeline element width
  timelineElementWidth = getTimelineElementWidth();
  timelineScrubber.style.left = (currentTime*timelineElementWidth) + 'px';

  // Update interval if playing
  if (isPlaying) {
    scrubberInterval.updateInterval(1000/(timelineElementWidth/2));
  }
}

/**
 * Stepwise translation of the scrubber back to the original position.
 */
function reverseTranslateScrubber() {
  const left = parseFloat(timelineScrubber.style.left);
  if (left <= 0) {
    clearInterval(reverseScrubberInterval);
    timelineScrubber.style.left = '0';
  } else {
    timelineScrubber.style.left = (left-6.8*2) + 'px';
  }
}

/**
 * Moves the scrubber forward by specified translation amount.
 * 
 * Adjustment of the translation amount also requires updating the scrubber interval.
 */
function translateScrubber() {
  const translation = 2; // Note changing this requires adjusting the scrubber interval as well
  const left = parseFloat(timelineScrubber.style.left);
  if (left <= totalTime*getTimelineElementWidth()) {
    timelineScrubber.style.left = (left+translation) + 'px';
  } else {
    scrubberInterval.stop();
  }
}

