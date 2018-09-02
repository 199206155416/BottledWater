var currentWebview = null; // 当前webview
var parentWebView = null; // 父级webview

var pageNo = 1; // 页码
var pageSize = 20; // 每页记录数，20
var mallCategory0Id = null; // 一级类目id（非必传）
var mallCategory2Id = null; // 三级类目id（非必传）
var mallBrandId = null; // 品牌id（非必传）
var orderByField = null; // 排序字段，销量传：default_sku_sale_num，价格传：defaultSkuPrice,传-1：综合排序
var orderByType = null; // 排序方式，递增：asc,递减：desc，传-1：综合排序

mui.init({
	swipeBack: false
})

mui.plusReady(function() {
	
	setSubWebviewBounce('none');
	currentWebview = plus.webview.currentWebview();
	parentWebView = plus.webview.currentWebview().parent();


	mallCategory0Id = currentWebview.firstCategoryId; // 一级类目id（非必传）
	mallCategory2Id = currentWebview.thirdCategoryId; // 三级类目id（非必传）
	mallBrandId = currentWebview.brandId; // 品牌id（非必传）


	// 获取所有分类
	getGoodsList();

	// //添加点击第一级和第二级的监听事件
	// addCategoryEvent();

	// //初始化第一级数据并且设置html
	// initFirstCategoryData();

	// //初始化第二级数据并且设置html
	// initSecondCategoryData(0);
})

// //添加点击第一级和第二级的监听事件
// function addCategoryEvent() {
// 	//为第一级分类监听点击事件
// 	mui('#categoryStair').on('tap', '.mui-control-item', function() {
// 		var item = this;
// 		get_sub_categoryByParentID(item.getAttribute('href').substring(9));
// 	});
// 	//监听第二级分类的点击事件
// 	//监听事件中mui选择的时候最好不要有多个被选择的对象，也就是＃categoryMovers最好只表示一个节点。也就是最好用id
// 	mui('#categoryMovers').on('tap', '.mui-table-view-cell a', function() {
// 		var categoryA = this;
// 		var id = 'appCategory/category-detail-new-needtem.html';
// 		var title = categoryA.innerText;
// 		var href = 'appCategory/category-detail-new-needtem.html';
// 		var categoryID = categoryA.getAttribute('href');
// 		//弹入分类商品列表
// 		pushWebView({
// 			webType: 'newWebview_First',
// 			id: id,
// 			href: href,
// 			aniShow: getaniShow(),
// 			title: title,
// 			isBars: false,
// 			barsIcon: '',
// 			extendOptions: {categoryID:categoryID}
// 		})
// 	});
// }
// //初始化第一级数据并且设置html
// function initFirstCategoryData() {
// 	for (var i = 0; i < 10; i++) {
// 		var item = {};
// 		item.id = i;
// 		item.name = '分类' + i;
// 		item.imageurl = '../img/category.png';
// 		categoryStair[i] = item;
// 		var html = '<a class="mui-control-item" href="#category' + categoryStair[i].id + '">' + categoryStair[i].name + '</a>';
// 		categoryHtml.push(html);
// 	}
// 	//设置categorystairhtml的innerhtml
// 	categoryStairHtml.innerHTML = categoryHtml.join('');
// 	//设置初始化第一个的mui-active
// 	document.querySelector('.mui-control-item').classList.add('mui-active');
// 	//重置categoryHtml数组
// 	categoryHtml = [];
// }
// //初始化第二级数据并且设置html
// function initSecondCategoryData(parentId) {
// 	var categorysub = {};
// 	categorysub.parentID = parentId;
// 	categorysubarray = [];
// 	for (var i = 0; i < 20; i++) {
// 		var subitem = {};
// 		subitem.categoryID = i;
// 		subitem.productName = parentId +'子分类' + i;
// 		categorysubarray[i] = subitem;
// 	}
// 	categorysub.categorysubarray = categorysubarray;
// 	//如果已经存在这个id的信息就不在加入
// 	var item = get_categoryMoversStateByID(parentId);
// 	if (item && item.categorysubarray.length > 0) {
// 		return;
// 	}
// 	categoryMovers.push(categorysub);
// 	createSubCategoryHtml(categorysub);
// 	setCurSubCategory();
// }
// //创建二级分类的html
// function createSubCategoryHtml(categorysub) {
// 	var html = '<div id="category' + categorysub.parentID + '" class="mui-control-content"><ul class="mui-table-view">';
// 	mui.each(categorysub.categorysubarray, function(index, item) {
// 		html = html + '<li class="mui-table-view-cell"><a href ="' + item.categoryID + '">' + item.productName + '</a></li>';
// 	});
// 	html = html + '</ul></div>';
	
