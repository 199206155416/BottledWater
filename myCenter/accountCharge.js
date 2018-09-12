mui.init({
	swipeBack:true
});
var currentWebview;
var payType;
var channel;
mui.plusReady(function(){
	currentWebview = plus.webview.currentWebview();
    var accountBalance = currentWebview.accountBalance;
    $("#accountBalance").html(accountBalance);
	bindEvent();
	initPayChannel();
});

function bindEvent(){
	window.addEventListener('navRightPress', function() {
		mui.toast('选择了确定');
		//上报服务器e3-server
		mui.back();
	}, false);
	
	$("#chargeBtn").click(function(){
		 $("#dialog").show();
	});
}

function hideDialog(){
	 $("#dialog").hide();
	 $("input[name='accountMoney']").val("");
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
 * 初始化支付名称
 * @param {Object} payType
 */
function initPayText(){
		switch(payType){
			case 0:
			  channel=payChannels[payType];
			break;
			case 1:
			  channel=payChannels[payType];
			break;
		}
}

/**
 * 进行充值
 */
function doCharge(){
	$("#dialog").show();
	payType=$("input[name='checkbox1']:checked").val();
	if(payType==undefined){
		mui.alert("选择支付方式", '提示', function(e) {
			        },"div");
	      return false;
	}
	initPayText();
	var accountMoney=$("input[name='accountMoney']").val();
	if(isNaN(accountMoney)){
		  mui.alert("只能输入数字", '提示', function(e) {
			        },"div");
	      return false;
	}
	var dataFormData=new FormData();
	var strUserId = localStorage.getItem("userId"); // 用户id
	dataFormData.append("user.id",strUserId);
	dataFormData.append("rechargeMoney",accountMoney);
	dataFormData.append("strPayType",payType);
	$.ajax({
			url: prefix + "/account/save",
			type: 'POST',
			data: dataFormData,
			contentType: false,
		    processData: false,  
			dataType: "json",
			success: function(res){
				// 打印请求报错日志
				ajaxLog(res);
				var result = res.result;
				if(res.resCode == 0){
					//进行支付
					var strPayInfo=result;
					doPay(strPayInfo);
				}else{
					 mui.alert(result, '提示', function(e) {
			        },"div");
				}
			}
		});
}
//进行充值支付
function doPay(payInfo){
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
                        hideDialog();
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}else if(payType==0){
		plus.payment.request(channel,payInfo,function(result){
                    plus.nativeUI.alert("支付成功！",function(){
                    	hideDialog();
                    });
                },function(error){
                    plus.nativeUI.alert("支付失败：" + JSON.stringify(error));
                });
	}
}



/**
 * 打开充值记录
 */
function openChargeLog(){
	pushWebView({
				webType: 'newWebview_First',
				id: 'myCenter/rechargeRecord.html_1',
				href: 'myCenter/rechargeRecord.html',
				aniShow: getaniShow(),
				title: "充值记录",
				isBars: false,
				barsIcon: '',
				extendOptions: {}
		   });
}
