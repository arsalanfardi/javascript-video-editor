import { moveScrubberByAmount, pauseScrubber, resetScrubber, startScrubber, moveScrubberToPosition } from '../timeline/timeline-scrubber.js';
import { getTimelineElementWidth } from '../timeline/timeline.js';
import { getCumulativeWidthByIndex } from '../user-video/video-manager.js';
import getBlobDuration from 'get-blob-duration';
import { isLoading } from '../loading-spinner/loading-spinner.js';
import tippy from 'tippy.js';

/** Array of recorded video elements */
export let recordings = [];
/** Index to track the current video within recordings */
let rec_index = 0;
/** Playing status */
export let isPlaying = false;

const playBtn = document.querySelector('#play');
const restartBtn = document.querySelector('#restart');

playBtn.addEventListener('click', togglePlay);
restartBtn.addEventListener('click', restart)

tippy(restartBtn, {
  content: 'Restart',
  arrow: false
});

tippy(playBtn, {
  content: 'Play',
  arrow: false
});

/**
 * Adds a new video element to the recordings array.
 * @param {*} videoElement the new video element
 */
export function addRecording(videoElement) {
  recordings.push(videoElement);
}

/**
 * Removes a recording and adjusts the scrubber position accordingly.
 * @param {*} index The index of the video to be removed
 * @param {*} duration The duration of the video to be removed
 */
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
      setPlayBtnClass();
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
    // If there are more videos to play perform another recursive call, otherwise, pause the playback loop
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
  resetVideos();

  rec_index = 0;
}

/**
 * Pauses scrubber and sets isPlaying to false.
 */
export function pause() {
  // Pause the current video
  if (rec_index < recordings.length) recordings[rec_index].pause();
  pauseScrubber();
  isPlaying = false;
  setPlayBtnClass();
}

/**
 * Goes to a specified time in the playback loop.
 * @param {*} time the desired time in the playback loop in seconds
 */
export async function seekTime(time) {
  if (recordings.length === 0) return;

  // Start loading spinner
  isLoading(true, document.querySelector('.timeline'));

  // Reset videos to account for rewinding
  resetVideos();

  // Loop through the playback array and find the video at the specified time
  let durationSum = 0, duration = 0, index = 0;
  while (index < recordings.length) {
    duration = await getBlobDuration(recordings[index].src);
    durationSum += duration;
    // Exit loop once the sum of the durations has reached or surpassed the specified time
    if (durationSum >= time || index === recordings.length-1) break;
    index++;
  }

  let timeInVideo = time - (durationSum - duration);
  rec_index = index;
  console.log(index)
  recordings[rec_index].currentTime = timeInVideo;
  isLoading(false, document.querySelector('.timeline'));
}

/**
 * Moves a video element in recordings to a new index
 * @param {*} oldIndex The original index of the element in the recordings array
 * @param {*} newIndex The new index of the element in the recordings array
 */
export function moveRecording(oldIndex, newIndex) {
  if (oldIndex >-1 && newIndex > -1) {
    // Remove video from the previous index and add it back in at the new index
    recordings.splice(newIndex, 0, recordings.splice(oldIndex, 1)[0])
  }
}

/**
 * Resets all videos in the recordings array by setting their current time to 0.
 */
function resetVideos() {
  recordings.forEach(video =>
    video.currentTime = 0
  );
}

/**
 * Sets the play button's class depending on isPlaying's status.
 */
function setPlayBtnClass() {
  if (isPlaying) {
    playBtn.className = 'btn-settings fas fa-pause fa-sm';
    playBtn._tippy.setContent('Pause');
  } else {
    playBtn.className = 'btn-settings fas fa-play fa-sm';
    playBtn._tippy.setContent('Play');
  }
}