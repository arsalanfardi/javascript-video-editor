import tippy from 'tippy.js';
import { createVideo } from '../user-video/video-manager';

const uploadBtn = document.querySelector('#upload');
const uploadPanel = document.querySelector('.upload-panel');
const modal = document.querySelector('.modal');
const inputElement = document.querySelector('#file-input');
const previewPanel = document.querySelector('.file-preview-panel');
const previewVideo = document.querySelector('#preview-video');
/** List for storing selected input files */
let fileList;

/** Set event listener for upload confirmation button */
document.querySelector('#confirm-upload').addEventListener('click', uploadVideoToTimeline);

tippy(uploadBtn, {
  content: 'Upload',
  arrow: false
});

/**
 * Prepares the upload menu by setting up event listeners for opening and closing of menu,
 * and upload confirmation.
 */
export function prepareUpload() {
  uploadBtn.addEventListener('click', openUpload);
  document.querySelector('#upload-close').addEventListener('click', closeUpload);

  inputElement.addEventListener('change', handleFiles);
  // Reset input element on each click to trigger onchange event even if same path is selected
  inputElement.addEventListener('click', function() {
    this.value = null;
  });
}

/**
 * The event listener for file input which displays the file preview and 
 * provides the option to confirm upload.
 */
function handleFiles() {
  // The file list from input, currently a single item since multiple upload is disallowed.
  fileList = Array.from(this.files);
  let blob = fileList[0];
  let videoUrl = window.URL.createObjectURL(blob);
  previewVideo.src = videoUrl;

  // Display a preview of the selected file and the button for upload confirmation.
  document.querySelector('.filename-preview').innerHTML = fileList[0].name;
  previewPanel.setAttribute('style', 'display: block');
}

/**
 * 
 */
function uploadVideoToTimeline() {
  fileList.map(fileBlob => {
    let videoUrl = window.URL.createObjectURL(fileBlob);
    createVideo(videoUrl, fileBlob);
  });
  closeUpload();
}

/**
 * Opens the upload menu by setting the display of the modal
 * and upload panel to none.
 * 
 * The file preview is kept closed so that the user must select another file.
 */
function openUpload() {
  modal.setAttribute('style', 'display: block');
  uploadPanel.setAttribute('style', 'display: block');
}

/**
 * Closes the upload menu by setting displays to none.
 */
function closeUpload() {
  modal.setAttribute('style', 'display: none');
  uploadPanel.setAttribute('style', 'display: none');
  previewPanel.setAttribute('style', 'display: none');
  previewPanel.removeAttribute('src');
}