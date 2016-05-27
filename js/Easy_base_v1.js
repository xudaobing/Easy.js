(function(win){
var rootEasy, _doc = win.document, _style = _doc.documentElement.style,
	_slice = Array.prototype.slice, _splice = Array.prototype.splice, _toString = Object.prototype.toString,
	_userAgent = navigator.userAgent.toLowerCase(),
	deviceType = (function(){
		var ret = /(iphone|ipad|mac|android)+/g.exec(_userAgent);
		return ret ? ret[1] : 'other';
	}()),
	type = function(o){
		var rets = /^\[object\s([a-zA-Z]+)\]$/ig.exec( _toString.call(o) );
		if(rets) return rets[1].toLowerCase();
	},
	isUndefined = function(o){ return typeof o === 'undefined'; },
	isNull = function(o){ return o === null || type(o) === 'null'; },
	isString = function(o){
		return (o || o === '') && ( typeof o === 'string' || o.constructor === String || type(o) === 'string' );
	},
	isNumber = function(o){
		return (o || o === 0) && ( typeof o === 'number' || o.constructor === Number || type(o) === 'number' );
	},
	isBoolean = function(o){
		return (o || o === false) && ( typeof o === 'boolean' || o.constructor === Boolean || type(o) === 'boolean' );
	},
	isArray = function(o){
		return o && ( Array.isArray(o) || type(o) === 'array' );
	},
	isLikeArray = function(o){
		return o && typeof o === 'object' && ( isArray(o) || ('length' in o && o.length >= 0) ) || false;
	},
	isObject = function(o){
		return o && ( o.constructor === Object || type(o) === 'object' );
	},
	isFunction = function(o){
		return o && ( typeof o === 'function' || o.constructor === Function || type(o) === 'function' );
	},
	isDate = function(o){ return o && ( o.constructor === Date || type(o) === 'date' ); },
	isRegExp = function(o){ return o && ( o.constructor === RegExp || type(o) === 'regexp' ); },
	isElement = function(o){
		return o && ( typeof o === 'object' && 'nodeName' in o && 'nodeType' in o && o.nodeType === 1 && o.ownerDocument === _doc );
	},
	isWindow = function(o){ return o != null && o != undefined && o === o.window; },
	toArray = function(o){
		if( isArray(o) ) return o;
		var rets = [];
		if( isLikeArray(o) ){
			var i = 0,len = o.length;
			while(i < len){rets.push( o[i] );i++;};
		};
		return rets;
	},
	each = function(o, callback){
		if( !o || !isFunction(callback) ) return;
		var i = 0,len,k,v,isArr = isArray(o);
		if(isArr){
			len = o.length;
		}else{
			var _keys = Object.keys(o);
			len = _keys.length;
		};
		if(len){
			for(;i < len;i++){
				k = isArr ? i : _keys[i];
				v = o[k];
				if(callback.call(o,k,v) === false) break;
			};
		};
	},

	toDomStyle = function(cssStyle){
		if(!isString(cssStyle) || !cssStyle.length) return '';
		return cssStyle.replace(/\-[a-z]/g,function(m) { return m.charAt(1).toUpperCase(); });
	},
	toCssStyle = function(domStyle){
		if(!isString(domStyle) || !domStyle.length) return '';
		return domStyle.replace(/[A-Z]/g, function(m) { return '-'+m.toLowerCase(); });
	},
	testCss = function(styleName){
		styleName = toDomStyle(styleName);
		if(styleName in _style) return styleName;
		var vendors = ['O', 'ms' ,'Moz' ,'webkit'],
			ret = false;
		styleName = styleName.charAt(0).toUpperCase() + styleName.substr(1),	
		each(vendors, function(k, v){
			var vendorProp = v + styleName;
			if(vendorProp in _style){
				ret = vendorProp;
				return false;
			};
		});
		return ret;
	},
	support = {
		isClassList : 'classList' in _doc.documentElement,
		isAddEventListener : 'addEventListener' in _doc,
		isTransform : testCss('transform'),
		isPerspective : testCss('perspective'),
		isTransition : testCss('transition'),
		isAnimation : testCss('animation'),
		isrequestAni : win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || false,
		iscancelAni : win.cancelAnimationFrame || win.webkitCancelAnimationFrame ||  win.mozCancelAnimationFrame || false
	};

(function(){
	support.isTransitionEnd = support.isTransition ? ( support.isTransition === 'transition' ? 'transitionend' : support.isTransition+'End') : false;
	support.isAnimationEnd = support.isAnimation ? ( support.isAnimation === 'animation' ? 'animationend' : support.isAnimation+'End') : false;
	var matches = ['webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector','matchesSelector','matches'],
		matches_len = matches.length;
	while(matches_len--){
		if( matches[ matches_len ] in Element.prototype ){
			support.matches = matches[ matches_len ];
			matches_len = 0;
		};
	};
}());


function Ej(selector, context){return new Ej.fn.init( selector, context );};
Ej.fn = {
	constructor : Ej,
	selector : '',
	length : 0,
	each : function(callback){
		each(this, callback);
	}
};
Ej.extend = Ej.fn.extend = function(){
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
Ej.extend('support', support);
Ej.extend({
	isWeiXin : !!_userAgent.match(/micromessenger/),
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

	qs : function(s, c){ return (isElement(c)?c:_doc).querySelector(s); },
	qsa : function(s, c){ return toArray( (isElement(c)?c:_doc).querySelectorAll(s) ); },
	matches : function(elem, selector){
		if(!isElement(elem) || !isString(selector) || !selector.length ) return false;
		if( typeof( support.matches ) !== 'undefined' ){
			return elem[ support.matches ]( selector );
		}else{
			return this.qsa(selector, elem.parentNode).indexOf( elem ) >= 0;
		};
		return false;
	},
	siblings : function(elem, selector){
		var rets = [], childs, _this = this;
		if( !isElement(elem) ) return rets;
		var childs = toArray( elem.parentNode.children );
		each(childs, function(i, v){
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
		if(!arguments.length) return _doc.createDocumentFragment();
		var _d,_s;
		if( isElement(s) ) _d = s;
		if( isString(s) && s.length ) _d = _doc.createElement( s );
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
	removeNode : function(d){
		if(!d || !isElement(d) || !isElement(d.parentNode)) return false;
		return d.parentNode.removeChild(d);
	},
	contains : function(parent, child, containSelf){
		if(!isElement(parent) || !isElement(child) )return false;
		if( (containSelf === 0 || containSelf === false) && parent === child) return false;
		if(parent.compareDocumentPosition){
			var _res = parent.compareDocumentPosition( child );
			return _res === 20 || _res === 0 || false;
		};
		if(parent.contains) return parent.contains(child);
		return false;
	},
	index : function(target, array){
		var isElem = isElement(target), ret = -1;
		if(!target || !isLikeArray(array) || !array.length) return ret;
		each(array, function(i, v){
			if(target === v || (isElem && this.contains(v, target) ) ){
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
			_tagName === 'script' && ( _doc.body.appendChild( _Dom ) );
			return;
		};
		isFunction( args[1] ) && args[1].apply(null, arguments);
	},
	slice : function(){
		return !arguments.length||!isLikeArray(arguments[0]) ? [] : _slice.apply( toArray(arguments[0]), toArray( arguments ).slice(1) );
	},
	splice : function(){
		return !arguments.length||!isLikeArray(arguments[0]) ? [] : _splice.apply( toArray(arguments[0]), toArray( arguments ).slice(1) );
	},
	pushArray : function(r,a){
		var r_len = r.length, a_len = a.length, i = 0;
		if(!a_len) return r;
		for(; i < a_len; i++){
			r[r_len++] = a[i]
		}
		r.length = r_len;
		return r;
	},

	getStyle : function(elem, styleName){
		if( isLikeArray(elem) ) elem = elem[0];
		if(!isElement(elem) || type(styleName) !== 'string' || !styleName.length) return false;
		styleName = toDomStyle(styleName);
		styleName = testCss(styleName);
		if( !styleName) return false;
		if( styleName === "float" ) styleName = "cssFloat";
		var ret;
		if(elem.style[styleName]){
			ret = elem.style[styleName];
		}else if(win.getComputedStyle){
			ret = win.getComputedStyle(elem, null)[styleName];
		}else if(elem.currentStyle){
			ret = elem.currentStyle[styleName];
		}
		return typeof ret !== undefined ? ret.toLowerCase() : false;
	},
	setStyle : function(){
		var args = arguments,len = args.length,self = arguments.callee;
		if(!len) return false;
		if(isLikeArray(args[0]) ){
			var _s = toArray( args );
			each(args[0], function(k, v){
				if(isElement(v) ){
					_s.splice(0,1,v);
					self.apply(null, _s);
				};
			});
			return;
		};
		if(isElement(args[0]) ){
			if(len === 2 && type(args[1]) === 'object'){
				each(args[1], function(k, v){
					self(args[0], k, v);
				});
				return;
			};
			if(len === 3 && type(args[1]) === 'string'){
				args[0].style[ toDomStyle( args[1] ) ] = args[2];
				return;
			};
		};
		return false;
	},
	isHidden : function(elem){
		return isElement(elem) && this.getStyle(elem, 'display') === 'none';
	},
	hasClass : function(elem,clas){
		if(!isElement(elem) || !isString(clas) || !clas.length) return;
		return elem.className.length ? ( this.support.isClassList ? elem.classList.contains( clas ) : !!elem.className.match( new RegExp("(\\s|^)"+clas+"(\\s|$)") ) ) : false;
	},
	addClass : function(elem,clas){
		this.hasClass(elem,clas) === false && ( this.support.isClassList ? elem.classList.add(clas) : ( elem.className += ' '+clas) );
	},
	removeClass : function(elem,clas){
		this.hasClass(elem,clas) === true && ( this.support.isClassList ? elem.classList.remove(clas) : ( elem.className = elem.className.replace(new RegExp("(\\s|^)"+clas+"(\\s|$)"),' ') ) );
	},
	toggleClass : function(elem,clas){
		this[ !this.hasClass(elem,clas)?'addClass':'removeClass' ](elem,clas);
	},
	replaceClass : function(elem,oldClas,newClas){
		this.removeClass(elem,oldClas);
		this.addClass(elem,newClas);
	},
	on : function(elem, eventType, handler, useCapture){/*- 事件 -*/
		if( !isElement(elem) || !isFunction(handler) ) return false;
		support.isAddEventListener ? elem.addEventListener(eventType, handler, !!useCapture) : elem.attachEvent("on" + eventType, handler);
	},
	off : function(elem, eventType, handler, useCapture){
		if( !isElement(elem) || !isFunction(handler) ) return false;
		support.isAddEventListener ? elem.removeEventListener(eventType, handler, !!useCapture) : elem.detachEvent("on" + eventType, handler);
	},
	one : function(elem, eventType, handler, useCapture){
		var _this = this;
		this.on(elem, eventType, function(){
			var _self = arguments.callee;
			_this.off(elem, eventType, _self, useCapture);
			isFunction(handler) && handler.apply(this, arguments);
		}, useCapture);	
	},
	ready : function(callback, self){//document-readey
		if( support.isAddEventListener ){
			_doc.addEventListener("DOMContentLoaded", function(){
				isFunction( callback ) && callback.call( self || win);
			}, false);
		}else{
			_doc.onreadystatechange = function(){
				if( _doc.readyState == 'complete' ){
					_doc.onreadystatechange = null;
					isFunction( callback ) && callback.call( self || win);
				}
			}
		}
	},
	requestAni : function( fun ){
		return support.isrequestAni ? support.isrequestAni.call(win, fun) : win.setTimeout(fun, 1000 / 60);
	},
	cancelAni : function( id ){
		return support.iscancelAni ? support.iscancelAni.call(win, id) : win.clearTimeout( id );
	},
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

Ej.fn.init = function( selector, context ){
	if(!selector) return this;
	if(isElement(selector) || selector === _doc){
		this[ 0 ] = selector;
		this.selector = selector === _doc ? 'document' : ( selector.id || selector.className || '' );
		this.length = 1;
		return this;
	};
	if(isString(selector) && selector.length){
		if( !context || isElement(context) || context === _doc ){
			var eles = Ej.qsa( selector, context );
			this.selector = selector;
			eles && Ej.pushArray(this, eles);
			return this;
		}else{
			if( context === _doc ) context = rootEasy;
			if( context.constructor !== Ej || isElement(context) ) context = Ej( context );
			return context.find( selector );
		}
	};
	if( isLikeArray(selector) ) return Ej.pushArray(this, selector);
	return this;
};
Ej.fn.init.prototype = Ej.fn;
rootEasy = Ej( _doc );

Ej.fn.extend({
	get : function(num){
		return isNumber(num) ? ( num < 0 ? this[ num + this.length ] : this[ num ] ) : _slice.call(this);
	},
	find : function( selector ){
		var rets = Ej();
		if(!selector || !isString(selector) || !selector.length) return rets;
		this.each(function(i,d){
			var fes;
			if( isElement(d) || d === _doc ){
				fes =  d.qsa( selector );
				rets = Ej.pushArray(rets, fes);
			};
		});
		rets.selector = this.selector.length ? ( this.selector + ' ') : '';
		rets.selector += selector;
		return rets;
	},
	toEmptyObject : function(boolean){
		if(!this.length && !boolean) return this;
		if(!!boolean){
			while(this.length){
				delete this[ --this.length ];
			};
			delete this.length;
			delete this.selector;
		}else{
			this.length = 0;
		}
		return this;
	},
	slice : function(){
		return _slice.apply(this, arguments);
	},
	splice : function(){
		var arr = this.get(), rets;
		rets = _splice.apply(arr, arguments);
		Ej.pushArray(this.toEmptyObject(), arr);
		return rets;
	},
	hasClass : function(clas){
		var _rets = false;
		each(this, function(i,d){
			if(Ej.hasClass(d, clas) === true){ 
				_rets = true;
				return false;
			}
		});
		return _rets;
	},
	addClass : function(clas){
		each(this, function(i,d){
			Ej.addClass(d, clas);
		});
		return this;
	},
	removeClass : function(clas){
		each(this, function(i,d){
			Ej.removeClass(d, clas);
		});
		return this;
	},
	toggleClass : function(clas){
		each(this, function(i,d){
			Ej[ Ej.hasClass(d, clas) === false ? 'addClass' : 'removeClass' ](d, clas);
		});
		return this;
	},
	replaceClass : function(oldClas,newClas){
		each(this, function(i,d){
			Ej.removeClass(d, oldClas);
			Ej.addClass(d, newClas);
		});
		return this;
	},
	on : function(type, handler, useCapture){
		each(this, function(i,d){
			if( isElement(d) ) Ej.on(d, type, handler, useCapture);
		});
		return this;
	},
	off : function(type, handler, useCapture){
		each(this, function(i,d){
			if( isElement(d) ) Ej.off(d, type, handler, useCapture);
		});
		return this;
	},
	one : function(type, handler, useCapture){
		each(this, function(i,d){
			if( isElement(d) ) Ej.one(d, type, handler, useCapture);
		});
		return this;
	},
	css : function(){
		var args = toArray(arguments), len = args.length, _this = this;
		if(!len) return false;
		if(len === 1 && isString(args[0]) && args[0].length ) return Ej.getStyle(this[0], args[0]);
		args.unshift( this );
		Ej.setStyle.apply(null, args );
	},
	show : function(time, isScale, callback){
		each(this, function(i, d){
			Ej.show(d, time, isScale, callback);
		});
		return this;
	},
	hide : function(time, isScale, callback){
		each(this, function(i, d){
			Ej.hide(d, time, isScale, callback);
		});
		return this;
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
		str += 'domain=' + (domain||win.location.host) + ';';
		_doc.cookie = str;
	    return true;
	},
	get : function(name){
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
		var m = _doc.cookie.match(r);
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
		data = this.toStr(data);
		method = isString(method) && 'GET' === method.toUpperCase() ? 'GET' : 'POST';
		if(method === 'GET') url += ( url.indexOf('?') != -1 ? '&' : '?' ) + data;
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
	toStr : function(){
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
		url += ( url.indexOf('?') != -1 ? '&' : '?' ) + this.toStr(data);
		this.load(url, function(){
			this.parentNode.removeChild(this);
			isFunction(callBack) && callBack.apply(this, arguments);
		},'script');
	}
});

if(typeof win.Ej === 'undefined'){
	win.Ej = Ej;
}else{
	win.setEjWinName = function(name){
		name && isString(name) && name.length && ( this[name] = Ej );
	};
};
})(window);