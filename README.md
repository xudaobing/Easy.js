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