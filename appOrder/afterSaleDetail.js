var currentWebview;
var refundItem; // 退款数据
var afterSaleWebView;
var pageNo;
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
	afterSaleWebView=plus.webview.getWebviewById("appOrder/afterSale.html");
	refundItem = currentWebview.refundItem;
    pageNo = currentWebview.pageNo;
	// 获取退款详情
	getRefundDetail();
	
	// 绑定事件
	bindEvent();
});

function bindEvent(){
	//$(".recall-apply").click(function(){
		//doCloseRefund();
	//});
	
	$(".change-apply").click(function(){
		//openEdit();
		doCloseRefund();
	});
	
}

function openEdit(){
	var id=refundItem.id;	
}

function doCloseRefund(){
	var id=refundItem.id;
	var state=refundItem.state;
		$.ajax({
		url: prefix + "/refund/closeRedund",
		type: "POST",
		data: {"id":id,"state":state}, 
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					mui.toast("撤销成功");
					var backData={"type":0,"id":id,"pageNo":pageNo};
					mui.fire(afterSaleWebView,"editData",backData);
					mui.back();
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}

/**
 * 获取订单列表
 * @author xuezhenxiang
 */
function getRefundDetail(){
		            var item=refundItem;
					var strStateName=item.strStateName;
					var refundReason=item.refundReason;
					var refundMoney=item.refundMoney;
					var remarks=item.remarks;
					var createDate=item.createDate;
					var state=item.state;
					var strImgPath=item.strImgPath;
					$('#refundReason').html(refundReason);
					if(refundMoney&&0!=refundMoney){
						$('#refundMoney').html("￥"+refundMoney);
					}else{
						$('#refundMoney').parent().hide();
					}
					var goodsState=item.goodsState;
					if(goodsState&&""!==goodsState){
						$("#goodsState").html(goodsState);
					}else{
						$("#goodsState").parent().hide();
					}
					$('#remarks').html(remarks);
					$('#createDate').html(createDate);
					if(strImgPath){
						$("#strImgPath").attr("src",strImgPath);
					}
					if(state!=0){
						$(".order-state-title").html(strStateName);
						$(".order-state-introduce").hide();
						$(".footer-bar").hide();
					}
					var order=item.mallOrder;
				   var mallOrderDetailList=order.mallOrderDetailList;
					for(var i1 = 0, len1 = mallOrderDetailList.length; i1 < len1; i1++){
						var itemGoods=mallOrderDetailList[i1];
						var id = itemGoods.id;
						var strGoodsName = itemGoods.strSkuName;
						var strGoodsImg = itemGoods.strGoodsImg;
						var strSkuAttr = itemGoods.strSkuAttr;
						var skuPrice = itemGoods.skuPrice;
						var count = itemGoods.count;
						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsTitle#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#strGoodsSKUDetail#", commonNameSubstr(strSkuAttr, 28));
						goodsTemplate = goodsTemplate.replace("#skuPrice#", skuPrice);
						goodsTemplate = goodsTemplate.replace("#count#", count);
						var goods = $(goodsTemplate);
						$(".goods-list").append(goods);
					}
	
}

