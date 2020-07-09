import { dragElement } from './draggable.js';

/* 

*/
export function initializeUserVideo(id) {
    let video = document.querySelector(id);

    dragElement(video);

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then(function (stream) {
            video.srcObject = stream;
          })
          .catch(function (error) {
            console.log("Something went wrong!", error);
          });
      }
}

