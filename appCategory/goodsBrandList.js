var currentWebview = null; // 当前webview
var parentWebView = null; // 父级webview

var pageNo = 1; // 页码
var pageSize = 20; // 每页记录数，20
var mallCategory0Id = null; // 一级类目id（非必传）
var mallCategory2Id = null; // 三级类目id（非必传）
var mallBrandId = null; // 品牌id（非必传）
var orderByField = "-1"; // 排序字段，销量传：default_sku_sale_num，价格传：defaultSkuPrice,传-1：综合排序
var orderByType = "-1"; // 排序方式，递增：asc,递减：desc，传-1：综合排序
var priceFlag=true;
mui.init({
	swipeBack: true,
	// pullRefresh: {
	//     container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	//     down : {
	// 		style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	// 		// color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	// 		// height: '50px',//可选,默认50px.下拉刷新控件的高度,
	// 		// range: '100px', //可选 默认100px,控件可下拉拖拽的范围
	// 		// offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
	// 		// auto: true,//可选,默认false.首次加载自动上拉刷新一次
	// 		callback: function(){} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	//     }
 //  	}
});

mui.plusReady(function() {
	
	// setSubWebviewBounce('none');
	currentWebview = plus.webview.currentWebview();
	// parentWebView = plus.webview.currentWebview().parent();


	mallCategory0Id = currentWebview.catId0; // 一级类目id（非必传）
	mallCategory2Id = currentWebview.catId2; // 三级级类目id（非必传）
	mallBrandId = currentWebview.brandId; // 品牌id（非必传）

	$("#mallUp").html(currentWebview.title);

	// 获取所有分类
	getGoodsList();

	//添加监听事件
	bindEvent();

	// //初始化第一级数据并且设置html
	// initFirstCategoryData();

	// //初始化第二级数据并且设置html
	// initSecondCategoryData(0);
});

/**
 * 绑定事件
 * @author xuezhenxiang
 */ 
function bindEvent(){

	// 筛选数据
	$("#sort").on("click", "li", function(){
		var sortType = $(this).attr("sortType") || "";
		var flag = $(this).hasClass("active"); // 当前是否选中
		var lId = $(this).attr("id");

		if(flag && lId != "costNum"){
			return false;
		}

		if(lId == "costNum"){
			if(!priceFlag){
				$(".topImg").attr("src","image/gray.png");
				$(".bottomImg").attr("src", "image/color.png");
				priceFlag=true;
				orderByType='asc';
			}else{
				$(".topImg").attr("src", "image/color.png");
				$(".bottomImg").attr("src", "image/gray.png");
				priceFlag=false;
				orderByType='desc';
			}
		}else{
			$(".topImg").attr("src", "image/gray.png");
			$(".bottomImg").attr("src", "image/gray.png");
			orderByType=-1;
		}

		$(this).addClass("active").siblings().removeClass("active");
		
		
		$("#scroll").animate({scrollTop: 0},10);	
		$("#mallListID").html("");
		pageNo = 1;
		loadFlag == 1;
		orderByField=sortType;
		getGoodsList();
	});	
};

/**
 * 获取所有商品
 * @author xuezhenxiang
 */
function getGoodsList(){
	var formData = new FormData();
	formData.append("pageNo", pageNo);
	formData.append("pageSize", pageSize);
	if(mallCategory0Id){
		formData.append("mallCategory0Id", mallCategory0Id);
	}
	

	if(mallCategory2Id){
		formData.append("mallCategory2Id", mallCategory2Id);
	}

	if(mallBrandId){
		formData.append("mallBrandId", mallBrandId);
	}
	
	formData.append("orderByField", orderByField);
	formData.append("orderByType", orderByType);

	$.ajax({
		url: prefix + "/goods/searchGoods",
		type: 'POST',
		data: formData,
		contentType: false,
	 	processData: false,  
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);

			if(res.resCode == 0){
				var nCount = res.result.count;
				var goodsList = res.result.list;

				if(nCount == 0){
					$("#shopPingNullTemp").show();
					return false;
				}else{
					$("#shopPingNullTemp").hide();
				}

				if(goodsList.length == 0){
					return false;
				}

				for (var i = 0; i < goodsList.length; i++) {
					var goodsId = goodsList[i].id; // 商品id
					var strGoodsName = goodsList[i].strGoodsName; // 商品名称
					var strTitle = goodsList[i].strTitle; // 商品名称
					var strMainImg = goodsList[i].strMainImg; // 商品图片
					var allStock = goodsList[i].allStock; // 商品库存
					var skuPrice = goodsList[i].defaultSkuPrice; // 商品库存
					var goodsTemp = $("#goodsTemp").html();

					goodsTemp = goodsTemp.replace("#strMainImg#", strMainImg);
					goodsTemp = goodsTemp.replace("#strGoodsName#", strGoodsName);
					goodsTemp = goodsTemp.replace("#strTitle#", strTitle);
					goodsTemp = goodsTemp.replace("#skuPrice#", skuPrice);

					var mallListDom = $(goodsTemp);

					;(function(mallListDom, goodsId){
						// 点击一级分类
						mallListDom.on("click", function(){
							var extendOptions = {
								goodsId: goodsId
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

					})(mallListDom, goodsId);

					$("#mallListID").append(mallListDom);
				}

				pageNo++;
				loadFlag = 1;
			}
		}
	});
};

/**
 * 屏幕滚动后加载列表
 */
var loadFlag = 1;
$(window).scroll(function(){
    var scrollTop = $(window).scrollTop();	// 滚动高度		    
    var scrollHeight = $(document).height(); // 文档高度
	var windowHeight = $(window).height(); // 文档窗口高度
	
	if (scrollTop + windowHeight >= scrollHeight - 300) {
		if(loadFlag == 1){
			loadFlag = 0;
			getGoodsList();
		}
	}

});