var currentWebview; // 当前子页面
var paredntWebview; // 父页面
var goodsList; // 待结算商品列表

mui.init({
	swipeBack: false
});


mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	paredntWebview = currentWebview.parent();
	detailcontent = document.getElementById('detailcontent');
	//监听页面隐藏的隐藏的时候清空数据信息
	currentWebview.addEventListener('hide', function() {
		goodsId = null;
	}, false);

	goodsList = currentWebview.goodsList;

	//如果要获取当前页面的数据
	mui.fire(paredntWebview,'getExtendOptions',{});
	//监听返回获取到options数据
	window.addEventListener('postExtendOptions',function(e){
		console.log(JSON.stringify(e.detail.extendOptions))
	},false);

	setHtml();

	// 绑定事件
	bindEvent();
});

function setHtml() {
	// 第一步查询默认地址
	queryDefaultAddress();
	//第二步设置商品
	setProduct();
	// //设置颜色选择
	// setChooseColor();
	// //设置评价
	// setevalute();
	// //设置店铺
	// setStore();
	// //设置相试宝贝
	// setGoodsLike();
};

/**
 * 设置图片轮播
 * @author xuezhenxiang
 */
function queryDefaultAddress(){
	
};

/**
 * 设置商品
 * @author xuezhenxiang
 */
function setProduct(){
	for(var i = 0, len = goodsList.length; i < len; i++){
		var strGoodsImg = goodsList[i]["strGoodsImg"];
		var strSkuName = goodsList[i]["strSkuName"];
		var strSku = goodsList[i]["strSku"];
		var goodsFactPrice = goodsList[i]["goodsFactPrice"];
		var nCount = goodsList[i]["nCount"];

		var goodsTemplate = $("#goodsTemplate").html();

		goodsTemplate = goodsTemplate.replace("#strGoodsImg#", strGoodsImg);
		goodsTemplate = goodsTemplate.replace("#strSkuName#", strSkuName);
		goodsTemplate = goodsTemplate.replace("#strSku#", strSku);
		goodsTemplate = goodsTemplate.replace("#goodsFactPrice#", goodsFactPrice);
		goodsTemplate = goodsTemplate.replace("#nCount#", nCount);

		var goodsDom = $(goodsTemplate);

		$("#goodsList").append(goodsDom);
	}
};

/**
 * 事件绑定
 * @author xuezhenxiang
 */
function bindEvent(){
	// 点击确定按钮
	$("#doPay").on("click", function(){
		var btnArray = ['否', '是'];
        mui.confirm('MUI是个好框架，确认？', 'Hello MUI', btnArray, function(e) {
            if (e.index == 1) {
                info.innerText = '你刚确认MUI是个好框架';
            } else {
                info.innerText = 'MUI没有得到你的认可，继续加油'
            }
        },"div")
	});

};
