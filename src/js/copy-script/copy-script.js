export function initializeCopy() {
  document.querySelector('#copyScript').addEventListener('click', copyScript);
}

function copyScript() {
  const script = document.querySelector('#script-body').innerHTML;
  // Create temporary text area to allow text to be copied
  const el = document.createElement('textarea');
  // Set the value of the text area to the script
  el.value = script;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}