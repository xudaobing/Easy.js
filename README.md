# Easy.js --- 简易JavaScript库

## 数据类型
		Ej.type() => 返回数据类型字符串 undefined null string number array object function date regexp

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
		Ej.qs() => 选择单个元素
		Ej.qsa() => 选择多个元素
		Ej() || Ej().find() => 选择多个元素，Ej对象，继承Ej prototype属性

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
		Ej.getStyle() => 获取单个元素css值，argumets[0]如果是数组，获取数组第一个元素的css值
		Ej.setStyle() => 设置css值；可以是多个元素，多对css+值：Ej.setStyle(elem,styleName,styleValue) || Ej.setStyle([elem01,elem02,...],{styleName:styleValue,..}); 

## 事件
		Ej.on() => 添加事件
		Ej.off() => 移除事件
		Ej.one() => 添加一次性事件

## Ajax
		Ej.Ajax() 
		Ej.get()
		Ej.post()
		Ej.post()
		Ej.getJSONP() => 跨域
		Ej.toStr() => object 转 string 

## Cookie
		Ej.Cookie.set => 设置
		Ej.Cookie.get => 获取
		Ej.Cookie.del => 清除