var currentWebview; // 当前子页面
var paredntWebview; // 父页面
var strOrderId; // 订单id



mui.init({
	swipeBack: false
});


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	paredntWebview = currentWebview.parent();
	//detailcontent = document.getElementById('detailcontent');
	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('hide', function() {
		strOrderId = null;
	}, false);

	strOrderId = currentWebview.strOrderId;
	// 获取订单支付状态
	getOrderPayState();
	
	$("#backIndex").click(function(){
		var allView=plus.webview.all();
		for(var i=0;i<allView.length;i++){
			var id=allView[i].id;
			if(id=="appMall/addOrder.html"||id=="appMall/paySuccess.html-1"||id=="appMall/productDetail.html"){
				allView[i].close();
			}
		}
		
	});
});

/**
 * 获取订单支付状态
 * @author xuezhenxiang
 */
function getOrderPayState(){
	$.ajax({
		url: prefix + "/order/orderState/" + strOrderId,
		type: "GET",
		dataType: "json",
		success: function(res){
			ajaxLog(res);
			if(res.resCode == 0){
				var result = res.result;
				var factPrice=result.factPrice;
				var strOrderNum=result.strOrderNum;
				var dtPayTime=result.dtPayTime;
				var stateName=result.stateName;
				$("#factPrice").html(factPrice);
				$("#strOrderNum").html(strOrderNum);
				$("#dtPayTime").html(dtPayTime);
				$("#stateName").html(stateName);
			}
		}
	})
}
