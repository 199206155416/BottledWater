var openType;//打开类型
var currentWebview; // 当前子页面
var map;
var changeValue;
var mapWebView
mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	mapWebView=plus.webview.getWebviewById("appAddress/map.html_1");
	//changeValue=currentWebview.changeValue;
	//console.log("changeValue:"+changeValue);
	map= new BMap.Map("container");
	map.centerAndZoom("石家庄",12);
	// 绑定事件
	bindEvent();
});

function bindEvent(){
	$("#searchKey").bind('input propertychange', function() {
		changeValue=$(this).val();
		 searchMap();
        }
      );

}

function searchMap(){
	$("#peripheryInfo").html("");
 var local = new BMap.LocalSearch("石家庄",   
            {renderOptions: {map: map,autoViewport: true},pageCapacity: 8,onSearchComplete:function(results){
            	if (local.getStatus() == BMAP_STATUS_SUCCESS){      
		            // 判断状态是否正确      
		            var s = [];      
		            for (var i = 0; i < results.getCurrentNumPois(); i ++){      
			                var poi=results.getPoi(i);
				 	        var poit=poi.point;
			                var strHtml='<li class="addressDetailInfo">'+
								'<div class="receiveInfo">'+
									'<div>'+
									'	<span style="font-size: .3rem;color: #333;">'+poi.title+'</span>'+
									'</div>'+
									'<div>'+
										'<span>'+poi.address+'</span>'+
									'</div>'+
								'</div>'+
							'</li>';
							$("#peripheryInfo").append(strHtml);
							$("#peripheryInfo li").last().data("index",i);
							$("#peripheryInfo li").last().click(function(){
								   var index=$(this).data("index");
								   var choosePoi=results.getPoi(index);
								   var chooseTitle=choosePoi.title;
								   var chooseAddress=choosePoi.address;
				 	               var choosePoit=choosePoi.point;
				 	               var lng=choosePoit.lng;//经度
							 	   var lat=choosePoit.lat;//纬度
							 	   var data={chooseTitle:chooseTitle,chooseAddress:chooseAddress,lng:lng,lat:lat};
							 	   mui.fire(mapWebView,"chooseAddress",data);
							 	   mui.back();  
							});
		            }      
        		}else{
        			mui.toast("检索失败");
        		}
            	
            }});  
local.search(changeValue);

}
