import { pauseScrubber, startScrubber, resetScrubber } from '../timeline/timeline-scrubber.js';

/** Array of recorded video elements */
let recordings = [];
/** Index to track the current video within recordings */
let rec_index = 0;
/** Playing status */
let isPlaying = false;

const playButton = document.querySelector('#play');
const restartButton = document.querySelector('#restart');

playButton.addEventListener('click', togglePlay);
restartButton.addEventListener('click', restart)

/**
 * Adds a new video element to the recordings array.
 * @param {*} videoElement the new video element
 */
export function addRecording(videoElement) {
  recordings.push(videoElement);
}

/**
 * Plays and pauses videos depending on the user selection.
 */
function togglePlay() {
  if (recordings.length != 0 && rec_index < recordings.length) {
    isPlaying = !isPlaying;
    if (isPlaying) {
      setPlayButtonClass();
      playVideos();
      startScrubber();
    } else {
      setPlayButtonClass();
      recordings[rec_index].pause();
      pauseScrubber();
    }
  }
}

/**
 * Recursive function for sequentially playing the videos in the recordings array.
 */
function playVideos() {
  if (isPlaying) {
    const video = recordings[rec_index];
    video.play();
    // Once video ends play the next video or pause if at the end
    video.onended = () => {
      rec_index++;
      if (rec_index < recordings.length) {
        playVideos();
      } else {
        pauseScrubber();
        isPlaying = false;
        setPlayButtonClass();
      }
    }
  }
}

/**
 * Resets the scrubber and rec_index back to zero.
 */
function restart() {
  // Ensure any current videos are paused
  if (rec_index < recordings.length) {
    recordings[rec_index].pause();
  }

  isPlaying = false;
  setPlayButtonClass();
  resetScrubber();

  // Reset each video element to the beginning
  recordings.forEach(video =>
    video.currentTime = 0
  );

  rec_index = 0;
}

/**
 * Sets the play button's class depending on isPlaying's status.
 */
function setPlayButtonClass() {
  if (isPlaying) {
    playButton.className = 'btn-settings fas fa-pause fa-sm';
  } else {
    playButton.className = 'btn-settings fas fa-play fa-sm';
  }
}