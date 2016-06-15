/**
 * @fileOverview 解析 md 文档。
 */

import {BuildFile} from 'tpack/src/buildFile';
import * as Marked from "marked";

/**
 * 解析 Markdown 文件。
 * @param file 要处理的文件。
 * @param options 相关的配置。
 */
export = function md(file: BuildFile, options: any) {

    file.extension = ".html";

    let content = file.content;

    // 预处理特殊指令。

    // 编译 markdown。
    content = Marked(content, options);

    // 保存。
    file.content = content;
};
