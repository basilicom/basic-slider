/*************************************************!
 *
 *   project:   Basic Slider
 *   author:    Marco Senkpiel
 *   url:       http://marco-senkpiel.de/2013/03/27/jquery-basic-slider-plugin/
 *   demo:      http://labs.marco-senkpiel.de/demos/basic-slider/
 *   download:  https://github.com/basilicom/basic-slider
 *
 *   Version:   1.0
 *   Copyright: (c) 2013 Marco Senkpiel
 *   Licence:   MIT
 *
 **************************************************/

(function ($) {
    var BasicSlider = function (slider, options) {

        var defaults = {
                width:600,
                height:300,
                duration: 500,
                easing: 'swing',
                onStart: null,
                onComplete: null
            },

            settings = $.extend({}, defaults, options),

            methods = {
                next:function(){
                    console.log('next');
                    core.nextSlide();
                },

                prev:function(){
                    console.log('prev');
                    core.prevSlide();
                },

                goToSlide:function(num){
                    core.goToSlide(num-1);
                },

                goToIndex:function(num){
                    core.goToSlide(num);
                }
            },

            core = {
                slides: [],
                slidesCount: 0,
                currentSlide: 0,
                initialPositions:[],

                addIndices: function () {
                    core.slides.each(function (index) {
                        $(this).data('index', index);
                    });
                },

                applyStyles: function () {
                    slider.addClass('basic-slider').css({
                        width:settings.width,
                        height:settings.height
                    });

                    core.slides.each(function () {
                        $(this).css({
                            position: 'absolute'
                        });
                    });
                },

                setInitialPositions: function () {
                    core.slides.each(function (index) {
                        var $this = $(this);
                        var left = (settings.width * index);

                        core.initialPositions[index] = left;

                        $this.css({
                            left: left,
                            width: settings.width,
                            height: '100%'
                        });
                    });
                },

                animateSlides: function () {
                    core.onAnimationStart();
                    core.slides.each(function (index) {

                        var left = core.initialPositions[index] - (settings.width * core.currentSlide);

                        var $slide = $(this);
                        $slide.stop().animate({
                            left:left
                        },{
                            duration:settings.duration,
                            easing:settings.easing,
                            complete: core.onAnimationComplete
                        })

                    });
                },

                onAnimationStart: function () {
                    if (typeof settings.onStart === 'function') {
                        settings.onStart();
                    }
                },

                onAnimationComplete: function () {
                    if ($(this).data('index') == core.slidesCount - 1) {
                        if (typeof settings.onComplete === 'function') {
                            settings.onComplete(core.currentSlide+1, core.currentSlide);
                        }
                    }
                },

                nextSlide: function () {
                    if(core.currentSlide < core.slidesCount-1){
                        core.currentSlide++;
                        core.animateSlides();
                    }
                },

                prevSlide: function () {
                    if(core.currentSlide > 0){
                        core.currentSlide--;
                        core.animateSlides();
                    }
                },

                goToSlide: function (num) {
                    if(num >= 0 && num < core.slidesCount){
                        core.currentSlide = num;
                        core.animateSlides();
                    }
                },

                init: function () {
                    core.slides = slider.children('.slide');
                    core.slidesCount = core.slides.length;
                    
                    core.addIndices();
                    core.applyStyles();
                    core.setInitialPositions();
                }
            };

        core.init();

        return methods;
    };

    $.fn.basicSlider = function (method) {

        var element = this;
        var instance = element.data('basicSlider');

        if (typeof method === 'object' || !method) {
            return element.each(function () {
                var basicSlider;
                if (!instance){
                    basicSlider = new BasicSlider(element, method);
                    element.data('basicSlider', basicSlider);
                }
            });

        } else if (typeof method === 'string' && instance[method]) {
            // call public methods
            return instance[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    };
})(jQuery);