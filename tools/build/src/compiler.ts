/**
 * 表示一个升级的 TypeScript 编译器。
 */

import * as ts from "typescript";
import {transpile} from "./transpiler";

// 重写 createProgram 函数以添加转换。
const createProgram = ts.createProgram;
ts.createProgram = function (rootNames: string[], options: ts.CompilerOptions, host?: ts.CompilerHost, oldProgram?: ts.Program) {

    // 设置默认选项。
    options.noImplicitUseStrict = options.noImplicitUseStrict !== false;

    // 编译。
    const program: ts.Program = createProgram.apply(this, arguments);

    // 语法转换。
    return transpile(program, options);
};

export = ts;