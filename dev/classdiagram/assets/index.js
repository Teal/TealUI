
function getClasses() {
	
	var classes = {};
	
	var reClassName = /^[A-Z][$\w]*$/;
	
	for(var className in window){
		if(reClassName.test(className)){
			addClass(className, window[className]);
		}
	}
	
	function addClass(className, value){
		
		if(value && typeof value === 'function'){
		
			var classInfo = classes[className] = {
				type: 'class',
				value: value
			};
			
			for(var subClassName in value){
				if(reClassName.test(subClassName)){
					addClass(className + '.' + subClassName, value[subClassName]);
				}
			}
			
			for(var memberName in value.prototype){
				if(value.prototype.hasOwnProperty(memberName)){
					switch(typeof value.prototype[memberName]){
						case 'function':
							classInfo.methods = classInfo.methods || {};
							classInfo.methods[memberName] = {
								value: value.prototype[memberName]
							};
							break;
						default:
							classInfo.fields = classInfo.fields || {};
							classInfo.fields[memberName] = {
								value: value.prototype[memberName]
							};
					}
				}
			}
			
			for(var eventName in value.$event){
				classInfo.events = classInfo.events || {};
				classInfo.events[eventName] = {
					value: value.$event[eventName]
				};
			}
			
		} else if(/^I[A-Z]/.test(className)){
			
			var classInfo = classes[className] = {
				type: 'interface',
				value: value
			};
			
			for(var memberName in value){
				switch(typeof value[memberName]){
					case 'function':
						classInfo.methods = classInfo.methods || {};
						classInfo.methods[memberName] = {
							value: value[memberName]
						};
						break;
					default:
						classInfo.fields = classInfo.fields || {};
						classInfo.fields[memberName] = {
							value: value[memberName]
						};
				}
			}
			
		}
		
	}
	
	for(var clazz in classes){
		
		if(classes[clazz].value.base) {
			classes[clazz].extend = getClassNameByValue(classes[clazz].value.base);
		}
		
	}
	
	function getClassNameByValue(clazz){
		for(var className in classes){
			if(classes[className].value === clazz) {
				return className;
			}
		}
	}
	
	return classes;

}

function applyJPlusClassInfo(classes){
	
	function addEvent(className, eventName){
		var info = classes[className];
		if(info){
			info.events = info.events || {};
			info.events[eventName] = {value: {}};
		}
	}
	
	function addInterface(className, interfaceName){
		var info = classes[className];
		if(info){
			info.implement = info.implement || [];
			info.implement.push(interfaceName);
		}
	}
	
	addEvent('Dialog', 'closing');
	addEvent('Dialog', 'close');
	
	addInterface('ToolTip', 'IToolTip');
	addInterface('BalloonTip', 'IToolTip');
	
	addInterface('Picker', 'IDropDownOwner');
	addInterface('Picker', 'IInput');
	addInterface('CheckBox', 'IInput');
	addInterface('RadioButton', 'IInput');
	addInterface('TextBox', 'IInput');
	addInterface('TreeNode', 'ICollapsable');
	addInterface('MenuButton', 'IDropDownOwner');
}

// 参数

var simpleClassColumn = 9;
var objectWidth = 150;
var objectHeight = 57;
var objectMarginRight = 30;
var objectMarginBottom = 90;
var implementHeight = 34;
var implementOffset = 20;
var padding = 40;

var members = {
    'field': '字段',
    'method': '方法',
    'event': '事件'
};

// 绘图

