import { dragElement } from './draggable.js';
import { resetTimer, startTimer } from '../timer/timer.js';
import { createVideo } from './video-manager.js';

/** Default constraints used on application start */
let defaultConstraints = { video: true, audio: true };
/** User video element */
let userVideo = document.querySelector('#userVideo');
/** Recording button */
let recordBtn = document.getElementById('record');
/** The current media stream */
let currentStream;
/** Recording state */
let recording = false;
/** The MediaRecorder object responsible for capturing the stream */
let mediaRecorder;

/**
 * Initiates the retrieval of user's media sources and makes the user video element draggable.
 */
export async function startUserVideo() {
  dragElement(userVideo);
  await getUserMedia(defaultConstraints);
  // Wait for MediaRecorder to be constructed before adding event listener to start record button
  recordBtn.addEventListener('click', toggleRecord);
}

/**
 * Gets the user's media source and prepares for recording.
 * @param {*} video the HTML video element
 */
export function getUserMedia(constraints) {
  // Stop any recording and subsequently the media tracks in the MediaRecorder
  if (recording) toggleRecord();
  if (currentStream) stopMediaTracks();

  return navigator.mediaDevices.getUserMedia(constraints)
    .then(createMediaRecorder)
      .catch(() =>
        alert("Something went wrong with retrieving your input devices, please try again!")
      );
}

/**
 * Instantiates a new MediaRecorder from the provided media stream.
 * @param {*} mediaStream the media stream to be used by the MediaRecorder
 */
function createMediaRecorder(mediaStream) {
  // Ensure both audio input and video are present
  if (!verifyStream(mediaStream)) return;
  // Update current stream
  currentStream = mediaStream;
  userVideo.srcObject = mediaStream;
  // Instantiate recording API
  mediaRecorder = new MediaRecorder(mediaStream);
  console.log("recording", recording)
  
  recordVideo(mediaRecorder);
}

/** Toggles starting and stopping of recording through the MediaRecorder object */
function toggleRecord() {
  if (!recording) {
    mediaRecorder.start();
    recording = true;
    recordBtn.className = 'fas fa-square fa-sm';
    userVideo.style.border = '1px solid red';
    startTimer();
  } else {
    mediaRecorder.stop()
    recording = false;
    recordBtn.className = 'fas fa-circle fa-sm';
    userVideo.style.border = 'none';
    resetTimer();
  }
}
/**
 * Utilizes the MediaRecorder object to record a video.
 * @param {*} mediaRecorder the MediaRecorder object enabling recording of videos
 */
function recordVideo(mediaRecorder) {
  // Define array to hold video recording
  let chunks = [];

  // The MediaRecorder event called during recording of video
  mediaRecorder.ondataavailable = ev => {
    chunks.push(ev.data);
  }

  // The MediaRecorder event called upon stopping recording
  mediaRecorder.onstop = () => {
    // Define new binary large object (Blob)
    let blob = new Blob(chunks, { 'type': 'video/mp4' });

    // Reset chunks array to save memory
    chunks = [];

    // Define url for video source
    let videoUrl = window.URL.createObjectURL(blob);
    createVideo(videoUrl, blob)
  }
}

/**
 * Loops through the media tracks and stops the appropriate one.
 */
function stopMediaTracks() {
  currentStream.getTracks().forEach(track => {
    track.stop();
  })
}

/**
 * Verifies that the audio input and video source are present in the stream, otehrwise returns false and alerts the user.
 * 
 * @return boolean indicating the validity of the stream
 */
function verifyStream(stream) {
  // Monitors any missing tracks
  let missingTracks = {
    'audio': true,
    'video': true
  }
  let message = '';

  stream.getTracks().forEach(track => {
    // If the track audio or video track exists, set value in dictionary to false
    missingTracks[track.kind] = false;
  });

  // Loop through the dictionary and check for any true values for missing tracks
  Object.keys(missingTracks).forEach(key => {
    if (missingTracks[key]) {
      message += `\n${key} not detected!`
    }
  })

  if (message.length !== 0) {
    alert(message);
    return false;
  }

  return true;
}