mui.init({
	swipeBack: false
});
var currentWebview;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = []; //推荐商品数组

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();

	// 获取商品列表
	getGoodsList();
});

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
			ajaxLog(e.resCode);

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
								var item = this;
								var itemID = this.getAttribute('id');
								var extendOptions = {
									itemID: itemID
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

