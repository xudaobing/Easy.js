/*
//Easy_Touch.js 2016-05-11
*/
;(function(win){
var Ej = win.Ej;
function Touch(contains, option){
	if( !Ej.isElement(contains) ) return;
	this.contains = contains;
	
	this.option = Ej.isObject( option ) ? option : {};
	this.transform = {x : 0, y : 0, z : 0};

	this.ts_Fun = this.start.bind( this );
	this.tm_Fun = this.move.bind( this );
	this.te_Fun = this.end.bind( this );
	
	this.init();
	this.addEvent();
};
Touch.prototype.init = function(){
	this.ts_info = {};
	this.tm_info = [];
	this.te_info = {};
	
	this.m_Ani_id = null;

	this.option.x && Ej.isNumber( this.option.x ) && ( this.transform.x = this.option.x );
	this.option.y && Ej.isNumber( this.option.y ) && ( this.transform.y = this.option.y );
	this.option.z && Ej.isNumber( this.option.z ) && ( this.transform.z = this.option.z );

	this.width = this.option.width || this.contains.clientWidth;
	this.height = this.option.height || this.contains.clientHeight;
	
	this.option.init && Ej.isFunction( this.option.init ) && this.option.init.call( this );
};
Touch.prototype.addTouch = function(){
	Ej.on(window, "touchstart", this.ts_Fun);
	Ej.on(window, "touchmove", this.tm_Fun);
    Ej.on(window, "touchend", this.te_Fun);
};
Touch.prototype.t_Start = function(e){
	var _et = e.target, _ct = e.changedTouches[0];

	if( this.isChild( _et ) ){

		if( !!this.option.ts_stopPropagation && e.bubbles) e.stopPropagation();
		if( !!this.option.ts_preventDefault && e.cancelable) e.preventDefault();

		this.ts_info.x = _ct.clientX;
		this.ts_info.y = _ct.clientY;
		this.ts_info.t = new Date().getTime();
		this.tm_info.length = 0;
		this.te_info = {};
		this.tm_info.push( this.ts_info );
		this.option.touchStart && Ej.isFunction( this.option.touchStart ) && this.option.touchStart.apply( this, arguments );
	}
};
Touch.prototype.t_Move = function(e){
	var _this = this, _et = e.target, _ct = e.changedTouches[0];

	if( this.isChild( _et ) ){

		if( !!this.option.tm_stopPropagation && e.bubbles) e.stopPropagation();
		if( !!this.option.tm_preventDefault && e.cancelable) e.preventDefault();

		if( this.m_Ani_id ) return;
	
		this.m_Ani_id = Ej.requestAni( function(){

			_this.tm_info.length > 1 && ( _this.tm_info.shift() );
			var _m_info = {};
			_m_info.x = _ct.clientX;
			_m_info.y = _ct.clientY;
			_m_info.t = new Date().getTime();
			_this.tm_info.push( _m_info );

			_this.isTM_T = _this.tm_info[1].y < _this.tm_info[0].y?true:false;
			_this.isTM_B = _this.tm_info[1].y > _this.tm_info[0].y?true:false;
			_this.isTM_L = _this.tm_info[1].x < _this.tm_info[0].x?true:false;
			_this.isTM_R = _this.tm_info[1].x > _this.tm_info[0].x?true:false;

			_this.transform.x += ( _this.tm_info[1].x - _this.tm_info[0].x );
			_this.transform.y += ( _this.tm_info[1].y - _this.tm_info[0].y );

			_this.option.touchMove && Ej.isFunction( _this.option.touchMove ) && _this.option.touchMove.apply( _this, arguments );
			_this.cancelAni();

		} );
	};
};
Touch.prototype.t_End = function(e){
	var _et = e.target, _ct = e.changedTouches[0];

	if( this.isChild( _et ) ){

		if( !!this.option.te_stopPropagation && e.bubbles) e.stopPropagation();
		if( !!this.option.te_preventDefault && e.cancelable) e.preventDefault();

		this.te_info.x = _ct.clientX;
		this.te_info.y = _ct.clientY;
		this.te_info.t = new Date().getTime();

		this.isTE_T = this.te_info.y < this.ts_info.y?true:false;
		this.isTE_B = this.te_info.y > this.ts_info.y?true:false;
		this.isTE_L = this.te_info.x < this.ts_info.x?true:false;
		this.isTE_R = this.te_info.x > this.ts_info.x?true:false;

		this.option.touchEnd && Ej.isFunction( this.option.touchEnd ) && this.option.touchEnd.apply( this, arguments );
	};
};
Touch.prototype.isChild = function(elem){
	if(!elem || !Ej.isElement(elem) ) return false;
	return Ej.contains(this.contains, elem );
};
Touch.prototype.cancelAni = function(){
	if( this.m_Ani_id ){
		Ej.cancelAni( this.m_Ani_id );
		this.m_Ani_id = null;
	};
};
/*- end -*/


Ej.extend('Touch', Touch);

var Tap = (function(){
	var taps = [];

	return function(elem, callback, isRemove){

	};
	
	}());
window.Tap = Tap;
/*
Ej.extend('Tap', function(o, callback){
	var args = arguments, len = args.length, self = args.callee;
	if(!len || !Ej.isFunction(callback) ) return;

	if( Ej.isLikeArray( o ) ){
		Ej.each(o, function(i, d){
			if( Ej.isElement(d) ) self(d, callback);
		});
		return;
	};
	new Touch(o, {
		touchEnd : function(){
			if( Math.abs(this.te_info.x - this.ts_info.x) < 15 && Math.abs(this.te_info.y - this.ts_info.y) < 15 && Math.abs(this.te_info.t - this.ts_info.t) < 150 ) callback.apply(o, arguments);
		}
	});
});
*/
}(window));