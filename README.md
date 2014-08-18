#Glove box

代码杂物箱，一些之前写的前端jquery插件，组件...


## slideListener

为触屏设备浏览器添加划屏监听的jquery插件

    $(selector)
      .supportSlide(options) // 初始化
      .on('slideUp', callbackSlideUp) // 添加上划监听
      .on('slideDown', callbackSlideDown) // 添加下划监听
      .on('slideLeft', callbackSlideLeft) // 添加左划监听
      .on('slideRight', callbackSlideRight); // 添加右划监听
    
    options : {
        pixel: 30, // 划越像素距离最小判定，默认30像素
        interval: 0 // 2次划屏之间的有效判定毫秒数，防止用户一直划屏，造成的连续反复操作
    }
