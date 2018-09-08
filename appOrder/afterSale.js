var currentWebview;
var type = 0; // -1 == 全部， -2 == 待付款， -3 == 待发货， -4 == 待收货， -5 == 已完成, 默认为-1
var pageNo = 1;
var pageSize = 20; 
var loadFlag = 1; // 上拉加载标志

mui.init({
	swipeBack: false,
	pullRefresh: {
	    container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	    down : {
			style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			height: '50px',//可选,默认50px.下拉刷新控件的高度,
			range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
			auto: true,//可选,默认false.首次加载自动上拉刷新一次
			callback: function(){} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
  	}
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
	// 获取订单列表
	getOrderList();
	
	// 绑定事件
	bindEvnet();
});

function bindEvent(){
	// 屏幕滚动后加载列表
	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();	// 滚动高度		    
		var scrollHeight = $(document).height(); // 文档高度
		var windowHeight = $(window).height(); // 文档窗口高度
			
		if (scrollTop + windowHeight >= scrollHeight - 300) {
			if(loadFlag == 1){
				loadFlag == 0;
				getOrderList();
			}
		}

	});
};

/**
 * 获取订单列表
 * @author xuezhenxiang
 */
function getOrderList(){
	var userId = localStorage.getItem(userId);
	var formData = new FormData();
	
	formData.append("strBuyerId", userId);
	formData.append("pageNo", pageNo);
	formData.append("pageSize", pageSize);
	formData.append("state", type);
	
	$.ajax({
		url: prefix + "/order/list",
		type: 'POST',
		data: formData,
		contentType: false,
	 	processData: false,  
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);

			if(res.resCode == 0){
				var list = res.result.list; // 列表数据
				var count = res.result.count; // 数据总量
				
				if(count == 0){
					$("#orderNullTemp").show();
					return false;
				}else{
					$("#orderNullTemp").hide();
				}
				
				if(list.length <= 0){
					return false;
				}

				for(var i = 0, len = list.length; i < len; i++){
					var lOrderId = list[i].id; // 订单id
					var strOrderNum = list[i].strOrderNum; // 订单编号
					var strStateName = list[i].strStateName; // 订单状态
					var orderListTemp = $("#orderListTemp").html();

					orderListTemp = orderListTemp.replace("#lOrderId#", lOrderId);
					orderListTemp = orderListTemp.replace("#strOrderNum#", strOrderNum);
					orderListTemp = orderListTemp.replace("#strStateName#", strStateName);

					var orderList = $(htmlTemplate);
					
					;(function(orderList){
						orderList.on("click", function(){
							pushWebView({
								webType: 'newWebview_First',
								id: 'appOrder/orderDetail.html',
								href: 'appOrder/orderDetail.html',
								aniShow: getaniShow(),
								title: "订单详情",
								isBars: false,
								barsIcon: '',
								extendOptions: extendOptions
							});
						});
					})(orderList);

					for(var i1 = 0, len1 = mallGoodsList.length; i1 < len1; i1++){
						var id = mallGoodsList[i1].id;
						var strGoodsName = mallGoodsList[i1].strGoodsName;
						var strGoodsImg = mallGoodsList[i1].strGoodsImg;
						var goodsSlogn = mallGoodsList[i1].goodsSlogn || "张三李四";
						var defaultSkuPrice = mallGoodsList[i1].defaultSkuPrice;

						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsName#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#goodsSlogn#", commonNameSubstr(goodsSlogn, 28));
						goodsTemplate = goodsTemplate.replace("#defaultSkuPrice#", defaultSkuPrice);

						var goods = $(goodsTemplate);
						;(function(){
//							goods.on("click", function(){
//								var goodsId = this.getAttribute('id');
//								var extendOptions = {
//									goodsId: goodsId
//								};
//								pushWebView({
//									webType: 'newWebview_First',
//									id: 'appMall/productDetail.html',
//									href: 'appMall/productDetail.html',
//									aniShow: getaniShow(),
//									title: "商品详情",
//									isBars: false,
//									barsIcon: '',
//									extendOptions: extendOptions
//								});
//							})
						})();
						orderList.find(".goodsList").append(goods);
					}
					
					$("#orderListID").append(orderList);
					pageNo++;
					loadFlag = 1;
				}
			}
		}
	})
};

