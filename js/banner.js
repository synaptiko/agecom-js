jQuery.noConflict();
jQuery(document).ready(function($) {
	var slideDuration = 500;
	var opacityDuration = 250;
	var autoDelay = 5000;

	var $bannerRoot = $('#banner');

  if ($bannerRoot.length === 0) {
    return;
  }

	var currentBlockNr = 0;
  var imageWidth = 384;
  var blockCount = 0;
	var autoDelayInterval;
  var data;

	createBanner();
  generateStyles();
	bindEvents();
	startAutoDelay();

	function createBanner() {
		var $textContainer, $inner, $carousel, $blockTpl, $block;
		var text, i, ln, image, images, backgroundCss;

		data = $bannerRoot.data('banner');
    blockCount = data.images.length;

		$bannerRoot.empty();

		$inner = $('<div class="inner">');
		$textContainer = $('<div class="block text"><div class="text-container"><div class="banner-header"><h1/></div><div class="banner-text"/></div><div class="banner-arrow"/></div>');
		$carousel = $('<div class="carousel"><div class="outer-wrap"><div class="wrap"/></div></div>');
		$blockTpl = $('<div class="block"><div class="inner"><h1/></div></div>');

		$bannerRoot.append($inner);
		$inner.append($textContainer);
		
		text = data.texts[0];
		$textContainer.find('h1').text(text.header);
		$textContainer.find('.banner-text').text(text.text);

		$inner.append($carousel);
		$carousel = $carousel.find('.wrap');
		images = data.images;
		for (i = 0, ln = images.length; i < ln; i++) {
			image = images[i];
			$block = $blockTpl.clone();

			backgroundCss = {
				backgroundImage: 'url(' + image.img + ')'
			};

			$block.find('.inner').css(backgroundCss).addClass('fader');
			$block.find('h1').text(image.text);
			$block.addClass('block' + (i + 1));
			$block.css(backgroundCss);
			$block.data('url', image.url);

			$carousel.append($block);
		}
	}

  function generateStyles() {
    var carouselStyles, i, blockStyle, blockStyles, styles;

    carouselStyles = [
      '#banner .carousel .outer-wrap {',
        'width: ' + (imageWidth * blockCount) + 'px;',
      '}',
      '#banner .carousel .wrap {',
        'width: ' + (imageWidth * (blockCount + 1)) + 'px;',
      '}'
    ];

    blockStyles = [];
    for (i = 0; i < (blockCount + 1); i++) {
      blockStyle = [
        '#banner .carousel .block' + (i + 1) + ' {',
          'left: ' + (i * imageWidth) + 'px;',
        '}'
      ];
      blockStyles = blockStyles.concat(blockStyle);
    }

    styles = carouselStyles.concat(blockStyles);
    $('head').append('<style>' + styles.join('') + '</style>');
  }

	function bindEvents() {
		var $blocks = $('.carousel .block', $bannerRoot);
		
		$blocks.hover(function() {
			$('.fader, h1', this).stop(true).animate({ opacity: 1 }, slideDuration);
			clearInterval(autoDelayInterval);
		}, function() {
			$('h1', this).stop(true).animate({ opacity: 0 }, opacityDuration);
			$('.fader', this).stop(true).animate({ opacity: 0 }, slideDuration);
			startAutoDelay();
		});
		$blocks.click(function() {
			window.location = $(this).data('url');
		});

		$('.banner-arrow', $bannerRoot).hover(function() {
			clearInterval(autoDelayInterval);
		}, function() {
			startAutoDelay();
		});
		$('.banner-arrow', $bannerRoot).click(next);
	}

	function next() {
		currentBlockNr++;
		currentBlockNr = currentBlockNr % blockCount;
		slideTo();
	}

	function startAutoDelay() {
		autoDelayInterval = setInterval(next, autoDelay);
	}

	var $textContainer = $('.block.text .text-container', $bannerRoot);
	var $carouselWrap = $('.carousel .wrap', $bannerRoot);
	var animationFinished = true;
	function slideTo() {
		var $firstBlock, $lastBlock;

		if (animationFinished === false) {
			return;
		}

		animationFinished = false;

		$firstBlock = $carouselWrap.find('.block:first-child');
		$lastBlock = $firstBlock.clone(true);
		$lastBlock.addClass('block' + (blockCount + 1));
		$carouselWrap.append($lastBlock);

		$carouselWrap.animate({
			left: -384
		}, slideDuration, function() {
			animationFinished = true;
			$carouselWrap.css({ left: 0 });
			
			if ($firstBlock) {
				$firstBlock.remove();
				$carouselWrap.find('.block').each(function(i, el) {
					$(el).attr('class', 'block block' + (i + 1));
				});
			}
		});

		$textContainer
			.animate({ opacity: 0 }, opacityDuration, function() {
				var text = data.texts[currentBlockNr];
				$('h1', this).text(text.header);
				$('.banner-text', this).text(text.text);
			})
			.animate({ opacity: 1 }, opacityDuration);
	}
});
