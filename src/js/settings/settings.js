import { initializeUserVideo } from '../user-video/user-video.js';

/**
 * Binds the event listeners to the settings buttons
 */
export function initializeSettings() {
    document.querySelector('#settings').addEventListener('click', openSettings);
    document.querySelector('#settings-close').addEventListener('click', closeSettings)
}

/**
 * Opens the settings panel by setting display to block, and displays user
 * media options in selection menus
 */
function openSettings() {
    initializeUserVideo('#settingsUserVideo');
    const audioSelect = document.querySelector('#audio-input');
    const videoSelect = document.querySelector('#video-input');
    // Remove the existing options in the dropdown menus to prevent duplication
    audioSelect.innerHTML = '';  
    videoSelect.innerHTML = '';
    
    // Make the settings panel visible
    document.querySelector('.settings-panel').style.display = "block";

    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      devices.forEach(device => {
        var opt = document.createElement('option')
        if (device.kind == 'audioinput') {
          opt.appendChild(document.createTextNode(device.label))
          audioSelect.appendChild(opt);
        } else if (device.kind == 'videoinput') {
          opt.appendChild(document.createTextNode(device.label))
          videoSelect.appendChild(opt);
        }
      });
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}

/**
 * Closes 
 */
function closeSettings() {
    document.querySelector('.settings-panel').style.display = "none";
}