iScroll.prototype.scrollToElementCenter = function(el, time, offset){
  var that = this, pos, offsetLeft, offsetTop;
  var m = m || Math;
  offset = offset || {left:0,top:0}
  el = el.nodeType ? el : that.scroller.querySelector(el);
  if (!el) return;

  pos = that._offset(el);
  pos.left += that.wrapperOffsetLeft;
  pos.top += that.wrapperOffsetTop;
  offsetLeft = (that.wrapperW - el.offsetWidth) / 2; 
  offsetTop = (that.wrapperH - el.offsetHeight) / 2;
  pos.left += offsetLeft + (offset.left || 0);
  pos.top += offsetTop + (offset.top || 0);

  pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
  pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
  time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

  that.scrollTo(pos.left, pos.top, time);
};