// 	categoryHtml.push(html);
// 	categoryMoversHtml.innerHTML = categoryHtml.join('');
// }
// //通过parentID获取下面的二级分类
// function get_sub_categoryByParentID(parentID) {
// 	//只有当categoryMovers这个数组中存在这个id并且这个id下面的分类数量大于0才不需要再次请求
// 	var item = get_categoryMoversStateByID(parentID);
// 	if (item && item.categorysubarray.length > 0) {
// 		return;
// 	}
	
// 	initSecondCategoryData(parentID);
// }
// //在完成创建二级分裂之后设置当前选中的subcategory
// function setCurSubCategory() {
// 	var stairslist = document.querySelectorAll('.mui-control-item');
// 	var moversList = document.querySelectorAll('.mui-control-content');
// 	var curItem;
// 	for (var i = 0; i < stairslist.length; i++) {
// 		if (stairslist[i].classList.contains('mui-active')) {
// 			curItem = stairslist[i];
// 			break;
// 		}
// 	}
// 	var curstairsID = curItem.getAttribute('href').substring(9);
// 	var showItem = null;
// 	for (var i = 0; i < moversList.length; i++) {
// 		if (moversList[i].id.substring(8) == curstairsID) {
// 			showItem = moversList[i];
// 			break;
// 		}
// 	}
// 	//如果现在没有content来显示 则马上请求 这个数据
// 	if (showItem) {
// 		showItem.classList.add('mui-active');
// 	} else {
// 		get_sub_categoryByParentID(curstairsID);
// 	}
// }

// function get_categoryMoversStateByID(parentID) {
// 	for (var i = 0; i < categoryMovers.length; i++) {
// 		if (categoryMovers[i].parentID == parentID) {
// 			return categoryMovers[i];
// 		}
// 	}
// 	return null;
// };

/**
 * 获取所有商品
 * @author xuezhenxiang
 */
function getGoodsList(){
	$.ajax({
		url: prefix + "/goods/searchGoods",
		type: 'POST',
		data: {
			pageNo: pageNo,
			pageSize: pageSize,
			mallCategory0Id: mallCategory0Id,
			mallCategory2Id: mallCategory2Id,
			mallBrandId: mallBrandId,
			orderByField: orderByField,
			orderByType: orderByType
		},
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);

			if(res.resCode == 0){
				pageNo++;
				
				var goodsList = res.result.list;

				for (var i = 0; i < goodsList.length; i++) {
					var goodsId = goodsList[i].id; // 商品id
					var strGoodsName = goodsList[i].strGoodsName; // 商品名称
					var strMainImg = goodsList[i].strMainImg; // 商品图片
					var allStock = goodsList[i].allStock; // 商品库存
					var skuPrice = goodsList[i].defaultSkuPrice; // 商品库存
					var mallListTemp = $("#mallListTemp").html();

					mallListTemp = mallListTemp.replace("#strLogoURL#", strLogoURL);
					mallListTemp = mallListTemp.replace("#strTitle#", strTitle);
					mallListTemp = mallListTemp.replace("#skuPrice#", skuPrice);

					var mallListDom = $(mallListTemp);

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

					$("#categoryStair").append(categoryStairDom);
				}
				
				//设置初始化第一个的mui-active
				$('.mui-control-item').eq(0).trigger("click");
				
			}
		}
	});
};

