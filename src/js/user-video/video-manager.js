// import getBlobDuration from '../../../node_modules/get-blob-duration/src/getBlobDuration.js';
import getBlobDuration from 'get-blob-duration';
import { extractFrames } from './clip-generator.js';
import { addRecording, recordings, removeRecording } from '../playback/playback.js';
import { decrementTotalTime, getTimelineElementWidth, incrementTotalTime } from '../timeline/timeline.js';

const videoTimeline = document.querySelector('.video-timeline');
let duration;
let selectedVideo;
document.querySelector('#delete').addEventListener('click', deleteVideo);

/**
 * Asynchronous function to create an HTML video element of appropriate width and append it to the video timeline.
 * @param {*} videoUrl the video source
 * @return {*} newVideo the recorded-video element
 */
export async function createVideo(videoUrl, blob) {
  // Get duration of the blob
  duration = await getBlobDuration(blob);
  console.log(duration);

  // Width of the video is the current width of a timeline element times the duration of the video in seconds
  let width = (duration * getTimelineElementWidth()) + 'px';
  console.log(width);

  // Create new video element
  const newVideo = createVideoElement(videoUrl, width);

  // Increment seconds on timeline if necessary
  incrementTotalTime(duration);

  // Add recording to playback list
  addRecording(newVideo);
}

/**
 * Creates an HTML video element.
 * @param {*} videoUrl the video source
 */
function createVideoElement(videoUrl, width) {
  const newVideo = document.createElement('video');
  newVideo.className = 'recorded-video';

  // Extract frames and generate clip
  extractFrames(newVideo, duration, width);

  newVideo.setAttribute('src', videoUrl);

  return newVideo;
}

export function selectVideoClip() {
  let videoClipElem = event.target.parentElement;
  if (videoClipElem !== selectedVideo && selectedVideo) {
    selectedVideo.removeAttribute('id');
  }
  videoClipElem.setAttribute('id', 'selected-video');
  selectedVideo = videoClipElem;
}

/**
 * Deletes the currently selected video by removing it from the recordings array and
 * decrementing the total time.
 */
async function deleteVideo() {
  if (selectedVideo) {
    let index = Array.from(videoTimeline.childNodes).indexOf(selectedVideo);
    const duration = await getBlobDuration(recordings[index].src);
    decrementTotalTime(duration);
    removeRecording(index, duration);
    selectedVideo.remove();
    selectedVideo = null;
  }
}

/**
 * Returns the cumulative width up to and including the specified video index.
 * @param {*} index 
 */
export function getCumulativeWidthByIndex(index) {
  const videoClips = Array.from(videoTimeline.childNodes);

  let totalWidth = 0;
  for (let i = 0; i <= index && i < videoClips.length; i++) {
    totalWidth += parseFloat(videoClips[i].style.width);
  }

  return totalWidth;
}