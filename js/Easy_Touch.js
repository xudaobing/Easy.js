/*
* Easy_Touch.js update 2016-05-27
*/
;(function(w){
var _toString = Object.prototype.toString,
	_requestAni = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.mozRequestAnimationFrame,
	_cancelAni = w.cancelAnimationFrame || w.webkitCancelAnimationFrame ||  w.mozCancelAnimationFrame;
function Touch( option ){
	this.option = option && this.isObject( option ) ? option : {};
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
	( this.option.addTouchStart !== 0 && this.option.addTouchStart !== false ) && w.addEventListener("touchstart", this.ts_Fun, false);
	( this.option.addTouchMove !== 0 && this.option.addTouchMove !== false ) && w.addEventListener("touchmove", this.tm_Fun, false);
	( this.option.addTouchEnd !== 0 && this.option.addTouchEnd !== false ) && w.addEventListener("touchend", this.te_Fun, false);
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
		return ret === 20 || ret === 0;
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

w.Touch = Touch;

}(window));