import { initializeCopy } from './js/copy-script/copy-script.js';
import { initializeSettings } from './js/settings/settings.js';
import { createTimeline } from './js/timeline/timeline.js';
import { startUserVideo } from './js/user-video/user-video.js';
import { prepareUpload } from './js/upload/upload-video.js';
import "./styles.css"; // Required for webpack
import "dropzone/dist/min/dropzone.min.css";
import * as Dropzone from "dropzone/dist/dropzone.js";

window.onload = () => {
  startUserVideo();
  createTimeline();
  initializeSettings();
  initializeCopy();
  // prepareUpload();
  Dropzone.options.dropzoneClass = {
    autoProcessQueue: 'false', // Turns off automatic POST by dropzone
    paramName: "file", // The name that will be used to transfer the file
    acceptedFiles: 'video/*',
    maxFilesize: 1, // MB
    url: '/file-upload',
    init: function() {
      this.on("drop", function(file) { alert("Added file."); });
    },
    accept: function(file, done) {
      if (file.name == "justinbieber.jpg") {
        done("Naha, you don't.");
      }
      else { done(); }
    }
  };
}