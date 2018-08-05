mui.init({
	swipeBack: false
});
var currentWebview; //当前子页面
var paredntWebview; //父页面
var product_id;
var detail = {};
var detailcontent;
mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	paredntWebview = currentWebview.parent();
	detailcontent = document.getElementById('detailcontent');
	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('hide', function() {
		detail = {};
	}, false);
	
	//如果要获取当前页面的数据
	mui.fire(paredntWebview,'getExtendOptions',{});
	//监听返回获取到options数据
	window.addEventListener('postExtendOptions',function(e){
		console.log(JSON.stringify(e.detail.extendOptions))
	},false);
	
	//初始化一些本地数据
	initSomeData();
	//设置显示
	setHtml();
})

function initSomeData() {
	detail.product_name = "到底是什么鬼啊，宝宝不高兴";
	detail.product_price = {defaultPrice:"20.00",listPrice:"28.0"};
	var arr = [];
	for (var i = 0;i<5;i ++) {
		var img = '../img/detail/'+ i+ '.jpg';
		arr.push(img);
	}
	detail.detail_small_pictures = arr;
}

function setHtml() {
	//第一步设置第一个图片滑动
	setSldiderHtml();
	//第二步设置商品名字价钱等
	setproductMessage();
	//设置颜色选择
	setChooseColor();
	//设置评价
	setevalute();
	//设置店铺
	setStore();
	//设置相试宝贝
	setGoodsLike();
}
//设置slider
function setSldiderHtml() {
	var picSlider = document.createElement('div');
	picSlider.className = 'mui-slider';
	detailcontent.appendChild(picSlider);
	var picSliderGroup = document.createElement('div');
	picSliderGroup.className = 'mui-slider-group';
	var picsliderindicator = document.createElement('div');
	picsliderindicator.className = 'mui-slider-indicator';
	for (var i = 0; i < detail.detail_small_pictures.length;) {
		var item = detail.detail_small_pictures[i];
		//设置itemdetai
		var div = document.createElement('div');
		div.className = 'mui-slider-item';
		var html = '<a href="#"><img src="' + item + '"/></a>';
		div.innerHTML = html;
		picSliderGroup.appendChild(div);
		//设置itemindicator
		var divindicator = document.createElement('div');
		if (i == 1) {
			divindicator.className = 'mui-indicator mui-active';
		} else {
			divindicator.className = 'mui-indicator';
		}
		picsliderindicator.appendChild(divindicator);
		i = i + 1;
	}
	picSlider.appendChild(picSliderGroup);
	picSlider.appendChild(picsliderindicator);
	var gallery = mui('.mui-slider');
	gallery.slider({
		interval: 0 //自动轮播周期，若为0则不自动播放，默认为0；
	});
}
//设置信息
function setproductMessage() {
	var headul = document.createElement('ul');
	headul.id = 'headul';
	headul.className = 'mui-table-view';
	detailcontent.appendChild(headul);
	var html = '<li class="mui-table-view-cell">\
		<div class="mui-table">\
			<div class="mui-table-cell mui-col-xs-10">\
				<h5 class="own-black-color mui-ellipsis-2">' + detail.product_name + '</h5>\
				<h5 class="own-main-color">¥' + detail.product_price.defaultPrice + '</h5>\
				<h6 class="own-text-through">¥' + detail.product_price.listPrice + '</h6>\
			</div>\
			<div class="mui-table-cell mui-col-xs-2 mui-text-right" >\
				<div class="borderleft">\
					<h6>心愿单</h6>\
				</div>\
			</div>\
		</div>\
</li>\
<li class="mui-table-view-cell" >\
		<div class="mui-table">\
			<div class="mui-table-cell mui-col-xs-10">\
				<h5 class="own-black-color">快递12.00元</h5>\
			</div>\
			<div class="mui-table-cell mui-col-xs-2 mui-text-right">\
				<h5 class="own-black-color">成都</h5>\
			</div>\
		</div>\
</li>\
<li class="mui-table-view-cell setbg">\
	<div>\
		<span class="mui-icon iconfont icon-queren" ></span>\
		<span>商家保证</span>\
	</div>\
		<div>\
			<span class="mui-icon iconfont icon-queren" ></span>\
			<span>7天无理由退换货，退货邮费由买家承担</span>\
		</div>\
		<div>\
			<span class="mui-icon iconfont icon-queren" ></span>\
			<span>单笔订单满199元，送礼物一份</span><br />\
		</div>\
		<div>\
			<span class="mui-icon iconfont icon-queren" ></span>\
			<span>单笔订单满399元，免快递费(不包含地区：新疆)</span>\
		</div>\
</li>';
	headul.innerHTML = html;
}
//设置选择颜色分类
function setChooseColor() {
	var chooseUl = document.createElement('ul');
	chooseUl.className = 'mui-table-view chooseUl';
	chooseUl.innerHTML = '<li class="mui-table-view-cell">\
					<a href="#" class="mui-navigate-right">选择 颜色 分类</a>\
					</li>';
	detailcontent.appendChild(chooseUl);
}
//设置评价
function setevalute() {
	var evaluteUl = document.createElement('ul');
	evaluteUl.className = 'mui-table-view';
	detailcontent.appendChild(evaluteUl);
	//评价块
	var evaluteDiv = document.createElement('li');
	evaluteDiv.className = 'mui-table-view-cell';
	evaluteDiv.innerHTML = '<p class="evaluateTitle">宝贝评价</p>\
	<div>\
		<span class="evaluate">味道好闻（46）</span>\
		<span class="evaluate">服务态度好（2）</span>\
		<span class="evaluate">是正品（1）</span>\
		<span class="evaluate">包装严实（6）</span>\
		<span class="evaluate">快递不错（90）</span>\
		<span class="evaluate">质量不错（20）</span>\
	</div>';
	evaluteUl.appendChild(evaluteDiv);
	//评价
	var evaluateContent = document.createElement('li');
	evaluateContent.className = 'mui-table-view-cell';
	evaluateContent.innerHTML = '<div class="evaluaterHead">\
		<img src="../img/touxiang.jpg" />\
		<span>王**小明</span>\
	</div>\
	<p class="evaluteContent">颜色和图片上的一样，没有色差，穿上以后也没有想象中的显黑，反而显白,颜色和图片上的一样，没有色差，穿上以后也没有想象中的显黑，反而显白</p>\
	<p class="evaluteMsg">2015－01-02,颜色分类：风之恋男 Q版5ml 净含量：其他/other</p>';
	evaluteUl.appendChild(evaluateContent);
	//查看更多
	var evaluateMore = document.createElement('li');
	evaluateMore.className = 'mui-table-view-cell moreEvaluate';
	evaluateMore.innerHTML = '<a href="#">查看更多信息</a>';
	evaluteUl.appendChild(evaluateMore);
}
//设置店铺
function setStore() {
	var storeUl = document.createElement('ul');
	storeUl.className = 'mui-table-view';
	storeUl.innerHTML = '<li class="mui-table-view-cell">\
	<div class="evaluaterHead">\
		<img src="../img/bg.jpeg" />\
		<span class="mui-ellipsis">[妮妮的店铺]全部正品</span>\
	</div>\
	<div class="mui-table">\
		<div class="mui-table-cell mui-col-xs-4">发货速度：4.8</div>\
		<div class="mui-table-cell mui-col-xs-4">发货数度：5.0</div>\
		<div class="mui-table-cell mui-col-xs-4">发货数度：4.5</div>\
	</div>\
	<div class="mui-table storeLink " style="text-align: center;">\
		<div class="mui-table-cell mui-col-xs-6">396<br/><span class="stroemsg">全部宝贝</span><br/><span class="evaluate lingBtn">查看宝贝分类</span></div>\
		<div class="mui-table-cell mui-col-xs-6">3.3万<br/><span class="stroemsg">关注人数</span><br/><span class="evaluate lingBtn">进入店铺吧</span></div>\
	</div>\
 </li>';
	detailcontent.appendChild(storeUl);
}

