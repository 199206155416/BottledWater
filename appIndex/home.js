mui.init({
	swipeBack: false,
	pullRefresh: {
	    container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	    down : {
			// style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			// color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			// height: '50px',//可选,默认50px.下拉刷新控件的高度,
			// range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			// offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
			auto: true,//可选,默认false.首次加载自动上拉刷新一次
			callback: function(){ //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				// 获取焦点图
				getFocusImg();
				// 获取商品列表
				getGoodsList();

				setTimeout(function(){
					mui('.mui-content').pullRefresh().endPulldown();
				}, 3000);
			}
	    }
  	}
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
				$("#goodsList").html("");
				for(var i = 0, len = result.length; i < len; i++){
					var activityImg = result[i].strImg;
					var mallGoodsList = result[i].mallGoodsList;
					var htmlTemplate = $("#goodsListTemplate").html();

					if(activityImg){
						htmlTemplate = htmlTemplate.replace("#activityImg#", "<img src='"+ activityImg +"' />");
					}else{
						htmlTemplate = htmlTemplate.replace("#activityImg#", "");
					}
					

					var goodslist = $(htmlTemplate);

					for(var i1 = 0, len1 = mallGoodsList.length; i1 < len1; i1++){
						var id = mallGoodsList[i1].id;
						var strGoodsName = mallGoodsList[i1].strGoodsName;
						var strMainImg = mallGoodsList[i1].strMainImg;
						var goodsSlogn = mallGoodsList[i1].remarks || "";
						var defaultSkuPrice = mallGoodsList[i1].defaultSkuPrice;

						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#id#", id);
						goodsTemplate = goodsTemplate.replace("#strMainImg#", strMainImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsName#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#goodsSlogn#", commonNameSubstr(goodsSlogn, 28));
						goodsTemplate = goodsTemplate.replace("#defaultSkuPrice#", defaultSkuPrice);

						var goods = $(goodsTemplate);
						;(function(){
							goods.on("click", function(){
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

