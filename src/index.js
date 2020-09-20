import { prepareCopy } from './js/copy-script/copy-script.js';
import { prepareSettings } from './js/settings/settings.js';
import { rearrangeVideos } from './js/timeline/rearrange.js';
import { createTimeline } from './js/timeline/timeline.js';
import { startUserVideo } from './js/user-video/user-video.js';
import { prepareUpload } from './js/upload/upload-video.js';
import "./styles.css"; // Required for webpack

window.onload = () => {
  startUserVideo();
  createTimeline();
  prepareSettings();
  prepareCopy();
  prepareUpload();
  rearrangeVideos();
}