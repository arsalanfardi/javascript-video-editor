/**
 * Makes the provided element draggable by click and hold.
 * @param {*} elmnt the HTML element to make draggable
 */
export function dragElement(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // Get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    
    // Get the new position of the element
    const tgtRect = elmnt.getBoundingClientRect();
    
    // Prevent element from going beyond parent's bounds
    const pRect = elmnt.parentElement.getBoundingClientRect();
    if (tgtRect.left < pRect.left) elmnt.style.left = 0;
    if (tgtRect.top < pRect.top) elmnt.style.top = 0;
    if (tgtRect.right > pRect.right) elmnt.style.left = pRect.width - tgtRect.width + 'px';
    if (tgtRect.bottom > pRect.bottom) elmnt.style.top = pRect.height - tgtRect.height + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
