import { recalculateScrubberPosition } from './timeline-scrubber';

const container = document.querySelector('.seconds-timeline');
const timelineElement = document.querySelector('#timeline-element');
const videoTimeline = document.querySelector('.video-timeline');
const zoomInBtn = document.querySelector('#zoomIn');
const zoomOutBtn = document.querySelector('#zoomOut');

/** Tracks the total recorded video time. */
export let totalTime = 0;
/** The length of the timeline in seconds, initially set at 60. */
let timelineLength = 60;

/**
 * Initializes the timeline by replicating the timeline element 60 times and appends a seconds value to each one.
 */
export function createTimeline() {
  createTimelineElements(1, timelineLength);
  zoomInBtn.addEventListener('click', zoomTimeline);
  zoomOutBtn.addEventListener('click', zoomTimeline);
}

/**
 * Depending on the button selected, will zoom in or out of the timeline by increasing the margins of the tick elements.
 */
function zoomTimeline() {
  const ticks = document.querySelectorAll('.tick-major, .tick-minor');
  const currentMargin = getTickMargin();

  if (this.id === 'zoomIn') {
    zoomInTimeline(ticks, currentMargin)
  }
  else {
    zoomOutTimeline(ticks, currentMargin)
  }
}

/**
 * Zooms in by increasing tick margins by 0.5 rem up to a maximum of 4 rems.
 * @param {*} ticks array of all the tick mark elements
 * @param {*} currentMargin the current margin value of the tick marks
 */
function zoomInTimeline(ticks, currentMargin) {
  // rem value of maximum zoom
  const maxZoom = 2.5;

  if (currentMargin < maxZoom) {
    // Ensure zoom in button is enabled
    zoomOutBtn.removeAttribute('disabled');

    const newMargin = (currentMargin + 0.5);
    ticks.forEach(element =>
      element.style.marginRight = newMargin + 'rem'
    );

    // Update scrubber position
    recalculateScrubberPosition();

    // Update width of video clips in timeline
    updateVideoClipWidths();

    // Disable zoom button if max zoom is reached
    if (newMargin === maxZoom) {
      zoomInBtn.setAttribute('disabled', true);
    }
  }
}

/**
 * Zooms out by decreasing tick margins by 0.5 rem down to a minimum of 1 rem.
 * @param {*} ticks array of all the tick mark elements
 * @param {*} currentMargin the current margin value of the tick marks
 */
function zoomOutTimeline(ticks, currentMargin) {
  const minZoom = 1;

  if (currentMargin > minZoom) {
    // Ensure zoom in button is enabled
    zoomInBtn.removeAttribute('disabled');

    const newMargin = (currentMargin - 0.5);
    ticks.forEach(element =>
      element.style.marginRight = newMargin + 'rem'
    );
    
    // Update scrubber position
    recalculateScrubberPosition();

    // Update width of video clips in timeline
    updateVideoClipWidths();

    // Disable zoom button if max zoom is reached
    if (newMargin === minZoom) {
      zoomOutBtn.setAttribute('disabled', true);
    }
  }
}

/**
 * Iterates through the video clips in the timeline and updates their widths based on the 
 * current timeline element width.
 */
function updateVideoClipWidths() {
  const videoClips = Array.from(videoTimeline.childNodes);
  videoClips.forEach(videoClip => {
    const duration = parseFloat(videoClip.getAttribute('data-video-duration'));
    const newWidth = (duration * getTimelineElementWidth()) + 'px';
    videoClip.setAttribute('style', `width: ${newWidth}`);
  });
}
/**
 * Increases the length of the timeline if the number of added seconds goes over the existing limit.
 * @param {*} seconds the amount of seconds to be added
 */
export function incrementTotalTime(seconds) {
  totalTime += seconds;
  if (totalTime > timelineLength) {
    // Create new timeline elements up to the next whole number
    createTimelineElements(timelineLength, Math.ceil(totalTime));
    timelineLength = Math.ceil(totalTime);
  }
}

export function decrementTotalTime(seconds) {
  totalTime -= seconds;
}

/**
 * Constructs a specified number of timeline elements between start and stop seconds.
 * @param {*} startSeconds the integer seconds value to begin at
 * @param {*} stopSeconds the integer seconds value to stop at
 */
function createTimelineElements(startSeconds, stopSeconds) {
  for (let i = startSeconds; i < stopSeconds; i++) {
    let nodeClone = timelineElement.cloneNode(true);
    nodeClone.querySelector('#seconds-count').innerHTML = i;
    container.appendChild(nodeClone);
  }
}

/**
 * Returns the current total width of one timeline element in pixels.
 * 
 * Will be used to determine the width of videos in the timeline.
 */
export function getTimelineElementWidth() {
  return parseInt(getComputedStyle(timelineElement).getPropertyValue('width'));
}

/**
 * Returns the current computed margin of the tick marks in units of rem.
 * 
 * Major and minor ticks will always have the same margin.
 */
function getTickMargin() {
  const remValue = 16;
  let majorTick = document.querySelector('.tick-major');
  const currentMargin = getComputedStyle(majorTick).getPropertyValue('margin-right');

  return parseInt(currentMargin) / remValue;
}
