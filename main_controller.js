var host = '',
	mode = 'extensions',
	appURL = '',
	lastHash = '';

var defaultWGConfig = {
	version:1,
	content:{
		kStaminaEnable:{title:"体力回复倒计时","default":true},
		kPokerEnable:{title:"启用扑克助手","default":true},
		kSlotEnable:{title:"启用拉霸助手","default":true},
		kBingoEnable:{title:"启用宾果助手","default":true},
		kBloodEnable:{title:"显示怪物血量","default":true},
		kBlitzEnable:{title:"开启闪电战斗","default":true},
		kWRTEnable:{title:"战斗时间显示到秒","default":true},
		kKBSEnable:{title:"战斗按键支持","default":true},
		kQAREnable:{title:"援助列表刷新","default":true},
		kCoopEnable:{title:"启用共斗助手","default":true}
	}
};

delete window.onerror;
//delete console.log;
//delete console.warn;

if(document.getElementById('wg_script_host')){
	host = document.getElementById('wg_script_host').innerHTML;
	mode = document.getElementById('wg_script_host').dataset.mode;
	appURL = document.getElementById('wg_script_host').dataset.appUrl;
}else{
	console.info('please update your kajikano extensions.');
	//return;
}

if(!('bind' in Function.prototype)){
	Function.prototype.bind = function(ctx){
		var fn = this;
		return function(){
			var args = Array.prototype.slice.call(arguments,1);
			fn.apply(ctx,args);
		}
	}
}

if(!('MutationObserver' in window)){
	window.MutationObserver = function(callback){
		this._callback = callback;
		this._elem = null;
		this._innerHTML = '';
		this._timer = 0;
	};
	MutationObserver.prototype.observe = function(elem,option){
		this._innerHTML = elem.innerHTML;
		this._elem = elem;
		this.polling();
	};
	MutationObserver.prototype.polling = function(){
		var innerHTML = this._elem.innerHTML;
		if(innerHTML != this._innerHTML){
			this._innerHTML = innerHTML;
			this._callback();
		}
		this._timer = setTimeout(this.polling.bind(this),500);
	};
	MutationObserver.prototype.disconnect = function(){
		clearTimeout(this._timer);
		this._elem = null;
		this._innerHTML = '';
	};
}


Game.reportError = function(msg, url, line, column, err, callback){
	createAppTeller('/report/err',JSON.stringify({msg:msg,url:url,line:line,column:column,err:err}));
	console.log(msg, url, line, column, err, callback)
};

var createAppTeller = function(method,data){
	if(mode=='app'){
		var s = document.createElement('script');
		s.src = appURL+method+'/'+data;
		document.body.appendChild(s);
	}
};

var wgModules = {};

var defineWGModule = function(name,context){};

var createScriptLoader = function(file,readySerif){
	console.log('loading '+file+' ...');
	var s = document.createElement('script'), r = ~~(Math.random()*10000);
	if(readySerif==undefined){readySerif='请稍后。'}
	var t = "function mp"+r+"(){\
		var s=document.createElement('script');\
		s.onerror=function(){location.reload()};\
		s.src='"+host+file+"';\
		document.body.appendChild(s)\
	};\
	function sb"+r+"(){\
		if(window.$ && $('#ready').size()>0 && !$('#ready').is(':visible')){\
			setTimeout(mp"+r+",100);\
			console.info('"+readySerif+"')\
		}else{\
			setTimeout(sb"+r+",100)\
		}\
	}sb"+r+"()";
	s.innerHTML = t;
	document.body.appendChild(s);
};

var getWGConfig = function(key){
	var values = localStorage['wg_global_config'];
	if(values){
		values = JSON.parse(values);
		if(key in values){
			return values[key];
		}
	}
	if(key in defaultWGConfig.content){
		return defaultWGConfig.content[key].default;
	}
	console.error('key',key,'is not exist in wgconfig');
	return false;
};

