/**
 * 用于手机端网页适配以固定宽度
 * adaptClientWidth480(); 适配到480像素宽度
 * adaptClientWidth320(); 适配到320像素宽度
 * 支持ie mobile
 * 不支持ios 5
 * android2下一些机型右边会有白边
 */

var adaptClientWidth =  function(uiWidth){
  'use strict';

  var head = document.getElementsByTagName('head'),
      dpi,
      viewport,
      ieMobile,
      oldViewport,
      storageKey = 'device-viewport-',
      storage = window.localStorage,
      initialContent = storage.getItem(storageKey),
      deviceWidth,
      devicePixelRatio,
      targetDensitydpi,
      clientWidth,
      ua,
      isAndroid,
      androidVersion,
      isSurport; 
  // 由于android 2.2 2.3的bug，
  // 目前仅支持320及480的适配，默认使用480
  uiWidth = uiWidth === 320 ? 320 : 480;
  storageKey += uiWidth.toString();
  /**
   * 删除页面上的viewport
   * @return {[type]} [description]
   */
  function removeViewport(){
    var metas = document.getElementsByTagName('meta');
    var meta, i;

    var metaCount = metas.length;
    for(i = 0; i < metaCount; i++){
      meta = metas[i];
      meta && meta.name && meta.name.toLowerCase() === 'viewport' && meta.parentNode.removeChild(meta);
    }
  }

  /**
   * 设置iemobile的viewport
   * 只能通过@-ms-viewport的css属性width设置
   * @return {[type]} [description]
   */
  function adaptIEMobile(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '@-ms-viewport { width: ' + uiWidth.toString() + 'px; }';

    head.length > 0 && head[head.length - 1].appendChild(style);

  }
  /**
   * 重新设置viewport，并利用本地存储保存第一次适配的viewport值
   * @return {[type]} [description]
   */
  function resetViewport(){
    removeViewport(); 
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = initialContent;
    head.length > 0 && head[head.length - 1].appendChild(viewport);
    storage.setItem(storageKey, initialContent);
  }
  /**
   * 检查是否设置成功，
   * 如果没有设置到指定值，则用window.screen.width
   * 通过公式计算算出targetDensitydpi
   * 并重设viewport
   * @return {[type]} [description]
   */
  function checkResult(){
    clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(clientWidth === uiWidth){
      return true;
    }
    //获取设备信息,并矫正参数值
    devicePixelRatio = window.devicePixelRatio;
    deviceWidth      = window.screen.width;
    //获取最终dpi
    targetDensitydpi = uiWidth / deviceWidth * devicePixelRatio * 160; 
    initialContent = 'target-densitydpi=' + targetDensitydpi + ', width=device-width, user-scalable=no';
    resetViewport();
  }

  // 检查本地存储中是否有，viewport的值
  if(initialContent){ 
    resetViewport();
    // return;
  }

  // ua
  ua = navigator.userAgent.toLowerCase();

  // 是否android设备
  isAndroid = (/android/gi).test(ua);
  // 是否ios设备
  isIos = (/ipad|iphone/gi).test(ua);
  // android版本
  androidVersion = isAndroid ? parseFloat((/Android[\/\s]+([\d\.]+)/).exec(navigator.userAgent)[1]) : 0;

  // 只有iphone以及android版本4+原生浏览器，可以以像素值设置viewport的width属性
  // 部分android版本4+机型也不支持
  isSurport = (!isAndroid) || androidVersion >= 4;

  // 是否iemobile
  ieMobile = (/iemobile/gi).test(ua);

  if(ieMobile){
    adaptIEMobile();
  }

  // 不支持的浏览器上直接用high-dpi、medium-dpi来设置target-densitydpi
  // 因为android 2.2 2.3上window.screen.width有bug
  // 所以只能设置high-dpi（480）、medium-dpi（320）
  // 一些比较奇葩分辨率的2.2 2.3设备上，最终设置的宽度会略大于480或320
  if(!isSurport){
    dpi = uiWidth === 480 ? 'high-dpi' : 'medium-dpi';
    initialContent = 'target-densitydpi=' + dpi + ', width=device-width, user-scalable=no';
    resetViewport();
    return;
  }

  // 默认设置
  // iphone以及android版本4+原生浏览器
  initialContent   = 'target-densitydpi=device-dpi, width=' + uiWidth + 'px, user-scalable=no';

  resetViewport();
  // ios设备不支持target-densitydpi 
  if(isIos){
    return;
  }

  // 一些android版本4+原生浏览器也不支持默认设置
  // 比如红米上的默认原生浏览器就不支持
  // 但是像微信等app中调用的webview对ua的重写导致ua中没有设备信息，
  // 所以也无法用ua来做区别判断机型作区分
  // 只能在默认设置后在检查是否成功
  // 不成功则利用设备宽度通过公式计算设置target-densitydpi的方法实现
  // 因为有些机型上设置viewport没有立刻生效，所以延时200毫秒检查
  setTimeout(checkResult, 200);
};
var adaptClientWidth480 = function(){
  'use strict';
  adaptClientWidth();
};
var adaptClientWidth320 = function(){
  'use strict';
  adaptClientWidth(320);
};



