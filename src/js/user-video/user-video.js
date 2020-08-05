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
  
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        video.srcObject = mediaStream;
        // Instantiate recording API
        let mediaRecorder = new MediaRecorder(mediaStream);

        // Event listener for recording button
        start.addEventListener('click', () => {
          if(!recording) {
            mediaRecorder.start();
            recording = true;
            start.className = 'fas fa-square fa-sm';
          } else {
            mediaRecorder.stop()
            recording = false;
            start.className = 'fas fa-circle fa-sm';
          }
        })

        recordVideo(mediaRecorder);

      })
      .catch(function (error) {
        console.log('Something went wrong!', error);
      });
  }
}

/**
 * Utilizes the MediaRecorder object to record a video and appends it to the video timeline. 
 * @param {*} mediaRecorder the MediaRecorder object enabling recording of videos
 */
function recordVideo(mediaRecorder) {
  let videoTimeline = document.querySelector('.video-timeline');

  // Define array to hold video recording
  let chunks = [];

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
    let videoUrl = window.URL.createObjectURL(blob);
    let newVideo = createVideo(videoUrl);
    videoTimeline.appendChild(newVideo);
    newVideo.play();
  }
}

/**
 * Creates an HTML video element.
 * @param {*} videoUrl the video source
 */
function createVideo(videoUrl) {
  let newVideo = document.createElement('video');
  newVideo.src = videoUrl;
  newVideo.className = 'recorded-video';
  // newVideo.setAttribute('controls', 'controls');

  return newVideo;
}