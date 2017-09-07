# 样式表操作
提供统一的、快速的 DOM 操作方法。

## API (源码: [utility/dom/cssRule.js](../../utility/dom/cssRule.js))

        |            API|            描述|            示例|        
--|--|--|--|--
        |            `CssRules.add`|            动态增加一个样式|            ```
CssRules.add("body", "background: #96CBFE;");
```
|        
        |            `CssRules.remove`|            动态删除一个样式|            ```
CssRules.remove("body", "background: #96CBFE;");
```
|        
        |            `CssRules.get`|            获取指定样式|            ```
CssRules.get("body");
```
|        
        |            `CssRules.set`|            设置指定样式|            ```
CssRules.set("body", "background: #96CBFE;");
```
|        
        |            `CssRules.get`|            禁用或启用指定的样式表文件|                            ##### 禁用                ```
CssRules.disableStyleSheet("css");
```
                ##### 启用                ```
CssRules.disableStyleSheet("css", false);
```
            |        
        |            `CssRules.setStyleSheet`|            设置指定的样式表文件路径|            ```
CssRules.setStyleSheet("css", "css2.css");
```
|
