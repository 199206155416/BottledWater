mui.init({
	swipeBack: true
});
var datalist = []; //数据数组
var listHtml = []; //listhtml数组
var productsList;
var categorydetailWebview; //当前webview
mui.plusReady(function() {
	categorydetailWebview = plus.webview.currentWebview();
	productsList = document.getElementById('productsList');
	//当reday加载之后，因为每次都要重新load所以每次都会调用到这边。
	//向父页面发送消息获取productID
	mui.fire(categorydetailWebview.parent(), 'getExtendOptions', {});
	//紧接着获取父页面返回的productid事件
	window.addEventListener('postExtendOptions', function(e) {
		console.log('收到返回的productID事件，id为' + e.detail.extendOptions.categoryID);
		//初始化数据
		productlistSuccess()
	}, false);
	//监听页面hide事件，当页面返回的时候将里面的数据清空
	categorydetailWebview.addEventListener('hide', function() {
		//将数据清空以及主要显示列表页面的innerhtml设置为''
		productsList.innerHTML = '';
		datalist = [];
	}, false);
	//添加每个item点击的监听事件
	mui('#productsList').on('tap', 'a', function() {
		var itemID = this.getAttribute('href');
		//弹入分类商品列表
		pushWebView({
			webType: 'newWebview_Second',
			id: 'appIndex/product-detail-needtem.html',
			href: 'appIndex/product-detail-needtem.html',
			aniShow: getaniShow(),
			title: '商品详情',
			isBars: false,
			barsIcon: '',
			extendOptions: {
				product_id: itemID
			}
		})
	});
});
//成功查询分类列表下的数据
function productlistSuccess() {
	for (var i = 0; i < 40; i++) {
		var dataitem = {};
		dataitem.detail_image_url = '../img/2.jpg';
		dataitem.product_price = {
			default_price: '30.0',
			list_price: '28.0'
		};
		dataitem.product_name = "这是从分类列表跳过来的，什么鬼啊";
		dataitem.product_id = i;
		datalist.push(dataitem);
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media mui-col-xs-6';
		li.innerHTML = '<a href="' + dataitem.product_id + '"><div class= "bgDiv"><img class="mui-media-object" src="' + dataitem.detail_image_url + '"/><div class="mui-media-body"><p class="mui-ellipsis-2">' + dataitem.product_name + '</p><p class="price-one">¥' + dataitem.product_price.default_price + '</p><p class="price-two">¥' + dataitem.product_price.list_price + '</p></div></div></a>';
		productsList.appendChild(li);
	}
}