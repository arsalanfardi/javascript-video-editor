import { startUserVideo } from '../user-video/user-video.js';

let currentStream;
let constraints = { video: true, audio: true };
let settingsVideo = document.querySelector('#settingsUserVideo');
const audioSelect = document.querySelector('#audio-input');
const videoSelect = document.querySelector('#video-input');

/**
 * Binds the event listeners to the settings buttons
 */
export function initializeSettings() {
  document.querySelector('#settings').addEventListener('click', openSettings);
  document.querySelector('#settings-close').addEventListener('click', closeSettings);
}

/**
 * Opens the settings panel by setting display to block, and displays user
 * media options in selection menus
 */
function openSettings() {
  getSettingsUserMedia(settingsVideo);

  // Remove the existing options in the dropdown menus to prevent duplication
  audioSelect.innerHTML = '';
  videoSelect.innerHTML = '';

  // Make the settings panel visible
  document.querySelector('.modal').style.display = "block";
  document.querySelector('.settings-panel').style.display = "block";

  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        let opt = document.createElement('option');
        opt.value = device.deviceId;
        if (device.kind === 'audioinput') {
          opt.appendChild(document.createTextNode(device.label));
          audioSelect.appendChild(opt);
          opt.value === constraints.audio ? opt.selected = 'selected' : opt;
        } else if (device.kind === 'videoinput') {
          opt.appendChild(document.createTextNode(device.label));
          videoSelect.appendChild(opt);
          opt.value === constraints.video ? opt.selected = 'selected' : opt;
        }
      });
      audioSelect.onchange = changeAudioInput;
      videoSelect.onchange = changeVideoSource;
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}

function getSettingsUserMedia() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        settingsVideo.srcObject = mediaStream;
        currentStream = mediaStream;
      })
      .catch(function (error) {
        console.log('Something went wrong!', error);
      }
    );
  }
}

function changeAudioInput() {
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  constraints.audio = audioSelect.options[audioSelect.selectedIndex].value;
  getSettingsUserMedia();
}

function changeVideoSource() {
  if (typeof currentStream !== 'undefined') {
    stopMediaTracks(currentStream);
  }
  constraints.video = videoSelect.options[videoSelect.selectedIndex].value;
  getSettingsUserMedia();
}

/**
 * Loops through each media track and stops them.
 */
function stopMediaTracks(stream) {
  stream.getTracks().forEach(track => {
    track.stop();
  })
}

/**
 * Closes thes settings menu by setting display to none.
 */
function closeSettings() {
  document.querySelector('.settings-panel').style.display = "none";
  document.querySelector('.modal').style.display = "none";
}