// import getBlobDuration from '../../../node_modules/get-blob-duration/src/getBlobDuration.js';
import getBlobDuration from 'get-blob-duration';
import { decrementTotalTime, getTimelineElementWidth, incrementTotalTime } from '../timeline/timeline.js';
import { addRecording, removeRecording } from '../playback/playback.js';

const videoTimeline = document.querySelector('.video-timeline');
let selectedVideo;
document.querySelector('#delete').addEventListener('click', deleteVideo);

/**
 * Asynchronous function to create an HTML video element of appropriate width and append it to the video timeline.
 * @param {*} videoUrl the video source
 * @return {*} newVideo the recorded-video element
 */
export async function createVideo(videoUrl, blob) {
  // Get duration of the blob
  const duration = await getBlobDuration(blob);
  console.log(duration);

  // Create new video element
  const newVideo = createVideoElement(videoUrl);

  // Width of the video is the current width of a timeline element times the duration of the video in seconds
  newVideo.style.width = (duration*getTimelineElementWidth()) + 'px';
  console.log(newVideo.style.width);

  // Increment seconds on timeline if necessary
  incrementTotalTime(duration);

  videoTimeline.appendChild(newVideo);
  addRecording(newVideo);
}

/**
 * Creates an HTML video element.
 * @param {*} videoUrl the video source
 */
function createVideoElement(videoUrl) {
  const newVideo = document.createElement('video');
  newVideo.src = videoUrl;
  newVideo.className = 'recorded-video';
  newVideo.addEventListener('click', selectVideo);

  return newVideo;
}

function selectVideo() {
  let videoElement = event.target;
  if (videoElement !== selectedVideo && selectedVideo) {
    selectedVideo.id = null;
  }
  videoElement.id = 'selected-video';
  selectedVideo = videoElement;
}

async function deleteVideo() {
  if (selectedVideo) {
    const duration = await getBlobDuration(selectedVideo.src);
    decrementTotalTime(duration);
    removeRecording(selectedVideo, duration);
    selectedVideo.remove();
    selectedVideo = null;
  }
}

export function getCumulativeWidthByIndex(index) {
  const videoElements = videoTimeline.childNodes;
  let totalWidth = 0;
  for(let i=0; i <= index && i < videoElements.length; i++) {
    totalWidth += parseFloat(videoElements[i].style.width);
  }
  return totalWidth;
}