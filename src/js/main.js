import { initializeCopy } from './copy-script/copy-script.js';
import { initializeSettings } from './settings/settings.js';
import { createTimeline } from './timeline/timeline.js';
import { startUserVideo } from './user-video/user-video.js';

window.onload = () => {
  startUserVideo();
  createTimeline();
  initializeSettings();
  initializeCopy();
}