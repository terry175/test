(function(){

	//return;

	function setStyle(){$('<style>.btn-change-speed.x{display:block;width:100px;height:45px;color:#ACE7EA;line-height:52px;text-align:center;background-image:url(data:image/png;base64,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)!important;background-repeat:no-repeat!important;background-position:0 0!important;background-size:100px 45px!important;}</style>').appendTo(document.body)}

	var wg_rates = [1,1.2,1.33,1.5,2,5], hooked=0;
	if(localStorage['wg_raid_rate']==undefined){
		localStorage['wg_raid_rate'] = 2;
	}

	function blitz(playtime){
		return playtime/getRate();
	}

	function getRate(){
		var index = ~~localStorage['wg_raid_rate'];
		if(index>=wg_rates.length){
			index=0;
		}
		return wg_rates[index];
	}

	function appbz(){
		if(require && $ 
			&& require.specified('lib/raid/motion')
			&& require.specified('lib/raid/effect')
			&& $('.btn-attack-start').size()>0){

			if(!hooked){

				var motion = require('lib/raid/motion');

				var hookWaitAll = motion.mWaitAll;
				motion.mWaitAll = function(a, b) {
					b.playtime = blitz(b.playtime || 5);
			        return hookWaitAll.call(motion,a,b);
			    };
		        var hookMoveToInstantry = motion.mMoveToInstantry;
		        motion.mMoveToInstantry = function(a, b){
		        	b.playtime = blitz(b.playtime || 0);
		        	return hookMoveToInstantry.call(motion,a,b);
		        };
		        var hookMoveTo = motion.mMoveTo;
		        motion.mMoveTo = function(b, c, d, e){
		        	d.playtime = blitz(d.playtime || 0);
		        	return hookMoveTo.call(motion,b,c,d,e);
		        };
		        var hookChangeMotionAll = motion.mChangeMotionAll;
		        motion.mChangeMotionAll = function(b, d, e, f){
		        	e.wait = blitz(e.wait || 0);
		        	return hookChangeMotionAll.call(motion,b,d,e,f);
		        };
		        var hookChangeMotion = motion.mChangeMotion;
		        motion.mChangeMotion = function(d, e, f){
		        	e.delay = blitz(e.delay || 0);
		        	return hookChangeMotion.call(motion,d,e,f);
		        };
		        var hookResetMotion = motion.mResetMotion;
		        motion.mResetMotion = function(a, b){
		        	b.delay = blitz(b.delay || 0);
		        	return hookResetMotion.call(motion,a,b);
		        };
		        var hookChangeMotionInstantly = motion.mChangeMotionInstantly;
		        motion.mChangeMotionInstantly = function(a){
		        	a.delay = blitz(a.delay || 0);
		        	return hookChangeMotionInstantly.call(motion,a);
		        };

		        var effect = require('lib/raid/effect');

		        var hookHitEffect = effect.mHitEffect;
		        effect.mHitEffect = function(a, c, d){
		        	//console.log('lib/raid/effect.mHitEffect',d.delay);
		        	d.delay = blitz(d.delay || 0);
		        	return hookHitEffect.call(effect,a,c,d);
		        };

		        var hookEffect = effect.mEffect;
		        effect.mEffect = function(a, c, d){
		        	//console.log('lib/raid/effect.mEffect',d.delay);
		        	d.delay = blitz(d.delay || 0);
		        	return hookEffect.call(effect,a,c,d);
		        };/**/

		        /*var hookSetFPS = createjs.Ticker.setFPS;
		        createjs.Ticker.setFPS = function(a){
		        	//return hookSetFPS(99);
		        	return hookSetFPS(24*getRate());
		        };*/
		        hooked=1;

		    }

	        setTimeout(function(){
		        $('.contents').off('tap','.btn-change-speed');
		        $('.btn-change-speed').addClass('x').html('Blitz +'+localStorage['wg_raid_rate']).on('tap',function(){
		        	var index = ~~localStorage['wg_raid_rate']+1;
		        	if(index>=wg_rates.length){
		        		index=0;
		        	}
		        	localStorage['wg_raid_rate']=index;
		        	$('.btn-change-speed').html('Blitz +'+index);
		        	//createjs.Ticker.setFPS();
		        });
		    },3000);
	        //createjs.Ticker.setFPS();
	        console.info('闪电战术已启用。');
		}else{
			setTimeout(appbz,1000);
		}
	}

	appbz();
	setStyle();

})();