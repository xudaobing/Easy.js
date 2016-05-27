(function(w, d){
var cdiv = document.createElement('div'), style = cdiv.style, slice = Array.prototype.slice, splice = Array.prototype.splice,
	toString = Object.prototype.toString, userAgent = w.navigator.userAgent,
	deviceType = (function(){
		var ret = /(iphone|ipad|mac|android)+/ig.exec( userAgent );
		return ret ? ret[1] : 'other';
	}()),
	type = function(o){
		var rets = /^\[object\s([a-zA-Z]+)\]$/ig.exec( toString.call(o) );
		return rets && rets[1].toLowerCase();
	},
	isUndefined = function(o){return typeof o === 'undefined';},
	isNull = function(o){return o === null || type(o) === 'null';},
	isString = function(o){return o === '' || typeof o === 'string' || type(o) === 'string';},
	isNumber = function(o){return o === 0 || typeof o === 'number' || type(o) === 'number';},
	isBoolean = function(o){return o === true || o === false || type(o) === 'boolean';},
	isArray = function(o){return Array.isArray(o) || type(o) === 'array';},
	isLikeArray = function(o){return o && ( isArray(o) || (typeof o === 'object' && 'length' in o && o.length >= 0) );},
	isObject = function(o){return o && type(o) === 'object';},
	isFunction = function(o){return o && ( typeof o === 'function' || type(o) === 'function' );},
	isDate = function(o){return o && type(o) === 'date';},
	isRegExp = function(o){return o && type(o) === 'regexp';},
	isElement = function(o){return o && typeof o === 'object' && Element.prototype.isPrototypeOf(o);},
	isWindow = function(o){return o && o === o.window;},
	each = function(o, c){
		if( !o || !isFunction(c) ) return;
		var isArr = isArray(o),i = 0,
			len,k,v,oks;
		!isArr && ( oks = Object.keys(o) );
		len = isArr ? o.length : oks.length
		for(;i < len;i++){
			k = isArr ? i : oks[i]; v = o[k];
			if( c.call(o,k,v) === false ) break;
		};
	},
	toArray = function(o){return isArray(o) ? o : ( isLikeArray(o) ? slice.call(o) : [] );},
	toDomStyle = function(cssStyle){return isString(cssStyle) && cssStyle.replace(/\-[a-z]/g,function(m) { return m.charAt(1).toUpperCase(); });},
	toCssStyle = function(domStyle){return isString(domStyle) && domStyle.replace(/[A-Z]/g, function(m) { return '-'+m.toLowerCase(); });},
	testCss = function(s){
		if(!isString(s) || !s.length)return false;
		s = toDomStyle(s);
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
		isClassList : 'classList' in cdiv,
		isAddEventListener : 'addEventListener' in d,
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
	var matches = ['webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector','matchesSelector','matches'];
	each(matches, function(k, v){
		if(v in Element.prototype){
			support.matches = v;
			return false;
		}
	});
}());
function Ej(selector, context){
	if(!selector || !isString(selector) || !selector.length) return null;
	var self = arguments.callee;
	if( /^#[\w-]+$/.exec( selector ) ) return self.qs(selector, context);
	var rets = self.qsa(selector, context);
	return rets.length ? ( rets.length === 1 ? rets[0] : rets ) : null;
};
Ej.extend = function(){
	var args = arguments,len = args.length,_this = this;
	if(!len) return;
	if(len === 1 && isObject( args[0] ) ){
		each(args[0], function(k, v){
			_this[k] = v;
		});
	};
	if(len === 2 && isString( args[0] ) && args[0].length ){
		if(typeof this[ args[0] ] === 'undefined') this[ args[0] ] = isObject( args[1] ) ? {} : null;
		if( !isObject( args[1] ) ){
			this[ args[0] ] = args[1];
		}else{
			each(args[1], function(k, v){
				_this[ args[0] ][k] = v;
			});
		}
	};
};
Ej.extend(support);
Ej.extend({
	toString : toString,
	userAgent: userAgent,
	deviceType : deviceType,
	isWeiXin : !!userAgent.match(/micromessenger/i),
	type : type,
	each : each,
	isUndefined : isUndefined,
	isNull : isNull,
	isString : isString,
	isNumber : isNumber,
	isBoolean : isBoolean,
	isFunction : isFunction,
	isArray : isArray,
	isLikeArray : isLikeArray,
	isObject : isObject,
	isDate : isDate,
	isRegExp : isRegExp,
	isElement : isElement,
	isWindow : isWindow,
	toDomStyle : toDomStyle,
	toCssStyle : toCssStyle,
	testCss : testCss,
	toArray : toArray,

	qs : function(s, c){return (isElement(c)?c:d).querySelector(s);},
	qsa : function(s, c){return toArray( (isElement(c)?c:d).querySelectorAll(s) );},
	matches : function(elem, selector){
		if(isElement(elem) && isString(selector) && selector.length){
			if( typeof( support.matches ) !== 'undefined' ){
				return elem[ support.matches ]( selector );
			}else{
				var _qsa = this.qsa(selector, elem.parentNode);
				return _qsa.length && _qsa.indexOf( elem ) >= 0;
			};
		};
	},
	siblings : function(elem, selector){
		if( !isElement(elem) ) return null;
		var child = toArray( elem.parentNode.children ), rets = [], _this = this;
		each(child, function(i, v){
			if( isElement(v) && v !== elem ) rets.push(v);
		});
		if( isString(selector) && selector.length ){
			rets = rets.filter(function(d){
				return _this.matches(d, selector);
			});
		};
		return rets;
	},
	createNode : function(s, o){
		if(!arguments.length) return d.createDocumentFragment();
		var _d,_s;
		if( isElement(s) ) _d = s;
		if( isString(s) && s.length ) _d = d.createElement( s );
		if( isElement(_d) && isObject(o) ){
			_s = _d.style;
			each(o, function(k, v){
				if(k in _d){
					_d[k] = v;
				}else if(k in _s){
					_s[k] = v;
				}else{
					_d.setAttribute(k, v);
				}
			});
		};
		return _d || null;
	},
	removeNode : function(d){return isElement(d) && isElement(d.parentNode) && d.parentNode.removeChild(d);},
	contains : function(parent, child, containSelf){
		if(!isElement(parent) || (containSelf === 0 || containSelf === false) && parent === child) return false;
		if(parent.compareDocumentPosition){
			var _res = parent.compareDocumentPosition( child );
			return _res === 20 || _res === 0;
		};
		return parent.contains && parent.contains(child);
	},
	indexOf : function(tag, arr){
		var isElem = isElement(tag), _this = this, ret = -1;
		if(!tag || !isArray(arr) || !arr.length) return ret;
		each(arr, function(i, v){
			if(tag === v || (isElem && _this.contains(v, tag) ) ){
				ret = i;
				return false;
			};
		});
		return ret;
	},
	load : function(){
		var _this = this, args = arguments, len = args.length, self = args.callee;
		if(!len) return;
		if( isArray( args[0] ) ){
			var loaded = [],
			onLoad = function(){
				loaded.push( this );
				if( loaded.length == args[0].length ){
					isFunction( args[1] ) && args[1].call( loaded );
				}else{
					self.call(_this, args[0][ loaded.length ], onLoad);
				}
			};
			self.call(_this, args[0][ loaded.length ], onLoad);
			return;
		};
		if( isString( args[0] ) ){
			var _tagName;
			( !!args[0].match(/.(jpg|png|gif|webp)$/i) || ( isString(args[2]) && args[2] === 'img') ) && ( _tagName = 'img' );
			( !!args[0].match(/.(js)$/i) || ( isString(args[2]) && args[2] === 'script') ) && ( _tagName = 'script' );
			if(!_tagName) return;
			var _Dom = _this.createNode(_tagName, {src : args[0]});
			_Dom.onload = _Dom.onreadystatechange = function(e){
				if( (e && e.type == 'load') || this.readyState == 'loaded' || this.readyState == 'complete' ){
					this.onload = this.onreadystatechange = null;
					isFunction( args[1] ) && args[1].apply(this, arguments);
				}
			}
			_tagName === 'script' && ( d.body.appendChild( _Dom ) );
			return;
		};
		isFunction( args[1] ) && args[1].apply(null, arguments);
	},
	slice : function(){return isLikeArray(arguments[0]) && slice.apply( arguments[0], slice.call(arguments, 1) );},
	splice : function(){return isLikeArray(arguments[0]) && splice.apply( arguments[0], slice.call(arguments, 1) );},
	getStyle : function(elem, styleName){
		if(!isElement(elem) || !isString(styleName) || !styleName.length) return false;
		styleName = toDomStyle(styleName);
		styleName = testCss(styleName);
		if( !styleName) return false;
		if( styleName === "float" ) styleName = "cssFloat";
		var ret;
		if(elem.style[styleName]){
			ret = elem.style[styleName];
		}else if(w.getComputedStyle){
			ret = w.getComputedStyle(elem, null)[styleName];
		}else if(elem.currentStyle){
			ret = elem.currentStyle[styleName];
		}
		return ret;
	},
	setStyle : function(){
		var args = arguments,len = args.length,self = args.callee;
		if(!len) return false;
		if(isArray(args[0]) ){
			each(args[0], function(k, v){
				if(isElement(v) ){
					_s.splice(0,1,v);
					self.apply(null, _s);
				};
			});
			return;
		};
		if(isElement(args[0]) ){
			if(len === 2 && isObject(args[1]) ){
				each(args[1], function(k, v){
					self(args[0], k, v);
				});
				return;
			};
			if(len === 3 && isString(args[1]) ){
				args[0].style[ toDomStyle( args[1] ) ] = args[2];
				return;
			};
		};
		return false;
	},
	isHidden : function(elem){return isElement(elem) && this.getStyle(elem, 'display').toLowerCase() === 'none';},
	hasClass : function(elem,clas){
		if(!isElement(elem) || !isString(clas) || !clas.length) return;
		return elem.className.length ? ( support.isClassList ? elem.classList.contains( clas ) : !!elem.className.match( new RegExp("(\\s|^)"+clas+"(\\s|$)") ) ) : false;
	},
	addClass : function(elem,clas){
		this.hasClass(elem,clas) === false && ( support.isClassList ? elem.classList.add(clas) : ( elem.className += ' '+clas) );
	},
	removeClass : function(elem,clas){
		this.hasClass(elem,clas) === true && ( support.isClassList ? elem.classList.remove(clas) : ( elem.className = elem.className.replace(new RegExp("(\\s|^)"+clas+"(\\s|$)"),' ') ) );
	},
	toggleClass : function(elem,clas){this[ this.hasClass(elem,clas) === true ? 'removeClass':'addClass' ](elem,clas);},
	replaceClass : function(elem,oldClas,newClas){
		this.removeClass(elem,oldClas);
		this.addClass(elem,newClas);
	},
	on : function(elem, eventType, handler, useCapture){/*- 事件 -*/
		return isElement(elem) && elem.addEventListener(eventType, handler, !!useCapture);
	},
	off : function(elem, eventType, handler, useCapture){
		return isElement(elem) && elem.removeEventListener(eventType, handler, !!useCapture);
	},
	one : function(elem, eventType, handler, useCapture){
		var _this = this;
		this.on(elem, eventType, function(){
			var _self = arguments.callee;
			_this.off(elem, eventType, _self, useCapture);
			isFunction(handler) && handler.apply(this, arguments);
		}, useCapture);	
	},
	ready : function(callback, self){
		this.on(d, "DOMContentLoaded", function(){
			isFunction( callback ) && callback.call( self || win);
		}, false);
	},
	requestAni : function( fun ){return support.isrequestAni ? support.isrequestAni.call(w, fun) : w.setTimeout(fun, 1000 / 60);},
	cancelAni : function( id ){return support.iscancelAni ? support.iscancelAni.call(w, id) : w.clearTimeout( id );},
	show : function(elem, time, isScale, callback){
		if( !isElement(elem) || !this.isHidden(elem) ) return;
		var args = arguments, len = args.length;
		time = len > 1 && isString(time) && time.length > 2 ? time : '400ms';
		isScale = len > 2 && ( isScale === 0 || isScale === false ) ? false : true;
		callback = isFunction(args[len-1]) ? args[len-1] : false;
		this.setStyle(elem,'display','block');
		if( support.isTransitionEnd ){
			this.setStyle(elem, {'opacity':0,'transform':'translate3d(0,0,0) scale(1'+(isScale?'.1':'')+')'});
			setTimeout(function(){
				Ej.one(elem, support.isTransitionEnd, function(){
					Ej.setStyle(elem, {'transition-duration':'0ms'});
					callback && callback.call(elem);
				});
				Ej.setStyle(elem, {'transition-duration':time,'opacity':1,'transform':'translate3d(0,0,0) scale(1)'});
			}, 10);
			return;
		};
		callback && callback.call(elem);
	},
	hide : function(elem, time, isScale, callback){
		if( !isElement(elem) || this.isHidden(elem) ) return;
		var args = arguments, len = args.length;
		time = len > 1 && isString(time) && time.length > 2 ? time : '400ms';
		isScale = len > 2 && ( isScale === 0 || isScale === false ) ? false : true;
		callback = isFunction(args[len-1]) ? args[len-1] : false;
		if( support.isTransitionEnd ){
			Ej.one(elem, support.isTransitionEnd, function(){
				Ej.setStyle(elem,{'display':'none','transition-duration':'0ms','opacity':1,'transform':'translate3d(0,0,0) scale(1)'});
				callback && callback.call(elem);
			});
			Ej.setStyle(elem,{'transition-duration':time,'opacity':0,'transform':'translate3d(0,0,0) scale(1'+(!!isScale?'.1':'')+')'});
			return;
		}
		Ej.setStyle(elem,'display','none');
		callback && callback.call(elem);
	}
});

/*- Cookie-*/
Ej.extend('Cookie', {
	set : function(name, value, hour, domain, path){
		var str = name + '=' + value + '; ';
		if(hour || hour === 0){
			var expire = new Date();
			expire.setTime(new Date().getTime() + 3600000 * hour);
			str += 'expires=' + expire.toGMTString() + '; ';
		};
		str += 'path=' + (path||'/') + '; ';
		str += 'domain=' + (domain||w.location.host) + ';';
		d.cookie = str;
	    return true;
	},
	get : function(name){
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
		var m = d.cookie.match(r);
		return (!m?'':m[1]);
	},
	del : function(name){
		this.set(name, '', 0);
	}
});

/*- Ajax -*/
Ej.extend({
	Ajax : function(method, url, data, callback){
		if(!arguments.length) return;
		data = this.toDataString(data);
		method = isString(method) && 'GET' === method.toUpperCase() ? 'GET' : 'POST';
		if(method === 'GET' && data && data.length) url += ( url.indexOf('?') != -1 ? '&' : '?' ) + data;
		var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				this.onreadystatechange = null;
				if( isFunction(callback) ){
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
	toDataString : function(){
		var args = arguments, len = args.length, self = args.callee;
		if( len == 1 && isObject(args[0]) ){
			var rets = [];
			each(args[0], function(k, v){
				rets.push( self(k, v) );
			});
			return rets.join('&');
		};
		if( len == 2 && isString(args[0]) ){
			var _k = args[0],
				_v = args[1];
			if( isNumber(_v) || isString(_v) ) return encodeURIComponent( _k ) + '=' + encodeURIComponent( _v );
			if( isNull(_v) || isUndefined(_v) ) return encodeURIComponent( _k ) + '=';
			if( isBoolean(_v) ) return encodeURIComponent( _k ) + '=' + ( _v ? 'true' : 'false');
			if( isFunction(_v) )  return encodeURIComponent( _k ) + '=undefined';
			if( isArray(_v) || isObject(_v) ){
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
		this.load(url, function(){
			this.parentNode.removeChild(this);
			isFunction(callBack) && callBack.apply(this, arguments);
		},'script');
	}
});

w.Easy_js = w.Ej = Ej;
})(window, document);