import { initializeUserVideo } from './user-video/user-video.js';
import { initializeTimeline } from './timeline/timeline.js';

initializeUserVideo();
initializeTimeline();

document.querySelector('#settings').addEventListener('click', showSettings)

function showSettings() {
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      console.log(device.kind + ": " + device.label +
                  " id = " + device.deviceId);
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}