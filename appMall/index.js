var _LoadNumber = { a: false };

mui.init({
	swipeBack: false,
	//	 pullRefresh: {
	//	     container: ".mui-content",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	//	     down : {
	////	 		style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	////	 		color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	////	 		height: '50px',//可选,默认50px.下拉刷新控件的高度,
	////	 		range: '100px', //可选 默认100px,控件可下拉拖拽的范围
	////	 		offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
	////	 		auto: true,//可选,默认false.首次加载自动上拉刷新一次
	//	 		callback: function(){} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	//	     }
	//   	}
});
var currentWebview;
var homeDiv;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = []; //推荐商品数组
mui.plusReady(function () {
	currentWebview = plus.webview.currentWebview();
	homeDiv = document.getElementById('homeDiv');
	getTopCategory();
	// 获取商品列表
	getGoodsList();
	//添加每个item点击的监听事件
	$('#channelList').on('click', 'li', function () {
		var id = $(this).attr('id');

		// 所有分类
		if (id == "all") {
			pushWebView({
				webType: 'newWebview_First',
				id: 'appCategory/category.html',
				href: 'appCategory/category.html',
				aniShow: getaniShow(),
				title: "商品分类",
				isBars: false,
				barsIcon: '',
				extendOptions: {}
			});

			return false;
		}
	});
});


/**
 * 获取所有分类
 * @author lsw
 */
function getTopCategory() {
	$.ajax({
		url: prefix + "/category/topList",
		type: 'GET',
		dataType: "json",
		success: function (res) {
			// 打印请求报错日志
			ajaxLog(res);

			if (res.resCode == 0) {
				var categoryList = res.result;
				for (var i = 0; i < categoryList.length; i++) {
					var id = categoryList[i].id; // 一级类目id
					var name = categoryList[i].name; // 一级类目的名称
					var strTopImg = categoryList[i].strTopImg;//图片
					var categoryTemplate = $("#catTemp").html();
					categoryTemplate = categoryTemplate.replace("#id#", id);
					categoryTemplate = categoryTemplate.replace("#name#", name);
					categoryTemplate = categoryTemplate.replace("#strTopImg#", strTopImg);
					var categoryTemplateDom = $(categoryTemplate);
					; (function (id, categoryTemplateDom, name) {
						categoryTemplateDom.on("click", function () {
							if("生活超市"==name){
								openSuperMarket();
							}else{
								openCatGoods(id, 0, name);
							}
							return false;
						});
					})(id, categoryTemplateDom, name);
					$("#all").before(categoryTemplateDom);
				}

			}
		}
	});
}


/**
 * 获取商品列表
 * @author xuezhenxiang
 */
