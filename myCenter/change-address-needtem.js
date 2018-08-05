mui.init({
	swipeBack: true
});
var emptyAddress;
var emptyAddressBtn;
mui.plusReady(function() {
	emptyAddress = document.querySelector('.emptyAddress');
	emptyAddressBtn = emptyAddress.querySelector('button');
	//判断如果没有可用地址就显示添加
	if (false) {
		emptyAddress.style.display = 'block';
		emptyAddressBtn.addEventListener('tap', function() {
			showaddressWeb();
		}, false);
	} else {
		emptyAddress.style.display = 'none';
	}
	//地址修改点击事件
	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
		var cell = this;
		var name = this.children[0];
		var phoneNum = this.children[1];
		var address = this.children[2];
		showaddressWeb();
	});
	//接收rightbar事件
	window.addEventListener('navRightPress', function() {
		showaddressWeb();
	}, false);
});

function showaddressWeb() {
	pushWebView({
		webType: 'newWebview_Second',
		id: 'myCenter/address-needtem.html',
		href: 'myCenter/address-needtem.html',
		aniShow: getaniShow(),
		title: "地址管理",
		isBars: true,
		barsIcon: 'mui-icon iconfont icon-iconfont53',
		extendOptions: {}
	})
}