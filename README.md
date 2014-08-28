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
    
## go-jsonpproxy

有些现有的ajax接口并没有实现jsonp的方式，导致前端本地开发环境必须在本地启服务，以实现同域的ajax调用，造成本地维护一个服务端的发布版本，给前端开发造成很多麻烦。
为了解决这个麻烦，用go语言写了一个转发程序，是原本不支持jsonp的接口转发为jsonp的ajax接口以便调用

    // config.ini
    ；目标地址
    [Target]
    url=http://192.168.1.22:8080/paoquan-console/service/ 
      
    ；本地使用的端口
    [local]
    port=8098

如上配置 并命令行启动 ./proxy
就可以实现 http://127.0.0.1:8098/ 对 http://192.168.1.22:8080/paoquan-console/service/ 上接口经过jsonp包装的http转发

前端代码js中通过设置一个 env 环境变量，来判断是否开发环境，调用哪一个接口及调用方式

## iscrollPlugin
iscrollPlugin/libs/iscroll.js是个经过修改的iscroll 4.2.5版本
主要改善了一下一些小问题
单页多个iscroll实例情况下动画的卡顿问题，
仿safari回弹效果的速度调整

iscrollPlugin/iscroll.boost.js为iscroll添加了一个方法scrollToElementCenter
iscroll的scrollToElement，不能使指定元素滚动到指定滑动区域的中间
项目中需要此功能，所以实现之
方法调用参考iscroll的scrollToElement方法

## audioPlayer
一个移动端多首背景音乐的轮播组建

    // 初始化
    var player = new AudioPlayer({
        musics: ['music/1.mp3','music/2.mp3'], // 音乐文件路径数组 
        auto: true // 是否自动开始播放，因为ios设备上的Audio不支持非用户行为触发的play，所以ios设备上，是初始化后，用户第一次触摸屏幕开始自动播放
    });
    
    // 开关音乐，返回值位布尔类型，表示当前是否正在播放
    player.doSwitch();

