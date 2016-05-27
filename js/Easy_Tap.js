/* Tap -- 快速点击
 *
 * 2015-05-13
 *
 * fast click
 */
var Tap = (function(){
	var taps = [], _ts_info,
		contains = function(parent, child){
			if(parent && child && parent.compareDocumentPosition ){
				var ret = parent.compareDocumentPosition( child );
				return ret === 20 || ret === 0;
			};
			return false;
		};
	window.addEventListener('touchstart', function(e){
		var _ct = e.changedTouches[0];
		_ts_info = {};
		_ts_info.x = _ct.clientX;
		_ts_info.y = _ct.clientY;
		_ts_info.t = new Date().getTime();
	}, true);

	function touchEnd(e){
		var _args = arguments, _ct = e.changedTouches[0], _this = this;
		if( Math.abs(_ct.clientX - _ts_info.x) < 15 && Math.abs(_ct.clientY - _ts_info.y) < 15 && new Date().getTime() - _ts_info.t < 150 ){
			taps.forEach(function(o){
				if(o && o.elem === _this && o.callbacks && o.callbacks.length){
					o.callbacks.forEach(function(f){
						f.apply(_this, _args);
					});
				};
			});
		};
	};
	return function(elem, callback, isRemove){
		var args = arguments, len = args.length, self = args.callee;
		if( !len ) return;
		if( Array.isArray( elem ) ){
			var args_arr =  Array.prototype.slice.call( args );
			elem.forEach(function(v){
				args_arr.splice(0, 1, v);
				self.apply(null, args_arr);
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
		var index = -1;
		taps.forEach(function(o, i){
			if(o && o.elem && o.elem === elem) index = i;
		});
		if( isRemove ){
			if( index === -1 ) return;
			if( callback ){
				var callbacks = taps[ index ]['callbacks'],
					f_index = callbacks.indexOf( callback );
				if( f_index !== -1 ){
					callbacks.splice( f_index, 1);
				};
			}else{
				taps.splice(index, 1);
			};
		}else{
			if( index === -1 ){
				taps.push( { elem : elem, callbacks : [] } );
				elem.addEventListener('touchend', touchEnd, false);
				index = taps.length - 1;
			};
			if( callback && taps[ index ][ 'callbacks' ].indexOf( callback ) === -1 ) taps[ index ][ 'callbacks' ].push( callback );
		};
	};
}());

