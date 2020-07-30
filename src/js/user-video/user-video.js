import { dragElement } from './draggable.js';

/**
 * Accesses the user's media sources and assigns the video and audio source to the specified element's ID, then
 * prepares the recording capabilties.
 * @param {*} id 
 */
export function startUserVideo(id) {
    let video = document.querySelector(id);

    dragElement(video);
    getUserMedia(video);
}

/**
 * Gets the user's media source and prepares for recording.
 * @param {*} video the HTML video element
 */
function getUserMedia(video) {
  // Recording state
  let recording = false;
  let constraints = { video: true, audio: true };
  let start = document.getElementById('btn-record');
  let vidSave = document.getElementById('timeline-video');
  
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        video.srcObject = mediaStream;
        // Instantiate recording API
        let mediaRecorder = new MediaRecorder(mediaStream);
        // Define array to hold video recording
        let chunks = [];

        start.addEventListener('click', () => {
          if(!recording) {
            mediaRecorder.start();
            recording = true;
          } else {
            mediaRecorder.stop()
            recording = false;
          }
        })

        // The MediaRecorder event called during recording of video
        mediaRecorder.ondataavailable = ev => {
          chunks.push(ev.data);
        }

        // The MediaRecorder event called upon stopping recording
        mediaRecorder.onstop = () => {
          // Define new binary large object (Blob)
          let blob = new Blob(chunks, { 'type' : 'video/mp4'});
          // Reset chunks array to save memory
          chunks = [];
          // Define url for video source
          let videoURL = window.URL.createObjectURL(blob);
          vidSave.src = videoURL; 
          vidSave.style.display = 'block';
        }
      })
      .catch(function (error) {
        console.log("Something went wrong!", error);
      });
  }
}
