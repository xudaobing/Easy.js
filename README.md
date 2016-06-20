# Easy_base_v3.js --- 简易JavaScript库
## 2016-06-20

## 数据类型
		Undefined Null String Number Array Object Function Date Regexp
		Ej.type() => 返回数据类型字符串
		Ej.is(o,string);//判断数据 o === string,返回布尔值 

## 针对的数据判断 - 返回布尔值 false || true
		Ej.isUndefined
		Ej.isNull
		Ej.isString
		Ej.isNumber
		Ej.isBoolean
		Ej.isArray
		Ej.isLikeArray => 判断类数组
		Ej.isObject
		Ej.isFunction
		Ej.isDate
		Ej.isRegExp
		Ej.isElement => 判断是或是Element(个人感觉欠缺)
		Ej.isWindow

## 选择器
		使用：querySelector || querySelectorAll
		Ej(selector, parent);
		Ej.qs() => 选择单个元素
		Ej.qsa() => 选择多个元素

## DOM
		Ej.create(string, option); // 创建DOM，option => 添加dom属性、css属性 或 data-*
		Ej.remove(dom); //移动dom
		Ej.contains(parent, child, containSelf); //判断元素 parent 是或包含 child
		Ej.index(Ej.index( dom, doms ); //判断dom 是或在 doms元素中，或在元素 子元素中
		Ej.isHidden( dom ); //判断dom是或隐藏
		Ej.siblings(dom, selector); // 获取dom的同级元素

## classLists
		Ej.hasClass()
		Ej.addClass()
		Ej.removeClass()
		Ej.toggleClass()
		Ej.replaceClass()

## css
		Ej.toDomStyle() => 'transform-style' -> 'transformStyle'
		Ej.toCssStyle() => 'transformStyle' -> 'transform-style'
		Ej.testCss() => 检测css3属性支持 
		Ej.css();
		Ej.css(dom, 'cssName');//返回css属性值
		Ej.css(dom, 'cssName', 'cssValue') || Ej.css(dom, {'cssName':'cssValue',...});//设置css属性值

## 事件
		Ej.on() => 添加事件
		Ej.off() => 移除事件
		Ej.one() => 添加一次性事件

## Ajax
		Ej.Ajax() 
		Ej.get()
		Ej.post()
		Ej.load();//可加载img、script
		Ej.getJSONP() => 跨域
		Ej.toStr() => 参数object 转 string {a:1,b;2} => a=1&b=2

## Cookie
		Ej.Cookie.set => 设置
		Ej.Cookie.get => 获取
		Ej.Cookie.del => 清除

## 效果
		Ej.show(dom, option); //显示dom
		Ej.hide(dom, option); //隐藏dom
		option => option.time : 时间；option.isScale : 是或缩放；option.callback : 完成回调；

## 其他
		Ej.keys => 兼容 Object.keys;
		Ej.indexOf => 兼容 Array.prototype.indexOf
		Ej.filter => 兼容 Array.prototype.filter

		Ej.each => 遍历 Array、Object；
		Ej.toArray => 类数组 转数组

		CSS3属性：
		Ej.isTransform 
		Ej.isPerspective
		Ej.isTransition
		Ej.isAnimation

		requestAni
		cancelAni



