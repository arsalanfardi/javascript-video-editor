import { initializeCopy } from './js/copy-script/copy-script.js';
import { initializeSettings } from './js/settings/settings.js';
import { createTimeline } from './js/timeline/timeline.js';
import { startUserVideo } from './js/user-video/user-video.js';
import "./styles.css"; // Required for webpack

window.onload = () => {
  startUserVideo();
  createTimeline();
  initializeSettings();
  initializeCopy();
}