/*************************************************!
 *
 *   project:   Basic Slider
 *   author:    Marco Senkpiel
 *   url:       http://marco-senkpiel.de/2013/03/27/jquery-basic-slider-plugin/
 *   demo:      http://labs.marco-senkpiel.de/demos/basic-slider/
 *   download:  https://github.com/basilicom/basic-slider
 *
 *   Version:   1.2
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
                onComplete: null,
                navigationContainer:null,
                fullWidth:false
            },

            settings = $.extend({}, defaults, options),

            methods = {
                next:function(){
                    core.nextSlide();
                },

                prev:function(){
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
                isNavigation:false,
                fullWithOffset:0,

                addIndices: function () {
                    core.slides.each(function (index) {
                        $(this).data('index', index);
                    });
                },

                applyStyles: function () {

                    if(settings.fullWidth){
                        settings.width = slider.parent().width()
                    }

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

                        if(settings.fullWidth){
                            var slideWidth = $this.outerWidth(true);
                            core.fullWithOffset = (slider.parent().width() / 2) - (slideWidth / 2);
                            left = (slideWidth * index) + core.fullWithOffset;

                            $this.css({
                                left: left
                            });
                        } else {
                            $this.css({
                                left: left,
                                width: settings.width,
                                height: '100%'
                            });
                        }

                        core.initialPositions[index] = left;
                    });
                },

                animateSlides: function () {
                    core.onAnimationStart();
                    core.slides.each(function (index) {
                        var $slide = $(this);
                        var left = (core.initialPositions[index] - ($slide.outerWidth(true) * core.currentSlide));

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

                        if(core.isNavigation){
                            core.updateNavigation();
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

                createNavigation:function(){
                    var $navCon = settings.navigationContainer;
                    for (var i = 0; i < core.slidesCount; i++) {
                        var item = '<a href="#'+i+'"></a>';
                        $navCon.append(item);
                    }

                    $('a', $navCon).on('click',function(e){
                        e.preventDefault();
                        var id = parseInt($(e.currentTarget).attr('href').substr(1));
                        core.goToSlide(id);
                    });

                    core.updateNavigation();
                },

                updateNavigation:function(){
                    var $navCon = settings.navigationContainer;
                    $('a', $navCon).each(function(index, el){
                        $(this).removeClass('active');
                        var id = parseInt($(this).attr('href').substr(1));
                        if(id == core.currentSlide){
                            $(this).addClass('active');
                        }
                    });
                },

                addResizeListener:function(){
                    $(window).resize(function (e) {
                        core.setInitialPositions();
                    });
                },

                init: function () {
                    core.slides = slider.children('.slide');
                    core.slidesCount = core.slides.length;
                    
                    core.addIndices();
                    core.applyStyles();
                    core.setInitialPositions();

                    if(settings.navigationContainer != null){
                        core.isNavigation = true;
                        core.createNavigation();
                    }

                    if(settings.fullWidth){
                        core.addResizeListener();
                    }
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