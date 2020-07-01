import { dragElement } from '../modules/draggable.js';

var video = document.querySelector('#videoElement');

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
}

dragElement(document.getElementById('videoElement'));

const container = document.getElementsByClassName('timeline')[0];
const node = document.getElementById('timeline__element');
for (let i=1; i<60; i++) {
  let nodeClone = node.cloneNode(true);
  nodeClone.querySelector('#timeline__seconds').innerHTML = i;
  container.appendChild(nodeClone);
}