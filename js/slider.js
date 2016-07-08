$(function() {
	'use strict';

	function Slider(node, slides) {
		this.$node = $(node);
		this.slides = slides;
		this.$slider = this.buildDOM();
		this.$buttons = this.$slider.find('.slider-buttons');
		this.$gallery = this.$slider.find('.slider-gallery');
		this.currentImageIndex = 0;
		this.currentButton = null;
		this.hidingTimeout = null;
		this.isStopped = false;
		this.init();
	}

	Slider.prototype.buildDOM = function() {
		var self = this;
		var sliderWrapper = document.createElement('div');
		$(sliderWrapper)
			.addClass('slider-wrapper')
			.html('<div class="slider-left-column"></div>' + '<div class="slider-right-column"></div>');
		$(sliderWrapper).find('.slider-left-column').html(
			'<div class="slider-buttons">' +
			'<div class="slider-button" id="button-1"></div>' +
			'<div class="slider-button" id="button-2"></div>' +
			'<div class="slider-button" id="button-3"></div>' +
			'<div class="slider-button" id="button-4"></div>' +
			'</div>'
		);
		$(sliderWrapper).find('.slider-right-column').html(
			'<div class="slider-gallery">' +
			'<div class="slider-image"></div>' +
			'<div class="slider-image"></div>' +
			'<div class="slider-image"></div>' +
			'<div class="slider-image"></div>' +
			'</div>'
		);
		$(sliderWrapper).find('.slider-button').each(function() {
			$(this).append('<div class="slider-triangle">');
		});
		$(sliderWrapper).find('.slider-image').each(function(i) {
			$(this).append('<img src="' + 'img/' + self.slides[i] + '" >');
		});
		return $(sliderWrapper);
	};

	Slider.prototype.highlightButton = function(node) {
		$('.slider-active').removeClass('slider-active');
		$(node).addClass('slider-active');
		$('.visible').removeClass('visible');
		$(node).find('.slider-triangle').addClass('visible');
	};

	Slider.prototype.computeButtonIndex = function(node) {
		this.currentImageIndex = $(node).index();
		this.currentButton = $(node);
		return this.currentImageIndex;
	};

	Slider.prototype.computeImageScroll = function(node) {
		this.computeButtonIndex(node);
		if (this.currentImageIndex === 0) {
			return '000%';
		} else if (this.currentImageIndex === 1) {
			return '100%';
		} else if (this.currentImageIndex === 2) {
			return '200%';
		} else if (this.currentImageIndex === 3) {
			return '300%';
		}
	};

	Slider.prototype.animateScroll = function(node) {
		this.$gallery.stop().animate({
			right: this.computeImageScroll(node)
		}, 500);
	};

	Slider.prototype.sliderLogicManual = function(node) {
		this.highlightButton(node);
		this.animateScroll(node);
	};

	Slider.prototype.nextImage = function(button, index) {
		var nextIndex = 0;
		var nextButton;
		var buttonsCount = this.$buttons.find('.slider-button').length;
		nextIndex = (index < (buttonsCount - 1)) ? index += 1 : 0;
		nextButton = this.$buttons.find('.slider-button').eq(nextIndex);
		return nextButton;
	};

	Slider.prototype.sliderLogicAuto = function(self) {
		setTimeout(function autoScroll() {
			clearInterval(self.hidingTimeout);
			var currentImage = self.currentImage;
			var currentIndex = self.currentImageIndex;
			var nextImage = self.nextImage(currentImage, currentIndex);
			self.sliderLogicManual(nextImage);
			self.hidingTimeout = setTimeout(autoScroll, 2000);
		}, 2000);
	};

	Slider.prototype.initiateSliderBehaviourManual = function() {
		var self = this;
		this.$buttons.on('click', '.slider-button', function(event) {
			clearInterval(self.hidingTimeout);
			self.isStopped = true;
			self.sliderLogicManual(event.target);
		});
	};

	Slider.prototype.initiateSliderBehaviourAuto = function() {
		var self = this;
		this.sliderLogicAuto(this);
		var timerID = setTimeout(function wait() {
			if (self.isStopped === true) {
				clearInterval(timerID);
				self.sliderLogicAuto(self);
			}
			timerID = setTimeout(wait, 5000);
		}, 5000);
	};

	Slider.prototype.init = function() {
		this.initiateSliderBehaviourManual();
		this.initiateSliderBehaviourAuto();
		this.highlightButton(this.$buttons.find('.slider-button').eq(0));
		this.$node.append(this.$slider);
	};

	window.Slider = Slider;
});