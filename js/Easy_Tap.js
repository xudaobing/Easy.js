/* Tap -- 快速点击
 *
 * 2015-05-30
 *
 * fast click
 */
var Tap = (function(){
	var isTouch = 'ontouchstart' in window,
		taps = [], ts_info, touchEnd;

	if(isTouch){

		window.addEventListener('touchstart', function(e){
			var ct = e.changedTouches[0];
			ts_info = {};
			ts_info.x = ct.clientX;
			ts_info.y = ct.clientY;
			ts_info.t = new Date().getTime();
		}, true);

		touchEnd = function(e){
			var args = arguments, ct = e.changedTouches[0], _this = this;
			if( Math.abs(ct.clientX - ts_info.x) < 15 && Math.abs(ct.clientY - ts_info.y) < 15 && new Date().getTime() - ts_info.t < 150 ){
				taps.forEach(function(o){
					if(o && o.elem === _this && o.callbacks && o.callbacks.length){
						o.callbacks.forEach(function(f){
							f.apply(_this, args);
						});
					};
				});
			};
		};

	};

	return function(elem, callback, isRemove){
		var args = arguments, len = args.length, self = args.callee, index = -1;
		if( !len ) return;

		if( Array.isArray( elem ) ){
			var args =  Array.prototype.slice.call( args );
			elem.forEach(function(v){
				args.splice(0, 1, v);
				self.apply(null, args);
			});
			return;
		};

		if( !elem || elem.nodeType !== 1 ) return;

		if( len > 1 ){
			callback = args[1];
			callback = ( callback && typeof callback === 'function' ) ? callback : false;
		};

		if( len === 1){
			isRemove = true;
		}else{
			isRemove = args[ len - 1 ];
			isRemove = (!!isRemove && typeof isRemove !== 'function') ? true : false;
		};

		if(isTouch){
			taps.forEach(function(o, i){
				if(o && o.elem && o.elem === elem) index = i;
			});
		};

		if( isRemove ){
			if( !isTouch ) callback && ( elem.removeEventListener('click', callback, false) );
			if( index === -1 ) return;
			if( callback ){
				var callbacks = taps[ index ]['callbacks'],
					f_index = callbacks.indexOf( callback );
				if( f_index !== -1 ) callbacks.splice( f_index, 1);
			}else{
				taps.splice(index, 1);
				elem.removeEventListener('touchend', touchEnd, false);
			};
		}else{
			if( !isTouch ){
				callback && ( elem.addEventListener('click', callback, false) );
				return;
			};
			if( index === -1 ){
				taps.push( { elem : elem, callbacks : [] } );
				elem.addEventListener('touchend', touchEnd, false);
				index = taps.length - 1;
			};
			if( callback && taps[ index ][ 'callbacks' ].indexOf( callback ) === -1 ) taps[ index ][ 'callbacks' ].push( callback );
		};
	};
}());

