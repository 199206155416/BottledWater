var openType;//打开类型
var currentWebview; // 当前子页面
var map;
var changeValue;
mui.init({
	swipeBack: true
});

mui.plusReady(function() {
	currentWebview = plus.webview.currentWebview();
	changeValue=currentWebview.changeValue;
	console.log("changeValue:"+changeValue);
	if(changeValue){
		map=currentWebview.map;
		searchMap();
	}
	// 绑定事件
	bindEvent();
});

function bindEvent(){
	$("#searchKey").bind('input propertychange', function() {
		var v=$(this).val();
		 openSearchMap(v);
		 $(this).val("");
          }
      );

}

function searchMap(){
	alert("changeValue:"+changeValue);
 var local = new BMap.LocalSearch("石家庄",   
            {renderOptions: {map: map,autoViewport: true},pageCapacity: 8,onSearchComplete:function(results){
            	if (local.getStatus() == BMAP_STATUS_SUCCESS){      
		            // 判断状态是否正确      
		            var s = [];      
		            for (var i = 0; i < results.getCurrentNumPois(); i ++){      
		                s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);      
		            }      
		             consolo.log(s.join("<br>"));
        		}else{
        			mui.toast("检索失败");
        		}
            	
            }});  
local.search(changeValue);

}
