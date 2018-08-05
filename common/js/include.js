/**
 * 引入主要的js文件
 * @type 
 */
var _main = {};
_main.version = "1.0.0";
_main.prefix = "";		//前缀  /  ../    ../../   ../../../
_main.level = 0;        //层级 0= /  1= ../  2= ../../  3= ../../../
_main.jsURLArr = [
    'common/js/mui.min.js',
    'common/js/engine.js'
];

_main.init=function(){
	_main.getPath();
	_main.inportJS();
}

//获取前缀
/**
 * 其实仔细想想，由于判断路径的js代码一般都直接放在js文件中而不是函数中，
 * 所以当加载该js文件时会立即执行其中的语句，而执行此语句时所获取到的js文件数目正好是js.length-1，
 * 因为页面后面的js文件还没有加载，所以该处的js文件获取的数目并不是页面所有的js文件的数目。
 * 这样一来，获取路径就无需再遍历了，而且文件判断也无需文件名，判断更加准确(js.length-1永远都是其文件本身)。
 */
_main.getPath = function(){
	var jsArr=document.scripts;
	var jsSelf = jsArr[jsArr.length-1];
	var level = jsSelf.getAttribute("level") || 0;
	for(var i=0;i<level;i++){
		_main.prefix = _main.prefix + "../";
	}
}

/**
 * 导入js
 */
_main.inportJS=function(){
	var pre = _main.prefix;
	for(var k=0;k<_main.jsURLArr.length;k++){
		var url = pre+_main.jsURLArr[k];
		url = url+"?="+_main.version;
		document.write("<script type=\"text/javascript\" src="+url+"></script>");
	}
}
_main.init();