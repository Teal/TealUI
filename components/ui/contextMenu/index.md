# 右键菜单

## 基本用法

```htm
<ContextMenu />
```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>J+ Library</title>
		
		<link href="../../controls/core/assets/styles/base.css" rel="stylesheet" type="text/css">
		<link href="../../controls/button/assets/styles/contextmenu.less" rel="stylesheet/less" type="text/css" />
		
		<script src="../../system/core/assets/scripts/base.js" type="text/javascript"></script>
		<script src="../../system/dom/assets/scripts/base.js" type="text/javascript"></script>
		<script src="../../controls/core/assets/scripts/base.js" type="text/javascript"></script>
		<script src="../../controls/core/assets/scripts/scrollablecontrol.js" type="text/javascript"></script>
		<script src="../../controls/core/assets/scripts/listcontrol.js" type="text/javascript"></script>
		<script src="../../controls/button/assets/scripts/contextmenu.js" type="text/javascript"></script>
		
		<script src="../../assets/demo/less.js" type="text/javascript"></script>
		<script src="../../assets/demo/demo.js" type="text/javascript"></script>
	</head>
	<body>
		
		<aside class="demo">
			
			<div id="a">右击我</div>
			
			
			<script>
				var a = Dom.get('a');
				
				// 创建一个新的菜单。
				var c = new ContextMenu();
				
				// 添加一个新的 MenuItem，并绑定点击事件。
				c.add('aa').on('click', function(){trace(this.getText())});
				
				// 应用当前菜单到节点 a 。
				c.setControl(a);
				
				
			</script>
			
		</aside>
		
		
	</body>
</html>