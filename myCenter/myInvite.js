mui.init({
	swipeBack: false
});

mui.plusReady(function() {
	var strInviteCode=localStorage.getItem("strInviteCode");
	$(".invite-code").html(strInviteCode);
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


