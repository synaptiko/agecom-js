jQuery.noConflict();
jQuery(document).ready(function($) {
  var duration = 1000;

  if (window.location.hash.length > 0) {
    var name = window.location.hash.slice(1);
    var $target = $('.' + name + '-anim-hash');

    if ($target.length > 0) {
      scrollTo($target);
    }
  }

  $('a[href*=#]').each(function() {
    var href = $(this).attr('href');
    var name = href.match('#(.*)');
    var $target = $('.' + name[1] + '-anim-hash');

    if ($target.length > 0) {
      $(this).on('click', function(event) {
        scrollTo($target, function() {
          window.location.hash = href;
        });
        event.preventDefault();
      });
    }
  });

  function scrollTo($target, callback) {
    $('html, body').stop().animate({
      'scrollTop': $target.offset().top
    }, duration, 'swing', callback);
  }
});
