var Waterfall = (function(){
	var options = {
		margin: 0,
		offsetH: 0,
		offsetV: 0,
		whiteBottom: 50,

		cols: 0,
		minWidth: 100,

		ajaxUrl: '',
		ajaxDataType: 'json',
		ajaxData: {},

		startPageIndex: 0,
		pageIndexName: 'pno',
		waterBox: 'li',
		parse: function(res){
			return (res instanceof Array) ? res : [];
		},
		url: function(item){
			return item ? item.url : '';
		},
		template: function(imgData){
			return '';
		},
		pageLoaded: function(res){
		},
		itemRendered: function(item){
		},
		last: function(res){
			return false;
		},
		noMore: function(){

		}
	};
	var pageIndex = 0, loading = false, waterWidth, columns, waters = [], imgWidth, wrapper, minColumn = 0, noMore = false, fixed, wrapperWidth;
	var log = (console && console.log) ? function(msg){ console.log(msg); } : function(msg){};

	function calculateColumnsHeight() {
		var minH = Math.min.apply({}, columns);
		var maxH = Math.max.apply({}, columns);
		var columnCount = columns.length;
		var wrapperHeight = (maxH + options.whiteBottom);
		for(var i = 0; i < columnCount; i++){
			if(columns[i] === minH){
				minColumn = i;
				break;
			} 
		}
		wrapper.style.height = wrapperHeight.toString() + 'px';
	};

	function renderWater(item, imageWidth, imageHeight){
		var itemElem = document.createElement(options.waterBox);
		var itemHeight = Math.ceil(Math.ceil(imgWidth) * imageHeight / imageWidth) + options.offsetV;
		var itemTop = columns[minColumn] + options.margin;
		var itemLeft = (waterWidth + options.margin) * minColumn + options.margin;
		itemElem.style.position = 'absolute';
		itemElem.style.width = waterWidth + 'px';
		itemElem.style.height = itemHeight + 'px';
		itemElem.style.top = itemTop + 'px';
		itemElem.style.left = itemLeft + 'px';
		itemElem.innerHTML = options.template(item);

		wrapper.appendChild(itemElem);
		columns[minColumn] += itemHeight + options.margin;

		calculateColumnsHeight();
	};

	function resetPosition(itemElem, imageWidth, imageHeight){
		var itemHeight = (imgWidth / imageWidth) * imageHeight + options.offsetV;
		var itemTop = columns[minColumn] + options.margin;
		var itemLeft = (waterWidth + options.margin) * minColumn + options.margin;	
		itemElem.style.width = waterWidth + 'px';
		itemElem.style.height = itemHeight + 'px';
		itemElem.style.top = itemTop + 'px';
		itemElem.style.left = itemLeft + 'px';	

		columns[minColumn] += itemHeight + options.margin;
		calculateColumnsHeight();
	};

	function pushWater(item, imageWidth, imageHeight){
		waters.push({
			item: item,
			width: imageWidth,
			height: imageHeight
		});
	};

	function loadStart(){
		loading = true;
	};

	function loadEnd(){
		loading = false;
	};

	function loadComplete(res){
		options.pageLoaded(res);
		pageIndex++;
		loadEnd();
	};

	function callbackAjax(res){
		var thisOptions = options;
		var thisRenderWater = renderWater;
		var thisPushWater = pushWater;
		var thisLoadComplete = loadComplete;
		var pageData = options.parse(res);
		var pageCount = pageData.length;
		var item, url, img, doneFunc;
		var done = 0;
		noMore = options.last(res);
		if(!res instanceof Array){
			log('data parse error!');
			return;
		}



		for(var i = 0; i < pageCount; i++){
			item = pageData[i];
			url = options.url(item);
			if(!(item && url)){
				log('data parse error:');
				log(item);
				return;
			}
			img = new Image();

			img.src = url;
			$(img).data('data', item);
			img.onload=function(){
				var imageData = $(this).data('data');
				thisRenderWater(imageData, this.width, this.height);
				thisPushWater(imageData, this.width, this.height);
				done++;
				(done === pageCount) && thisLoadComplete(res);	
			};
			img.onerror=function(){
			  	done++;
				(done === pageCount) && thisLoadComplete(res);	
			};
		};

	};

	function resetColumns(columnCount){
		columns = [];
		for(var i = 0; i < columnCount; i++){
			columns.push(0);
		}
	};

	function reset(cols){
		var waterCount, itemDoms, elem, item;
		fixed = cols ? true : fixed;
		cols = cols || options.cols;
		if(cols === options.cols && wrapperWidth === wrapper.clientWidth){
			return;
		}

		wrapperWidth = wrapper.clientWidth;
		if(!fixed){
			cols = (wrapperWidth - options.margin) / (options.minWidth + options.margin)
			cols = Math.floor(cols);
		}
		waterWidth = (wrapperWidth - ((cols + 1) * options.margin)) / cols;
		imgWidth = waterWidth - options.offsetH;
		resetColumns(cols);
		minColumn = 0;
		options.cols = cols;

		waterCount = waters.length;
		itemDoms = wrapper.getElementsByTagName(options.waterBox);
		for(var i = 0; i < waterCount; i++){
			elem = itemDoms[i];
			item = waters[i];
			resetPosition(elem, item.width, item.height);
		}
	};

	function ajaxParams(){
		options.ajaxData[options.pageIndexName] = pageIndex;
		return options.ajaxData;
	};

	function load(){
		if(loading){
			log('Another request of waterfall is processing...');
			return false;
		}
		if(noMore){
			log('no more images...');
			options.noMore();
			return false;
		}
		$.ajax(options.ajaxUrl, {
			data: ajaxParams(), 
			dataType: options.ajaxDataType, 
			type: 'GET',
			beforeSend: loadStart,
			success: callbackAjax,
			error: loadEnd
		});
	};

	function Waterfall(elemId, settings){
		var i, timeout;
		for (i in settings) options[i] = settings[i];

		wrapper = document.getElementById(elemId);
		pageIndex = options.startPageIndex;
		fixed = options.cols > 0;
		reset();
		load();

		timeout = setInterval(reset, 300);
	};

	Waterfall.prototype.loadMore = load;

	Waterfall.prototype.reset = function(cols){
		reset(cols);
	};

	return Waterfall;
})();