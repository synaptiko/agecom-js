jQuery.noConflict();
jQuery(document).ready(function($) {
  var duration = 500;

  $('.anim-hover').each(function() {
    var $this = $(this);
    var classes = $this.attr('class').split(/\s+/);
    
    classes.splice(classes.indexOf('anim-hover'), 1);
    classes.push('inner');
    $(this).append('<div class="' + classes.join(' ') + '">');
  });
  $('.anim-hover').hover(function() {
    $('.inner', this).stop(true).animate({ opacity: 1 }, duration);
  }, function() {
    $('.inner', this).stop(true).animate({ opacity: 0 }, duration);
  });
});
