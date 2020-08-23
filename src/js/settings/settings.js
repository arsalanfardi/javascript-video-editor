import { getUserMedia } from '../user-video/user-video.js';

/** The current settings stream */
let currentStream;
/** The selected constraints */
let selectedConstraints = { video: true, audio: true };
/** The constraints for user testing purposes which may not necessarily be saved */
let testConstraints = { video: true, audio: true };
let settingsVideo = document.querySelector('#settingsUserVideo');
const audioSelect = document.querySelector('#audio-input');
const videoSelect = document.querySelector('#video-input');

/**
 * Binds the event listeners to the settings buttons
 */
export function initializeSettings() {
  document.querySelector('#settings').addEventListener('click', openSettings);
  document.querySelector('#settings-close').addEventListener('click', closeSettings);
  document.querySelector('#save-settings').addEventListener('click', saveSelection);
}

/**
 * Opens the settings panel by setting display to block, and displays user
 * media options in selection menus
 */
function openSettings() {
  getSettingsUserMedia(selectedConstraints);

  // Remove the existing options in the dropdown menus to prevent duplication
  audioSelect.innerHTML = '';
  videoSelect.innerHTML = '';

  // Make the settings panel visible
  document.querySelector('.modal').style.display = "block";
  document.querySelector('.settings-panel').style.display = "block";

  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        // Create an option for the selection menu
        let opt = document.createElement('option');
        opt.value = device.deviceId;
        if (device.kind === 'audioinput') {
          // Append to audio selection menu
          opt.appendChild(document.createTextNode(device.label));
          audioSelect.appendChild(opt);
          // Select this option on start-up if it's in the current stream from a previous selection
          opt.value === selectedConstraints.audio.deviceId?.exact ? opt.selected = 'selected' : opt;
        } else if (device.kind === 'videoinput') {
          // Append to video selection menu
          opt.appendChild(document.createTextNode(device.label));
          videoSelect.appendChild(opt);
          // Select this option on start-up if it's in the current stream from a previous selection
          opt.value === selectedConstraints.video.deviceId?.exact ? opt.selected = 'selected' : opt;
        }
      });
      audioSelect.onchange = changeAudioInput;
      videoSelect.onchange = changeVideoSource;
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}

/**
 * Gets the user's media source and applies it to the video in the settings menu.
 */
function getSettingsUserMedia(constraints) {
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

/**
 * Changes the audio source in the settings menu by assigning the source to the test constraints.
 */
function changeAudioInput() {
  if (currentStream) {
    stopMediaTracks();
  }
  const audioSource = audioSelect.options[audioSelect.selectedIndex].value;
  const audioConstraints = {  deviceId: { exact: audioSource } };
  testConstraints.audio = audioConstraints;
  getSettingsUserMedia(testConstraints);
}

/**
 * Changes the video source in the settings menu by assigning the source to the test constraints.
 */
function changeVideoSource() {
  if (currentStream) {
    stopMediaTracks();
  }
  const videoSource = videoSelect.options[videoSelect.selectedIndex].value;
  const videoConstraints = {  deviceId: { exact: videoSource } };
  testConstraints.video = videoConstraints;
  getSettingsUserMedia(testConstraints);
}

/**
 * Finalizes the selection by setting the test constraints to the selected constraints, then swapping the user media on the main page.
 */
async function saveSelection() {
  // Ensure a deep copy to avoid bugs when saving and then proceeding to try and change media sources again
  selectedConstraints = { ...testConstraints };
  // Wait for user video to be changed before closing settings menu
  await getUserMedia(selectedConstraints);
  closeSettings();
}

/**
 * Loops through the media tracks and stops them.
 */
function stopMediaTracks() {
  currentStream.getTracks().forEach(track => {
    track.stop();
  })
}

/**
 * Closes thes settings menu by resetting the settings media stream to previously selected one, and assigning none to display.
 */
function closeSettings() {
  // Reset settings media stream to previously selected one
  getSettingsUserMedia(selectedConstraints);
  document.querySelector('.settings-panel').style.display = "none";
  document.querySelector('.modal').style.display = "none";
}