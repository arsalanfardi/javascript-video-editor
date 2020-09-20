import {Sortable} from '@shopify/draggable';
import { moveRecording, pause } from '../playback/playback';
import { getTimeFromPos } from './timeline-scrubber';

export function rearrangeVideos() {
  const containerSelector = '.video-timeline';
  const containers = document.querySelectorAll(containerSelector);

  if (containers.length === 0) {
    return false;
  }

  const sortable = new Sortable(containers, {
    draggable: '.video-clip',
    mirror: {
      appendTo: containerSelector,
      constrainDimensions: true,
    },
    delay: 250
  });

  sortable.on('sortable:stop', (sortableEvent) => {
    pause() // Pause playback
    moveRecording(sortableEvent.oldIndex, sortableEvent.newIndex)
    getTimeFromPos(); // Get time from scrubber position to resync the playback loop
  });
  return sortable;
}