mui.init({
	swipeBack: false
});
var currentWebview;
var homeDiv;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = []; //推荐商品数组
mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	homeDiv = document.getElementById('homeDiv');
	// //初始化一些本地数据
	// initSomeData();
	// //设置跑马灯
	// setMarquee();
	// //设置推荐商品
	// setRecommend();
	//添加每个item点击的监听事件
	mui('#recommend').on('tap', 'a', function() {
		var goodsId = this.getAttribute('href');
		var extendOptions = {
			goodsId: goodsId
		};
		pushWebView({
			webType: 'newWebview_First',
			id: 'appIndex/productDetail.html',
			href: 'appIndex/productDetail.html',
			aniShow: getaniShow(),
			title: "商品详情",
			isBars: false,
			barsIcon: '',
			extendOptions: extendOptions
		});
	});
})

