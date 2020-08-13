import { startUserVideo } from './user-video/user-video.js';
import { createTimeline } from './timeline/timeline.js';
import { initializeSettings } from './settings/settings.js';

startUserVideo('#userVideo');
createTimeline();
initializeSettings();

const startScrubber = () => {

  timelineScrubber.style.left = '0';
  setInterval(translate, 1000/10);

}
document.querySelector('#record').addEventListener('click', startScrubber)
const timelineScrubber = document.querySelector('.timeline-scrubber');



function translate() {
  let left = parseFloat(timelineScrubber.style.left);
  timelineScrubber.style.left = (left+6.8) + 'px';
}