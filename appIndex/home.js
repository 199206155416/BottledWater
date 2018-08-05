mui.init({
	swipeBack: false
});
var currentWebview;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = []; //推荐商品数组

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	//设置跑马灯
	// setMarquee();
	
	//添加每个item点击的监听事件
	mui('#goodsList').on('tap', '.goods-item', function() {
		var item = this;
		var itemID = this.getAttribute('id');
		var extendOptions = {
			itemID: itemID
		};
		pushWebView({
			webType: 'newWebview_First',
			id: 'appMall/productDetail.html',
			href: 'appMall/productDetail.html',
			aniShow: getaniShow(),
			title: "商品详情",
			isBars: false,
			barsIcon: '',
			extendOptions: extendOptions
		});
	});
})

