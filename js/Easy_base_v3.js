/*
* 2016-06-15
* IE8+
*/


(function(w, d){
var cdiv = document.createElement('div'), style = cdiv.style,
	slice = Array.prototype.slice, splice = Array.prototype.splice,
	toString = Object.prototype.toString, userAgent = w.navigator.userAgent;

/*- 设备、数据类型 Type模块 -*/
var T = function(o){
		var rets = /^\[object\s([a-zA-Z]+)\]$/ig.exec( toString.call(o) );
		return rets && rets[1];
	};
	T.device = (function(){
		var ret = /(iphone|ipad|mac|android)+/ig.exec( userAgent );
		return ret ? ret[1] : 'other';
	}());
	T.isWeiXin = !!userAgent.match(/micromessenger/i);
	T.isUndefined = function(o){
		return typeof o === 'undefined' || T(o) === 'Undefined';
	};
	T.isNull = function(o){
		return o === null || T(o) === 'Null';
	};
	T.isString = function(o){
		return o === '' || typeof o === 'string' || T(o) === 'String';
	};
	T.isNumber = function(o){
		return o === 0 || typeof o === 'number' || T(o) === 'Number';
	};
	T.isBoolean = function(o){
		return o === true || o === false || T(o) === 'Boolean';
	};
	T.isArray = function(o){
		return o && ( o instanceof Array || T(o) === 'Array');
	};
	T.isLikeArray = function(o){
		return o && ( this.isArray(o) || (typeof o === 'object' && 'length' in o && o.length >= 0) );
	};
	T.isObject = function(o){
		return o && ( o instanceof Object || T(o) === 'Object' );
	};
	T.isFunction = function(o){
		return o && ( o instanceof Function || T(o) === 'Function' );
	};
	T.isDate = function(o){
		return o && (o instanceof Date || T(o) === 'Date');
	};
	T.isRegExp = function(o){
		return o && (o instanceof RegExp || T(o) === 'RegExp');
	};
	T.isElement = function(o){
		return o && typeof o === 'object' && Element.prototype.isPrototypeOf(o) && o.nodeType ===1 && this.isString( o.nodeName );
	};
	T.isWindow = function(o){
		return o && o === o.window;
	};

var	keys = Object.keys || function( o ){
		var rets = [], k;
		if( o ){
			for(k in o) if( Object.prototype.hasOwnProperty.call(o, k) )rets.push( k );
		};
		return rets;
	},
	each = function(o, c){
		if( !o || !T.isFunction(c) ) return;
		var isArr = T.isArray(o), isObj = T.isObject(o), len, oks;
		if( isArr )len = o.length;
		if( isObj ){
			oks = keys(o);
			len = oks.length;
		};
		if( len && len > 0){
			var i = 0, k, v;
			for(; i < len; i++){
				k = isArr ? i : oks[i];
				v = o[k];
				if( c.call(o,k,v) === false ) break;
			};
		};
	},
	toArray = function(o){
		if( T.isLikeArray(o) && o.length){
			try{
				return slice.call(o);
			}catch(e){
				var i = 0,l = o.length,rets = [];
				while(i < l){rets.push(o[i]);i++;}
				return rets;
			}
		};
		return [];
	},
	indexOf = Array.prototype.indexOf || function(value){
		if( T.isArray( this ) ){
			var ret = -1;
			each(this, function(i, v){
				if(v === value) ret = i;
				return false;
			});
			return ret;
		};
		return -1;
	},
	filter = Array.prototype.filter || function(fn){
		var rets = [];
		if( T.isArray(this) ){
			each(this,function(i, v){
				if( fn(v, i) ) rets.push(v);
			});
		};
		return rets;
	},
	toDomStyle = function(s){
		return T.isString(s) && s.replace(/\-[a-z]/g, function(m){return m.charAt(1).toUpperCase();} );
	},
	toCssStyle = function(s){
		return T.isString(s) && s.replace(/[A-Z]/g, function(m){return '-'+m.toLowerCase();} );
	},
	testCss = function(s){
		s = toDomStyle(s);
		if(!s || !T.isString(s) || !s.length)return false;
		if(s in style) return s;
		var vds = ['O', 'ms' ,'Moz' ,'webkit'], ret = false;
		s = s.charAt(0).toUpperCase() + s.substr(1);
		each(vds, function(k, v){
			var vs = v + s;
			if(vs in style){
				ret = vs;
				return false;
			};
		});
		return ret;
	},
	support = {
		isTransform : testCss('transform'),
		isPerspective : testCss('perspective'),
		isTransition : testCss('transition'),
		isAnimation : testCss('animation'),
		isrequestAni : w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.mozRequestAnimationFrame || false,
		iscancelAni : w.cancelAnimationFrame || w.webkitCancelAnimationFrame ||  w.mozCancelAnimationFrame || false
	};
(function(){
	support.isTransitionEnd = support.isTransition ? ( support.isTransition === 'transition' ? 'transitionend' : support.isTransition+'End') : false;
	support.isAnimationEnd = support.isAnimation ? ( support.isAnimation === 'animation' ? 'animationend' : support.isAnimation+'End') : false;
	var matches = ['webkitMatchesSelector','MozMatchesSelector','msMatchesSelector','oMatchesSelector','matchesSelector','matches'];
	each(matches, function(k, v){
		if(v in Element.prototype){
			support.matches = v;
			return false;
		}
	});
}());

function Ej(selector, context){
	if(!T.isString(selector) || !selector.length) return null;
	var self = arguments.callee;
	if( /^#[\w-]+$/.exec( selector ) ) return self.qs(selector, context);
	var rets = self.qsa(selector, context);
	return rets.length ? rets : null;
};
Ej.extend = function(){
	var args = arguments,len = args.length,_this = this;
	if(!len) return;
	if(len === 1 && T.isObject( args[0] ) ){
		each(args[0], function(k, v){
			_this[k] = v;
		});
	};
	if(len === 2 && T.isString( args[0] ) && args[0].length ){
		if(typeof this[ args[0] ] === 'undefined') this[ args[0] ] = T.isObject( args[1] ) ? {} : null;
		if( !T.isObject( args[1] ) ){
			this[ args[0] ] = args[1];
		}else{
			each(args[1], function(k, v){
				_this[ args[0] ][k] = v;
			});
		}
	};
};

/*- ClassList -*/
var classList = {};
if( 'classList' in cdiv ){
	classList.hasClass = function(d, s){
		if( T.isElement(d) && T.isString(s) && s.length ) return d.classList.contains( s );
	};
	classList.addClass = function(d, s){
		if( T.isElement(d) && this.hasClass(d, s) === false ) d.classList.add( s );
	};
	classList.removeClass = function(d, s){
		if( T.isElement(d) && this.hasClass(d, s) === true ) d.classList.remove( s );
	};
}else{
	classList.hasClass = function(d, s){
		if( T.isElement(d) && T.isString(s) && s.length )return !!d.className.match( new RegExp("(\\s|^)"+ s +"(\\s|$)") );
	};
	classList.addClass = function(d, s){
		if( T.isElement(d) && this.hasClass(d, s) === false ) d.className += ' ' + s;
	};
	classList.removeClass = function(d, s){
		if( T.isElement(d) && this.hasClass(d, s) === true ) d.className = d.className.replace(new RegExp("(\\s|^)"+ s +"(\\s|$)"),' ');
	};
};
classList.toggleClass = function(d, s){
	if( T.isElement(d) ) this[ this.hasClass(d, s) === false ? 'addClass' : 'removeClass' ](d, s);
};
classList.replaceClass = function(d, os, ns){
	if( T.isElement(d) ){
		this.hasClass(d, os) === true && this.removeClass(d, os);
		this.hasClass(d, ns) === false && this.addClass(d, ns);
	};
};

/*- 事件 -*/
var event = {},
	isAddEventListener = 'addEventListener' in d,
	addEvent = isAddEventListener ? 'addEventListener' : 'attachEvent',
	removeEvent = isAddEventListener ? 'removeEventListener' : 'detachEvent',
	typePrefix = isAddEventListener ? '' : 'on',
	testAgrs = function(dm, fn){
		return dm && ( dm === d || T.isWindow(dm) || T.isElement(dm) ) && T.isFunction( fn );
	};

event.on = function(dm, type, handler, useCapture){
	return testAgrs(dm, handler) && dm[ addEvent ]( typePrefix + type, handler, !!useCapture);
};
event.off = function(dm, type, handler, useCapture){
	if( testAgrs(dm, handler) ) dm[ removeEvent ]( typePrefix + type, handler, !!useCapture);
};
event.one = function(dm, type, handler, useCapture){
	var _this = this;
	this.on(dm, type, function(){
		_this.off(dm, type, arguments.callee, useCapture);
		T.isFunction(handler) && handler.apply(dm, arguments);
	}, useCapture);
};
if( isAddEventListener ){
	event.ready = function(callback, self){
		this.one(d, "DOMContentLoaded", function(){
			T.isFunction( callback ) && callback.call( self || w);
		}, false);
	};
}else{
	event.ready = function(callback, self){
		d.onreadystatechange = function(){
			if( d.readyState == 'complete' ){
				d.onreadystatechange = null;
				T.isFunction( callback ) && callback.call( self || w);
			}
		}
	};
};

Ej.extend( T );
Ej.extend({
	toString : toString,
	userAgent: userAgent,
	type : T,
	keys : keys,
	each : each,
	indexOf : indexOf,
	filter : filter,
	toDomStyle : toDomStyle,
	toCssStyle : toCssStyle,
	testCss : testCss,
	toArray : toArray
});
Ej.extend( support );
Ej.extend( classList );
Ej.extend( event );
Ej.extend({
	qs : function(s, c){return (T.isElement(c)?c:d).querySelector(s);},
	qsa : function(s, c){return toArray( (T.isElement(c)?c:d).querySelectorAll(s) );},
	matches : function(d, s){
		if(T.isElement(d) && T.isString(s) && s.length){
			if( typeof( support.matches ) !== 'undefined' ){
				return d[ support.matches ]( s );
			}else{
				var _qsa = this.qsa(s, d.parentNode);
				return _qsa.length && indexOf.call(_qsa, d) >= 0;
			};
		};
	},
	siblings : function(d, s){
		if( !T.isElement(d) ) return null;
		var childs = toArray( d.parentNode.children ), rets = [], _this = this;
		each(childs, function(i, v){
			if( T.isElement(v) && v !== d ) rets.push(v);
		});
		if( T.isString(s) && s.length ){
			rets = filter.call(rets, function(d){
				return _this.matches(d, s);
			});
		};
		return rets;
	},
	create : function(s, o){
		if(!arguments.length) return d.createDocumentFragment();
		var _this = this, dm = null;
		if( T.isElement(s) ) dm = s;
		if( T.isString(s) && s.length ) dm = d.createElement( s );
		if( T.isElement(dm) && T.isObject(o) ){
			each(o, function(k, v){
				if(k in dm){
					dm[k] = v;
				}else if(k in style){
					_this.css(dm, k, v);
				}else{
					dm.setAttribute(k, v);
				}
			});
		};
		return dm;
	},
	remove : function(d){
		return T.isElement(d) && T.isElement(d.parentNode) && d.parentNode.removeChild(d);
	},
	contains : function(parent, child, containSelf){
		if(!T.isElement(parent) || !T.isElement(child) ) return false;
		if( (containSelf === 0 || containSelf === false) && parent === child) return false;
		if(parent.compareDocumentPosition){
			var _res = parent.compareDocumentPosition( child );
			return _res === 20 || _res === 0;
		};
		if(parent.contains) return parent.contains(child);
		return false;
	},
	index : function(dm, arr){
		var _this = this, ret = -1;
		if(!T.isElement(dm) || !T.isArray(arr) || !arr.length) return ret;
		each(arr, function(i, v){
			if(dm === v || _this.contains(v, dm) ){
				ret = i;
				return false;
			};
		});
		return ret;
	},
	css : function(){
		var args = arguments, len = args.length, self = args.callee;
		if( !len || !T.isElement(args[0]) ) return;
		if( T.isObject( args[1] ) ){
			each(args[1], function(k, v){
				self(args[0], k ,v);
			});
			return;
		};
		if( T.isString( args[1] ) ){
			var dm = args[0], ds = args[1];
			if( ds === "float" ) ds = "cssFloat";
			ds = toDomStyle(ds);
			ds = testCss(ds);
			if( len === 2 ) return ds && ( w.getComputedStyle ? w.getComputedStyle(dm, null)[ds] : dm.currentStyle[ds] );
			if( len === 3 && ds) dm.style[ds] = args[2];
		};
	},
	isHidden : function(dm){
		return T.isElement(dm) && this.css(dm, 'display').toLowerCase() === 'none';
	},
	requestAni : function( fun ){
		if( T.isFunction(fun) ) return support.isrequestAni ? support.isrequestAni.call(w, fun) : w.setTimeout(fun, 1000 / 60);
	},
	cancelAni : function( id ){
		if(id) return support.iscancelAni ? support.iscancelAni.call(w, id) : w.clearTimeout( id );
	},
	show : function( dm ){ //dm, time, isScale, callback
		if( !T.isElement(dm) || !this.isHidden(dm) ) return;
		var _this = this, args = arguments, len = args.length;
		var time = len > 1 && T.isString( args[1] ) && time.length > 2 ? args[1] : '400ms';
		var isScale = len > 1 && ( args[1] === 0 || args[1] === false || args[2] === 0 || args[2] === false ) ? false : true;
		var callback = len > 1 && T.isFunction( args[len-1] ) ? args[ len-1 ] : false;
		this.css(dm,'display','block');
		if( support.isTransitionEnd ){
			this.css(dm, {'opacity':0,'transform':'translate3d(0,0,0) scale(1'+(isScale?'.1':'')+')'});
			setTimeout(function(){
				_this.one(dm, support.isTransitionEnd, function(){
					_this.css(dm, {'transition-duration':'0ms'});
					callback && callback.call(dm);
				});
				_this.css(dm, {'transition-duration':time,'opacity':1,'transform':'translate3d(0,0,0) scale(1)'});
			}, 10);
			return;
		};
		callback && callback.call(dm);
	},
	hide : function( dm ){//dm, time, isScale, callback
		if( !T.isElement(dm) || this.isHidden(dm) ) return;
		var _this = this, args = arguments, len = args.length;
		var time = len > 1 && T.isString( args[1] ) && time.length > 2 ? args[1] : '400ms';
		var isScale = len > 1 && ( args[1] === 0 || args[1] === false || args[2] === 0 || args[2] === false ) ? false : true;
		var callback = len > 1 && T.isFunction( args[len-1] ) ? args[ len-1 ] : false;
		if( support.isTransitionEnd ){
			_this.one(dm, support.isTransitionEnd, function(){
				_this.css(dm,{'display':'none','transition-duration':'0ms','opacity':1,'transform':'translate3d(0,0,0) scale(1)'});
				callback && callback.call(dm);
			});
			_this.css(dm,{'transition-duration':time,'opacity':0,'transform':'translate3d(0,0,0) scale(1'+(!!isScale?'.1':'')+')'});
			return;
		}
		_this.css(dm,'display','none');
		callback && callback.call(dm);
	}
});

/*- Cookie-*/
Ej.extend('Cookie', {
	set : function(name, value, option){
		if( !T.isString(name) || T.isUndefined(value) ) return false;
		if( T.isArray(value) || T.isObject(value) ) value = JSON.stringify( value );
		var str = name + '=' + value + '; ';
		if(option && (option.hour || option.hour == 0) ){
			var expire = new Date();
			expire.setTime(new Date().getTime() + 3600000 * hour);
			str += 'expires=' + expire.toGMTString() + '; ';
		};
		str += 'path=' + ( (option && option.path) ? option.path : w.location.pathname ) + '; ';
		str += 'domain=' + ( (option && option.host) ? option.host : w.location.host ) + ';';
		d.cookie = str;
	    return true;
	},
	get : function(name){
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
		var m = d.cookie.match(r);
		return (!m?'':m[1]);
	},
	del : function(name){
		this.set(name, '', {'hour' : 0});
	}
});

/*- Ajax -*/
Ej.extend({
	Ajax : function(method, url, data, callback){
		if(!arguments.length) return;
		data = this.toDataString(data);
		method = T.isString(method) && 'GET' === method.toUpperCase() ? 'GET' : 'POST';
		if(method === 'GET' && data && data.length) url += ( url.indexOf('?') != -1 ? '&' : '?' ) + data;
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				this.onreadystatechange = null;
				if( T.isFunction(callback) ){
					var type = this.getResponseHeader("Content-Type");
					if( type === "application/json" ){
						callback( JSON.parse(this.responseText) );
					}else if( type.indexOf("xml") !== -1 && this.responseXML ){
						callback( this.responseXML ); 
					}else{
						callback( this.responseText ); 
					};
				};
			};
		};
		xhr.send( method === 'GET' ? null : data );
		return xhr;
	},
	get : function(url, data, callback){
		return this.Ajax('GET', url, data, callback);
	},
	post : function(url, data, callback){
		return this.Ajax('POST', url, data, callback);
	},
	load : function(){ //url, tag, callback
		var args = arguments, len = args.length;
		if( !len || !T.isString( args[0] ) ) return;
		var tag;
		len > 0 && T.isString( args[1] ) && args[1].length && ( tag = args[1] );
		if( typeof tag === 'undefined' ){
			!!args[0].match(/.(jpg|png|gif|webp)$/i) && ( tag = 'img' );
			!!args[0].match(/.(js)$/i) && ( tag = 'script' );
		};
		if( tag ){
			var dm = this.create(tag, {'src' : args[0]});
			dm.onload = dm.onreadystatechange = function(e){
				if( (e && e.type == 'load') || this.readyState == 'loaded' || this.readyState == 'complete' ){
					tag = this.onload = this.onreadystatechange = null;
					T.isFunction( args[ len-1 ] ) && args[ len-1 ].apply(this, arguments);
				}
			}
			tag.toLowerCase() === 'script' && ( d.body.appendChild( dm ) );
		};
	},
	toDataString : function(){
		var args = arguments, len = args.length, self = args.callee;
		if( len == 1 && T.isObject(args[0]) ){
			var rets = [];
			each(args[0], function(k, v){
				rets.push( self(k, v) );
			});
			return rets.join('&');
		};
		if( len == 2 && T.isString(args[0]) ){
			var _k = args[0],
				_v = args[1];
			if( T.isNumber(_v) || T.isString(_v) ) return encodeURIComponent( _k ) + '=' + encodeURIComponent( _v );
			if( T.isNull(_v) || T.isUndefined(_v) ) return encodeURIComponent( _k ) + '=';
			if( T.isBoolean(_v) ) return encodeURIComponent( _k ) + '=' + ( _v ? 'true' : 'false');
			if( T.isFunction(_v) )  return encodeURIComponent( _k ) + '=undefined';
			if( T.isArray(_v) || T.isObject(_v) ){
				var _v_Arr = [];
				each(_v, function(k, v){
					_v_Arr.push( self(_k+'['+k+']', v) );
				});
				return _v_Arr.join('&');
			};
		};
		return '';
	},
	getJSONP : function(url, data, callBack){
		if(!arguments.length) return;
		url += ( url.indexOf('?') != -1 ? '&' : '?' ) + this.toDataString(data);
		this.load(url, 'script', function(){
			this.parentNode.removeChild(this);
			T.isFunction(callBack) && callBack(data);
		},'script');
	}
});

w.Easy_js = w.Ej = Ej;
})(window, document);

