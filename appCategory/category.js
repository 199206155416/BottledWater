var categoryWebview; //这个页面的实例
var categoryStair = []; //第一级category数据存储
var categoryMovers = []; //第二级category数据存储
var categoryHtml = []; //html数组
var categoryStairHtml; //categoryStair的div
var categoryMoversHtml; //categoryMovers的div
var parentWebView; //父类

mui.init({
	swipeBack: false
})

mui.plusReady(function() {
	
	setSubWebviewBounce('none');
	categoryWebview = plus.webview.currentWebview();
	categoryStairHtml = document.getElementById('categoryStair');
	categoryMoversHtml = document.getElementById('categoryMovers');
	parentWebView = plus.webview.currentWebview().parent();

	// 获取所有分类
	getCategoryList();

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
 * 获取所有分类
 * @author xuezhenxiang
 */
function getCategoryList(){
	$.ajax({
		url: prefix + "/category/list",
		type: 'POST',
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog(res);

			if(res.resCode == 0){
				var categoryList = res.result;
				for (var i = 0; i < categoryList.length; i++) {
					var firstCategoryId = categoryList[i].id; // 一级类目id
					var firstCategoryName = categoryList[i].name; // 一级类目的名称
					var brands = categoryList[i].brands; // 对应一级类目的品牌列表
					var secondCategoryList = categoryList[i].chileCategory; // 对应一级类目的二级类目列表
					var categoryStairTemplate = $("#categoryStairTemplate").html();

					categoryStairTemplate = categoryStairTemplate.replace("#firstCategoryName#", firstCategoryName);
					var categoryStairDom = $(categoryStairTemplate);

					;(function(categoryStairDom, brands, secondCategoryList){
						// 点击一级分类
						categoryStairDom.on("click", function(){
							$(this).addClass("mui-active").siblings().removeClass("mui-active");

							// 清空品牌列表和二级分类列表
							$("#brandList").html("");
							$("#secondCategoryList").html("");

							renderChildCategory(brands, secondCategoryList);
						});



					})(categoryStairDom, brands, secondCategoryList);

					$("#categoryStair").append(categoryStairDom);
				}
				
				//设置初始化第一个的mui-active
				$('.mui-control-item').eq(0).trigger("click");
				
			}
		}
	});
};

/**
 * 渲染子级品牌和分类
 */ 
function renderChildCategory(brands, secondCategoryList){
	// 1、品牌
	if(brands.length <= 0){
		$("#hotBrand").hide();
	}else{
		for(var i =0, len = brands.length; i < len; i++){
			var brandListTemplate = $("#brandListTemplate").html();
			var brandId = brands[i].id; // 品牌id
			var strBrandName = brands[i].name; // 品牌name
			var strBrandImg = brands[i].strImg; // 品牌Img

			brandListTemplate = brandListTemplate.replace("#strBrandName#", strBrandName);
			brandListTemplate = brandListTemplate.replace("#strBrandImg#", strBrandImg);

			var brandDom = $(brandListTemplate);
			;(function(brandDom, strBrandName){
				brandDom.on("click", function(){
					pushWebView({
						webType: 'newWebview_First',
						id: 'appCategory/goodsBrandList.html',
						href: 'appCategory/goodsBrandList.html',
						aniShow: getaniShow(),
						title: strBrandName,
						isBars: false,
						barsIcon: '',
						extendOptions: {
							title: strBrandName,
						}
					});
				})
			})(brandDom, strBrandName);

			$("#brandList").append(brandDom);
		}

		$("#hotBrand").show();
	}
	// 2、分类
	for(var i = 0, len = secondCategoryList.length; i < len; i++){
		var secondCategoryTemplate = $("#secondCategoryTemplate").html();
		var secondCategoryName = secondCategoryList[i].name;
		var thirdCategoryList = secondCategoryList[i].chileCategory;

		if(!thirdCategoryList || thirdCategoryList.length <= 0){
			continue;
		}

		secondCategoryTemplate = secondCategoryTemplate.replace("#secondCategoryName#", secondCategoryName);

		var secondCategoryDom = $(secondCategoryTemplate);
		;(function(secondCategoryDom, thirdCategoryList){
			for(var ii = 0, ll = thirdCategoryList.length; ii < ll; ii++){
				var thirdCategoryTemplate = $("#thirdCategoryTemplate").html();
				var thirdCategoryImg = thirdCategoryList[ii].strImg;
				var thirdCategoryName = thirdCategoryList[ii].name;
				var thirdCategoryId = thirdCategoryList[ii].id;

				thirdCategoryTemplate = thirdCategoryTemplate.replace("#thirdCategoryImg#", thirdCategoryImg);
				thirdCategoryTemplate = thirdCategoryTemplate.replace("#thirdCategoryName#", thirdCategoryName);

				var thirdCategoryDom = $(thirdCategoryTemplate);
				;(function(thirdCategoryDom, thirdCategoryName){
					thirdCategoryDom.on("click", function(){
						pushWebView({
							webType: 'newWebview_First',
							id: 'appCategory/goodsBrandList.html',
							href: 'appCategory/goodsBrandList.html',
							aniShow: getaniShow(),
							title: thirdCategoryName,
							isBars: false,
							barsIcon: '',
							extendOptions: {
								title: thirdCategoryName,
							}
						});
					});
				})(thirdCategoryDom, thirdCategoryName);

				secondCategoryDom.find(".categoryListID").append(thirdCategoryDom);
			}

		})(secondCategoryDom, thirdCategoryList);

		$("#secondCategoryList").append(secondCategoryDom);
	}
};