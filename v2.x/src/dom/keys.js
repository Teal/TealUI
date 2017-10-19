//===========================================
//  键盘键值   keys.js  A
//===========================================




/*
 * 
 * 
 * 
 *  字母和数字键的键码值(keyCode)
按键 	键码 	按键 	键码 	按键 	键码 	按键 	键码
A 	65 	J 	74 	S 	83 	1 	49
B 	66 	K 	75 	T 	84 	2 	50
C 	67 	L 	76 	U 	85 	3 	51
D 	68 	M 	77 	V 	86 	4 	52
E 	69 	N 	78 	W 	87 	5 	53
F 	70 	O 	79 	X 	88 	6 	54
G 	71 	P 	80 	Y 	89 	7 	55
H 	72 	Q 	81 	Z 	90 	8 	56
I 	73 	R 	82 	0 	48 	9 	57

　　 

数字键盘上的键的键码值(keyCode) 	功能键键码值(keyCode)
按键 	键码 	按键 	键码 	按键 	键码 	按键 	键码
0 	96 	8 	104 	F1 	112 	F7 	118
1 	97 	9 	105 	F2 	113 	F8 	119
2 	98 	* 	106 	F3 	114 	F9 	120
3 	99 	+ 	107 	F4 	115 	F10 	121
4 	100 	Enter 	108 	F5 	116 	F11 	122
5 	101 	- 	109 	F6 	117 	F12 	123
6 	102 	. 	110 	  	  	  	 
7 	103 	/ 	111 	  	  	  	 

　　 

控制键键码值(keyCode)
按键 	键码 	按键 	键码 	按键 	键码 	按键 	键码
BackSpace 	8 	Esc 	27 	Right Arrow 	39 	-_ 	189
Tab 	9 	Spacebar 	32 	Dw Arrow 	40 	.> 	190
Clear 	12 	Page Up 	33 	Insert 	45 	/? 	191
Enter 	13 	Page Down 	34 	Delete 	46 	`~ 	192
Shift 	16 	End 	35 	Num Lock 	144 	[{ 	219
Control 	17 	Home 	36 	;: 	186 	\| 	220
Alt 	18 	Left Arrow 	37 	=+ 	187 	]} 	221
Cape Lock 	20 	Up Arrow 	38 	,< 	188 	'" 	222

多媒体键码值(keyCode)
按键 	键码 	按键 	键码 	按键 	键码 	按键 	键码
音量加 	175 	  	  	  	  	  	 
音量减 	174 	  	  	  	  	  	 
停止 	179 	  	  	  	  	  	 
静音 	173 	  	  	  	  	  	 
浏览器 	172 	  	  	  	  	  	 
邮件 	180 	  	  	  	  	  	 
搜索 	170 	  	  	  	  	  	 
收藏 	171 	  	 
 */


(function(){
	var keys = {};
	
	
	keys.getKey = function(keyCode){
		
	};
	
	namespace(".Keys", keys);
})



/*


if(namespace("playEvent")){
	
	playEvent = function(){
		var Event = {
			   
				//��ü�
				getKey : function(e){
					var down = (e || playEvent.getEvent()).keyCode;
					if(down==91) return "Windows";
					if(down==93) return "Menu";
					if(down==222) return "\'";
					if(down >= 48 && down <=91)
						return String.fromCharCode(down);	
					if(down >= 112 && down <=135)
						return "F" + ((down-112) + 1);						
					if(down >= 188 && down <=191)
						return String.fromCharCode(down-128);	
					if(down >= 96 && down <=105)
						return String.fromCharCode(down-48);	
					if(down >= 219 && down <=229)
						return String.fromCharCode(down-128);	
					switch(down){
						case 17:
							return "Ctrl";
						case 32:
							return " ";
						case 16:
							return "Shift";	
						case 18:
							return "Alt";	
						case 19:
							return "Pause";	
						case 13:
							return "\n";	
						case 40:
							return "Down";
						case 38:
							return "Up";
						case 37:
							return "Left";
						case 39:
							return "Right";
						case 45:
							return "Insert";								
						case 46:
							return "Delete";
						case 35:
							return "End";	
						case 109:
							return "-";
						case 36:
							return "Home";	
						case 106:
							return "*";
						case 111:
							return "/";
						case 107:
							return "=";
						case 9:
							return "Tab";
						case 8:
							return "Backspace";
						case 27:
							return "ESC";
						case 144:
							return "Num_Lock";
						case 34:
							return "Page_Down";
						case 145:
							return "Scroll_Lock";		
						case 33:
							return "Page_Up";										
						case 3:
							return "Break";
						case 0:
							return "";
						case 192:
							return "'";
							
						default:
							return "δָ��";
					}
					
				},
	
			    
Event.Keys = {
	'enter': 13,
	'up': 38,
	'down': 40,
	'left': 37,
	'right': 39,
	'esc': 27,
	'space': 32,
	'backspace': 8,
	'tab': 9,
	'delete': 46
};
 
*/


