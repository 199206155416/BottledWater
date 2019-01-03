var _LoadNumber = { a: false,b:false };

mui.init({
	swipeBack: false,
//	pullRefresh: {
//		container: ".mui-content", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
//		down: {
//			// style: 'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
//			// color:' #2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
//			// height: '50px',//可选,默认50px.下拉刷新控件的高度,
//			// range: '100px', //可选 默认100px,控件可下拉拖拽的范围
//			// offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
//			auto: true, //可选,默认false.首次加载自动上拉刷新一次
//			callback: function() { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
//				// 获取焦点图
//				getFocusImg();
//				// 获取商品列表
//				getGoodsList();
//
//				setTimeout(function() {
//					mui('.mui-content').pullRefresh().endPulldown();
//				}, 3000);
//			}
//		}
//	}
});
var currentWebview;
var marqueeArray = []; //跑马灯数据数组
var recommendArray = []; //推荐商品数组

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	// 获取焦点图
	getFocusImg();
    checkUpdate();
    
	// 获取商品列表
	getGoodsList();
 
    // 监听点击消息事件
    /*
    plus.push.addEventListener( "click", function( msg ) {
        // 判断是从本地创建还是离线推送的消息
        switch( msg.payload ) {
            case "LocalMSG":
                outSet( "点击本地创建消息启动：" );
            break;
            default:
                outSet( "点击离线推送消息启动：");
            break;
        }
        // 提示点击的内容
        plus.ui.alert( msg.content );
        // 处理其它数据
        logoutPushMsg( msg );
    }, false );
    // 监听在线消息事件
    plus.push.addEventListener( "receive", function( msg ) {
        if ( msg.aps ) {  // Apple APNS message
            outSet( "接收到在线APNS消息：" );
        } else {
            outSet( "接收到在线透传消息：" );
        }
        logoutPushMsg( msg );
    }, false );
   */
});

//检查更新
function checkUpdate(){
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
		var wgtVer = inf.version;
		console.log("当前版本："+wgtVer);
		var formData=new FormData();
		formData.append("version",wgtVer);
		$.ajax({
		url: prefix + "/appupdate/checkAppUpdate",
		type: 'POST',
		data: formData,
		contentType: false,
	 	processData: false,  
		dataType: "json",
		success: function(res){
			// 打印请求报错日志
			ajaxLog("代码更新"+res);
			if(res.resCode == 0){
				var downUrl=res.result;
				if(downUrl!=""&&downUrl){
					console.log("downUrl："+downUrl);
					downWgt(downUrl);
				}
			}	
	
		}
		});
	});
}
		// 下载wgt文件 
