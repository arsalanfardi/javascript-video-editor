import { moveScrubberByAmount, pauseScrubber, resetScrubber, startScrubber, moveScrubberToPosition } from '../timeline/timeline-scrubber.js';
import { getTimelineElementWidth } from '../timeline/timeline.js';
import { getCumulativeWidthByIndex } from '../user-video/video-manager.js';

/** Array of recorded video elements */
export let recordings = [];
/** Index to track the current video within recordings */
let rec_index = 0;
/** Playing status */
export let isPlaying = false;

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

export function removeRecording(index, duration) {
  if (index > -1) {
    if (index === rec_index) {
      removeCurrentVideo(index);
    } else {
      // The video to be deleted is either before or after the current playing video,
      // if before, then reposition scrubber and decrement rec_index
      if (index < rec_index) {
        moveScrubberByAmount(-duration*getTimelineElementWidth());
        rec_index--;
      }
      recordings.splice(index, 1);
    }
  }
}

function removeCurrentVideo(index) {
  let deletedVideo = recordings.splice(index, 1)[0];
  deletedVideo.pause();
  // Get the cumulative width up to the video prior to this one
  let newScrubberPosition = getCumulativeWidthByIndex(index-1) + 'px';
  // Move scrubber to the new position
  moveScrubberToPosition(newScrubberPosition);
  // If this video was the last in the series then pause the timeline,
  // otherwise keep playing videos if isPlaying is true.
  if (rec_index === recordings.length) {
    pause();
  } else if (isPlaying) {
    playVideos();
  }
}

/**
 * Plays and pauses videos depending on the user selection.
 */
function togglePlay() {
  // Check whether videos exist and that there are more to be played
  if (recordings.length != 0 && rec_index < recordings.length) {
    isPlaying = !isPlaying;
    if (isPlaying) {
      setPlayButtonClass();
      playVideos();
      startScrubber();
    } else {
      // Pause the current video
      // recordings[rec_index].pause();
      pause();
    }
  }
}

/**
 * Recursive function for sequentially playing the videos in the recordings array.
 */
function playVideos() {
  const video = recordings[rec_index];
  video.play();
  // Once video ends play the next video or pause if at the end
  video.onended = () => {
    // Increment rec_index on video end.
    rec_index++;
    // If there are more videos to play perform another recursive call, otherwise pause.
    if (rec_index < recordings.length) {
      playVideos();
    } else {
      pause();
    }
  }
}

/**
 * Resets the scrubber and rec_index back to zero.
 */
function restart() {
  // Ensure any current videos are paused
  pause();
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

/**
 * Pauses scrubber and sets isPlaying to false.
 */
export function pause() {
  // Pause the current video
  if (rec_index < recordings.length) recordings[rec_index].pause();
  pauseScrubber();
  isPlaying = false;
  setPlayButtonClass();
}