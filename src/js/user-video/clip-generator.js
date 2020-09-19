import { selectVideoClip } from './video-manager.js';
import { isLoading } from '../loading-spinner/loading-spinner.js';

const videoTimeline = document.querySelector('.video-timeline');

/**
 * Extracts frames from the provided video by drawing to canvas at a preset interval.
 * @param {*} video The video to extract frames from
 * @param {*} duration The duration of the video
 * @param {*} width The width of the video
 */
export function extractFrames(video, duration, width) {
  let seekResolve;

  const seekResolver = async function () {
    if (seekResolve) seekResolve();
  }

  video.addEventListener('seeked', seekResolver);

  video.addEventListener('loadeddata', async function () {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    let [w, h] = [this.videoWidth, this.videoHeight]
    canvas.width = w;
    canvas.height = h;

    let frames = [];
    let interval = 2; // The seconds interval at which frames are extracted
    let currentTime = 0;
    
    // Loop through the video and draw frames to the canvas
    while (currentTime < duration) {
      this.currentTime = currentTime;
      await new Promise(r => seekResolve = r);

      context.drawImage(this, 0, 0, w, h);
      let imgUrl = canvas.toDataURL();
      frames.push(imgUrl);

      currentTime += interval;
    }

    // Reset to beginning and remove seek action listener
    this.currentTime = 0;
    this.removeEventListener('seeked', seekResolver);

    // Generate and append video clip to timeline
    generateVideoClip(frames, width, duration);
  });
}

/**
 * Generates a video clip div element from the extracted frames.
 * @param {*} frames The array of extracted frames
 * @param {*} width The required width of the video frame
 * @param {*} videoDuration The duration of the video
 */
function generateVideoClip(frames, width, videoDuration) {
  // Create new video clip element
  const videoClipElem = document.createElement('div');
  videoClipElem.setAttribute('class', 'video-clip');
  videoClipElem.setAttribute('style', `width: ${width}`)
  // Store the duration of the clip in a custom data attribute for convenient accessibility
  videoClipElem.setAttribute('data-video-duration', videoDuration);

  // Add each extracted frame as a child image to the video clip element
  frames.map(imgUrl => {
    let img = document.createElement('img');
    img.setAttribute('src', imgUrl);
    img.setAttribute('class', 'frame');
    videoClipElem.appendChild(img);
  })

  // Add event listener for video selection from video-manager
  videoClipElem.addEventListener('click', selectVideoClip);
  videoTimeline.appendChild(videoClipElem);
  
  // Stop loading spinner on timeline
  isLoading(false, document.querySelector('.timeline'));
}
