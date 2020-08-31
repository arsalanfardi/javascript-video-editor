// import * as Dropzone from "dropzone/dist/dropzone.js";
import tippy from 'tippy.js';

const uploadBtn = document.querySelector('#upload');
const uploadPanel = document.querySelector('.upload-panel');
const modal = document.querySelector('.modal');
const inputElement = document.querySelector('#file-input')

tippy(uploadBtn, {
  content: 'Upload',
  arrow: false
});

export function prepareUpload() {
  uploadBtn.addEventListener('click', openUpload);
  document.querySelector('#upload-close').addEventListener('click', closeUpload);

  inputElement.addEventListener("change", handleFiles);

  // window.Dropzone = require('dropzone/dist/min/dropzone.min');
  // Dropzone.options.dropzoneClass = {
  //   autoProcessQueue: 'false', // Turns off automatic POST by dropzone
  //   paramName: "file", // The name that will be used to transfer the file
  //   acceptedFiles: 'video/*',
  //   maxFilesize: 1, // MB
  //   url: '/file-upload',
  //   init: function() {
  //     this.on("drop", function(file) { alert("Added file."); });
  //   },
  //   accept: function(file, done) {
  //     if (file.name == "justinbieber.jpg") {
  //       done("Naha, you don't.");
  //     }
  //     else { done(); }
  //   }
  // };
}

function handleFiles() {
  const fileList = this.files; /* now you can work with the file list */
  console.log(fileList)
}

function openUpload() {
  modal.style.display = 'block';
  uploadPanel.style.display = 'block';
}

function closeUpload() {
  modal.style.display = 'none';
  uploadPanel.style.display = 'none';
}