function setGoodsLike() {
	var goods = document.createElement('ul');
	goods.className = 'mui-table-view mui-grid-view';
	detailcontent.appendChild(goods);
	var word = document.createElement('p');
	word.className = 'own-black-color';
	word.style.marginBottom = '0px';
	word.style.marginLeft = '5px';
	word.style.paddingTop = '5px';
	word.innerText = '相似商品';
	goods.appendChild(word);
	for (var i = 0; i < 8; i++) {
		var goodsItem = document.createElement('li');
		goodsItem.className = 'mui-table-view-cell mui-media mui-col-xs-3';
		goodsItem.innerHTML = '<a href="#">\
				<img class="mui-media-object" style="max-width: 100%;height: auto" src="../img/3.jpg" />\
				<div class="mui-media-body ">\
					<p class="mui-ellipsis-2">尽量不要福建省批发价我佩服排位积分排位</p>\
					<p class="price">¥22.0</p>\
				</div>\
			</a>'
		goods.appendChild(goodsItem);
	}
	//			<li class="mui-table-view-cell mui-media mui-col-xs-3">
	//				<a href="#">
	//					<img class="mui-media-object" style="max-width: 100%;height: auto" src="../img/bg.jpeg" />
	//					<div class="mui-media-body ">
	//						<p class="mui-ellipsis-2">尽量不要福建省批发价我佩服排位积分排位</p>
	//						<p class="price">¥22.0</p>
	//					</div>
	//				</a>
	//			</li>
}