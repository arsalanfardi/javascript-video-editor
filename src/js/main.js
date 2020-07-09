import { initializeUserVideo } from './user-video/user-video.js';
import { initializeTimeline } from './timeline/timeline.js';

initializeUserVideo('#userVideo');
initializeTimeline();

document.querySelector('#settings').addEventListener('click', showSettings)

const audioSelect = document.querySelector('#audio-input')
const videoSelect = document.querySelector('#video-input')

initializeUserVideo('#settingsUserVideo');

function showSettings() {
  document.querySelector('.settings-panel').style.display = "block";
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      var opt = document.createElement('option')
      opt.appendChild( document.createTextNode(device.kind + ": " + device.label) );
      console.log(device.kind + ": " + device.label +
                  " id = " + device.deviceId);
                  videoSelect.appendChild(opt);
      audioSelect.appendChild(opt);
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}



