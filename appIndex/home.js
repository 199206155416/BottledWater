mui.init({
	swipeBack: false
});
var currentWebview;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = []; //推荐商品数组

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	// 获取焦点图
	getFocusImg();

	// 获取商品列表
	getGoodsList();
});

/**
 * 获取焦点图
 */
function getFocusImg(){
	$.ajax({
		url: prefix + "/sys/getTopImgs",
		type: 'GET',
		dataType: "json",
		success: function(e){
			// 打印请求报错日志
			ajaxLog(e);

			if(e.resCode == 0){
				var result = e.result;
				var marqueeArray = [];

				for(var i = 0, len = result.length; i < len; i++){
					var marqueeItem  = {};
					marqueeItem.contentId = result[i].strLink;
					marqueeItem.imagerpath = result[i].strImg;
					marqueeArray.push(marqueeItem);
				}

				setMarquee(marqueeArray);
			}
		}
	});
};

/**
 * 设置轮播图
 * @author xuezhenxiang
 */
function setMarquee(marqueeArray) {
	var sliderMarquee = document.getElementById('slider');
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
};

/**
 * 获取商品列表
 * @author xuezhenxiang
 */
function getGoodsList(){
	$.ajax({
		url: prefix + "/goods/getModularGoods/0",
		type: 'GET',
		dataType: "json",
		success: function(e){
			// 打印请求报错日志
			ajaxLog(e);

			if(e.resCode == 0){
				var result = e.result;

				for(var i = 0, len = result.length; i < len; i++){
					var activityImg = "./image/1.jpg";
					var mallGoodsList = result[i].mallGoodsList;
					var htmlTemplate = $("#goodsListTemplate").html();

					htmlTemplate = htmlTemplate.replace("#activityImg#", activityImg);

					var goodslist = $(htmlTemplate);

					for(var i1 = 0, len1 = mallGoodsList.length; i1 < len1; i1++){
						var id = mallGoodsList[i].id;
						var strGoodsName = mallGoodsList[i].strGoodsName;
						var strMainImg = mallGoodsList[i].strMainImg;
						var goodsSlogn = mallGoodsList[i].goodsSlogn || "张三李四";
						var defaultSkuPrice = mallGoodsList[i].defaultSkuPrice;

						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#id#", id);
						goodsTemplate = goodsTemplate.replace("#strMainImg#", strMainImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsName#", strGoodsName);
						goodsTemplate = goodsTemplate.replace("#goodsSlogn#", goodsSlogn);
						goodsTemplate = goodsTemplate.replace("#defaultSkuPrice#", defaultSkuPrice);

						var goods = $(goodsTemplate);
						;(function(){
							goods.on("tap", function(){
								var goodsId = this.getAttribute('id');
								var extendOptions = {
									goodsId: goodsId
								};
								pushWebView({
									webType: 'newWebview_First',
									id: 'appMall/productDetail.html',
									href: 'appMall/productDetail.html',
									aniShow: getaniShow(),
									title: "商品详情",
									isBars: false,
									barsIcon: '',
									extendOptions: extendOptions
								});
							})
						})();
						goodslist.find(".goods-list").append(goods);
					}
					
					$("#goodsList").append(goodslist);
				}
			}
		}
	})
};

