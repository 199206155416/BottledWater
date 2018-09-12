mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	//注册列表的点击事件
	addListevent();
	
})
// //点击头像事件
// function addHeadevent() {
// 	//点击头像登录
// 	touxiangimg.addEventListener('tap', function() {
// 		if (!localStorage.getItem('user')) {
// 			pushWebView({
// 				webType: 'newWebview_First',
// 				id: 'login/login.html',
// 				href: 'login/login.html',
// 				aniShow: getaniShow(),
// 				title: "登录",
// 				isBars: false,
// 				barsIcon: '',
// 				extendOptions: {}
// 			})
// 		}
// 	}, false);
// }

//注册列表的点击事件
function addListevent() {
	$("#moreList").on('click', 'li', function() {
		var id = $(this).attr("id");
		var extendOptionsData={};
		if(0==id||1==id){
			extendOptionsData={conType:id};
			id="myCenter/conshow.html";
		}
		var aniShow = getaniShow();

		pushWebView({
			webType: 'newWebview_First',
			id: id,
			href: id,
			aniShow: aniShow,
			extendOptions: extendOptionsData
		})
	});
}

