mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	// 注册事件
	addListevent();
})

//注册列表的点击事件
function addListevent() {
	$("#safetyCenterList").on('click', 'li', function() {
		var id = $(this).attr("id");
		
		var aniShow = getaniShow();
		
		pushWebView({
			webType: 'newWebview_First',
			id: id,
			href: id,
			aniShow: aniShow,
			extendOptions: {}
		})
	});
}

