TealUI 目录结构规范

```
TealUI/ 
    ├── _notes/         存放开发日志和临时文件
    ├── _build/         存放发布生成的目录
    │   ├── dist/       存放可直接引用的完整 js
    │   └── lib/        存放支持 require 加载的 js 和 css
    ├── node_modules/   存放打包工具依赖
    ├── assets/         开发系统所需的资源文件
    ├── demos/          组件完整 DEMO 展示
    ├── docs/           文档和教程
    ├── src/            组件源码
    └── tools/          相关工具
```



目标，所有模块可以按需使用。

