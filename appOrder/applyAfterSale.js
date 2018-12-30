var currentWebview;
var order; // 退款订单

mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
	order = currentWebview.order;

	// 获取订单列表
	getOrderDetail();
	
	// 绑定事件
	bindEvent();
});

function bindEvent(){
	$(".after-sale-infos>li").each(function(i,ele){
		$(ele).data("i",i);
		$(ele).click(function(){
			var index=$(this).data("i");
			var id = $(this).attr("id");
			var aniShow = getaniShow();
			//检测已经存在sessionkey否者运行下面的登陆代码
			if (localStorage.getItem('userMobile') && localStorage.getItem('userId')) {} else {
				id = "login/login.html";
				aniShow = 'slide-in-bottom';
			}
			var optionsData={"index":index,"order":order};
			pushWebView({
				webType: 'newWebview_First',
				id: id,
				href: id,
				aniShow: aniShow,
				extendOptions: optionsData
			});
		});
	});
	
}

/**
 * 获取订单列表
 * @author xuezhenxiang
 */
function getOrderDetail(){
				var mallOrderDetailList = order.mallOrderDetailList; // 商品列表
				for(var i = 0, len = mallOrderDetailList.length; i < len; i++){
					var remarks = mallOrderDetailList[i].strTitle;
					var strSkuName = mallOrderDetailList[i].strSkuName; // 商品名称
					var skuPrice = mallOrderDetailList[i].skuPrice; // 商品价格
					var strGoodsImg = mallOrderDetailList[i].strGoodsImg; // 商品图片
					var count = mallOrderDetailList[i].count; // 商品数量
					var orderListTemp ='<div class="goods-item">'+
									'<div class="goods-item-img"><img src="'+strGoodsImg+'" alt=""></div>'+
									'<div class="goods-info">'+
										'<p class="goods-title">'+strSkuName+'</p>'+
										'<p class="goods-sku">'+remarks+'</p>'+
										'<p class="goods-price">¥'+skuPrice+'<span class="goods-count">X'+count+'</span></p>'+
									'</div>'+
								'</div>';
					$(".goods-list").append(orderListTemp);

					
				}
	
}