function getGoodsList() {
	$.ajax({
		url: prefix + "/goods/getModularGoods/1",
		type: 'GET',
		dataType: "json",
		success: function (e) {
			_LoadNumber.a = true;
			// 打印请求报错日志
			ajaxLog(e);

			if (e.resCode == 0) {
				var result = e.result;

				$("#goodsList").html("");

				for (var i = 0, len = result.length; i < len; i++) {
					var activityImg = result[i].strImg;
					var mallGoodsList = result[i].mallGoodsList;
					var htmlTemplate = $("#goodsListTemplate").html();
					if (activityImg) {
						htmlTemplate = htmlTemplate.replace("#activityImg#", activityImg);
					} else {
						htmlTemplate = htmlTemplate.replace("#activityImg#", "");
					}

					var goodslist = $(htmlTemplate);

					for (var i1 = 0, len1 = mallGoodsList.length; i1 < len1; i1++) {
						var id = mallGoodsList[i1].id;
						var strGoodsName = mallGoodsList[i1].strGoodsName;
						var strMainImg = mallGoodsList[i1].strMainImg;
						var goodsSlogn = mallGoodsList[i1].strTitle;
						var defaultSkuPrice = mallGoodsList[i1].defaultSkuPrice;

						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#id#", id);
						goodsTemplate = goodsTemplate.replace("#strMainImg#", strMainImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsName#", strGoodsName);
						goodsTemplate = goodsTemplate.replace("#goodsSlogn#", goodsSlogn);
						goodsTemplate = goodsTemplate.replace("#defaultSkuPrice#", defaultSkuPrice);

						var goods = $(goodsTemplate);
						; (function () {
							goods.on("tap", function () {
								var goodsId = this.getAttribute('id');
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
							})
						})();
						goodslist.find(".goods-list").append(goods);
					}

					$("#goodsList").append(goodslist);
				}
			}
		}
	})
}


function openSuperMarket(){
	pushWebView({
				webType: 'newWebview_First',
				id: 'appCategory/category.html',
				href: 'appCategory/category.html',
				aniShow: getaniShow(),
				title: "商品分类",
				isBars: false,
				barsIcon: '',
				extendOptions: {}
			});
}

function openCatGoods(catId0, thirdCategoryId, categoryName) {
	pushWebView({
		webType: 'newWebview_First',
		id: 'appCategory/goodsBrandList.html',
		href: 'appCategory/goodsBrandList.html',
		aniShow: getaniShow(),
		title: categoryName,
		isBars: false,
		barsIcon: '',
		extendOptions: {
			catId0: catId0
		}
	});
}

//下拉刷新
function PullRefresh(id) {
	var Tween = {
		Linear: function (t, b, c, d) { return c * t / d + b; },
		Quad: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t + b;
			},
			easeOut: function (t, b, c, d) {
				return -c * (t /= d) * (t - 2) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t + b;
				return -c / 2 * ((--t) * (t - 2) - 1) + b;
			}
		},
		Cubic: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t * t + b;
			},
			easeOut: function (t, b, c, d) {
				return c * ((t = t / d - 1) * t * t + 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t + 2) + b;
			}
		},
		Quart: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t * t * t + b;
			},
			easeOut: function (t, b, c, d) {
				return -c * ((t = t / d - 1) * t * t * t - 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
			}
		},
		Quint: {
			easeIn: function (t, b, c, d) {
				return c * (t /= d) * t * t * t * t + b;
			},
			easeOut: function (t, b, c, d) {
				return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
				return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
			}
		},
		Sine: {
			easeIn: function (t, b, c, d) {
				return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
			},
			easeOut: function (t, b, c, d) {
				return c * Math.sin(t / d * (Math.PI / 2)) + b;
			},
			easeInOut: function (t, b, c, d) {
				return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
			}
		},
		Expo: {
			easeIn: function (t, b, c, d) {
				return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
			},
			easeOut: function (t, b, c, d) {
				return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
			},
			easeInOut: function (t, b, c, d) {
				if (t == 0) return b;
				if (t == d) return b + c;
				if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
				return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
			}
		},
		Circ: {
			easeIn: function (t, b, c, d) {
				return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
			},
			easeOut: function (t, b, c, d) {
				return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
			},
			easeInOut: function (t, b, c, d) {
				if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
				return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
			}
		},
		Elastic: {
			easeIn: function (t, b, c, d, a, p) {
				if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
				if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
				else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			},
			easeOut: function (t, b, c, d, a, p) {
				if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
				if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
				else var s = p / (2 * Math.PI) * Math.asin(c / a);
				return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
			},
			easeInOut: function (t, b, c, d, a, p) {
				if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
				if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
				else var s = p / (2 * Math.PI) * Math.asin(c / a);
				if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
			}
		},
		Back: {
			easeIn: function (t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * (t /= d) * t * ((s + 1) * t - s) + b;
			},
			easeOut: function (t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			},
			easeInOut: function (t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
				return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
			}
		},
		Bounce: {
			easeIn: function (t, b, c, d) {
				return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
			},
			easeOut: function (t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
				}
			},
			easeInOut: function (t, b, c, d) {
				if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
				else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
			}
		}
	}
	function xround(x, num) {
		return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
	}
	var scrollElement = document.getElementById(id);
	/**1滚动条状态，3touch接管状态 */
	var topState = 1;
	//var isTop = false;
	var startClientY = 0;
	var prevMoveY = 0;
	var refreshHeight = 44;
	var isRefres = false;
	//刷新状态1正常，2松手刷新，3刷新中
	var refresState = 1;
	//移动距离
	var distance = 0;
	scrollElement.addEventListener('scroll', function (event) {
		//console.log(event);

	}, false);
	scrollElement.addEventListener('touchstart', function (event) {
		var touch = event.targetTouches[0];
		startClientY = xround(touch.clientY, 2);
		prevMoveY = startClientY;
	}, false);
	var touchmove = function (event) {
		var touch = event.targetTouches[0];
		var clientY = xround(touch.clientY, 2);
		var direction = 'down';
		if (prevMoveY > clientY) {
			direction = 'up'
		}
		//触碰到下滑临界值
		if (topState === 1 && $("#scroll").scrollTop() <= 0 && direction == 'down') {
			event.preventDefault();
			startClientY = clientY;
			topState = 3;
			//console.log('到顶了', event)
			return;
		}
		if (topState == 3) {
			if (window.swiper && window.swiper.autoplaying == true) {
				window.swiper.stopAutoplay();
			}
			if (direction == 'down') {
				event.preventDefault();
				distance = (clientY - startClientY) / 2 - refreshHeight;
				setState(distance);
				scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
				scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			}
			else {
				distance = clientY - startClientY - refreshHeight;
				if (distance > -refreshHeight) {
					event.preventDefault();
					distance = (clientY - startClientY) / 2 - refreshHeight;
					setState(distance);
					scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
					scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
				}
				else {
					topState = 1;
					setState(-refreshHeight)
					scrollElement.style.webkitTransform = 'translate3d(0,' + -refreshHeight + 'px,0)';
					scrollElement.style.transform = 'translate3d(0,' + -refreshHeight + 'px,0)';
				}
			}

		}
		prevMoveY = clientY;
	}
	function setState(distance) {
		if (refresState != 2 && distance >= 0) {
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'block';
			refresState = 2;
		}
		if (refresState != 1 && distance < 0) {
			refresState = 1;
			document.getElementById('top1').style.display = 'block';
			document.getElementById('top2').style.display = 'none';
			document.getElementById('top3').style.display = 'none';
		}
	}
	scrollElement.addEventListener('touchmove', touchmove, false);
	var touchend = function (event) {
		scrollElement.removeEventListener('touchmove', touchmove, false);
		scrollElement.removeEventListener('touchend', touchend, false);
		var touch = event.targetTouches[0];
		if (refresState == 2) {
			refresState = 3;
			document.getElementById('top1').style.display = 'none';
			document.getElementById('top2').style.display = 'block';
			document.getElementById('top3').style.display = 'none';
			an(0);
			_LoadNumber = { a: false };
			_isPullRefresh = true;
			var loadNumberTimeId = setInterval(function () {
				if (_LoadNumber.a) {
					_isPullRefresh = false;
					refresState = 1;
					an(- refreshHeight);
					clearInterval(loadNumberTimeId);
				}

			}, 1000);
			// 请求接口数据
			getGoodsList();
		} else {

			if (topState == 3) {
				an(- refreshHeight);
			}
			else {
				scrollElement.addEventListener('touchmove', touchmove, false);
				scrollElement.addEventListener('touchend', touchend, false);
			}
		}
		topState = 1;
	}
	scrollElement.addEventListener('touchend', touchend, false);
	scrollElement.addEventListener('touchcancel', touchend, false);


	var an = function (position) {
		position = +position;
		var tdistance = +distance
		var start = 0, during = 35;
		var _run = function () {
			start++;
			distance = Tween.Cubic.easeOut(start, tdistance, position - tdistance, during);
			scrollElement.style.webkitTransform = 'translate3d(0,' + distance + 'px,0)';
			scrollElement.style.transform = 'translate3d(0,' + distance + 'px,0)';
			if (start < during) {
				requestAnimationFrame(_run);
			}
			else {
				if (refresState !== 3) {
					scrollElement.addEventListener('touchmove', touchmove, false);
					scrollElement.addEventListener('touchend', touchend, false);
				}
				else {
				}
				if (position == (- refreshHeight)) {
					document.getElementById('top1').style.display = 'block';
					document.getElementById('top2').style.display = 'none';
					document.getElementById('top3').style.display = 'none';
				}

				topState = 1;
			}
		};
		_run();
	}
}
//下拉刷新调用
PullRefresh('scroll');
