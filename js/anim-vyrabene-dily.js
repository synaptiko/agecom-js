jQuery.noConflict();
jQuery(document).ready(function($) {
  var duration = 500;
  var $images = $('.image_prehled');

  if ($images.length > 0) {
    $images.each(function() {
      $('#' + this.id + '_over').css({ opacity: 0 });
    });

    var origShowMouseOverArea = window._showMouseOverArea;
    var origHideMouseOverArea = window._hideMouseOverArea;
    var overtakenAreas = {};
    window._hideMouseOverArea = function(areaId) {
      if (!overtakenAreas[areaId]) origHideMouseOverArea(areaId);
    };
    window._showMouseOverArea = function(parentId, areaId, params, e) {
      var $areaEl;
      if (!overtakenAreas[areaId]) {
        overtakenAreas[areaId] = true;
        origShowMouseOverArea(parentId, areaId, params, e);

        $areaEl = $('#' + areaId);
        $areaEl.hover(animateIn, animateOut);
        animateIn.apply($areaEl);
      }
    };

    function animateIn() {
      $(this).stop(true).animate({ opacity: 1 }, duration);
    }
    function animateOut() {
      $(this).stop(true).animate({ opacity: 0 }, duration);
    }
  }
});
