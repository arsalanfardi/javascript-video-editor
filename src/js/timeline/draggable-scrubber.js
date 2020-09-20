import { pause } from "../playback/playback.js";
import { getTimelineElementWidth, totalTime } from "./timeline.js";
import { getTimeFromPos } from "./timeline-scrubber.js";

/**
 * Makes the provided element draggable by click and hold.
 * @param {*} scrubber the scrubber HTML element
 */
export function dragScrubber(scrubber) {
  let pos1 = 0, pos2 = 0;
  scrubber.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the mouse cursor position at startup
    pos2 = e.clientX;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
    // Pause playback loop
    pause();
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos2 - e.clientX;
    pos2 = e.clientX;
    // set the element's new position:
    scrubber.style.left = (scrubber.offsetLeft - pos1) + "px";
    
    // Get the new position of the element
    const tgtRect = scrubber.getBoundingClientRect();
    
    // Prevent element from going beyond the zero bound
    const pRect = scrubber.parentElement.getBoundingClientRect();
    if (tgtRect.left < pRect.left) scrubber.style.left = 0;
    // Prevent element from going beyond the end of the last video clip
    let totalWidth = getTimelineElementWidth()*totalTime;
    if (parseFloat(scrubber.style.left) > totalWidth) scrubber.style.left = totalWidth + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    // Get the new time
    getTimeFromPos();
  }
}
