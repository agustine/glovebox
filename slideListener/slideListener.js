/**
 * jQuery移动端浏览器划屏监听插件
 *
 * $(selector)
 *   .supportSlide(options)
 *   .on('slideUp', callbackSlideUp)
 *   .on('slideDown', callbackSlideDown)
 *   .on('slideLeft', callbackSlideLeft)
 *   .on('slideRight', callbackSlideRight);
 *
 * options : {
 *     pixel: 30, // 划越像素距离最小判定，默认30像素
 *     interval: 0 // 2次划屏之间的有效判定毫秒数，防止用户一直划屏，造成的连续反复操作
 * }
 */


(function ($) {
    'use strict';
    // 2次有效划屏判定锁
    var lock = false,
        options;
    // 默认设定
    var defaultOptions = {
        pixel: 30, // 划越像素距离最小判定，默认30像素
        interval: 0 // 2次划屏之间的有效判定毫秒数，防止用户一直划屏，造成的连续反复操作
    };

    /**
     * 上锁
     */
    function lockSlide(){
        lock = true;
    };

    /**
     * 解锁
     */
    function unlockSlide(){
        lock = false;
    };

    /**
     * 出发划屏监听
     * @param {jQuery Object}   $elem       监听elem的jQuery对象
     * @param {String}          eventName   监听事件
     */
    function trigger($elem, eventName){
        var interval = options.interval;
        if(lock){
            return;
        }
        $elem.trigger(eventName);
        if(interval){
            lockSlide();
            setTimeout(unlockSlide, interval);
        }
    };

    /**
     * 判断方向，返回滑动事件名称
     * @param  {Number} startX 起始点x轴像素值
     * @param  {Number} startY 起始点y轴像素值
     * @param  {Number} endX   结束点x轴像素值
     * @param  {Number} endY   结束点y轴像素值
     * @param  {Number} pixel  划越像素距离最小判定像素距离值
     * @return {String}        返回滑动事件名称
     */
    function direction (startX, startY, endX, endY, pixel) {
        'use strict';
        var pixelX = endX - startX;
        var pixelY = endY - startY;
        var absX = Math.abs(pixelX);
        var absY = Math.abs(pixelY);
        pixel = Math.abs(pixel);
        // x轴 y轴都小于判定值，放回空淄川
        if (Math.max(absX, absY) < pixel) {
            return '';
        }
        if (absY > absX) {
            if (pixelY > 0) {
                return 'slideDown';
            } else {
                return 'slideUp';
            }
        } else {
            if (pixelX > 0) {
                return 'slideRight';
            } else {
                return 'slideLeft';
            }
        }
    }

//    function touchStart(e){
//
//    }
//
//    function touchMove(e){
//
//    }
//
//    function touchEnd(e){
//
//    }

    $.fn.extend({
        supportSlide: function (settings) {
            'use strict';
            // 获取options
            options = $.extend(defaultOptions, settings);

            // 非ie浏览器标准监听
            $(this).on('touchstart', function (e) {
                'use strict';
                var $this = $(this);
                var pixel = options.pixel;
                var touch, startX, startY, endX, endY, eventName;
                e.originalEvent = e.originalEvent || e;
                touch = e.originalEvent.changedTouches[0];
                startX = touch.pageX;
                startY = touch.pageY;

                $this.bind('touchmove', function (e) {
                    'use strict';
                    e.originalEvent = e.originalEvent || e;
                    touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    endX = touch.pageX;
                    endY = touch.pageY;
                    eventName = direction(startX, startY, endX, endY, pixel);
                    eventName && $this.off('touchmove');
//                    eventName && $this.trigger(eventName);
                    eventName && trigger($this, eventName);
                });
                return true;
            }).on('touchend', function (e) {
                'use strict';
                $(e.currentTarget).off('touchmove');
                return true;
            });

            // ie mobile
            $(this).get(0).addEventListener('MSPointerDown', function (event) {
                'use strict';
                var $this = $(this);
                var pixel = options.pixel;
                var startX, startY, endX, endY, eventName;
                startX = event.pageX;
                startY = event.pageY;
                this.addEventListener('MSPointerMove', function (event) {
                    endX = event.pageX;
                    endY = event.pageY;
                    eventName = direction(startX, startY, endX, endY, pixel);
                    eventName && $this.off('MSPointerMove');
//                    eventName && $this.trigger(eventName);
                    eventName && trigger($this, eventName);
                }, false);
            }, false);
            $(this).get(0).addEventListener('MSPointerUp', function (event) {
                'use strict';
                $(this).off('MSPointerMove');
            }, false);

            return this;
        }
    })
})(jQuery);