/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  $(`#arrow`).click(function(event) {
    $(`.new-tweet`).slideToggle('fast', function() {
      $(`#tweet_input`).focus();
    })
    event.stopPropagation();
  })

  $(`.new-tweet`).hide();
  $(`.error-message`).hide();

  //Creates time between date tweeted and today's date
  const timePassed = (date) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    let todayDate = new Date();
    const timeDiff = (todayDate - date) / msPerDay;

    if (timeDiff >= 365) {
      return Math.floor(timeDiff / 365) + " years ago";
    } else if (timeDiff >= 1) {
      return Math.floor(timeDiff) + " days ago";
    } else if (timeDiff * 24 * 60 <=1) {
      return Math.floor(timeDiff * 24 * 60 * 60) + " seconds ago";
    } else if (timeDiff * 24 <= 1) {
      return Math.floor(timeDiff * 24 * 60) + " minutes ago";
    } else {
      return Math.floor(timeDiff * 24) + " hours ago";
    };
  };
  
  //Create single Tweet 
  const makeATweet = (tweet) => {
    const {
      name,
      avatars,
      handle,
    } = tweet.user;
    const { text } = tweet.content;
    const { created_at } = tweet;

    $footerText = timePassed( new Date(created_at));

    $retweet = 'images/Retweet.png';
    $flag = 'images/Flag.png';
    $like = 'images/Like.png';

    //new tweet header
    $header = $("<header>").html(`<img src=${avatars} alt="avatar">
    ${name}<span id="username">${handle}</span>`);

    $article = $("<article>");

    $article.addClass("tweet");

    //new tweet footer
    $footerTime = $('<div id="time">').html($footerText);
    $footerReaction = $('<div id="reactions">').html(`<img src=` + $flag + ` alt="flag">` + `<img src=` + $retweet + ` alt="retweet">` + `<img src=` + $like + ` alt="like">`);
    $footer = $("<footer>").append($footerTime, $footerReaction);
    
    $p = $("<p>").text(text);

    //PUT IT ALL TOGETHER
    $article.append($header, $p, $footer);

    return `<article class="tweet">` + $article.html() + `</article>`;
  }

  //Process array of tweet objects; stringify, render.
  const renderTweets = function(tweets) {
    const tweetArray = [];
    for (element of tweets) {
      const tweetElement = makeATweet(element);
      tweetArray.unshift(tweetElement);
    }

    $('main #tweet_container').append(tweetArray.join(''));
  }

//GET tweets
const loadTweets = () => {
  $.ajax({
    type: 'GET',
    url: '/tweets',
    success: function (data) {
      renderTweets(data);
    }
  });
};

loadTweets();

//SCROLL TO TOP BUTTON

const scrollToTop = () => {
  // Set a variable for the number of pixels we are from the top of the document.
  const c = document.documentElement.scrollTop || document.body.scrollTop;

  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    // ScrollTo takes an x and a y coordinate.
    // Increase the '10' value to get a smoother/slower scroll.
    window.scrollTo(0, c - c / 10);
  }
};

// Set a variable for our button element.
const scrollToTopButton = document.getElementById('js-top');

const scrollFunc = () => {
  // Get the current scroll value
  let y = window.scrollY;
   
  // If the scroll value is greater than the window height, add a class to the scroll-to-top button to show it.
  if (y > 0) {
    scrollToTopButton.className = "top-link show";
  } else {
    scrollToTopButton.className = "top-link hide";
  }
};

window.addEventListener("scroll", scrollFunc);

// When the button is clicked, run ScrolltoTop function
scrollToTopButton.onclick = function(e) {
  e.preventDefault();
  scrollToTop();
}

//END SCROLL TO TOP FUNCTIONALITY//


//LISTENER FOR SUBMIT
$('.container').find('form').on('submit', function(event) {
  event.preventDefault();
  const $form = $(event.target);
  const $textbox = $form.find('#tweet_input')
  const $tweet = $textbox.val();
  
  const counterValue = 140;
  if ($tweet === "") {
    $('.error-message').html("Please enter your tweet.");
    $('.error-message').show();
  } else if ($tweet.length > counterValue) {
    // $.fx.off = true;
    $('.error-message').html("Tweet exceeds maximum length!");
    $('.error-message').show();
  } else {
    $('.error-message').hide();
    $.ajax({
      type: 'POST',
      url: '/tweets',
      "data": $textbox,
      success: function() {
        $('.counter').html(counterValue);
        $('main #tweet_container').html("");
        loadTweets();
      }
    }).then(setTimeout($textbox.val(''), 1000))
  };
});
}); 