var currentWebview;
var strOrderId; // 订单id

mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
	strOrderId = currentWebview.strOrderId;

	// 获取订单列表
	getOrderDetail();
	
	// 绑定事件
	bindEvnet();
});

function bindEvent(){
	
	
};

/**
 * 获取订单列表
 * @author xuezhenxiang
 */
function getOrderDetail(){
	$.ajax({
		url: prefix + "/order/detail/" + strOrderId,
		type: 'GET',
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);

			if(res.resCode == 0){
				var result = res.result; // 数据
				
				var strReceiptUserName = result.strReceiptUserName; // 收货人姓名
				var strReceiptMobile = result.strReceiptMobile; // 收货人电话
				var strLocation = result.strLocation; // 省市区
				var strDetailAddress = result.strDetailAddress; // 详细地址
				var totalPrice = result.totalPrice; // 总价
				var factPrice = result.factPrice; // 实付价格
				var dtPayTime = result.dtPayTime; // 支付时间
				var bucketNum = result.bucketNum; // 桶数量
				var bucketMoney = result.bucketMoney; // 桶价格
				var mallOrderDetailList = result.mallOrderDetailList; // 商品列表

				for(var i = 0, len = mallOrderDetailList.length; i < len; i++){
					var lGoodsId = mallOrderDetailList[i].id; // 商品id
					var strSkuName = mallOrderDetailList[i].strSkuName; // 商品名称
					var skuPrice = mallOrderDetailList[i].skuPrice; // 商品价格
					var strGoodsImg = mallOrderDetailList[i].strGoodsImg; // 商品图片
					var count = mallOrderDetailList[i].count; // 商品数量
					
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

					
				}
			}
		}
	})
};

