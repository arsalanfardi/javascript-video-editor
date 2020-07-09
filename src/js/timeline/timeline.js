export function initializeTimeline() {
    const container = document.getElementsByClassName('timeline')[0];
    const node = document.getElementById('timeline-element');

    for (let i=1; i<60; i++) {
        let nodeClone = node.cloneNode(true);
        nodeClone.querySelector('#timeline-seconds').innerHTML = i;
        container.appendChild(nodeClone);
    }

    document.querySelector('#zoomIn').addEventListener('click', zoomTimeline)
    document.querySelector('#zoomOut').addEventListener('click', zoomTimeline)
}

function zoomTimeline() {
  let cssRuleCode = document.all ? 'rules' : 'cssRules'; // Account for IE and FF
  // Get CSS stylesheet and adjust margins for the tickMajor/Minor classes
  const styleSheet = document.styleSheets[0][cssRuleCode];
  let tickMinor = styleSheet[42].style;
  let tickMajor = styleSheet[43].style;
  let marginValue = parseInt(tickMajor['margin-right'].charAt(0)) // Major and minor margins should be the same
  if (this.id === 'zoomIn') {
    zoomInTimeline(tickMinor, tickMajor, marginValue)
  }
  else {
    zoomOutTimeline(tickMinor, tickMajor, marginValue)
  }
}

function zoomInTimeline(tickMajorStyle, tickMinorStyle, marginValue) {
  const maxZoom = 4;
  if (marginValue < maxZoom) {
    let newMarginValue = (marginValue + 1) + 'rem'; // Increment by 1rem
    tickMajorStyle['margin-right'] = newMarginValue;
    tickMinorStyle['margin-right'] = newMarginValue;
  }
}

function zoomOutTimeline(tickMajorStyle, tickMinorStyle, marginValue) {
  const minZoom = 1;
  if (marginValue > minZoom) {
    let newMarginValue = (marginValue - 1) + 'rem'; // Decrement by 1rem
    tickMajorStyle['margin-right'] = newMarginValue;
    tickMinorStyle['margin-right'] = newMarginValue;
  }
}