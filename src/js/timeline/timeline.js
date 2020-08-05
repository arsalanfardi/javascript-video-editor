/**
 * Initializes the timeline by replicating the timeline element 60 times and appends a seconds value to each one.
 */
export function createTimeline() {
    const container = document.getElementsByClassName('seconds-timeline')[0];
    const node = document.querySelector('#timeline-element');

    for (let i=1; i<60; i++) {
        let nodeClone = node.cloneNode(true);
        nodeClone.querySelector('#seconds-count').innerHTML = i;
        container.appendChild(nodeClone);
    }

    document.querySelector('#zoomIn').addEventListener('click', zoomTimeline);
    document.querySelector('#zoomOut').addEventListener('click', zoomTimeline);
}

/**
 * Depending on the button selected, will zoom in or out of the timeline by selecting the timeline tick classes on the stylesheet
 * and increasing their margins.
 */
function zoomTimeline() {
  const ticks = document.querySelectorAll('.tick-major, .tick-minor');
  const currentMargin = getCurrentMargin();

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
 * Returns the current computed margin of the tick marks in units of rem.
 * 
 * Major and minor ticks will always have the same margin.
 */
export function getCurrentMargin() {
  const remValue = 16;
  let majorTick = document.querySelector('.tick-major');
  const currentMargin = window.getComputedStyle(majorTick).getPropertyValue('margin-right');

  return parseInt(currentMargin)/remValue;
}