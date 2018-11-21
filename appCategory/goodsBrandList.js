var currentWebview = null; // 当前webview
var parentWebView = null; // 父级webview

var pageNo = 1; // 页码
var pageSize = 20; // 每页记录数，20
var mallCategory0Id = null; // 一级类目id（非必传）
var mallCategory2Id = null; // 三级类目id（非必传）
var mallBrandId = null; // 品牌id（非必传）
var orderByField = "-1"; // 排序字段，销量传：default_sku_sale_num，价格传：defaultSkuPrice,传-1：综合排序
var orderByType = "-1"; // 排序方式，递增：asc,递减：desc，传-1：综合排序
var _LoadNumber = { a: false };


var priceFlag = true;
mui.init({
	swipeBack: true,

});

mui.plusReady(function () {
	currentWebview = plus.webview.currentWebview();

	mallCategory0Id = currentWebview.catId0; // 一级类目id（非必传）
	mallCategory2Id = currentWebview.catId2; // 三级级类目id（非必传）
	mallBrandId = currentWebview.brandId; // 品牌id（非必传）

	$("#mallUp").html(currentWebview.title);

	// 获取所有分类
	getGoodsList();

	//添加监听事件
	bindEvent();
});

/**
 * 绑定事件
 * @author xuezhenxiang
 */
function bindEvent() {

	// 筛选数据
	$("#sort").on("click", "li", function () {
		var sortType = $(this).attr("sortType") || "";
		var flag = $(this).hasClass("active"); // 当前是否选中
		var lId = $(this).attr("id");

		if (flag && lId != "costNum") {
			return false;
		}

		if (lId == "costNum") {
			if (!priceFlag) {
				$(".topImg").attr("src", "image/gray.png");
				$(".bottomImg").attr("src", "image/color.png");
				priceFlag = true;
				orderByType = 'asc';
			} else {
				$(".topImg").attr("src", "image/color.png");
				$(".bottomImg").attr("src", "image/gray.png");
				priceFlag = false;
				orderByType = 'desc';
			}
		} else {
			$(".topImg").attr("src", "image/gray.png");
			$(".bottomImg").attr("src", "image/gray.png");
			orderByType = -1;
		}

		$(this).addClass("active").siblings().removeClass("active");


		$("#scroll").animate({ scrollTop: 0 }, 10);
		$("#mallListID").html("");
		pageNo = 1;
		loadFlag == 1;
		orderByField = sortType;
		getGoodsList();
	});
};

/**
 * 获取所有商品
 * @author xuezhenxiang
 */
function getGoodsList() {
	var formData = new FormData();
	formData.append("pageNo", pageNo);
	formData.append("pageSize", pageSize);
	if (mallCategory0Id) {
		formData.append("mallCategory0Id", mallCategory0Id);
	}


	if (mallCategory2Id) {
		formData.append("mallCategory2Id", mallCategory2Id);
	}

	if (mallBrandId) {
		formData.append("mallBrandId", mallBrandId);
	}

	formData.append("orderByField", orderByField);
	formData.append("orderByType", orderByType);
    $("#load").show();
	$.ajax({
		url: prefix + "/goods/searchGoods",
		type: 'POST',
		data: formData,
		contentType: false,
		processData: false,
		dataType: "json",
		success: function (res) {
			_LoadNumber.a = true;
			// 打印请求报错日志
			ajaxLog(res);
			 $("#load").hide();
			if(res.resCode == 0){
				var nCount = res.result.count;
				var goodsList = res.result.list;
				if (nCount == 0) {
					$("#shopPingNullTemp").show();
					return false;
				} else {
					$("#shopPingNullTemp").hide();
				}

				if (goodsList.length == 0) {
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
					goodsTemp = goodsTemp.replace("#strGoodsName#", commonNameSubstr(strGoodsName, 36));
					goodsTemp = goodsTemp.replace("#strTitle#", strTitle);
					goodsTemp = goodsTemp.replace("#skuPrice#", skuPrice);

					var mallListDom = $(goodsTemp);

					; (function (mallListDom, goodsId) {
						// 点击一级分类
						mallListDom.on("click", function () {
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

// 屏幕滚动后加载列表
$("#scroll").scroll(function () {
	var scrollTop = $(this).scrollTop();	// 滚动高度		    
	var scrollHeight = $(this).height(); // 文档高度
	var windowHeight = $(window).height(); // 文档窗口高度

	if (scrollTop + windowHeight >= scrollHeight - 300) {
		if (loadFlag == 1) {
			loadFlag = 0;
			getGoodsList();
		}
	}

});


//下拉刷新
function PullRefresh(id, callback) {
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
			console.log('到顶了', event)
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
			callback();
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
PullRefresh('scroll', function () {
	pageNo = 1;
	loadFlag = 1;
	$("#mallListID").html("");
	$("#load").hide();
	// 获取数据
	getGoodsList();
});

