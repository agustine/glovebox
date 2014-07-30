var Curtain = (function(){
	function Curtain(id, time){
		var curtain = this;
		var urlNode;
		this.isRun = false;
		this.isStart = true;
		this.ready = false;
		this.offset = 0;
		this.id = id || 'curtain';
		this.img = document.getElementById(this.id);
		urlNode = this.img.attributes['url'];
		if(!this.img){
			return false;
		}

		this.time = time || 3000;
		this.url = urlNode ? urlNode.nodeValue : '';
		this.setStyle = function(styles){
			for(var style in styles){
				this.img.style[style] = styles[style];
			}
		}			
		this.transform = function(){
			var props,styleValue;
			if(!this.ready){
				return;
			}
			styleValue = this.isStart ? this.endStyle : this.startStyle;

			props = {
				'-o-transform': styleValue,
				'-moz-transform': styleValue,
				'-webkit-transform': styleValue,
				'transform': styleValue
			};
			this.setStyle(props);
			this.isStart = !this.isStart;
		}
		var init = function(){
			curtain.setStyle({'height': '100%'});
			curtain.ready = false;
			curtain.offset = curtain.img.width - curtain.img.parentElement.offsetWidth;
		  curtain.startStyle = 'translate3d(0,0,0)';
			curtain.endStyle = 'translate3d(' + (-curtain.offset).toString() + 'px,0px,0px)';

			timeStyleValue = curtain.time.toString() + 'ms';
			timeProps = {
				'-o-transition':timeStyleValue,
				'-moz-transition':timeStyleValue,
				'-webkit-transition':timeStyleValue,
				'transition':timeStyleValue
			};
			curtain.setStyle(timeProps);

			curtain.isStart = true;
		  curtain.ready = true;			
		  
		  if(curtain.isRun){
				curtain.run();
			}
		}
		this.img.onload = init;
		window.onresize = init;
		this.img.src = this.url;
	}

	Curtain.prototype.run = function(){
		var curtain = this;
		var transform = function(){
			curtain.transform();
		}

		this.timeout && clearTimeout(this.timeout);
		transform();
		this.timeout = setInterval(transform, this.time);
		this.isRun = true;
	};

	return Curtain;
})();