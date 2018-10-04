var categoryStair = []; //第一级category数据存储
var categoryMovers = []; //第二级category数据存储
var categoryHtml = []; //html数组

mui.init({
	swipeBack: false
})

mui.plusReady(function() {
	
	setSubWebviewBounce('none');

	// 获取所有分类
	getCategoryList();

})

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
			$("#loading").hide();
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

					;(function(categoryStairDom, brands, secondCategoryList,firstCategoryId){
						// 点击一级分类
						categoryStairDom.on("click", function(){
							$(this).addClass("mui-active").siblings().removeClass("mui-active");

							// 清空品牌列表和二级分类列表
							$("#brandList").html("");
							$("#secondCategoryList").html("");
							renderChildCategory(brands, secondCategoryList,firstCategoryId);
						});



					})(categoryStairDom, brands, secondCategoryList,firstCategoryId);

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
function renderChildCategory(brands, secondCategoryList,catId0){
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
		var catId1=secondCategoryList[i].id;
		var thirdCategoryList = secondCategoryList[i].chileCategory;
		if(!thirdCategoryList || thirdCategoryList.length <= 0){
			continue;
		}

		secondCategoryTemplate = secondCategoryTemplate.replace("#secondCategoryName#", secondCategoryName);

		var secondCategoryDom = $(secondCategoryTemplate);
		if(thirdCategoryList){
				;(function(secondCategoryDom, thirdCategoryList,catId0){
			for(var ii = 0, ll = thirdCategoryList.length; ii < ll; ii++){
				var thirdCategoryTemplate = $("#thirdCategoryTemplate").html();
				var thirdCategoryImg = thirdCategoryList[ii].strImg;
				var thirdCategoryName = thirdCategoryList[ii].name;
				var thirdCategoryId = thirdCategoryList[ii].id;
				thirdCategoryTemplate = thirdCategoryTemplate.replace("#thirdCategoryImg#", thirdCategoryImg);
				thirdCategoryTemplate = thirdCategoryTemplate.replace("#thirdCategoryName#", thirdCategoryName);

				var thirdCategoryDom = $(thirdCategoryTemplate);
				;(function(thirdCategoryDom, thirdCategoryName,catId0,thirdCategoryId){
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
								catId0: catId0,
								catId2: thirdCategoryId,
							}
						});
					});
				})(thirdCategoryDom, thirdCategoryName,catId0,thirdCategoryId);

				secondCategoryDom.find(".categoryListID").append(thirdCategoryDom);
			}

		})(secondCategoryDom, thirdCategoryList,catId0);
		}
		
		$("#secondCategoryList").append(secondCategoryDom);
	}
};