mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	var strInviteCode=localStorage.getItem("myInviteCode");
	$(".invite-code").html(strInviteCode);
	getFocusImg();
});

/**
 * 获取焦点图
 */
function getFocusImg() {
	$.ajax({
		url: prefix + "/sys/getTopImgs",
		type: 'GET',
		dataType: "json",
		success: function(e) {
			// 打印请求报错日志
			ajaxLog(e);
			if(e.resCode == 0) {
				var result = e.result;
				var strLink= result[0].strLink;
			    var strImg= result[0].strImg;
				$("#strImg").attr("src",strImg);
				
			}
		}
	});
};
