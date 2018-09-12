mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	bindEent();
});

function bindEent(){
	$("#saveBtn").click(function(){
		    var strContent=$("#strContent").val();
		    if(""==strContent){
		    	mui.alert("请输入内容", '提示', function(e) {
			        },"div");
			     return false;
		    }
		    if(strContent.length>150){
		    	 mui.alert("最多输入150字", '提示', function(e) {
			        },"div");
			     return false;
		    }
		    
		    doSave(strContent);
	});
}


function doSave(strContent){
		$("#saveBtn").attr("disabled",true);
		var userId= localStorage.getItem("userId"); // 用户id
	    var strMobile=localStorage.getItem("userMobile"); // 手机号
		var sendData={"strUserId":userId,"strMobile":strMobile,"strUserName":"","strContent":strContent};
		$.ajax({
		url: prefix + "/feedback/save",
		type: 'POST',
		data:sendData,
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);
			$("#saveBtn").attr("disabled",false);
			var result=res.result;
			if(res.resCode == 0){
				mui.toast('提交成功！');
				mui.back();
			}else{
				mui.toast(result);
			}
		}
	});

}