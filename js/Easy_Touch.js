/*
//Easy_Touch.js 2016-05-11
*/
;(function(w){
var _toString = Object.prototype.toString,
	_requestAni = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.mozRequestAnimationFrame,
	_cancelAni = w.cancelAnimationFrame || w.webkitCancelAnimationFrame ||  w.mozCancelAnimationFrame;
function Touch( option ){
	this.option = option && this.isObject( option ) ? option : {};
	//console.log( this.option );
	this.ts_Fun = this.t_Start.bind( this );
	this.tm_Fun = this.t_Move.bind( this );
	this.te_Fun = this.t_End.bind( this );
	
	this.init();
	this.addTouch();
};
Touch.prototype.init = function(){
	this.ts_info = {};
	this.tm_info = [];
	this.te_info = {};
	this.m_Ani_id = null;
	this.deleteDirection();
	this.option.init && this.isFunction( this.option.init ) && this.option.init.call( this );
};
Touch.prototype.addTouch = function(){
	( this.option.isAddTouchStart != 0 && this.option.isAddTouchStart != false ) && w.addEventListener("touchstart", this.ts_Fun, false);
	( this.option.isAddTouchMove != 0 && this.option.isAddTouchMove != false ) && w.addEventListener("touchmove", this.tm_Fun, false);
	( this.option.isAddTouchEnd != 0 && this.option.isAddTouchEnd != false ) && w.addEventListener("touchend", this.te_Fun, false);
};
Touch.prototype.t_Start = function(e){
	this.deleteDirection();
	this.cancelAni();
	var _ct = e.changedTouches[0];
	this.ts_info.x = _ct.clientX;
	this.ts_info.y = _ct.clientY;
	this.ts_info.t = new Date().getTime();
	this.tm_info.length = 0;
	this.tm_info.push( this.ts_info );
	this.te_info = {};
	this.option.touchStart && this.isFunction( this.option.touchStart ) && this.option.touchStart.apply( this, arguments );
};
Touch.prototype.t_Move = function(e){
	var _ct = e.changedTouches[0];
	if( this.m_Ani_id ) return;
	this.m_Ani_id = _requestAni( function(){
		this.tm_info.length > 1 && ( this.tm_info.shift() );
		var _m_info = {};
		_m_info.x = _ct.clientX;
		_m_info.y = _ct.clientY;
		_m_info.t = new Date().getTime();
		this.tm_info.push( _m_info );
		if( this.tm_info.length > 1 ){
			this.isTM_T = this.tm_info[1].y < this.tm_info[0].y ? true : false;
			this.isTM_B = this.tm_info[1].y > this.tm_info[0].y ? true : false;
			this.isTM_L = this.tm_info[1].x < this.tm_info[0].x ? true : false;
			this.isTM_R = this.tm_info[1].x > this.tm_info[0].x ? true : false;
		};
		this.option.touchMove && this.isFunction( this.option.touchMove ) && this.option.touchMove.apply( this, arguments );
		this.cancelAni();
	}.bind(this) );
};
Touch.prototype.t_End = function(e){
	var _ct = e.changedTouches[0];
	this.te_info.x = _ct.clientX;
	this.te_info.y = _ct.clientY;
	this.te_info.t = new Date().getTime();
	this.isTE_T = this.te_info.y < this.ts_info.y ? true : false;
	this.isTE_B = this.te_info.y > this.ts_info.y ? true : false;
	this.isTE_L = this.te_info.x < this.ts_info.x ? true : false;
	this.isTE_R = this.te_info.x > this.ts_info.x ? true : false;
	this.option.touchEnd && this.isFunction( this.option.touchEnd ) && this.option.touchEnd.apply( this, arguments );

};
Touch.prototype.contains = function(parent, child){
	if(parent && child && parent.compareDocumentPosition ){
		var ret = parent.compareDocumentPosition( child );
		return ret === 20 || ret === 0 || false;
	};
	return false;
};
Touch.prototype.isFunction = function(o){
	return o && ( typeof(o) === 'function' || _toString.call( o ) === '[object Function]');
};
Touch.prototype.isObject = function(o){
	return o && typeof(o) === 'object' && ( o.constructor === Object || _toString.call( o ) === '[object Object]' );
};
Touch.prototype.cancelAni = function(){
	if( this.m_Ani_id ){
		_cancelAni( this.m_Ani_id );
		this.m_Ani_id = null;
	};
};
Touch.prototype.deleteDirection = function(){
	this.isTM_T = this.isTM_B = this.isTM_L = this.isTM_R = false;
	this.isTE_T = this.isTE_B = this.isTE_L = this.isTE_R = false;
};
/*- end -*/

if( typeof w.Ej !== 'undefined' && w.Ej.extend ){
	Ej.extend('Touch', Touch);
}else{
	w.Touch = Touch;
};

var Tap = (function(){
	var taps = [];
	new Touch({
		isAddTouchMove : 0,
		touchEnd : function(){

			console.log( this, arguments );
		}
	});
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
			isRemove = (isRemove === 1 || isRemove === true ) ? true : false;
		};
		
		var index;
		taps.forEach(function(o, i){
			if(o && o.elem && o.elem === elem) index = i;
		});
		if( isRemove ){
			if( typeof index === 'undefined' ) return;
			if( callback ){
				var callbacks = taps[ index ]['callbacks'],
					f_index = callbacks.indexOf( callback );
				if( f_index != -1 ){
					callbacks.splice( f_index, 1);
				};
			}else{
				taps.splice(index, 1);
			};
		}else{
			if( typeof index === 'undefined' ){
				taps.push( { elem : elem, callbacks : [] } );
				index = taps.length;
			};
			if( callback && taps[ index ][ 'callbacks' ].indexOf( callback ) === -1 ) taps[ index ][ 'callbacks' ].push( callback );
		};
	};
	
	}());
w.Tap = Tap;

}(window));