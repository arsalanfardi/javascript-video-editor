// import * as Dropzone from "dropzone/dist/dropzone.js";
import tippy from 'tippy.js';

const uploadBtn = document.querySelector('#upload');
const uploadPanel = document.querySelector('.upload-panel');
const modal = document.querySelector('.modal');
const inputElement = document.querySelector('#file-input');
const previewPanel = document.querySelector('.file-preview-panel');

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

  inputElement.addEventListener("change", handleFiles);
}

/**
 * The event listener for file input which displays the file preview and 
 * provides the option to confirm upload.
 */
function handleFiles() {
  // The file list from input, currently a single item since multiple upload is disallowed.
  const fileList = this.files;

  // Display a preview of the selected file and the button for upload confirmation.
  document.querySelector('.filename-preview').innerHTML = fileList[0].name;
  previewPanel.style.display = 'block';
}

/**
 * Opens the upload menu by setting the display of the modal
 * and upload panel to none.
 * 
 * The file preview is kept closed so that the user must select another file.
 */
function openUpload() {
  modal.style.display = 'block';
  uploadPanel.style.display = 'block';
}

/**
 * Closes the upload menu by setting displays to none.
 */
function closeUpload() {
  modal.style.display = 'none';
  uploadPanel.style.display = 'none';
  previewPanel.style.display = 'none';
}