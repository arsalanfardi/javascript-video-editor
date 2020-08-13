const timelineScrubber = document.querySelector('.timeline-scrubber');

timelineScrubber.animate({
  left: '5px'
}, {
  duration: 5000,
  easing: "linear",
//   step: function(x) {
// //                        $(".timer").text(playbackPercentage); 
//   }
});