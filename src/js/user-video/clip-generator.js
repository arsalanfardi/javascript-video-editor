import { selectVideoClip } from './video-manager.js';

const videoTimeline = document.querySelector('.video-timeline');

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
    let interval = 2;
    let currentTime = 0;
  
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
    generateVideoClip(frames, width);
  });
}

function generateVideoClip(frames, width) {
  // Create new video clip element
  const videoClipElem = document.createElement('div');
  videoClipElem.setAttribute('class', 'video-clip');
  videoClipElem.setAttribute('style', `width: ${width}`)

  // Add each extracted frame as a child image to the video clip element
  frames.map(imgUrl => {
    let img = document.createElement('img');
    img.setAttribute('src', imgUrl);
    img.setAttribute('class', 'frame');
    videoClipElem.appendChild(img);
  })

  // Add event listener for video selection from video-manager
  videoClipElem.addEventListener('click', selectVideoClip)
  videoTimeline.appendChild(videoClipElem);
}