// 实际项目中需要更换为自己服务器的地址 
function downWgt(url){ 
   //var url='http://www.zhilonggk.com/appupdate.wgtu';
    plus.nativeUI.showWaiting("升级中...");
    var dtask = plus.downloader.createDownload( url, {method:"GET"}, function(d,status){
        if ( status == 200 ) { 
            console.log( "Download wgtu success: " + d.filename );
            plus.runtime.install(d.filename,{},function(){
                plus.nativeUI.closeWaiting();
                plus.nativeUI.alert("资源包更新成功,是否重启",function(){
                    plus.runtime.restart();
                });
            },function(e){
                plus.nativeUI.closeWaiting();
                alert("资源包更新失败: "+e.message);
            });
        } else {
            plus.nativeUI.closeWaiting();
             alert( "下载资源包失败: " + status ); 
        } 
    } );
    dtask.addEventListener('statechanged',function(d,status){
        console.log("statechanged: "+d.state);
    });
    dtask.start();
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


function openUseCon(){
	     var extendOptionsData={conType:4};
		var aniShow = getaniShow();

		pushWebView({
			webType: 'newWebview_First',
			id:"myCenter/conshow.html",
			href: "myCenter/conshow.html",
			aniShow: aniShow,
			extendOptions: extendOptionsData
		})
	
}

function tipFun(){
	mui.toast("正在建设中");
}

function openCatGoods(catId0,thirdCategoryId,categoryName){
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


/**
 * 获取焦点图
 */
function getFocusImg() {
	$.ajax({
		url: prefix + "/sys/getTopImgs",
		type: 'GET',
		dataType: "json",
		success: function(e) {
			// 打印请求报错日志
			ajaxLog(e);
			_LoadNumber.a = true;

			if(e.resCode == 0) {
				var result = e.result;
				var marqueeArray = [];

				for(var i = 0, len = result.length; i < len; i++) {
					var marqueeItem = {};
					marqueeItem.contentId = result[i].strLink;
					marqueeItem.imagerpath = result[i].strImg;
					marqueeArray.push(marqueeItem);
				}

				setMarquee(marqueeArray);
			}
		}
	});
};

///**
// * 设置轮播图
// * @author xuezhenxiang
// */
//function setMarquee(marqueeArray) {
//	var sliderMarquee = document.getElementById('slider');
//	var sliderGroup = document.createElement('div');
//	sliderGroup.className = 'mui-slider-group mui-slider-loop';
//	sliderMarquee.appendChild(sliderGroup);
//	var sliderIndicator = document.createElement('div');
//	sliderIndicator.className = 'mui-slider-indicator';
//	sliderMarquee.appendChild(sliderIndicator);
//	for (var i = 0; i < marqueeArray.length; i++) {
//		if (0 == i) {
//			var sliderItemDuplicate = document.createElement('div');
//			sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
//			sliderItemDuplicate.innerHTML = '<a href="' + marqueeArray[marqueeArray.length - 1].contentId + '">\
//					<img src="' + marqueeArray[marqueeArray.length - 1].imagerpath + '" />\
//				</a>';
//			sliderGroup.appendChild(sliderItemDuplicate);
//		}
//		var sliderItem = document.createElement('div');
//		sliderItem.className = 'mui-slider-item';
//		sliderItem.innerHTML = '<a href="' + marqueeArray[i].contentId + '">\
//				<img src="' + marqueeArray[i].imagerpath + '" />\
//			</a>';
//		sliderGroup.appendChild(sliderItem);
//		var indicatorItme = document.createElement('div');
//		if (i == 0) {
//			indicatorItme.className = 'mui-indicator mui-active';
//		} else {
//			indicatorItme.className = 'mui-indicator';
//		}
//		sliderIndicator.appendChild(indicatorItme);
//		if (marqueeArray.length - 1 == i) {
//			var sliderItemDuplicate = document.createElement('div');
//			sliderItemDuplicate.className = 'mui-slider-item mui-slider-item-duplicate';
//			sliderItemDuplicate.innerHTML = '<a href="' + marqueeArray[0].contentId + '">\
//					<img src="' + marqueeArray[0].imagerpath + '" />\
//				</a>';
//			sliderGroup.appendChild(sliderItemDuplicate);
//		}
//		slider = mui('.mui-slider').slider({
//			interval:2000
//		});
//	}
//};

/**
 * 设置轮播图
 * @author xuezhenxiang
 */
function setMarquee(marqueeArray) {
	var strHtml = "";
	for(var i = 0; i < marqueeArray.length; i++) {
		if(marqueeArray[i].contentId){
			strHtml += '<div class="swiper-slide"><a href="' + marqueeArray[i].contentId + '">\
				<img src="' + marqueeArray[i].imagerpath + '" />\
			</a></div>'
		}else{
			strHtml += '<div class="swiper-slide">\
				<img src="' + marqueeArray[i].imagerpath + '" />\
			</div>'
		}
		
	}
	$("#banner").html(strHtml);
	slider = new Swiper(".swiper-container", {
		autoplay: 5000,
		loop: true,
		pagination: '.swiper-pagination',
	});
};

/**
 * 获取商品列表
 * @author xuezhenxiang
 */
function getGoodsList() {
	$.ajax({
		url: prefix + "/goods/getModularGoods/0",
		type: 'GET',
		dataType: "json",
		success: function(e) {
			// 打印请求报错日志
			ajaxLog(e);
			_LoadNumber.a = true;

			if(e.resCode == 0) {
				var result = e.result;
				$("#goodsList").html("");
				for(var i = 0, len = result.length; i < len; i++) {
					var activityImg = result[i].strImg;
					var mallGoodsList = result[i].mallGoodsList;
					var htmlTemplate = $("#goodsListTemplate").html();

					if(activityImg) {
						htmlTemplate = htmlTemplate.replace("#activityImg#", "<img src='" + activityImg + "' />");
					} else {
						htmlTemplate = htmlTemplate.replace("#activityImg#", "");
					}
                    var catId=result[i].mallCategory.id;
					var goodslist = $(htmlTemplate);
					(function(catId){
						goodslist.find(".banner-bar").click(function(){
							openSuperMarket();
							  //openCatGoods(catId,'0','');
						});
					})(catId);
					

					for(var i1 = 0, len1 = mallGoodsList.length; i1 < len1; i1++) {
						var id = mallGoodsList[i1].id;
						var strGoodsName = mallGoodsList[i1].strGoodsName;
						var strMainImg = mallGoodsList[i1].strMainImg;
						var goodsSlogn = mallGoodsList[i1].strTitle || "";
						var defaultSkuPrice = mallGoodsList[i1].defaultSkuPrice;

						var goodsTemplate = $("#goodsTemplate").html();
						goodsTemplate = goodsTemplate.replace("#id#", id);
						goodsTemplate = goodsTemplate.replace("#strMainImg#", strMainImg);
						goodsTemplate = goodsTemplate.replace("#strGoodsName#", commonNameSubstr(strGoodsName, 34));
						goodsTemplate = goodsTemplate.replace("#goodsSlogn#", commonNameSubstr(goodsSlogn, 28));
						goodsTemplate = goodsTemplate.replace("#defaultSkuPrice#", defaultSkuPrice);

						var goods = $(goodsTemplate);;
						(function() {
							goods.on("click", function() {
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
			}else{
			  mui.alert(e.result);
			}
		}
	})
};

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
		 	_LoadNumber = { a: false, b:false };
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
PullRefresh('scroll', function(){
	// 获取焦点图
	getFocusImg();
	// 获取商品列表
	getGoodsList();
});
