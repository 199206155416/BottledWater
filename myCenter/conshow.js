mui.init({
	swipeBack: false
});
var currentWebview;
var conType;
mui.plusReady(function() {
	// 获取关于我们内容
	currentWebview = plus.webview.currentWebview();
	conType=currentWebview.conType;
	if(conType==0){
		$("#titleEle").html("服务协议");
	}else if(conType==1){
		$("#titleEle").html("关于我们");
	}else if(conType==2){
		$("#titleEle").html("优惠券使用说明");
	}
	getContent();
})


//注册列表的点击事件
function getContent() {
	$.ajax({
		url: prefix + "/sys/getSysValue/"+conType,
		type: 'GET',
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			if(res.resCode == 0){
				$("#container").html(res.result);
			}
		}
	});
}

