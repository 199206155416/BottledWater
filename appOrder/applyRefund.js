var currentWebview;
var order; // 退款订单
var refundType;
mui.init({
	swipeBack: false,
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
	order = currentWebview.order;
	var index=currentWebview.index;
	refundType=index;
	if(0==index){//仅退款
		$(".mui-title").html("申请退款");
	}else if(1==index){
		$(".mui-title").html("申请退款/退货");
		$(".after-sale-infos>li:eq(0)").show();
	}else if(2==index){
		$(".mui-title").html("申请换货");
		$(".after-sale-infos>li:eq(2)").hide();
	}
	// 获取订单列表
	getOrderDetail();
	
	// 绑定事件
	bindEvent();
});

function bindEvent(){
	// 提交表单
	$("#applyBtn").on("click", function(){
		  doSave();
	});

	// 选择原因
	$("#selectReason").on("click", function(){
		// 初始化mui选择器
		initSelect();
	});
	
    $("#selectGoodsState").on("click", function(){
		 var pickerGoodsState = new mui.PopPicker();
		 	pickerGoodsState.setData([
		 		{value:'摔坏了', text:'摔坏了'},
		 		{value:'掉漆了', text:'掉漆了'},
			]);
		 	pickerGoodsState.show(function (selectItems) {
			    $("#goodsState").html(selectItems[0].text);
		  });
	});
	
	$("#uploadImg").click(function(){
		  $("input[type='file']").trigger("click");
	});
}

function doSave(){
	var strUserId = localStorage.getItem("userId");
	var strOrderId=order.id;
	var refundMoney=order.factPrice;
	var refundReason=$("#refundReason").html();
	var goodsState=$("#goodsState").html();
	if(refundReason==""){
		mui.alert("请选择退款原因");
		return false;
	}
	
	if(goodsState=="" && 1==refundType){
		mui.alert("请选择货物状态");
		return false;
	}
	var sendData=new FormData();
	sendData.append("strUserId",strUserId);
	sendData.append("strOrderId",strOrderId);
	sendData.append("refundMoney",refundMoney);
	sendData.append("refundType",refundType);
	sendData.append("refundReason",refundReason);
	if(goodsState!=""){
		sendData.append("goodsState",goodsState);
	}
	var files = $('input[type="file"]').prop('files');
	if(files.length>0){
		sendData.append("file",files[0]);
	}
	$.ajax({
		url: prefix + "/refund/save",
		type: "POST",
		data: sendData,
		contentType: false,
	 	processData: false,  
		dataType: "json",
		success: function(res){
				ajaxLog(res);
				var result=res.result;
				if(res.resCode == 0){
					mui.toast("提交成功");
					openOrderList();
				}else{
				   mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
	
}

function openOrderList(){
		pushWebView({
			webType: 'newWebview_First',
			id: 'appOrder/orderList.html-1',
			href: 'appOrder/orderList.html',
			aniShow: getaniShow(),
			title: "订单列表",
			isBars: false, 
			barsIcon: '',
			extendOptions: {
			}
		});
}

/**
 * 初始化mui选择器
 */
function initSelect(){
	var picker = new mui.PopPicker();
 	picker.setData([
 		{value:'选错商品了', text:'选错商品了'},
 		{value:'与图片不符', text:'与图片不符'},
	]);
 	picker.show(function (selectItems) {
	    // console.log(selectItems[0].text);//智子
	    // console.log(selectItems[0].value);//zz 

	    $("#refundReason").html(selectItems[0].text);
  });
  
 
  
}

/**
 * 获取订单详情
 * @author xuezhenxiang
 */
function getOrderDetail(){
	            var factPrice=order.factPrice;
	            $("#factPrice").html("￥"+factPrice);
				var mallOrderDetailList = order.mallOrderDetailList; // 商品列表
				for(var i = 0, len = mallOrderDetailList.length; i < len; i++){
					var remarks = mallOrderDetailList[i].remarks;
					var strSkuName = mallOrderDetailList[i].strSkuName; // 商品名称
					var skuPrice = mallOrderDetailList[i].skuPrice; // 商品价格
					var strGoodsImg = mallOrderDetailList[i].strGoodsImg; // 商品图片
					var count = mallOrderDetailList[i].count; // 商品数量
					var orderListTemp ='<div class="goods-item">'+
									'<div class="goods-item-img"><img src="'+strGoodsImg+'" alt=""></div>'+
									'<div class="goods-info">'+
										'<p class="goods-title">'+strSkuName+'</p>'+
										'<p class="goods-sku">'+remarks+'</p>'+
										'<p class="goods-price">￥'+skuPrice+'<span class="goods-count">X'+count+'</span></p>'+
									'</div>'+
								'</div>';
					$(".goods-list").append(orderListTemp);

					
				}
	
}



function changImg(e){ 
 var myImg = document.getElementById('uploadImg');
 for (var i = 0; i < e.target.files.length; i++) { 
 var file = e.target.files[i]; 
 console.log(file); 
 if (!(/^image\/.*$/i.test(file.type))) { 
  continue; //不是图片 就跳出这一次循环 
 } 
 //实例化FileReader API 
 var freader = new FileReader(); 
 freader.readAsDataURL(file); 
 freader.onload = function(e) { 
  console.log(e);
  myImg.setAttribute('src', e.target.result); 
 } 
 } 
 }


