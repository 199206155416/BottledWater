var currentWebview;
var type = 0; // -1 == 全部， -2 == 待付款， -3 == 待发货， -4 == 待收货， -5 == 已完成, 默认为-1
var pageNo = 1;
var pageSize = 20; 
var loadFlag = 1; // 上拉加载标志
mui.init({
	swipeBack: false
	// pullRefresh: {
	//     container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	//     down : {
	// 		style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	// 		color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	// 		height: '50px',//可选,默认50px.下拉刷新控件的高度,
	// 		range: '100px', //可选 默认100px,控件可下拉拖拽的范围
	// 		offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
	// 		auto: true,//可选,默认false.首次加载自动上拉刷新一次
	// 		callback: function(){} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	//     }
 //  	}
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
	//获取退款列表
	getRefundLogList();
	
	// 绑定事件
	bindEvent();
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
 * 获取退款列表
 * @author xuezhenxiang
 */
function getRefundLogList(){
	var userId = localStorage.getItem(userId);
	var formData = new FormData();
	formData.append("strBuyerId", userId);
	formData.append("pageNo", pageNo);
	formData.append("pageSize", pageSize);
	$.ajax({
		url: prefix + "/refund/list",
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
					return false;				}

				for(var i = 0, len = list.length; i < len; i++){
					var item=list[i];
					var strStateName=item.strStateName
					var id=item.id;//退款ID
					var order=item.mallOrder;
					var lOrderId = order.id; // 订单id
					var orderListTemp = $("#orderListTemp").html();
					orderListTemp = orderListTemp.replace("#refundStateName#", strStateName);
					var orderList = $(orderListTemp);
					
					;(function(orderList,item){
						orderList.find(".go-to-detail").on("click", function(){
							pushWebView({
								webType: 'newWebview_First',
								id: 'appOrder/afterSaleDetail.html',
								href: 'appOrder/afterSaleDetail.html',
								aniShow: getaniShow(),
								title: "退款详情",
								isBars: false,
								barsIcon: '',
								extendOptions: {
									strOrderId: lOrderId
								}
							});
							
						});
					})(orderList,item);
				   var mallOrderDetailList=order.mallOrderDetailList;
					for(var i1 = 0, len1 = mallOrderDetailList.length; i1 < len1; i1++){
						var itemGoods=mallOrderDetailList[i1];
						var id = itemGoods.id;
						var strGoodsName = itemGoods.strSkuName;
						var strGoodsImg = itemGoods.strGoodsImg;
						var strGoodsSKUDetail = itemGoods.remarks;
						var skuPrice = itemGoods.skuPrice;
						var count = itemGoods.count;
						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsTitle#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#strGoodsSKUDetail#", commonNameSubstr(strGoodsSKUDetail, 28));
						goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
						goodsTemplate = goodsTemplate.replace("#count#", count);
						
						var goods = $(goodsTemplate);
						orderList.find(".goods-list").append(goods);
					}
					
					$("#orderListID").append(orderList);
					pageNo++;
					loadFlag = 1;
				}
			}
		}
	})
};

