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
	// 获取商品列表
	getGoodsList();

	//添加每个item点击的监听事件
	$('#channelList').on('click', 'li', function() {
		var id = $(this).attr('id');

		// 所有分类
		if(id == "all"){
			pushWebView({
				webType: 'newWebview_First',
				id: 'appCategory/category.html',
				href: 'appCategory/category.html',
				aniShow: getaniShow(),
				title: "商品分类",
				isBars: false,
				barsIcon: '',
				extendOptions: {}
			});

			return false;
		}

		var extendOptions = {
			id: id
		};
		pushWebView({
			webType: 'newWebview_First',
			id: 'appIndex/productDetail.html',
			href: 'appIndex/productDetail.html',
			aniShow: getaniShow(),
			title: "商品详情",
			isBars: false,
			barsIcon: '',
			extendOptions: extendOptions
		});
	});
});


/**
 * 获取商品列表
 * @author xuezhenxiang
 */
function getGoodsList(){
	$.ajax({
		url: prefix + "/goods/getModularGoods/1",
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


