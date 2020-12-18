$(document).ready(function () {
  let counterValue = 140;
  const $counter = $('.counter');
  $counter.text(counterValue);
  $('#tweet_input').on('input', function() {
    const characters = $(this).val().length 
    $counter.html(counterValue - characters);
     if (counterValue < characters) {
      $counter.css('color', 'red');
     } else {
      $counter.css('color', '#545149');
     }
  });
});