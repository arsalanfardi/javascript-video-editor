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
  if (recordings.length != 0) {
    isPlaying = !isPlaying;
    if (isPlaying) {
      setPlayButtonClass();
      playVideos();
    } else {
      setPlayButtonClass();
      recordings[rec_index].pause();
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
      if (rec_index < recordings.length - 1) {
        rec_index++;
        playVideos();
      } else {
        rec_index = 0;
        playButton.className = 'btn-settings fas fa-play fa-sm';
      }
    }
  }
}

function restart() {
  recordings[rec_index].pause();
  isPlaying = false;
  setPlayButtonClass();

  // Reset each video element to the beginning
  recordings.forEach(video =>
    video.currentTime = 0
  );

  rec_index = 0;
}

function setPlayButtonClass() {
  if (isPlaying) {
    playButton.className = 'btn-settings fas fa-pause fa-sm';
  } else {
    playButton.className = 'btn-settings fas fa-play fa-sm';
  }
}