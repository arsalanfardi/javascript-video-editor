const timeline = document.querySelector('.timeline')
const container = document.querySelector('.seconds-timeline');
const node = document.querySelector('#timeline-element');
/** Tracks the total recorded video time. */
let totalTime = 0;
/** The length of the timeline in seconds, initially set at 60. */
let timelineLength = 60;

/**
 * Initializes the timeline by replicating the timeline element 60 times and appends a seconds value to each one.
 */
export function createTimeline() {
    createTimelineElements(1, timelineLength);
    document.querySelector('#zoomIn').addEventListener('click', zoomTimeline);
    document.querySelector('#zoomOut').addEventListener('click', zoomTimeline);
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
 * Zooms in by increasing tick margins by 1 rem up to a maximum of 4 rems.
 * @param {*} ticks array of all the tick mark elements
 * @param {*} currentMargin the current margin value of the tick marks
 */
function zoomInTimeline(ticks, currentMargin) {
  // rem value of maximum zoom
  const maxZoom = 4;
  
  if (currentMargin < maxZoom) {
    ticks.forEach(element =>
      element.style.marginRight = (currentMargin + 1) + 'rem'
    )
  }
}

/**
 * Zooms out by decreasing tick margins by 1 rem down to a minimum of 1 rem.
 * @param {*} ticks array of all the tick mark elements
 * @param {*} currentMargin the current margin value of the tick marks
 */
function zoomOutTimeline(ticks, currentMargin) {
  const minZoom = 1;

  if (currentMargin > minZoom) {
    ticks.forEach(element =>
      element.style.marginRight = (currentMargin - 1) + 'rem'
    )
  }
}

/**
 * Increases the length of the timeline if the number of added seconds goes over the existing limit.
 * @param {*} seconds the amount of seconds to be added
 */
export function incrementTotalTime(seconds) {
  // Increment total time to the nearest upper whole number
  totalTime += Math.ceil(seconds);
  if (totalTime > timelineLength) {
    createTimelineElements(timelineLength, totalTime);
    timelineLength = totalTime;
  }
}

/**
 * Constructs a specified number of timeline elements between start and stop seconds.
 * @param {*} startSeconds the integer seconds value to begin at
 * @param {*} stopSeconds the integer seconds value to stop at
 */
function createTimelineElements(startSeconds, stopSeconds) {
  for (let i = startSeconds; i < stopSeconds; i++) {
    let nodeClone = node.cloneNode(true);
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
  return parseInt(window.getComputedStyle(node).getPropertyValue('width'));
}

/**
 * Returns the current computed margin of the tick marks in units of rem.
 * 
 * Major and minor ticks will always have the same margin.
 */
function getTickMargin() {
  const remValue = 16;
  let majorTick = document.querySelector('.tick-major');
  const currentMargin = window.getComputedStyle(majorTick).getPropertyValue('margin-right');

  return parseInt(currentMargin)/remValue;
}
