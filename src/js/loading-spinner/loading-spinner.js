/**
 * Manages the loading spinner for the specified element based upon the provided
 * isLoading flag.
 * 
 * @param {*} isLoading boolean value indicating the loading status
 * @param {*} element the element to append or remove the loading spinner
 */
export function isLoading(isLoading, element) {
  if (isLoading) {
    // Append in first position
    element.prepend(createLoadingSpinner());
  } else {
    // Locate position of loading spinner in element child nodes and remove
    const childNodes = Array.from(element.childNodes);
    const index = childNodes.indexOf(document.querySelector('.loading'));
    if (index > -1) {
      childNodes[index].remove();
    }
  }
}

/**
 * Creates a loading spinner element.
 */
function createLoadingSpinner() {
  const loadingElement = document.createElement('div');
  loadingElement.setAttribute('class', 'loading');
  const loadingSpinner = document.createElement('div');
  loadingSpinner.setAttribute('id', 'loading-spinner');
  loadingElement.appendChild(loadingSpinner);

  return loadingElement;
}