// 分析类的列表并返回类树。
function getClasssDom(classes) {

    var r = [];

    // 统计每个类的直接子类

    for (var className in classes) {

        var clazz = classes[className];

        clazz.name = className;

        // 如果存在继承，则放到对应父类的 children 属性。
        if (clazz.extend && classes[clazz.extend]) {

            var parentClass = classes[clazz.extend];

            // 第一次添加时，初始化 children 属性。
            if (!parentClass.children) {
                parentClass.children = [];
            }

            parentClass.children.push(clazz);

        } else {

            // 否则，它被添加到全局数组里。
            r.push(clazz);

        }

    }

    // 统计每个类的全部子类个数

    getCount(r, 0, 0);

    function getCount(children, col, row) {

        var rowCount = 0;
        var colCount = 0;

        for (var i = 0; i < children.length; i++) {

            children[i].row = row;
            children[i].col = col + colCount;

            if (children[i].children) {
                var t = getCount(children[i].children, col + colCount, row + 1);
                colCount += t[1];

                children[i].rowCount = t[0];
                children[i].colCount = t[1];
            } else {
                children[i].colCount = children[i].rowCount = 1;
                colCount++;
            }

            if (rowCount < children[i].rowCount) {
                rowCount = children[i].rowCount;
            }

        }

        return [rowCount + 1, colCount];
    }

    // 根据体系大小排序

    r.sort(function (x, y) {
        return x.colCount === y.colCount ? x.rowCount < y.rowCount : x.colCount < y.colCount;
    });
    
    rr = r;
    
    function moveBy(classDom, x, y){
    	
    	classDom.col += x;
    	classDom.row += y;
    	
    	if(classDom.children) {
	    	for (var i = 0; i < classDom.children.length; i++) {
				moveBy(classDom.children[i], x, y);
	        }
       }
    	
    }
    
    if(r.length) {
	     	
	    var maxCol = r[0].colCount, currentRow = 0, i = 0, currentCol = 0;
	
	    for (; i < r.length; i++) {
	    	
	    	if(r[i].colCount === 1 && r[i].rowCount === 1){
	    		break;
	    	}
	    	
			moveBy(r[i], -r[i].col, currentRow);
			
			currentRow += r[i].rowCount;
	    }
	
	    for (; i < r.length; i++) {
	    	
			moveBy(r[i], -r[i].col + currentCol, currentRow);
			
			currentCol++;
			
			if(currentCol >= maxCol) {
				currentCol = 0;
				currentRow++;
			}
			
	    }
	    
    }

    return r;

    /*

    [
        name: 'Class1',
        type: '类',
        count: 5,
        children: [{
            name: 'Class1',
            type: '类',
        }]
    */
}

function paintClassDom(classes) {

    var classDom = window.h = getClasssDom(classes);

    // 每个类的宽度。
    var html = '';

    for (var i = 0; i < classDom.length; i++) {
        drawSignleObject(classDom[i]);
    }
    
    var maxWidth = classDom[classDom.length - 1].x + objectWidth + padding;
    var maxHeight = classDom[classDom.length - 1].y + objectHeight + padding;
    
    html += '<div style="left:' + maxWidth　+ 'px;top:' + maxHeight　+ 'px;">&nbsp;</div>'

	document.getElementById('body').style.width = maxWidth + 'px';
	document.getElementById('body').style.height = maxHeight + 'px';
    document.getElementById('body').innerHTML = html;

    // 绘制单一的对象。
    function drawSignleObject(clazz) {

        var x = padding + clazz.col * (objectWidth + objectMarginRight);
        var y = padding + clazz.row * (objectHeight + objectMarginBottom);

        var width = objectWidth * clazz.colCount + (clazz.colCount - 1) * objectMarginRight;

        clazz.x =x + (width - objectWidth) / 2;
        clazz.y = y;
        clazz.width = width;

        html += drawObject(clazz);

        if (clazz.implement) {
            html += drawVerticalCircle(clazz.x + objectWidth / 2 + implementOffset, clazz.y - implementHeight, implementHeight);
            html += drawLink(clazz.implement.join(','), clazz.x + objectWidth / 2 + implementOffset + 18, clazz.y - implementHeight - 4);
        }

        // 如果有子对象。画一个继承的箭头。
        if (clazz.children) {

            for (var i = 0; i < clazz.children.length; i++) {
                drawSignleObject(clazz.children[i]);
            }

            html += drawVerticalArrow(x + width / 2, y + objectHeight, objectMarginBottom / 2);

            y = y + objectHeight + objectMarginBottom / 2;

            html += drawHorizonalLine(clazz.children[0].x + objectWidth / 2, y, clazz.children[clazz.children.length - 1].x - clazz.children[0].x);

            for (var i = 0; i < clazz.children.length; i++) {

                html += drawVerticalLine(clazz.children[i].x + objectWidth / 2, y, objectMarginBottom / 2);

            }
        }

    }

}

// 绘图底层

function drawObject(clazz) {
    var html = '';

    var extend = clazz.extend || 'Object';
    html += '<aside class="object ' + (clazz.type || 'class') +' collapsed" style="left:' + clazz.x + 'px;top:' + clazz.y + 'px"><header><div class="collapse"></div><h4 title="' + clazz.name + '">' +   clazz.name + '</h4><div class="info"><span class="rightarrow"></span><a href="#' + extend + '">' + extend + '</a></div>';

    html += '</header><dl>';

    for (var memberType in members) {

        var t = clazz[memberType + 's'];

        if (t) {
            html += '<dt>' + members[memberType] + '</dt>';

            for (var field in clazz[memberType + 's']) {
                html += '<dd><a href="#' + clazz.name + '" title="' + field + '" class="member-' + (t[field].attribute || 'public') + '" data-class="' + clazz.name + '" data-memberType="' + memberType + 's" data-field="' + field + '"><span class="icon-member icon-' + (t[field].isStatic ? 'static' : 'none') + '"></span><span class="icon-member icon-' + memberType + '"></span>' + field + '</a></dd>';
            }
        }
    }

    html += '</dl></aside>';

    return html;
}

