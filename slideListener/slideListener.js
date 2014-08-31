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

    var isIE = (/iemobile/gi).test(navigator.appVersion);

    $.fn.extend({
        supportSlide: function (settings) {
            'use strict';
            // touchstart时触电坐标x、y
            var startX,
                startY,
            // 2次有效划屏判定锁
                lock = false,
            // 触摸事件监听名称
                startEvent = isIE ? 'MSPointerDown' : 'touchstart',
                moveEvent = isIE ? 'MSPointerMove' : 'touchmove',
                endEvent = isIE ? 'MSPointerUp' : 'touchend',
            // 默认设定
                options = {
                    pixel: 30, // 划越像素距离最小判定，默认30像素
                    interval: 0 // 2次划屏之间的有效判定毫秒数，防止用户一直划屏，造成的连续反复操作
                },
                trigger,
                that = $(this).get(0);
            // 获取options
            options = $.extend(options, settings);

            /**
             * 上锁
             */
            function lockSlide() {
                lock = true;
            };

            /**
             * 解锁
             */
            function unlockSlide() {
                lock = false;
            };

            /**
             * 出发划屏监听
             * @param {jQuery Object}   $elem       监听elem的jQuery对象
             * @param {String}          eventName   监听事件
             */
            function triggerFunc($elem, eventName) {
                var interval = options.interval;
                if (lock) {
                    return;
                }
                $elem.trigger(eventName);
                if (interval) {
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
            function direction(startX, startY, endX, endY) {
                'use strict';
                var pixelX = endX - startX;
                var pixelY = endY - startY;
                var absX = Math.abs(pixelX);
                var absY = Math.abs(pixelY);
                var pixel = Math.abs(options.pixel);
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

            /**
             * touch start 事件
             * @param {Object} event 事件对象
             */
            function touchStart(event) {
                var touch;
                if (isIE) {
                    startX = event.pageX;
                    startY = event.pageY;
                } else {
                    event.originalEvent = event.originalEvent || event;
                    touch = event.originalEvent.touches[0];
                    startX = touch.pageX;
                    startY = touch.pageY;
                }
                trigger = triggerFunc;
            }

            /**
             * touch move 事件
             * @param {Object} event 事件对象
             */
            function touchMove(event) {
                var touch, endX, endY, eventName;
                // 获取当前触摸位置
                if (isIE) {
                    endX = event.pageX;
                    endY = event.pageY;
                } else {
                    event.originalEvent = event.originalEvent || event;
                    touch = event.originalEvent.touches[0];
                    endX = touch.pageX;
                    endY = touch.pageY;
                }
                event.preventDefault();
                // 获取划屏方向
                eventName = direction(startX, startY, endX, endY);
                // 触发监听
                eventName && trigger && trigger($(this), eventName);
            }

            /**
             * touch end 事件
             * @param {Object} event 事件对象
             */
            function touchEnd(event) {
                trigger = null;
            }

            // 添加 touchstart touchmove touchend监听
            that.addEventListener(startEvent, touchStart, false);
            that.addEventListener(moveEvent, touchMove, false);
            that.addEventListener(endEvent, touchEnd, false);

            return this;
        }
    })
})(jQuery);