var setWGConfig = function(key,value){
	var values = localStorage['wg_global_config'];
	if(!values){
		values = {};
	}else{
		values = JSON.parse(values);
	}
	values[key] = value;
	localStorage['wg_global_config'] = JSON.stringify(values);
};

var tellWebviewAppSetting = function(){
	var sJson = {};
	for(var key in defaultWGConfig.content){
		//console.log(key);
		sJson[key]={title:defaultWGConfig.content[key].title,value:getWGConfig(key)};
	}
	createAppTeller('/menu/add',JSON.stringify(sJson));
};
if(mode=='app'){
	tellWebviewAppSetting();
}

!function checkAnticheat(){
if(require && require.specified('lib/locallib')){
	var cs=0,addcs=function(){if(++cs>=3){$('body').get(0).dataset.safeguard='safeguard'}}
	require('util/ob'),!function bt(){

		//$.Finger.preventDefault = true;
		//console.info('offing');
		//$('#wrapper').off('mousedown mouseup touchstart touchend tap');
		var es=$._data($('#wrapper').get(0)).events,rs={tap:1,mouseup:2,mousedown:3,touchstart:4,touchend:5},guid=-1,count=0;
		if(!es){
			return setTimeout(bt,200)
		}
		for(var key in es){
			for(var i=0;i<es[key].length;i++){
				if(es[key][i].selector==undefined && es[key][i].origType in rs){
					if(guid===-1){
						guid=es[key][i].guid;
					}else if(guid!==es[key][i].guid){
						continue;
					}
					count++;
					//console.info(es[key][i]);
					var handler=es[key][i].handler;
					es[key][i].handler=function(ev){
						if(ev.type!=='tap'){
							//console.info(ev.type,ev.x,ev.y);
						}
						/*if(ev.type==='tap' && ev.x>0 && ev.y>0){
							handler(ev);
						}*/
						//console.info('hacked');
					}
					//$('#wrapper').off(key,es[key][i].handler);
				}
			}
		}
		//console.info(count);
		if(count!==5){
			setTimeout(bt,200);
		}else{
			console.info('bye 1001');
			addcs();
		}
	}();
	//$('body').off('mousedown mouseup touchstart touchend tap');
	var anticheatPath = 'http://game-a3.granbluefantasy.jp/assets/js/lib/locallib.js';
	anticheatPath = $('[data-requiremodule="lib/locallib"]').attr('src');

	function checkModified(codeText){
		var code = codeText.match(/define\([\'\"]util\/ob[\'\"],[^\n]+/i);
		//console.info(code);
		if(code && code.length>0){
			if(code[0]==='define("util/ob",["jquery"],function(a){var b=this,c=0,d=1,e="",f=" ",g='"',h="#",i="*",j=",",k="-",l="/",m="1",n="3",o="5",p=":",q="=",r="A",s="D",t="F",u="G",v="I",w="J",x="M",y="N",z="O",A="P",B="S",C="T",D="U",E="[",F="]",G="^",H="_",I="a",J="b",K="c",L="d",M="e",N="f",O="g",P="h",Q="i",R="j",S="k",T="l",U="m",V="n",W="o",X="p",Y="r",Z="s",$="t",_="u",aa="v",ba="w",ca="x",da="y",ea=1001,fa=4001,ga=7001,ha=7002,ia=8001,ja=8002,ka=9001,la=9002,ma=9003,na=9004,oa=9005,pa=511,qa=3011,ra=5011,sa=10111,ta=20011,ua=50101,va=60101,wa=R+W+Q+V,xa=U+I+S+M+r+Y+Y+I+da,ya=function(){return a[xa](arguments)[wa](e)},za=ya(T,M,V,O,$,P),Aa={};Aa[ya(K,W,V,$,M,V,$,C,da,X,M)]=ya(I,X,X,T,Q,K,I,$,Q,W,V,l,R,Z,W,V),Aa[ya(L,I,$,I,C,da,X,M)]=ya(R,Z,W,V),Aa[ya($,da,X,M)]=ya(A,z,B,C);var Ba=function(c,d){c=c||e,d=d||{},d[ya(_)]=b[ya(u,I,U,M)][ya(_,Z,M,Y,v,L)];var f=ya(W,J,l)+c;Aa[ya(L,I,$,I)]=b[ya(w,B,z,y)][ya(Z,$,Y,Q,V,O,Q,N,da)](d),Aa[ya(_,Y,T)]=b[ya(u,I,U,M)][ya(J,I,Z,M,D,Y,Q)]+f,a[ya(I,R,I,ca)](Aa)},Ca=b[ya(Z,M,$,C,Q,U,M,W,_,$)],Da=c,Ea={},Fa=function(a){if(Ea[a]=(Ea[a]||c)+d,!Da){Da=d;var b=qa,e={};e[ya(K)]=Ea,e[ya(O)]=c,Ca(function(){Ba(ya(Y),e),Da=c},b)}},Ga=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f[ya(W,N,N)](d,g),Fa(b))};f[ya(W,V)](d,g)},Ha=function(a,b,c,d){var e=function(){d()?Fa(a):(a!==fa&&(b+=c),Ca(e,b))};Ca(e,b)};!function(){var a=ya($,da,X,M),e=ya($,I,X),g=ya(da),i=ya(ca),j=b[ya(s,I,$,M)][ya(V,W,ba)],k=c,l=j();Ga(ea,ya(h,ba,Y,I,X,X,M,Y),ya(U,W,_,Z,M,L,W,ba,V,f,U,W,_,Z,M,_,X,f,$,W,_,K,P,Z,$,I,Y,$,f,$,W,_,K,P,M,V,L,f,$,I,X),function(b){return b[a]===e?k=(b[i]||b[g])&&j()-l<ra?c:k+d:l=j(),k>n})}(),function(){var a=ya(C,Q,K,S,M,Y),c=ya(n,o),d=ya(K,Y,M,I,$,M,R,Z),e=ya(O,M,$,t,A,B);Ha(ga,ra,sa,function(){return b[d]&&b[d][a]&&b[d][a][e]&&b[d][a][e]()>c});var f=ya(Z,M,$,v,V,$,M,Y,aa,I,T),g=ya(O,M,$,v,V,$,M,Y,aa,I,T);Ha(ha,ra,sa,function(){if(b[d]&&b[d][a]&&b[d][a][e]&&b[d][a][g]&&b[d][a][f]){var c=b[d][a][e](),h=b[d][a][g]();b[d][a][f](h+100);var i=!1;return b[d][a][e]()==c&&(i=!0),b[d][a][f](h),i}})}(),function(){var b=ya(Z,K,Y,Q,X,$,E,Z,Y,K,G,q,g,K,P,Y,W,U,M,k,M,ca,$,M,V,Z,Q,W,V,p,l,l,N,O,X,W,S,X,S,V,M,P,O,T,K,Q,W,Q,R,M,R,N,M,M,J,Q,O,L,V,J,V,W,S,R,g,F,j,T,Q,V,S,E,P,Y,M,N,G,q,g,K,P,Y,W,U,M,k,M,ca,$,M,V,Z,Q,W,V,p,l,l,N,O,X,W,S,X,S,V,M,P,O,T,K,Q,W,Q,R,M,R,N,M,M,J,Q,O,L,V,J,V,W,S,R,g,F);Ha(ia,sa,va,function(){return a(b)[za]})}(),function(){var b=ya(E,Q,L,G,q,U,S,$,H,F,j,E,K,T,I,Z,Z,G,q,U,S,$,H,F);Ha(ja,sa,va,function(){return a(b)[za]})}(),function(){var b=ya(E,Q,L,G,q,O,J,N,C,W,W,T,F);Ha(ka,ra,ta,function(){return a(b)[za]})}(),function(){var b=ya(Z,K,Y,Q,X,$,E,Q,L,G,q,O,N,M,H,F);Ha(la,ua,va,function(){return a(b)[za]})}(),function(){var b=ya(E,Q,L,G,q,O,_,Y,I,J,_,Y,_,F);Ha(ma,ra,ta,function(){return a(b)[za]})}(),function(){var b=ya(Z,K,Y,Q,X,$,E,Q,L,G,q,$,S,M,H,F);Ha(na,ua,va,function(){return a(b)[za]})}(),function(){var b=ya(Q,V,X,_,$,E,Q,L,i,q,J,W,Z,Z,H,U,W,L,M,H,m,F);Ha(oa,ra,ta,function(){return a(b)[za]})}(),function(){var b=ya(Q,V,X,_,$,E,Q,L,i,q,$,M,U,X,W,Y,I,Y,da,H,Z,U,I,T,T,F);Ha(oa,ra,ta,function(){return a(b)[za]})}(),function(){var a=(b[ya(x,I,$,P)][ya(N,T,W,W,Y)],b[ya(x,I,$,P)][ya(Y,I,V,L,W,U)],b[ya(T,W,K,I,$,Q,W,V)][ya(P,I,Z,P)][ya(Z,X,T,Q,$)](l)[c]);Ha(fa,pa,c,function(){return a!==ya(L,M,J,_,O)})}()});'){
				console.info('ob version safe');
				addcs();
				return;
			}
		}
		alert('官方已更新反作弊代码，请注意！');
		createAppTeller('/report/err',JSON.stringify({sensitive:1,msg:'官方已更新反作弊代码，请注意！'}));
		//window.codeText = codeText;
		//define('util/anticheat',["jquery"],function(a){var b=1001,c=7001,d=9001,e=9002,f=5011,g=10111,h=20011,i=30011,j=60101,k={contentType:"application/json",dataType:"json",type:"POST",url:"ob"},l=function(b){var c={u:Game.userId,c:b};k.data=JSON.stringify(c),a.ajax(k)},m=function(b,c,d,e){var f=a(c),g=function(a){e(a)&&(f.off(d,g),l(b))};f.on(d,g)},n=function(a,b,c,d){var e=function(){d()?l(a):(b+=c,setTimeout(e,b))};setTimeout(e,b)};!function(){var a=0,c=Date.now();m(b,"body","mousedown mouseup touchstart touchend tap",function(b){return"tap"===b.type?a=(b.x||b.y)&&Date.now()-c<f?0:a+1:c=Date.now(),a>3})}(),function(){n(c,g,g,function(){return createjs&&createjs.Ticker&&createjs.Ticker.getFPS&&createjs.Ticker.getFPS()>35})}(),function(){n(d,f,h,function(){return a("[id^=gbfTool]").length})}(),function(){n(e,i,j,function(){return a("script[id^=gfe_]").length})}()});
	}

	var xhr = new XMLHttpRequest();
	xhr.open('get',anticheatPath,true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState===4){
			if(xhr.status===200){
				//console.info(xhr.responseText);
				checkModified(xhr.responseText);
			}else{
				alert('反作弊代码检查失败，请注意！');
				createAppTeller('/report/err',JSON.stringify({sensitive:1,msg:'反作弊代码检查失败，请注意！'}));
			}
		}
	};
	xhr.send();

	var warnRecordKeeper={},hookJQueryAjaxBeforeSend = $.ajaxSettings.beforeSend;
	$.ajaxSettings.beforeSend = function(a,b){
		if(/\/ob\/r|\/gc\/gc/.test(b.url)){
			var p=b.url.split('/').splice(3,2).join('/'),
				g=false,
				m=b.data;
			b.data = m
				.replace(/,?"(\d{4})"\:\d+/ig,function($1,$2){if($2!=='1002' && $2!=='1003' && $2!=='4001'){g=!0;if(!($2 in warnRecordKeeper)){warnRecordKeeper[$2]=1;alert('你触犯了作弊码'+$2+'，赶紧把其它插件禁用了吧！')}return ''}return $1})
                .replace('{,','{')
                .replace(',}','}');
            if(g){
            	console.info(p,m,b.data);
            }
		}
		hookJQueryAjaxBeforeSend.call($.ajaxSettings,a,b);
	};
	addcs();
}else{
	setTimeout(checkAnticheat,300);
}
}();

Object.defineProperty(window,'tapEvent',{get:function(){
	return createRangeTapEvent(360,366,146,50);
}});

var createRangeTapEvent = function(x,y,w,h){
	return $.Event('tap',{x:x+Math.round(Math.random()*w),y:y+Math.round(Math.random()*h)});
}

var receiveAppSetupMenu = function(key,value){
	//console.log(key,value);
	setWGConfig(key,value);
};

var destroyers = [], registerRouteChangeDestroyer = function(fn){
	destroyers.push(fn);
}, routeChangedDestroy = function(){
	if(destroyers.length>0){
		var fn = destroyers.shift();
		fn(routeChangedDestroy);
	}else{
		checkLoadModule();
	}
};

var copyTextToClipboard = function(text){
	var textArea = document.createElement("textarea");
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();
	var ret = document.execCommand('copy');
	document.body.removeChild(textArea);
	return ret;
};

var routeChanged = function(){
	if(lastHash==location.hash){
		return;
	}
	lastHash = location.hash;
	routeChangedDestroy();
};

var checkLoadModule = function(){
	//console.log(location.hash);
	
	if(/mypage/i.test(location.hash)){
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/casino\/game\/slot/i.test(location.hash)){
		if(getWGConfig('kSlotEnable')){
			createScriptLoader('casino_slot.js?v=2','别急，很快就要开始了。');
		}
	}

	else if(/casino\/game\/poker/i.test(location.hash)){
		if(getWGConfig('kPokerEnable')){
			createScriptLoader('casino_poker.js?v=3','别急，很快就要开始了。');
		}
	}

	else if(/casino\/game\/bingo/i.test(location.hash)){
		if(getWGConfig('kBingoEnable')){
			createScriptLoader('casino_bingo.js?v=1');
		}
	}

	else if(/event\/teamraid\d+\/ranking_guild\/detail/i.test(location.hash) || /event\/teamraid\d+\/ranking\/detail/i.test(location.hash)){
		createScriptLoader('teamraid_ranker.js?v=1');
	}

	else if(/raid\/\d+/i.test(location.hash) || /raid_multi\/\d+/i.test(location.hash) || /raid_semi\/\d+/i.test(location.hash)){
		if(getWGConfig('kBloodEnable')){
			createScriptLoader('monster_hp.js?v=1');
		}
		if(getWGConfig('kBlitzEnable')){
			createScriptLoader('combat_blitz.js?v=1');
		}
		if(getWGConfig('kKBSEnable')){
			createScriptLoader('combat_hotkey.js?v=1');
		}
		if(getWGConfig('kWRTEnable')){
			createScriptLoader('raid_timer.js?v=1');
		}
		createScriptLoader('raid_copy_number.js?v=1');
	}

	else if(/coopraid\/room\/\d+/i.test(location.hash)){
		createScriptLoader('coopraid_copy_number.js');
	}

	else if(/coopraid\/offer/i.test(location.hash)){
		if(getWGConfig('kCoopEnable')){
			createScriptLoader('coopraid_offer.js?v=2');
		}
	}

	else if(/quest\/assist/i.test(location.hash)){
		if(getWGConfig('kQAREnable')){
			//createScriptLoader('quest_assist.js?v=1');
		}
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/quest\/index/i.test(location.hash)){
		if(getWGConfig('kStaminaEnable')){
			createScriptLoader('mypage_stamina.js?v=1');
		}
	}

	else if(/quest\/stage/i.test(location.hash)){
		createScriptLoader('quest_stage.js?v=1');
	}

	else if(/event\/teamraid\d+\/top/i.test(location.hash) || /event\/teamraid\d+$/i.test(location.hash)){
		createScriptLoader('teamraid_copy_rival.js?v=1');
	}

	else if(/event\/[\w\d]+\/gacha\//i.test(location.hash)){
		createScriptLoader('event_gacha.js?v=1');
	}

	else if(/present/i.test(location.hash)){
		createScriptLoader('present_auto.js?v=1');
	}
};