function drawHorizonalLine(x, y, width) {
    return '<div class="line-horizonal" style="top:' + y + 'px;left:' + x + 'px;width:' + width + 'px"></div>';
}

function drawVerticalLine(x, y, height) {
    return '<div class="line-vertical" style="left:' + x + 'px;top:' + y + 'px;height:' + height + 'px"></div>';
}

function drawVerticalArrow(x, y, height) {

    return '<div class="arrow-top" style="left:' + (x - 5) + 'px;top:' + y + 'px;">△</div>' + drawVerticalLine(x, y + 14, height - 14);
}

function drawLink(text, x, y) {

    return '<a class="x-linkbutton" style="left:' + (x - 20) + 'px;top:' + ( y - 2) + 'px;" href="#' + text + '">' + text + '</a>';
}

function drawVerticalCircle(x, y, height) {

    return '<div class="arrow-circle" style="left:' + (x - 5) + 'px;top:' + (y - 2) + 'px;">◦</div>' + drawVerticalLine(x, y + 12, height - 12);
}

function testDraw(func, args0, args1, args2) {
    var func = arguments[0];
    document.getElementById('body').innerHTML = func.call(this, args0, args1, args2);
}

var zIndex = 1;

function initUI(){
	
	// 获取类图。
	var classes = getClasses();
	
	applyJPlusClassInfo(classes);
	
	// 生成全部类图。
    paintClassDom(classes);
    
    // 类图的交互。
    
    var body = Dom.get('body');
    var main = Dom.get('main');
    Dom.on(body, 'click', '.collapse', function () {
        Dom.toggleClass(Dom.parent(Dom.parent(this)), 'collapsed');
    });
    
    Dom.on(body, 'click', '.object', function () {
        Dom.setStyle(this, 'zIndex', zIndex++);
    });


    var MyDraggable = Draggable.extend({

        onDragStart: function (e) {
            var me = this;
            this.offset = Dom.getScroll(main);
        },

        onDrag: function (e) {

            var me = this;

            Dom.setScroll(main, me.offset.x - me.to.x + me.from.x, me.offset.y - me.to.y + me.from.y);

        }

    });


    new MyDraggable({elem: body});
    
    Dom.popup(body, {
    	event: 'click dd a',
    	
    	elem: Dom.append(main, '<aside class="source">\
            <span class="arrow"><span class="arrow-fore">◆</span></span>\
            <pre class="sh">AAAA</pre>\
        </aside>'),
    	
    	show: function(dom){
    		var classInfo = Dom.getAttr(dom, 'data-class');
    		var memeberType = Dom.getAttr(dom, 'data-memberType');
    		var fieldInfo = Dom.getAttr(dom, 'data-field');
    		
    		var value = classes[classInfo][memeberType][fieldInfo].value;
    		
    		Dom.setText(Dom.find('pre', this.elem), String(value));
			Demo.SyntaxHighligher.one(Dom.find('pre', this.elem), memeberType == 'methods' ? 'js' : '');
			
    		Dom.pin(this.elem, dom, 'r', 0, -4, false);
    		
    	}
    });
    
    Dom.hashchange(function(){
    	
    	var hash = location.getHash();
    	
    	
    	var info =classes[hash];
    	
    	if(info){
    		
    		Dom.animate(main, {scrollLeft: info.x - Dom.getWidth(main) / 2, scrollTop: info.y - Dom.getHeight(main) / 2 + objectHeight});
    		
    	}
    	
    });
    
    var d1 = new SearchTextBox('#d1');
        
        　　d1.on('search', function(text) {
        	location.hash = text;
        　　});
        
    var suggest = new Suggest(d1.input());
    
    suggest.selectItem = function(item){
    	suggest.setText(Dom.getText(item));
    	location.hash = Dom.getText(item);
    	return this.hideDropDown();
    };
    
    suggest.getSuggestItems = function(text){
    	var r = [];
    	for(var className in classes){
    		if(className.indexOf(text) >= 0){
    			r.push(className);
    		}
    	}
    	
    	return r;
    };
    

}

Dom.ready(initUI);