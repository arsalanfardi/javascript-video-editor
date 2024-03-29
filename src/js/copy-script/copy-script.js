import tippy from 'tippy.js';

const copyBtn = document.querySelector('#copyScript');

tippy(copyBtn, {
  content: 'Copy script',
  arrow: false,
});

tippy(copyBtn, {
  trigger: 'click',
  content: 'Script copied!',
  arrow: false,
  onShow(instance) {
    setTimeout(() => {
      instance.hide();
    }, 1000);
  }
});

/**
 * Adds event listener to the copy button.
 */
export function prepareCopy() {
  copyBtn.addEventListener('click', copyScript);
}

/**
 * Copies the script upon clicking of the copy button.
 */
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
  tippy(copyBtn, {
    content: 'Copy Script',
    arrow: false,
  });
}