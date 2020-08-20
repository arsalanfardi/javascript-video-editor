import { startUserVideo } from './user-video/user-video.js';
import { createTimeline } from './timeline/timeline.js';
import { initializeSettings } from './settings/settings.js';

window.onload = () => {
  startUserVideo();
  createTimeline();
  initializeSettings();
}