var currentWebview;
var strOrderId; // 订单id
var state;
mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	
	strOrderId = currentWebview.strOrderId;

	// 获取订单列表
	getOrderDetail();
	
	// 绑定事件
	bindEvent();
});

function bindEvent(){
	
	
}


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
				state=result.state;
				var strReceiptUserName = result.strReceiptUserName; // 收货人姓名
				$("#strConsigneeName").html(strReceiptUserName);
				var strReceiptMobile = result.strReceiptMobile; // 收货人电话
				$("#strMobile").html(strReceiptMobile);
				var strLocation = result.strLocation; // 省市区
				var strDetailAddress = result.strDetailAddress; // 详细地址
				$("#strAddress").html(strDetailAddress);
				var totalPrice = result.totalPrice; // 总价
				$("#nAmount1").html("¥"+totalPrice);
				var factPrice = result.factPrice; // 实付价格
				$("#factPrice").html("¥"+factPrice);
				var distributionFee=result.distributionFee;
				if(distributionFee&&distributionFee!=0){
					$("#distributionFeeDiv").show();
					$("#distributionFee").html(factPrice);
				}
				var isWater=result.isWater;
				if('0'==isWater){
					$("#spanName").html("配送员");
				}else{
					$("#spanName").html("店主");
				}
				var dtPayTime = result.dtPayTime; // 支付时间
				var bucketNum = result.bucketNum; // 桶数量
				var bucketMoney = result.bucketMoney; // 桶价格
				if(bucketMoney&&bucketMoney!=0){
					$("#bucketMoneyDiv").show();
					$("#bucketMoney").html("¥"+bucketMoney);
				}
				var ticketTotalCount=result.ticketTotalCount;
				if(ticketTotalCount&&ticketTotalCount!=0){
					$("#ticketTotalCountDiv").show();
					$("#ticketTotalCount").html(ticketTotalCount);
				}
				var remarks=result.remarks;
				$("#strBuyerMessage").html(remarks);
				var strStateName=result.strStateName;
				if("待付款"==strStateName){
					$("#cancleOrderBtn").show();
				}
				
				if("待付款"==strStateName){
					$("#cancleOrderBtn").show();
				}
				
				
				if("待收货"==strStateName&&"退款成功"!=strStateName&&state==3){
					$(".confirmToReceipt").show();
				}
				$("#orderstate").html(strStateName);
				var strOrderNum=result.strOrderNum;
				$("#orderNum").html(strOrderNum);
				var createDate=result.createDate;
				$("#createTime").html(createDate);
				var dtPayTime=result.dtPayTime;
				$("#dtPayTime").html(dtPayTime);
				var strDeliveryName=result.strDeliveryName;
				var strDeliveryMobile=result.strDeliveryMobile;
				if(strDeliveryName){
					$("#strDeliveryName").html(strDeliveryName+" "+strDeliveryMobile);
				}
				var mallOrderDetailList = result.mallOrderDetailList; // 商品列表
				for(var i = 0, len = mallOrderDetailList.length; i < len; i++){
					var lGoodsId = mallOrderDetailList[i].id; // 商品id
					var strSkuName = mallOrderDetailList[i].strSkuName; // 商品名称
					var strSkuAttr=mallOrderDetailList[i].strSkuAttr;
					var skuPrice = mallOrderDetailList[i].skuPrice; // 商品价格
					var strGoodsImg = mallOrderDetailList[i].strGoodsImg; // 商品图片
					var count = mallOrderDetailList[i].count; // 商品数量
					var orderListTemp ='<div class="goods_wid clearfix" id="goods_wid">'+
							'<div class="leftthum goods_img">'+
								'<img id="strGoodsURL" src="'+strGoodsImg+'" />'+
							'</div>'+
							'<div class="rightContent">'+
								'<div class="beforeTitle" id="strGoodsTitle">'+strSkuName+'</div>'+
								'<div class="beforeTitle" id="strSkuSttrs">'+strSkuAttr+'</div>'+
								'<p id="specValue"></p>'+
								'<div class="orderMoney">'+
									'<span class="subOrderMoney" id="strAmountOne">¥'+skuPrice+'</span>'+
									'<span class="ordernum" id="strGoodsAmount">X'+count+'</span>'+
								'</div>'+
							'</div>'+
						'</div>';
					$("#comOrderGoods").append(orderListTemp);
					
				}
			}
		}
	})
}

function doConfirmOrder(){
	var btnArray = ['否', '是'];
        mui.confirm("是否收到货?", '是否到货', btnArray, function(e) {
            if (e.index == 1) {
                confirmOrder();
            }
        },"div");
}

function confirmOrder(){
	    var userId= localStorage.getItem("userId"); // 用户id
		$.ajax({
		url: prefix + "/order/confirmOrder",
		type: "POST",
		data: {"strOrderId":strOrderId,"finishOperationUser":userId}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					mui.toast("确认收货成功");
					$("#orderstate").html("已收货");
					$(".confirmToReceipt").hide();
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}




function doCancelOrder(){
	var btnArray = ['取消', '确认'];
        mui.confirm("确认删除此订单?", '取消订单', btnArray, function(e) {
            if (e.index == 1) {
                cancelOrder();
            }
        },"div");
}

function cancelOrder(){
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
					mui.back();
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}