/*

//===========================================
//  键   Keys.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================



///	<summary>
/// 所有键
///	</summary>
/// <class name="Keys" type="Enum" />
var Keys = JPlus.Keys = ['none',
			'lButton', 'rButton', 0, 0, 0,
			0, 0, 'backspace', '\t', '\r',
			' ', 'clear', '\n', 0, 0,
			'shift', 'ctrl', 'alt', 'pause', 'capsLock',
			0, 0, 0, 0, 0, 
			0, 'escape', 0, 0, 0,
			0, ' ', 'pageUp', 'pageDown','end',
			'home', 'left', 'up', 'right', 'down',
			0, 0, 0, 0, 'insert',
			'delete', 'help'];



(function(s){
	var i;
	s[224] = 'meta';
	s[91] = 'lwin';
	s[92] = 'rwin';
	s[93] = 'select';
	s[106] = '×';
	s[107] = '=';
	s[108] = 'numpadEnter';
	s[109] = s[189] =  '-';
	s[110] = '.';
	s[111] = '÷';
	s[229] = '`';
	s[220] = '\\';
	s[219] = '[';
	s[221] = ']';	
	s[222] = '\'';	
	s[143] = 'shift';
	s[144] = 'numLock';
	s[145] = 'scrollLock';
	s[315] = '<';
	s[317] = '>';
	s[346] = '{';
	s[347] = '|';
	s[319] = '~';
	s[348] = '}';
	s[349] = '\"';
	s[236] = '_';
	s[234] = '+';
	s[318] = '?';
	
	[
	 ')',
	'!', '@', '#', '$', '%', 
	 '^', '&', '*', '(', 0,
	 ':', '=', ',', 0, '.',
	 '/'
	].each(function(v, k){
		s[k + 175] = v;
	});
	
	for(i = 0 ; i < 10; i++)
	   s[96 + i] = i; 
	  
	   
	for(i = 1 ; i < 17; i++)
	   s[111 + i] = "F" + i; 
	   
	for( i = 48; i < 65; i++)
		s[i] = String.fromCharCode(i);
		
	for (i = 65; i < 91; i++) {
		s[i] = String.fromCharCode(i + 32);
		s[i + 127] = String.fromCharCode(i);
	}
	  
	for(i = 0; i < 256; i++)
		if(s[i] && s[i].length > 1)
			s[s[i]] = i; 
	 
	s.enter = 13;
	s.space = 11;
	s.tab = 9;
	
	///	<summary>
    ///	根据事件返回键名
    ///	</summary>
    /// <params name="event" type="Event">事件</params>
    /// <returns type="String">键名</returns>
	s.getName = function(event){
		var k = event.keyCode;
		if(k == 0)
			return null;
	 	if(event.shiftKey)
			k += 127;
		return JPlus.Keys[k];
	 };
	 
    ///	<summary>
    ///	创建一个处理按键的事件句柄。
    ///	</summary>
    /// <params name="fn" type="Function">函数</params>
    /// <returns type="Function">函数。参数：键名， 是否ctrl，是否alt</returns>
    s.createHandler = function(fn){
		return function(eventArgs){
			var v = JPlus.Keys.getName(eventArgs);
        	if(v == "shift" || v == "alt" || v == "ctrl")
           		return false;
        	return fn(v, eventArgs.ctrlKey,  eventArgs.altKey);
		}
        
    };
	 
})(JPlus.Keys);






Ext.EventObject = function(){
    
    var E = Ext.lib.Event;
    
    
    var safariKeys = {
        63234 : 37, 
        63235 : 39, 
        63232 : 38, 
        63233 : 40, 
        63276 : 33, 
        63277 : 34, 
        63272 : 46, 
        63273 : 36, 
        63275 : 35  
    };

    
    var btnMap = Ext.isIE ? {1:0,4:1,2:2} :
                (Ext.isSafari ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Ext.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };
    Ext.EventObjectImpl.prototype = {
        
        browserEvent : null,
        
        button : -1,
        
        shiftKey : false,
        
        ctrlKey : false,
        
        altKey : false,

        
        BACKSPACE : 8,
        
        TAB : 9,
        
        RETURN : 13,
        
        ENTER : 13,
        
        SHIFT : 16,
        
        CONTROL : 17,
        
        ESC : 27,
        
        SPACE : 32,
        
        PAGEUP : 33,
        
        PAGEDOWN : 34,
        
        END : 35,
        
        HOME : 36,
        
        LEFT : 37,
        
        UP : 38,
        
        RIGHT : 39,
        
        DOWN : 40,
        
        DELETE : 46,
        
        F5 : 116,

           
        setEvent : function(e){
            if(e == this || (e && e.browserEvent)){ 
                return e;
            }
            this.browserEvent = e;
            if(e){
                
                this.button = e.button ? btnMap[e.button] : (e.which ? e.which-1 : -1);
                this.shiftKey = e.shiftKey;
                
                this.ctrlKey = e.ctrlKey || e.metaKey;
                this.altKey = e.altKey;
                
                this.keyCode = e.keyCode;
                this.charCode = e.charCode;
                
                this.target = E.getTarget(e);
                
                this.xy = E.getXY(e);
            }else{
                this.button = -1;
                this.shiftKey = false;
                this.ctrlKey = false;
                this.altKey = false;
                this.keyCode = 0;
                this.charCode =0;
                this.target = null;
                this.xy = [0, 0];
            }
            return this;
        },

        
        stopEvent : function(){
            if(this.browserEvent){
                if(this.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopEvent(this.browserEvent);
            }
        },

        
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },

        
        isNavKeyPress : function(){
            var k = this.keyCode;
            k = Ext.isSafari ? (safariKeys[k] || k) : k;
            return (k >= 33 && k <= 40) || k == this.RETURN || k == this.TAB || k == this.ESC;
        },

        isSpecialKey : function(){
            var k = this.keyCode;
            return k == 9 || k == 13  || k == 40 || k == 27 ||
            (k == 16) || (k == 17) ||
            (k >= 18 && k <= 20) ||
            (k >= 33 && k <= 35) ||
            (k >= 36 && k <= 39) ||
            (k >= 44 && k <= 45);
        },
        
        stopPropagation : function(){
            if(this.browserEvent){
                if(this.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(this);
                }
                E.stopPropagation(this.browserEvent);
            }
        },

        
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        
        getKey : function(){
            var k = this.keyCode || this.charCode;
            return Ext.isSafari ? (safariKeys[k] || k) : k;
        },

        
        getPageX : function(){
            return this.xy[0];
        },

        
        getPageY : function(){
            return this.xy[1];
        },

        
        getTime : function(){
            if(this.browserEvent){
                return E.getTime(this.browserEvent);
            }
            return null;
        },

        
        getXY : function(){
            return this.xy;
        },

        
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : this.target;
        },
        
        getRelatedTarget : function(){
            if(this.browserEvent){
                return E.getRelatedTarget(this.browserEvent);
            }
            return null;
        },

        
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ 
                delta = e.wheelDelta/120;
                
                if(window.opera) delta = -delta;
            }else if(e.detail){ 
                delta = -e.detail/3;
            }
            return delta;
        },

        
        hasModifier : function(){
            return ((this.ctrlKey || this.altKey) || this.shiftKey) ? true : false;
        },

        
        within : function(el, related){
            var t = this[related ? "getRelatedTarget" : "getTarget"]();
            return t && Ext.fly(el).contains(t);
        },

        getPoint : function(){
            return new Ext.lib.Point(this.xy[0], this.xy[1]);
        }
    };

    return new Ext.EventObjectImpl();
}();




	
	
	
	
Ext.KeyNav = function(el, config){
    this.el = Ext.get(el);
    Ext.apply(this, config);
    if(!this.disabled){
        this.disabled = true;
        this.enable();
    }
};

Ext.KeyNav.prototype = {
    disabled : false,
    defaultEventAction: "stopEvent",

    prepareEvent : function(e){
        var k = e.getKey();
        var h = this.keyToHandler[k];
                                if(Ext.isSafari && h && k >= 37 && k <= 40){
            e.stopEvent();
        }
    },

    relay : function(e){
        var k = e.getKey();
        var h = this.keyToHandler[k];
        if(h && this[h]){
            if(this.doRelay(e, this[h], h) !== true){
                e[this.defaultEventAction]();
            }
        }
    },

    doRelay : function(e, h, hname){
        return h.call(this.scope || this, e);
    },

        enter : false,
    left : false,
    right : false,
    up : false,
    down : false,
    tab : false,
    esc : false,
    pageUp : false,
    pageDown : false,
    del : false,
    home : false,
    end : false,

        keyToHandler : {
        37 : "left",
        39 : "right",
        38 : "up",
        40 : "down",
        33 : "pageUp",
        34 : "pageDown",
        46 : "del",
        36 : "home",
        35 : "end",
        13 : "enter",
        27 : "esc",
        9  : "tab"
    },

	
	enable: function(){
		if(this.disabled){
                                    if(Ext.isIE){
                this.el.on("keydown", this.relay,  this);
            }else{
                this.el.on("keydown", this.prepareEvent,  this);
                this.el.on("keypress", this.relay,  this);
            }
		    this.disabled = false;
		}
	},

	
	disable: function(){
		if(!this.disabled){
		    if(Ext.isIE){
                this.el.un("keydown", this.relay);
            }else{
                this.el.un("keydown", this.prepareEvent);
                this.el.un("keypress", this.relay);
            }
		    this.disabled = true;
		}
	}
};

Ext.KeyMap = function(el, config, eventName){
    this.el  = Ext.get(el);
    this.eventName = eventName || "keydown";
    this.bindings = [];
    if(config instanceof Array){
	    for(var i = 0, len = config.length; i < len; i++){
	        this.addBinding(config[i]);
	    }
    }else{
        this.addBinding(config);
    }
    this.keyDownDelegate = Ext.EventManager.wrap(this.handleKeyDown, this, true);
    this.enable();
};

Ext.KeyMap.prototype = {
    
    stopEvent : false,

    
	addBinding : function(config){
        var keyCode = config.key, 
            shift = config.shift, 
            ctrl = config.ctrl, 
            alt = config.alt,
            fn = config.fn,
            scope = config.scope;
        if(typeof keyCode == "string"){
            var ks = [];
            var keyString = keyCode.toUpperCase();
            for(var j = 0, len = keyString.length; j < len; j++){
                ks.push(keyString.charCodeAt(j));
            }
            keyCode = ks;
        }
        var keyArray = keyCode instanceof Array;
        var handler = function(e){
            if((!shift || e.shiftKey) && (!ctrl || e.ctrlKey) &&  (!alt || e.altKey)){
                var k = e.getKey();
                if(keyArray){
                    for(var i = 0, len = keyCode.length; i < len; i++){
                        if(keyCode[i] == k){
                          if(this.stopEvent){
                              e.stopEvent();
                          }
                          fn.call(scope || window, k, e);
                          return;
                        }
                    }
                }else{
                    if(k == keyCode){
                        if(this.stopEvent){
                           e.stopEvent();
                        }
                        fn.call(scope || window, k, e);
                    }
                }
            }
        };
        this.bindings.push(handler);  
	},

    
    handleKeyDown : function(e){
	    if(this.enabled){ 
    	    var b = this.bindings;
    	    for(var i = 0, len = b.length; i < len; i++){
    	        b[i].call(this, e);
    	    }
	    }
	},
	
	
	isEnabled : function(){
	    return this.enabled;  
	},
	
	
	enable: function(){
		if(!this.enabled){
		    this.el.on(this.eventName, this.keyDownDelegate);
		    this.enabled = true;
		}
	},

	
	disable: function(){
		if(this.enabled){
		    this.el.removeListener(this.eventName, this.keyDownDelegate);
		    this.enabled = false;
		}
	}
};
       
*/     