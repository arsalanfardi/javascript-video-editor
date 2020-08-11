import { dragElement } from './draggable.js';
import { getTimelineElementWidth, incrementTotalTime } from '../timeline/timeline.js';
import getBlobDuration from '../../../node_modules/get-blob-duration/src/getBlobDuration.js';
import { resetTimer, startTimer } from '../timer/timer.js';

let recordings = [];

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
          if (!recording) {
            mediaRecorder.start();
            recording = true;
            start.className = 'fas fa-square fa-sm';
            video.style.border = '1px solid red';
            startTimer();
          } else {
            mediaRecorder.stop()
            recording = false;
            start.className = 'fas fa-circle fa-sm';
            video.style.border = 'none';
            resetTimer();
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
  const videoTimeline = document.querySelector('.video-timeline');

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
    createVideo(videoUrl, blob).then(newVideo => {
      videoTimeline.appendChild(newVideo);
      // recordings.append(newVideo);
    }).catch(
      console.log
    );   
  }
}

/**
 * Asynchronous function to create an HTML video element of appropriate width.
 * @param {*} videoUrl the video source
 * @return {*} newVideo the recorded-video element
 */
async function createVideo(videoUrl, blob) {
  // Get duration of the blob
  const duration = await getBlobDuration(blob);
  console.log(duration)

  // Create new video element
  const newVideo = document.createElement('video');
  newVideo.src = videoUrl;
  newVideo.className = 'recorded-video';

  // Width of the video is the current width of a timeline element times the duration of the video in seconds
  newVideo.style.width = (duration*getTimelineElementWidth()) + 'px';
  console.log(newVideo.style.width)

  // Increment seconds on timeline if necessary
  incrementTotalTime(duration);
  return newVideo;
}