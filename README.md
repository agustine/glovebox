#Glove box

代码杂物箱，一些之前写的前端jquery插件，组件...


## adaptClientWidth

调整移动端页面宽度（320px or 480px），利用viewport实现
以便满足设计对页面的像素级要求，兼容ie mobile 10

    // 适配到480px宽度， ios5 android2不兼容
    adaptClientWidth480(); 
    // 适配到320px宽度， 部分android2机型下页面右侧会有白边
    adaptClientWidth320(); 

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
