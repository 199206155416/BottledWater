mui.init({
	swipeBack: false
});
var currentWebview;
var homeDiv;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = []; //推荐商品数组
mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	homeDiv = document.getElementById('homeDiv');
	//初始化一些本地数据
	initSomeData();
	//设置跑马灯
	setMarquee();
	//设置推荐商品
	setRecommend();
	//添加每个item点击的监听事件
	mui('#recommend').on('tap', 'a', function() {
		var item = this;
		var itemID = this.getAttribute('href');
		var extendOptions = {
			itemID: itemID
		};
		pushWebView({
			webType: 'newWebview_First',
			id: 'appIndex/product-detail-needtem.html',
			href: 'appIndex/product-detail-needtem.html',
			aniShow: getaniShow(),
			title: "商品详情",
			isBars: false,
			barsIcon: '',
			extendOptions: extendOptions
		});
	});
})

function initSomeData() {
	for (var i = 0; i < 20; i++) {
		var dataItem = {};
		dataItem.product_price = {default_price:"20.00",list_price:"28.0"};
		dataItem.product_name = "这都是些什么鬼东西啊有什么用啊啊啊 ";
		dataItem.large_image_url = "../img/1.jpg";
		dataItem.product_id = "13110";
		recommendArray.push(dataItem);
	}
	for (var i = 0 ; i < 4;i++	) {
		var marqueeItem  = {};
		marqueeItem.contentId = i;
		if (i == 3) {
			marqueeItem.imagerpath = '../img/slider/slider4.png';
		} else{
			marqueeItem.imagerpath = '../img/slider/slider'+(i+1)+'.jpg';
		}
		marqueeArray.push(marqueeItem);
	}
}

function setMarquee() {
	var sliderMarquee = document.getElementById('productSlider');
	var sliderGroup = document.createElement('div');
	sliderGroup.className = 'mui-slider-group mui-slider-loop';
	sliderMarquee.appendChild(sliderGroup);
	var sliderIndicator = document.createElement('div');
	sliderIndicator.className = 'mui-slider-indicator';
	sliderMarquee.appendChild(sliderIndicator);
	for (var i = 0; i < marqueeArray.length; i++) {
		if (0 == i) {
			var sliderItemDuplicate = document.createElement('div');
			sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
			sliderItemDuplicate.innerHTML = '<a href="' + marqueeArray[marqueeArray.length - 1].contentId + '">\
					<img src="' + marqueeArray[marqueeArray.length - 1].imagerpath + '" />\
				</a>';
			sliderGroup.appendChild(sliderItemDuplicate);
		}
		var sliderItem = document.createElement('div');
		sliderItem.className = 'mui-slider-item';
		sliderItem.innerHTML = '<a href="' + marqueeArray[i].contentId + '">\
				<img src="' + marqueeArray[i].imagerpath + '" />\
			</a>';
		sliderGroup.appendChild(sliderItem);
		var indicatorItme = document.createElement('div');
		if (i == 0) {
			indicatorItme.className = 'mui-indicator mui-active';
		} else {
			indicatorItme.className = 'mui-indicator';
		}
		sliderIndicator.appendChild(indicatorItme);
		if (marqueeArray.length - 1 == i) {
			var sliderItemDuplicate = document.createElement('div');
			sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
			sliderItemDuplicate.innerHTML = '<a href="' + marqueeArray[0].contentId + '">\
					<img src="' + marqueeArray[0].imagerpath + '" />\
				</a>';
			sliderGroup.appendChild(sliderItemDuplicate);
		}
		slider = mui('.mui-slider').slider({
			interval:2000
		});
	}
}
//设置推荐商品
function setRecommend() {
	var recommend = document.getElementById('recommend');
	mui.each(recommendArray, function(index, item) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
		li.innerHTML = '<a href="' + item.product_id + '">\
			<div class= "bgDiv">\
				<img class="mui-media-object" src="'+item.large_image_url+'"/>\
				<div class="mui-media-body">\
					<p class="mui-ellipsis-2">' + item.product_name + '</p>\
					<p class="price-one">¥' + item.product_price.default_price + '</p>\
					<p class="price-two">¥' + item.product_price.list_price + '</p>\
				</div>\
			</div>\
		</a>';
		recommend.appendChild(li);
	});
}