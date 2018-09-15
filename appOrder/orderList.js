var currentWebview;
var type = -1; // -1 == 全部， -2 == 待付款， -3 == 待发货， -4 == 待收货， -5 == 已完成, 默认为-1
var pageNo = 1;
var pageSize = 20; 
var loadFlag = 1; // 上拉加载标志
var payChannels;
var payType;
var channel;
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
	
	type = currentWebview.type ? currentWebview.type : -1;
	
	renderTab(type);

	// 获取订单列表
	getOrderList();
	initPayChannel();
	
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
	
	// 点击切换tab
	$("#myTapWidth").on("click", "li", function(){
		type = $(this).attr("type");
		$(this).addClass("row").siblings().removeClass("row");
		loadFlag = 1;
		
		getOrderList();
		
	});
}

/**
 * 初始化支付渠道
 * @param {Object} payType
 */
function initPayChannel(){
	plus.payment.getChannels(function(channels){
			payChannels=channels;
	    },function(e){
	        alert("获取支付通道失败："+e.message);
	    });
	
}

/**
 * 渲染tab
 * @author xuezhenxiang
 * */
function renderTab(type){
	$("#myTapWidth li[type="+ type +"]").addClass("row").siblings().removeClass("row");
};

/**
 * 获取订单列表
 * @author xuezhenxiang
 */
function getOrderList(){
	var userId = localStorage.getItem("userId");
	var formData = new FormData();
	formData.append("strBuyerId",userId);
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
			$("#orderListID").html("");
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
					var order = list[i];
					var lOrderId = list[i].id; // 订单id
					var strOrderNum = list[i].strOrderNum; // 订单编号
					var strStateName = list[i].strStateName; // 订单状态
					var factPrice=list[i].factPrice;
					var orderListTemp = $("#orderListTemp").html();

					orderListTemp = orderListTemp.replace("#lOrderId#", lOrderId);
					orderListTemp = orderListTemp.replace("#strOrderNum#", strOrderNum);
					orderListTemp = orderListTemp.replace("#strStateName#", strStateName);
					orderListTemp = orderListTemp.replace("#factPrice#", factPrice);
					if(strStateName=="待付款"){
						orderListTemp = orderListTemp.replace("none", "block");
					}
					var orderList = $(orderListTemp);
					var mallOrderDetailList=list[i].mallOrderDetailList
					;(function(orderList, lOrderId,order){
						orderList.find(".goodsList").on("click", function(){
							pushWebView({
								webType: 'newWebview_First',
								id: 'appOrder/orderDetail.html',
								href: 'appOrder/orderDetail.html',
								aniShow: getaniShow(),
								title: "订单详情",
								isBars: false,
								barsIcon: '',
								extendOptions: {
									strOrderId: lOrderId
								}
							});
						});
						orderList.find(".payment").click(function(){
							    var strPayType=order.strPayType;
							    nowPay(lOrderId,strPayType);
							    return false;
						});
						
						orderList.find(".cancel").click(function(){
									var btnArray = ['取消', '确认'];
							        mui.confirm("确认取消订单吗?", '取消订单', btnArray, function(e) {
							            if (e.index == 1) {
							                cancelOrder(lOrderId);
							            }
							        },"div");
							     return false;   
						});
					})(orderList, lOrderId,order);

					for(var i1 = 0, len1 = mallOrderDetailList.length; i1 < len1; i1++){
						var item=mallOrderDetailList[i1];
						var id = item.id;
						var strGoodsName = item.strSkuName;
						var strGoodsImg = item.strGoodsImg;
						var strGoodsSKUDetail = item.remarks;
						var skuPrice = item.skuPrice;
						var count = item.count;
						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsTitle#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#strGoodsSKUDetail#", commonNameSubstr(strGoodsSKUDetail, 28));
						goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
						goodsTemplate = goodsTemplate.replace("#count#", count);
						
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
}
/**
 * 取消订单
 * @param {Object} strOrderId
 */
function cancelOrder(strOrderId){
		$.ajax({
		url: prefix + "/order/cancelOrder",
		type: "POST",
		data: {"strOrderId":strOrderId}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					mui.toast("取消成功");
					getOrderList();
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}

/**
 * 立即支付
 * @param {Object} strOrderId
 * @param {Object} strPayType
 * @param {Object} factPrice
 */
function nowPay(strOrderId,strPayType){
	payType=parseInt(strPayType);
	if("0"==strPayType||"1"==strPayType){
		channel=payChannels[payType];
	}
	$.ajax({
		url: prefix + "/pay/againPay",
		type: "POST",
		data: {"strOrderId":strOrderId,"strPayType":strPayType,"strOrderType":"0"}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					doPay(result);
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}

function doPay(payInfo){
	console.log("payInfo:"+payInfo);
	if(payType==1){//微信
		var appid=payInfo["appid"];
		var noncestr=payInfo["noncestr"];
		var package=payInfo["package"];
		var partnerid=payInfo["partnerid"];
		var prepayid=payInfo["prepayid"];
		var timestamp=payInfo["timestamp"];
		var sign=payInfo["sign"];
		var payInfoNew={"appid":appid,"noncestr":noncestr,"package":package,"partnerid":partnerid,"prepayid":prepayid,"timestamp":timestamp,"sign":sign};
		var stra=JSON.stringify(payInfoNew);
		plus.payment.request(channel,stra,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                       getOrderList();
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==0){
		plus.payment.request(channel,payInfo,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                        getOrderList();
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==2){//余额
		 plus.nativeUI.alert("支付成功！",function(){
                      getOrderList();
          });

		
	}
}




