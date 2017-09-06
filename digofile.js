const digo = require("digo");
digo.config({
    ignore: [".*", "_*", "node_modules", "digofile.js", "tsconfig.json"],
    sourceMap: true,
    sourceMapIncludeSourcesContent: true,
    sourceMapRoot(file) {
        return digo.relativePath(file.sourceMapDir, "_build");
    },
    sourceMapSource(source) {
        return digo.relativePath(source);
    }
});

exports.build = (options) => {
    const list = digo.src("*", "!assets/tpl");
    list.src("*.scss").pipe("digo-node-sass", {
        includePaths: ["components"]
    });
    list.src("*.css").pipe("digo-css-inline", {
        ".ttf": "application/x-font-truetype",
        ".woff": "application/font-woff",
        ".svg": "image/svg+xml",
        ".gif": "image/gif",
        ".ico": "image/x-icon",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".wbmp": "image/vnd.wap.wbmp"
    });
    list.src("*.ts", "*.tsx", "*.js", "*.jsx", "!*.d.ts").pipe({
        name: "TS",
        add(file, options, done, result) {
            const tsc = get(TSC, options);
            file.ext = ".js";
            if (file.buildMode === digo.BuildMode.clean) {
                tsc.remove(file.srcPath);
            } else {
                const output = tsc.getEmitOutput(file.srcPath);
                for (const diagnostic of output.diagnostics) {
                    const startLoc = diagnostic.file && diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                    const endLoc = diagnostic.file && diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start + diagnostic.length);
                    file.error({
                        plugin: "TS",
                        message: diagnostic.messageText,
                        fileName: diagnostic.file ? diagnostic.file.fileName : undefined,
                        line: startLoc && startLoc.line,
                        column: startLoc && startLoc.character,
                        endLine: endLoc && endLoc.line,
                        endColumn: endLoc && endLoc.character
                    });
                }
                if (output.outputText != undefined) {
                    file.content = output.outputText;
                }
                if (output.sourceMapText) {
                    const map = JSON.parse(output.sourceMapText);
                    map.sourcesContent = map.sourcesContent || [];
                    for (let i = 0; i < map.sources.length; i++) {
                        map.sources[i] = file.resolve(map.sources[i]);
                        map.sourcesContent[i] = (tsc.getSourceFile(map.sources[i]) || {}).text;
                    }
                    file.sourceMapEmit = false;
                    file.applySourceMap(map);
                }
                if (output.declarationText != undefined) {
                    const declaration = new digo.File();
                    declaration.path = digo.setExt(file.srcPath, ".d.ts");
                    declaration.content = output.declarationText;
                    result.add(declaration);
                }
            }
            if (file.test("./components") && !file.test("*-test.*") && !digo.existsFile(digo.setExt(file.srcPath, ".md"))) {
                const docFile = new digo.File();
                docFile.buildMode = file.buildMode;
                docFile.path = digo.setExt(file.srcPath, ".md");
                docFile.content = "";
                result.add(docFile);
            }
            done();
        }
    }, options);
    list.src("*.md", "!./*.md").pipe({
        name: "MD",
        add(file, options) {
            const mdc = get(MDC, options);
            file.name = mdc.getOutputName(file.name);
            const result = mdc.getEmitOutput(file.srcPath);
            if (result.outputText != undefined) {
                file.content = result.outputText;
            }
            if (result.deps) {
                file.dep(result.deps);
            }
        }
    }, options);
    list.src("./*/index.yml").pipe({
        name: "Index",
        add(file, options, done, result) {
            const mdc = get(MDC, options);
            const rootDir = getRootDir(file.srcPath);

            file.ext = ".js";
            file.content = `Doc.initList(${JSON.stringify(mdc.buildIndex(rootDir))});`;

            const indexFile = new digo.File();
            indexFile.path = digo.setExt(file.srcPath, ".html");
            indexFile.content = mdc.render({
                root: "..",
                dir: rootDir,
                title: getTitle(rootDir),
                init: {
                    root: "..",
                    dir: rootDir
                },
                body: `<aside id="doc_mainmenu" class="doc-menubutton">
                        <a href="javascript://打开工具" title="工具" class="doc-icon">🔧⏷</a>
                        <menu>
                            <li><a href="javascript:Doc.toggleFullScreen()" accesskey="f"><i class="doc-icon">✥</i>全屏显示</a></li>
                            <li class="doc-menu-divider"><a href="${get(Git, options).url}/edit/${get(Git, options).branch}/${file.name}" target="_blank"><i class="doc-icon">✍</i>编辑此页</a></li>
                        </menu>
                    </aside>
                    <h1 id="${getTitle(rootDir)}"><a href="#${getTitle(rootDir)}" title="链接" aria-hidden="true" class="doc-icon doc-permalink">☍</a>${getTitle(rootDir)}</h1>
                    <p id="doc_loading"><i class="doc-icon doc-spin">҉</i> 正在载入列表...</p>`,
                footer: `\n\t<script>Doc.writeList()</script>`
            });
            result.add(indexFile);

            done();
        }
    }, options);
    list.src("package.json").pipe({
        name: "Package",
        add(file, options) {
            try {
                const data = JSON.parse(file.content);
                if (data.types) {
                    data.main = data.types.replace(/\.[tj]sx?$/i, ".js").replace(/\.(sc|le)ss$/i, ".css");
                    delete data.types;
                }
                file.content = JSON.stringify(data, undefined, 2);
            } catch (e) {
                file.error(e);
            }
        }
    }, options);
    list.src("assets/mockup/index.html").pipe({
        name: "Index",
        add(file, options) {
            file.dir = "";
            file.content = buildTpl(file.content);
        }
    }, options);
    return list.dest("_build");
};

exports.publish = () => {
    const list = exports.build({ publish: true });
    list.src("*.css").pipe("digo-autoprefixer", {
        browsers: [
            "Explorer >= 9",
            "Edge >= 12",
            "Chrome >= 11",
            "FireFox >= 8",
            "Safari >= 8",
            "Android >= 4",
            "iOS >= 8",
            "ExplorerMobile >= 11",
            "UCAndroid >= 10"
        ]
    });
    list.src("*.css", "!components").pipe("digo-clean-css");
    list.src("*.js", "!components").pipe("digo-uglify-js");
    return list.dest("_publish");
};

exports.watch = () => {
    return digo.watch(exports.build);
};

exports.server = () => {
    return digo.startServer({
        port: 9090,
        task: exports.build,
        root: "_build",
        plugins: ["digo-livereload"]
    });
};

exports.launch = () => {
    let name = getOutputDocName(digo.parseArgs()[1] || "");
    if (!require("fs").existsSync("_build/" + name)) {
        name = "";
    }
    digo.exec(`${process.platform === "win32" ? "start" : "open"} ${digo.server ? digo.server.url : "http://localhost:9090/"}${name}`, () => {
        digo.report = false;
    });
};

exports.default = () => {
    exports.server();
    digo.then(exports.launch);
};

exports.new = (options) => {
    const data = Object.assign(digo.parseArgs(), options);
    if (!/[^\/]+\//.test(data[1])) {
        digo.info("用法: digo new <分类>/<组件名> [组件显示名] [组件描述]\n  如: digo new ui/textBox 文本框 用于输入内容的组件");
        digo.report = false;
        return;
    }

    data.moduleName = data[1];
    data.name = data.name || digo.getFileName(data.moduleName, false);
    data.nameLower = data.name.toLowerCase();
    data.namePascal = data.name.charAt(0).toUpperCase() + data.name.slice(1);

    data.displayName = data[2] || data.name;
    data.description = data[3] || data.displayName;

    data.author = data.author || digo.exec("git config user.name", { slient: true }).output.join("").trim();
    data.email = data.email || digo.exec("git config user.email", { slient: true }).output.join("").trim();
    data.version = data.version || "0.0.1";
    data.date = data.date || digo.formatDate(undefined, "yyyy/MM/dd");

    data.dir = data.dir || "components";
    data.rootDir = data.rootDir || digo.relativePath(data.dir + "/" + data.moduleName, "");
    data.tpl = data.tpl || `assets/tpl/${data.moduleName.replace(/\/.*$/, "")}`;

    if (!digo.existsDir(data.tpl)) {
        if (!digo.existsDir(`assets/tpl/default`)) {
            digo.fatal("Cannot find tpl folder: {tpl}", data);
            return;
        }
        data.tpl = `assets/tpl/default`;
    }

    digo.walk(data.tpl, {
        file(path) {
            digo.writeFileIf(`${data.dir}/${data.moduleName}/${digo.relativePath(data.tpl, path).replace("tpl", data.name)}`, renderTpl(new digo.File(path).content, data));
        },
        end() { }
    });

    const index = digo.readFile(`${data.dir}/index.yml`).toString();
    if (!inIndex(index, data.moduleName)) {
        digo.writeFile(`${data.dir}/index.yml`, addIndex(index, data.moduleName));
    }
};

exports.index = () => {
    digo.src("index.yml").pipe(file => {
        const rootDir = getRootDir(file.path);
        file.content = cleanIndex(file.content, digo.glob(rootDir === "components" ? "components/**/package.json" : [rootDir + "/**/*.md", rootDir + "/**/index.html"]).map(path => getModuleName(path)));
        file.overwrite = true;
    }).dest(".");
};

/**
 * 返回一个 TypeScript 编译器。
 * @param options 选项。
 */
function TSC(options) {
    const compilerOptions = require("./components/tsconfig").compilerOptions;
    compilerOptions.sourceMap = digo.sourceMap;
    if (options && options.publish) {
        compilerOptions.target = "es5";
    }

    const tsc = createTypeScriptCompiler(compilerOptions, {
        log: digo.log,
        trace: digo.verbose,
        error: digo.error,
        getCurrentDirectory() {
            return "components";
        }
    });
    if (digo.watcher) {
        digo.watcher.on("rebuild", (changes, deletes) => {
            for (const path of changes) {
                tsc.changed(path);
            }
            for (const path of deletes) {
                tsc.changed(path);
            }
        });
    }
    return tsc;

    /**
     * 创建一个 TypeScript 编译器服务。
     * @param compilerOptions 编译的选项。 
     * @param compilerHost 编译器的选项。 
     */
    function createTypeScriptCompiler(compilerOptions = {}, compilerHost = {}) {
        const ts = require("typescript");

        compilerOptions = ts.fixupCompilerOptions(compilerOptions);
        if (compilerOptions.lib) {
            const libMap = ts.optionDeclarations.find(t => t.name == "lib").element.type;
            compilerOptions.lib = compilerOptions.lib.map(lib => libMap.get(lib) || lib);
        }
        if (compilerHost.getCurrentDirectory) {
            if (compilerOptions.paths) {
                compilerOptions.paths = compilerOptions.paths.map(p => ts.normalizePath(ts.combinePaths(compilerHost.getCurrentDirectory(), p)));
            }
            if (compilerOptions.baseUrl) {
                compilerOptions.baseUrl = ts.normalizePath(ts.combinePaths(compilerHost.getCurrentDirectory(), compilerOptions.baseUrl));
            }
        }

        compilerOptions.suppressOutputPathCheck = true;
        delete compilerOptions.outDir;

        let projectVersion = 0;
        const files = { __proto__: null };
        const contents = { __proto__: null };
        const moduleResolutionCache = ts.createModuleResolutionCache(ts.sys.getCurrentDirectory(), ts.createGetCanonicalFileName(!!compilerOptions.forceConsistentCasingInFileNames));
        const services = ts.createLanguageService(Object.assign(ts.createCompilerHost(compilerOptions), {
            getCompilationSettings() {
                return compilerOptions;
            },
            getProjectVersion() {
                return projectVersion;
            },
            getScriptFileNames() {
                return Object.keys(files);
            },
            getScriptVersion(fileName) {
                return files[fileName] || 0;
            },
            getScriptSnapshot(fileName) {
                const cached = contents[fileName];
                if (cached !== undefined) {
                    return cached;
                }
                const content = ts.sys.readFile(fileName, "utf-8");
                if (content == undefined) {
                    return contents[fileName] = ts.ScriptSnapshot.fromString("");
                }
                return contents[fileName] = ts.ScriptSnapshot.fromString(content);
            },
            getDefaultLibFileName: ts.getDefaultLibFilePath,
            readDirectory: ts.sys.readDirectory,
            resolveModuleNames(moduleNames, containingFile) {
                return moduleNames.map(moduleName => ts.resolveModuleName(moduleName, containingFile, compilerOptions, ts.sys, moduleResolutionCache).resolvedModule);
            }
        }, compilerHost));
        return {
            add(path) {
                if (!(path in files)) {
                    files[path] = 1;
                    delete contents[path];
                    projectVersion++;
                }
            },
            remove(path) {
                if (path in files) {
                    delete files[path];
                    delete contents[path];
                    projectVersion++;
                }
            },
            changed(path) {
                if (files[path]) {
                    files[path]++;
                    delete contents[path];
                    projectVersion++;
                }
            },
            getEmitOutput(path) {
                this.add(path);
                const emitOutput = services.getEmitOutput(path, false);
                if (!emitOutput.outputFiles) {
                    return {
                        diagnostics: []
                    };
                }
                const map = emitOutput.outputFiles.find(x => ts.fileExtensionIs(x.name, ".map"));
                const declaration = emitOutput.outputFiles.find(x => ts.fileExtensionIs(x.name, ".d.ts"));
                const output = emitOutput.outputFiles.find(x => x !== map && x !== declaration);
                return {
                    outputText: output ? output.text : undefined,
                    sourceMapText: map && map.text,
                    declarationText: declaration && declaration.text,
                    diagnostics: services.getSyntacticDiagnostics(path)
                };
            },
            getProgram() {
                return services.getProgram();
            },
            getSourceFile(path) {
                this.add(path);
                return this.getProgram().getSourceFile(path);
            },
            transpile(content, options) {
                let postfix = "";
                options.compilerOptions = Object.assign({}, compilerOptions, {
                    sourceMap: false
                }, options.compilerOptions);
                if (options.moduleName) {
                    if (/^\s*import /m.test(content)) {
                        postfix = `\nvar exports = require("${options.moduleName}")\n`;
                    } else {
                        options.compilerOptions.module = "none";
                    }
                }
                return ts.transpileModule(content, options).outputText + postfix;
            }
        };
    }

}

/**
 * 表示一个 Markdown 编译器。
 * @param options 选项。
 */
function MDC(options) {
    const yaml = require("js-yaml");
    const pinyin = require("fast-pinyin");
    const tsDocParser = require("tsdocparser");

    const mdc = createMarkdownCompiler({
        contentClass: "doc",
        taskClassPrefix: "doc-task",
        codeClassPrefix: "doc-code-",
        externalLinkClassPrefix: "doc-external",
        blockquoteClass: " doc-blockquote",
        blockquoteInfoClassPostfix: " doc-blockquote-info",
        blockquoteErrorClassPostfix: " doc-blockquote-error",
        blockquoteWarningClassPostfix: " doc-blockquote-warning",
        relativeLink(name, options) {
            const names = name.split('#', 2);
            const path = options.file && resolveModuleName(options.file.dir, names[0]);
            if (path) {
                const meta = metaCache[path] || getMeta(path, digo.bufferToString(digo.readFileIf(path)));
                return meta ? {
                    title: name,
                    href: options.file.root + "/" + options.file.dir + "/" + meta.href + (names[1] ? "#" + names[1] : ""),
                    content: meta.title
                } : null;
            }
        },
        anchor(anchor) {
            return `<a href="#${anchor}" title="链接" aria-hidden="true" class="doc-icon doc-permalink">☍</a>`;
        },
        toc(toc) {
            let html = "";
            for (const item of toc) {
                const tag = item.level === 1 ? "dt" : "dd";
                html += `\n\t<${tag}><a href="#${item.anchor}">${mdc.encodeHTML(item.content)}</a></${tag}>`;
            }
            return `<dl id="doc_toc">${html}\n</dl>\n`;
        },
        html(html, opt) {
            return html.replace(/(<script[^>]*>)([\s\S]*)(<\/script>)/gi, (all, start, source, end) => `${start}\n${get(TSC, options).transpile(source, { moduleName: `doc_script_${++opt._scriptId || (opt._scriptId = 1)}` })}${end}`);
        },
        code(info, source, opt) {
            const infos = info.split(/\s+/);
            const lang = infos[0];
            const demo = infos[1] === "demo";

            const sources = source.split(/^----*$/m);
            let html = "";
            for (const source of sources) {
                if (html) {
                    html += "<hr>\n";
                }
                html += mdc.highlight(source.trim(), lang);
            }

            const highlights = infos[demo ? 2 : 1];
            if (highlights && /\{.+\}/.test(highlights)) {
                html = html.split("\n");
                for (let part of highlights.slice(1, -1).split(",")) {
                    part = part.split("-");
                    const start = part[0] - 1;
                    const end = part[1] - 1 || start;
                    for (let i = start; i <= end; i++) {
                        if (html[i]) {
                            html[i] = html[i].replace(/<[^>]*?>|[^<]+/g, all => {
                                if (!/^</.test(all)) {
                                    all = `<span class="doc-code-highlight">${all}</span>`;
                                }
                                return all;
                            });
                        }
                    }
                }
                html = html.join("\n");
            }
            if (sources.length > 1) {
                html = html.replace(/<hr>\n/g, "<hr>");
            }

            html = `<pre class="doc-code"><a href="javascript://复制源码" title="复制源码" aria-hidden="true" class="doc-icon" onclick="Doc.copyCode(this)">❐</a><code class="doc-code-${lang}">${html}</code></pre>`;
            if (demo) {
                const hide = infos.indexOf("hide", 2) >= 0 ? " doc-demo-collapsed" : "";
                const doc = infos.indexOf("doc", 2) >= 0 ? " doc" : "";

                const demoId = sources.length > 1 ? "" : `doc_demo_${++opt._demoId || (opt._demoId = 1)}`;
                let demoHtml = `<div class="doc-demo-body${sources.length > 1 ? "" : doc}" aria-label="示例"${sources.length > 1 ? "" : ` id="${demoId}"`}>\n${sources.length > 1 ? `<div class="doc-row">` : ""}`;
                for (let source of sources) {
                    const currentDemoId = sources.length > 1 ? `doc_demo_${++opt._demoId || (opt._demoId = 1)}` : demoId;

                    source = source.replace(/__root__/g, currentDemoId);
                    if (/^[jt]sx?$/.test(lang)) {
                        source = `<script>\n${get(TSC, options).transpile(source, { moduleName: currentDemoId })}\n</script>`;
                    } else if (lang === "css") {
                        source = `<style>\n${source}\n</style>`;
                    } else {
                        source = source.replace(/(<script[^>]*>)([\s\S]*)(<\/script>)/gi, (all, start, source, end) => `${start}\n${get(TSC, options).transpile(source, { moduleName: currentDemoId })}${end}`);
                    }

                    demoHtml += sources.length > 1 ? `\n<div class="doc-col${doc}" id="${currentDemoId}">\n${source}\n</div>` : source;
                }
                demoHtml += `${sources.length > 1 ? `\n</div>` : ""}\n</div>`;
                html = `<div class="doc-demo${hide}">
                    ${demoHtml}
                    ${html}${hide ? `\n<a href="javascript://查看源码" aria-label="查看源码" aria-checked="true" class="doc-demo-toggle" onclick="Doc.toggleDemoCode(this.parentNode)"><i class="doc-icon">⏷</i></a>` : ""}
                </div>`;
            }
            return html;
        }
    });

    const metaCache = { __proto__: null };
    const contentCache = { __proto__: null };
    const repository = get(Git, options);

    const tpl = buildTpl(new digo.File("assets/mockup/detail.html").content
        .replace(/<title>/, `__metaHtml__$&`)
        .replace(/组件名/g, "__title__")
        .replace(/<script src=".*\/require.js"><\/script>/, "$&__header__")
        .replace(/\.\.\/doc/g, `__root__/assets/doc`)
        .replace(/\.\.\/\.\./g, `__root__`)
        .replace(/(href|src)="([^:#_]*?)"/g, `$1="__root__/$2"`)
        .replace(` class="doc-navbar-active"`, "")
        .replace(/(查找)组件/g, "$1__dirHtml__")
        .replace(/\s*<!--[\s\S]*?--> *\n?/g, "")
        .replace(/(<article[^>]*>)[\s\S]*(<\/article>)/, `$1\n__body__\n$2`)
        .replace(/Doc\.init\([\s\S]*?\);/, "Doc.init(__initHtml__)")
        .replace(/<script>\s*Doc\.initList[\s\S]*?<\/script>/, `<script src="__root__/__dir__/index.js"></script>__footer__`));

    return Object.assign(mdc, {
        render(data) {
            data.metaHtml = "";
            for (const key in data.meta) {
                if (data.meta[key]) {
                    data.metaHtml += `<meta name="${key}" content="${mdc.encodeHTML(data.meta[key])}">\n    `;
                }
            }
            data.dirHtml = getTitle(data.dir);
            data.initHtml = JSON.stringify(data.init);
            return renderTpl(tpl.replace(`<li><a href="__root__/${data.dir}"`, `<li class="doc-navbar-active"><a href="__root__/${data.dir}"`), data);
        },
        buildIndex(dir) {
            metaCache[dir] = true;
            const index = digo.bufferToString(digo.readFileIf("./" + dir + "/index.yml"));
            if (!index) {
                return {};
            }
            const data = parseYAML(index);

            let lastMeta;
            const parse = items => {
                if (typeof items === "object" && !Array.isArray(items)) {
                    const result = {};
                    for (const key in items) {
                        const r = parse(items[key]);
                        if (r) {
                            result[key] = r;
                        }
                    }
                    return result;
                }
                const result = [];
                for (let name of items) {
                    name = resolveModuleName(dir, name);
                    if (!name) {
                        continue;
                    }

                    const content = contentCache[name] = digo.bufferToString(digo.readFileIf(name));
                    const meta = metaCache[name] = getMeta(name, content);
                    if (lastMeta) {
                        lastMeta.next = meta;
                        meta.prev = lastMeta;
                    }
                    lastMeta = meta;

                    const item = {
                        href: meta.href,
                        title: meta.title,
                        pinyin: getPinYin(meta.title)
                    };
                    if (meta.keyword) {
                        item.keywords = meta.keyword.join(",");
                        item.keywordsPinYin = getPinYin(meta.keyword.join(","));
                    }
                    result.push(item);
                }
                return result.length ? result : null;
            };
            return parse(data);
        },
        getOutputName(name) {
            if (/\/([^\/]+)\/\1\.\w+$/.test(name)) {
                return digo.setFileName(name, "index.html");
            }
            return digo.setExt(name, ".html");
        },
        getEmitOutput(path) {
            const file = mdc.getSourceFile(path);

            const mdOptions = {
                file: file,
                toc: true,
                appendToc: [],
                appendHeader: "",
            };
            if (file.module) {
                mdOptions.appendHeader = `<div class="doc-menubutton">
                        <small>${file.module}</small>
                        <menu>
                            <li><a href="javascript:Doc.copy(${mdc.encodeHTML(JSON.stringify(createImport(file)))})">复制 <code>import "${file.module}"</code></a></li>
                            <li><a href="javascript:Doc.copy(${mdc.encodeHTML(JSON.stringify(createRequire(file)))})">复制 <code>require("${file.module}")</code></a></li>
                            <li class="doc-menu-divider"><a href="javascript:Doc.copy(${mdc.encodeHTML(JSON.stringify(`"${file.module}"`))})">复制 <code>"${file.module}"</code></a></li>
                        </menu>
                    </div>`;
            }
            if (file.tag) {
                for (const tag of file.tag) {
                    mdOptions.appendHeader += ` <span class="doc-tag">${mdc.encodeHTML(tag)}</span>`;
                }
            }

            const apiDoc = file.api ? createApiDoc(file.api, mdOptions.appendToc, file.root) : "";
            const doc = mdc.transpile(file.content, mdOptions);
            const imports = (file.import || []).concat(file.module).filter(x => x);

            return {
                outputText: mdc.render({
                    root: file.root,
                    dir: file.dir,
                    meta: {
                        author: file.author,
                        version: file.version,
                        description: file.description,
                        keywords: file.keywords
                    },
                    init: {
                        root: file.root,
                        dir: file.dir,
                        active: file.sidebarActive,
                        test: file.test,
                        imports: imports
                    },
                    title: file.title,
                    header: imports && imports.length ? `\n\t<script>require(${JSON.stringify(imports)})</script>` : "",
                    body: `<aside id="doc_mainmenu" class="doc-menubutton">
                            <a href="javascript://打开工具" title="工具" class="doc-icon">🔧⏷</a>
                            <menu>
                                ${file.testPath ? `<li><a href="javascript:Doc.toggleUnitTest()" accesskey="t"><i class="doc-icon">☕</i>单元测试</a></li>` : ""}
                                <li><a href="javascript:Doc.toggleFullScreen()" accesskey="f"><i class="doc-icon">✥</i>全屏显示</a></li>
                                ${mdOptions._demoId != null ? `<li><a href="javascript:Doc.toggleDemoCodes()" accesskey="c"><i class="doc-icon">⅏</i>折叠源码</a></li>` : ""}
                                ${apiDoc ? `<li><a href="javascript:Doc.toggleApis()" accesskey="a"><i class="doc-icon">≡</i>展开 API</a></li>` : ""}
                                ${file.modulePath ? `<li class="doc-menu-divider"><a href="${repository.url}/tree/${repository.branch}/${digo.relativePath(file.modulePath)}" target="_blank"><i class="doc-icon">😺</i>查看源码</a></li>` : ""}
                                ${file.modulePath ? `<li><a href="${repository.url}/issues/new?title=${mdc.encodeHTML(file.module)}" target="_blank"><i class="doc-icon">🐛</i>报告 BUG</a></li>` : ""}
                                ${!file.created ? `<li${file.modulePath ? "" : ` class="doc-menu-divider"`}><a href="${repository.url}/edit/${repository.branch}/${file.name}" target="_blank"><i class="doc-icon">✍</i>编辑此页</a></li>` : ""}
                            </menu>
                        </aside>
                        ${doc}
                        ${apiDoc}
                        ${file.prev || file.next ? `<nav id="doc_pager">
                            ${file.prev ? `<a href="${file.root}/${file.dir}/${file.prev.href}" title="${mdc.encodeHTML(file.prev.title)}" id="doc_pager_prev"><i class="doc-icon">⮜</i> ${mdc.encodeHTML(file.prev.title)}</a>` : ""}
                            ${file.next ? `<a href="${file.root}/${file.dir}/${file.next.href}" title="${mdc.encodeHTML(file.next.title)}" id="doc_pager_next">${mdc.encodeHTML(file.next.title)} <i class="doc-icon">⮞</i></a>` : ""}
                        </nav>` : ""}`
                }),
                deps: file.jsPath ? [file.jsPath] : null
            };
        },
        getSourceFile(path) {
            const dir = getRootDir(path);
            if (!metaCache[dir]) {
                mdc.buildIndex(dir);
            }

            const name = digo.relativePath(path);
            let content = contentCache[name];
            let result;
            if (content != undefined) {
                delete contentCache[name];
                result = Object.assign({}, metaCache[name]);
            } else {
                content = digo.bufferToString(digo.readFileIf(name));
                result = Object.assign({}, metaCache[name], getMeta(name, content));
            }
            result.sidebarActive = (metaCache[name] || metaCache[name.replace(/^([^/]*)\/([^/]*)\/([^/]*)\/(.*)$/, "$1/$2/$3/$3.md")] || result).href;
            result.root = digo.relativePath(digo.getDir(path), "");
            result.dir = dir;
            result.name = name;
            result.content = content;
            result.created = !content;

            const jsPath = result.jsPath = pick([digo.setExt(path, ".js"), digo.setExt(path, ".ts"), digo.setExt(path, ".tsx"), digo.setExt(path, ".d.ts")]);
            if (jsPath) {
                const api = result.api = parseDoc(jsPath);
                if (api) {
                    if (api.members) {
                        const exportDefault = api.members.find(x => x.exportName === "default");
                        if (exportDefault) {
                            result.exportDefault = exportDefault.name;
                        }
                        result.exports = api.members.map(x => x.exportName).filter(x => x && x !== "default");
                    }
                    if (!result.content) {
                        result.title = api.summary || result.title;
                        result.author = api.author || result.author;
                        result.content = `# ${result.title}`;
                    }
                }
            }
            const modulePath = result.modulePath = jsPath || pick([digo.setExt(path, ".css"), digo.setExt(path, ".scss"), digo.setExt(path, ".less")]);
            if (modulePath) {
                result.module = digo.setExt(digo.relativePath("components", modulePath), "").replace(/([^\/]+)\/\1$/, "$1");
            }
            const testPath = result.testPath = pick([digo.setExt(path, "-test.ts"), digo.setExt(path, "-test.tsx"), digo.setExt(path, "-test.js"), digo.setExt(path, "-test.jsx")]);
            if (testPath) {
                result.test = digo.relativePath("components", testPath);
            }

            return result;
        }
    });

    function createImport(data) {
        let code = data.exportDefault || "";
        if (data.exports && data.exports.length) {
            code += (code ? ", " : "") + "{ " + data.exports.join(", ") + " }";
        }
        if (code) code += " from ";
        return `import ${code}"${data.module}";\n`;
    }

    function createRequire(data) {
        let code = "";
        const moduleName = data.module.replace(/^.*\//, "") + "_1";
        if (data.exportDefault) {
            code += `\tvar ${data.exportDefault} = ${moduleName}.default;\n`;
        }
        if (data.exports) {
            for (const exportName of data.exports) {
                code += `\tvar ${exportName} = ${moduleName}.${exportName};\n`;
            }
        }
        return `require(["${data.module}"], function (${moduleName}) {\n${code}\n\n});\n`;
    }

    function createApiDoc(data, toc, root) {
        if (!data.members) {
            return "";
        }
        const namespaces = tsDocParser.sort(data.members, true);
        let html = "";
        if (namespaces.length) {
            html += header(1, "api", "API");
            for (const namespace of namespaces) {
                const classMember = namespace.member;
                const hasExtends = classMember && classMember.extends && classMember.extends.length;
                const hasImplmenents = classMember && classMember.implmenents && classMember.implmenents.length;

                if (classMember) {
                    html += header(2, "api/" + namespace.name, `${namespace.name}${typeParameters(classMember.typeParameters)} ${({ "class": "类", "interface": "接口", "enum": "枚举", "type": "类型" })[classMember.memberType]}`, classMember);

                    if (hasExtends || hasImplmenents) {
                        html += `<p>`;
                        if (hasExtends) {
                            html += `继承自：<code>${classMember.extends.map(typeToLink).join(", ")}</code>`;
                        }
                        if (hasImplmenents) {
                            if (hasExtends) {
                                html += `；`;
                            }
                            html += `实现接口：<code>${classMember.implmenents.map(typeToLink).join(", ")}</code>`;
                        }
                        html += `</p>`;
                    }

                    html += mdc.transpile(classMember.summary);
                    html += typeParametersDetail(classMember.typeParameters);
                } else if (namespaces.length > 1) {
                    html += header(2, "global", "全局");
                }

                if (classMember && classMember.memberType === "type") {
                    html += `<p>同：<code>${typeToLink(classMember.type)}</code></p>`;
                    html += detail(null, classMember);
                } else {
                    if (classMember) {
                        html += detail(null, classMember);
                    }
                    html += `<div class="doc doc-scrollable">`;

                    if (namespace.propteries.size) {
                        html += `<table class="doc-api">`;
                        if (classMember && classMember.memberType === "enum") {
                            html += `<tr>
                                <th class="doc-api-property">枚举字段</th>
                                <th class="doc-api-type">枚举值</th>
                                <th class="doc-api-summary">描述</th>
                            </tr>`;
                            namespace.propteries.forEach((member, key) => {
                                const summary = mdc.transpile(member.summary);
                                html += `<tr id="${memberAnchor(classMember, member.name)}">
                                    <td>
                                        ${sourceLink(member, " doc-api-more")}
                                        <a href="javascript://详细信息" title="展开/折叠详细信息" class="doc-icon doc-api-toggle" onclick="Doc.toggleApi(this)">⮞</a>
                                        <code>${mdc.encodeHTML(member.name)}</code>
                                        <span class="doc-api-more"> = <code>${mdc.encodeHTML(member.default)}</code></span>
                                        <div class="doc doc-api-detail">
                                            ${summary}
                                            ${detail(classMember, member)}
                                        </div>
                                    </td>
                                    <td>
                                        <code>${mdc.encodeHTML(member.default)}</code>
                                    </td>
                                    <td class="doc">
                                        ${summary}
                                    </td>
                                </tr>`;
                            });
                        } else {
                            html += `<tr>
                                <th class="doc-api-property">${classMember ? "字段" : "变量"}</th>
                                <th class="doc-api-type">类型</th>
                                <th class="doc-api-summary">描述</th>
                                ${hasExtends ? `<th class="doc-api-extends">继承自</th>` : ""}
                            </tr>`;
                            namespace.propteries.forEach((member, key) => {
                                const summary = mdc.transpile(`${accessibility(member)}${member.const ? `(常量)` : member.readOnly ? `(只读)` : ""}${member.summary || ""}`);
                                const parent = hasExtends && classMember.extendedPototypes && classMember.extendedPototypes.indexOf(member) >= 0 && typeToLink(member.parent);
                                const indexer = member.memberType === "indexer";
                                html += `<tr id="${memberAnchor(classMember, indexer ? "indexer" : member.name)}">
                            <td>
                                ${sourceLink(member, " doc-api-more")}
                                <a href="javascript://详细信息" title="展开/折叠详细信息" class="doc-icon doc-api-toggle" onclick="Doc.toggleApi(this)">⮞</a>
                                <code>${indexer ? `[${member.parameters[0].name}]` : mdc.encodeHTML(key)}</code>
                                <span class="doc-api-more">: <code>${typeToLink(indexer ? member.returnType : member.type)}</code>${member.default ? ` = <code>${mdc.encodeHTML(member.default)}</code>` : ""}</span>
                                <div class="doc doc-api-detail">
                                    ${indexer ? method(classMember, member) : summary + detail(classMember, member)}
                                    ${parent ? `<h4>继承自</h4><p><code>${parent}</code></p>` : ""}
                                </div>
                            </td>
                            <td>
                                <code>${typeToLink(tsDocParser.toSimpleType(indexer ? member.returnType : member.type))}</code>
                            </td>
                            <td class="doc">
                                ${summary}
                            </td>
                            ${hasExtends ? `<td>${parent ? `<code>${parent}</code>` : "—"}</td>` : ""}
                        </tr>`;
                            });
                        }
                        html += `</table>`;
                    }

                    if (namespace.methods.size) {
                        html += `<table class="doc-api"><tr>
                            <th class="doc-api-method">${classMember ? "方法" : "函数"}</th>
                            <th class="doc-api-summary">描述</th>
                            ${hasExtends ? `<th class="doc-api-extends">继承自</th>` : ""}
                        </tr>`;
                        namespace.methods.forEach((member, key) => {
                            const summary = mdc.transpile(`${methodModifier(member)}${member.summary || ""}`);
                            const parent = hasExtends && classMember.extendedPototypes && classMember.extendedPototypes.indexOf(member) >= 0 && typeToLink(member.parent);
                            html += `<tr id="${memberAnchor(classMember, member.name)}">
                                <td>
                                    ${sourceLink(member, " doc-api-more")}
                                    <a href="javascript://详细信息" title="展开/折叠详细信息" class="doc-icon doc-api-toggle" onclick="Doc.toggleApi(this)">⮞</a>
                                    <code>${member.generator ? "*" : ""}${key}${mdc.encodeHTML(typeParameters(member.typeParameters))}<i class="doc-tip doc-api-ellipsis">${parameters(member.parameters)}</i><span class="doc-tip doc-api-more">${parameters(member.parameters, true)}:<code>${typeToLink(tsDocParser.toSimpleType(member.returnType))}</code>${member.overloads && member.overloads.length ? `(${member.overloads.length} 重载)` : ""}</span></code>
                                    <div class="doc doc-api-detail">
                                        ${method(classMember, member)}
                                        ${parent ? `<h4>继承自</h4><p><code>${parent}</code></p>` : ""}
                                    </div>
                                </td>
                                <td class="doc">
                                    ${summary}
                                </td>
                                ${hasExtends ? `<td>${parent ? `<code>${parent}</code>` : "—"}</td>` : ""}
                            </tr>`;
                        });
                        html += `</table>`;
                    }

                    html += `</div>`;

                }
            }
        }
        return html;

        function header(level, anchor, content, member) {
            toc.push({
                level: level,
                anchor: anchor,
                content: content
            });
            return `<h${level + 1} id="${anchor}"><a href="#${anchor}" title="链接" aria-hidden="true" class="doc-icon doc-permalink">☍</a>${sourceLink(member, "")}${mdc.encodeHTML(content)}</h${level + 1}>`;
        }

        function sourceLink(member, className) {
            if (!member || isExternalPath(member.sourceFile)) {
                return "";
            }
            const src = mdc.encodeHTML(digo.relativePath("components", member.sourceFile));
            return `<a href="${repository.url}/tree/${repository.branch}/components/${src}#L${member.sourceLine + 1}-${member.sourceEndLine + 1}" target="_blank" title="源码：${src}，第 ${member.sourceLine + 1} 行" aria-hidden="true" class="doc-icon doc-sourcelink${className}">⅏</a>`;
        }

        function isExternalPath(path) {
            return !digo.inDir("components", path);
        }

        function typeParameters(typeParameters) {
            return typeParameters && typeParameters.length ? `<${typeParameters.map(p => p.name).join(", ")}>` : "";
        }

        function typeParametersDetail(typeParameters) {
            let html = "";
            if (typeParameters && typeParameters.length) {
                html += `<table>
                    <tr>
                        <th>泛型参数</th>
                        <th>约束类型</th>
                        <th>默认类型</th>
                    </tr>`;
                for (const typeParameter of typeParameters) {
                    html += `<tr>
                        <td>${mdc.encodeHTML(typeParameter.name)}</td>
                        <td>${typeParameter.extends ? typeToLink(typeParameter.extends) : "—"}</td>
                        <td>${typeParameter.default ? typeToLink(typeParameter.default) : "—"}</td>
                    </tr>`;
                }
                html += `</table>`;
            }
            return html;
        }

        function parameters(parameters, full) {
            let html = `(`;
            if (parameters) {
                for (let i = 0; i < parameters.length; i++) {
                    const parameter = parameters[i];
                    if (i) {
                        html += `, `;
                    }
                    if (!full && parameter.optional) {
                        html += `...`;
                        break;
                    }
                    if (parameter.rest) {
                        html += `...`;
                    }
                    html += parameter.name;
                    if (full) {
                        if (parameter.optional && !parameter.rest) {
                            html += `?`;
                        }
                        html += `:<code>${typeToLink(tsDocParser.toSimpleType(parameter.type))}</code>`;
                    }
                }
            }
            return html + `)`;
        }

        function method(classMember, member) {
            if (member.overloads) {
                return member.overloads.map((overload, index) => method(classMember, overload)).join(`\n<hr>\n`);
            }
            return `${mdc.transpile(methodModifier(member) + (member.summary || ""))}
                ${typeParametersDetail(member.typeParameters)}
                ${member.thisType ? `<p>this：<code>${typeToLink(member.thisType)}</code></p>` : ""}
                ${member.parameters && member.parameters.length ? `<table>
                        <tr>
                            <th>参数</th>
                            <th>类型</th>
                            <th>描述</th>
                            <th>默认值</th>
                        </tr>
                        ${member.parameters.map(parameter => `<tr>
                                <td>
                                    <code>${mdc.encodeHTML(parameter.name)}${!parameter.optional ? `<span class="doc-api-required">*</span>` : ""}</code>
                                </td>
                                <td>
                                    <code>${typeToLink(parameter.type)}</code>
                                </td>
                                <td class="doc">
                                    ${mdc.transpile(parameter.summary)}
                                </td>
                                <td>
                                    ${parameter.default ? `<code>${mdc.encodeHTML(parameter.default)}</code>` : "—"}
                                </td>
                            </tr>`).join("\n")}
                    </table>` : ""}
                <h4>返回值</h4>
                <p>类型：<code>${typeToLink(member.returnType)}</code></p>
                ${mdc.transpile(member.returnSummary)}
                ${detail(classMember, member)}`;
        }

        function methodModifier(member) {
            return `${accessibility(member)}${member.abstract ? `(抽象的)` : ""}${member.async ? `(异步的)` : ""}`;
        }

        function accessibility(member) {
            return member.protected ? `(保护的)` : member.internal ? `(内部的)` : member.private ? `(私有的)` : "";
        }

        function typeToLink(type) {
            if (!type) {
                return "";
            }
            let html = "";
            for (const part of type) {
                switch (part.type) {
                    case "symbol":
                        if (part.sourceFile && !isExternalPath(part.sourceFile)) {
                            html += `<a href="${part.sourceFile === data.name ? "" : root + "/" + mdc.getOutputName(digo.relativePath(part.sourceFile))}#api/${mdc.encodeHTML(part.text)}">${mdc.encodeHTML(part.text)}</a>`;
                            break;
                        }
                    default:
                        if (part.text) {
                            html += mdc.encodeHTML(part.text);
                        }
                        break;
                }
            }
            return html;
        }

        function memberAnchor(classMember, key) {
            return "api/" + (classMember ? classMember.name + "/" + key : key);
        }

        function detail(classMember, member) {
            let html = "";
            if (member.description) {
                html += `<h4>说明</h4>${mdc.transpile(member.description)}`;
            }
            if (member.examples && member.examples.length) {
                html += `<h4>示例</h4>${member.examples.map(example => mdc.transpile(example.indexOf('```') < 0 ? "```jsx\n" + example + "\n```" : example)).join("\n")}`;
            }
            if (member.sees && member.sees.length) {
                html += `<h4>参考</h4><ul>${member.sees.map(see => `<li>${digo.isAbsoluteUrl(see) ? `<a href="${mdc.encodeHTML(see)}" target="_blank" class="doc-external">${mdc.encodeHTML(see)}</a>` : `<a href="#api/${(classMember ? mdc.toAnchor(classMember.name) + "/" : "")}${mdc.encodeHTML(mdc.toAnchor(see))}">${mdc.encodeHTML(see)}</a>`}</li>`).join("\n")}</ul>`;
            }
            return html;
        }
    }

    function parseDoc(path) {
        const tsc = get(TSC, options);
        try {
            const sourceFile = tsc.getSourceFile(path);
            const doc = tsDocParser.parseProgram(tsc.getProgram(), [sourceFile]);
            return doc.sourceFiles[0];
        } catch (e) {
            digo.error({
                fileName: path,
                error: e,
                message: "Cannot parse jsdoc: " + e.message
            });
        }
    }

    function getMeta(name, content) {
        let result;
        if (/\.html$/i.test(name)) {
            result = {
                title: getTitleFromHTML(content) || digo.getFileName(digo.getDir(name))
            }
        } else {
            result = parseMeta(content);
            if (!result.title) {
                result.title = getTitleFromMarkDown(content) || digo.getFileName(name, false);
            }
        }
        result.href = mdc.getOutputName(name).replace(/\/index\.html$/i, "/").replace(/^[^\/]+\//, "");
        return result;
    }

    function parseMeta(markdown) {
        return parseYAML(match(markdown, /^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n/, 1));
    }

    function parseYAML(content) {
        try {
            return content && yaml.safeLoad(content, {
                json: true
            }) || {};
        } catch (e) {
            return {};
        }
    }

    function getPinYin(chinsese) {
        return pinyin(chinsese.toLowerCase(), {
            heteronym: true,
            keepUnrecognized: true
        }).join(" ");
    }

    function getTitleFromMarkDown(content) {
        return match(content, /^#\s+(.*)$/m, 1);
    }

    function getTitleFromHTML(content) {
        return match(content, /<title>(.*?)<title>/i, 1);
    }

    /**
     * 创建一个 Markdown 编译器。
     * @param compilerOptions 编译的选项。
     */
    function createMarkdownCompiler(compilerOptions = {}) {
        const MarkdownIt = require("markdown-it");
        const Token = require("markdown-it/lib/token");
        const uslug = require("uslug");
        const hljs = require("highlight.js");

        hljs.configure({
            classPrefix: compilerOptions.codeClassPrefix
        });

        const taskClassPrefix = compilerOptions.taskClassPrefix || "";
        const md = new MarkdownIt({
            linkify: true,
            html: true
        })
            .use(require("markdown-it-container"))
            .use(require("markdown-it-task-checkbox"), {
                idPrefix: taskClassPrefix.replace("-", "_") + "_",
                ulClass: taskClassPrefix,
                liClass: taskClassPrefix + "-item",
            })
            .use(function removeMeta(md) {
                md.block.ruler.before("code", "meta", (state, start, end, silent) => {
                    if (start !== 0 || state.blkIndent !== 0) {
                        return false
                    }
                    if (state.tShift[start] < 0) {
                        return false
                    }
                    if (!/^---$/.test(get(state, start))) {
                        return false
                    }
                    const data = []
                    let line = start
                    while (line < end) {
                        line++
                        const str = get(state, line)
                        if (/^---$/.test(str)) {
                            break
                        }
                        if (state.tShift[line] < 0) {
                            break
                        }
                        data.push(str)
                    }
                    state.line = line + 1
                    return true
                }, {
                        alt: []
                    });

                function get(state, line) {
                    const pos = state.bMarks[line]
                    const max = state.eMarks[line]
                    return state.src.substr(pos, max - pos)
                }
            })
            .use(function blockquote(md) {
                const defaultRender = md.renderer.rules.blockquote_open || md.renderer.renderToken.bind(md.renderer);
                md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    const next = tokens[idx + 2];
                    let className = compilerOptions.blockquoteClass || "";
                    if (next && next.children && next.children[0] && next.children[0].content) {
                        next.children[0].content = next.children[0].content.replace(/^\[!\]|^\([i!]\)/, all => {
                            className += (all === "(i)" ? compilerOptions.blockquoteInfoClassPostfix : all === "(!)" ? compilerOptions.blockquoteErrorClassPostfix : compilerOptions.blockquoteWarningClassPostfix) || "";
                            return "";
                        });
                    }
                    token.attrPush(["class", (compilerOptions.contentClass || "") + className]);
                    return defaultRender(tokens, idx, options, env, self);
                };
            })
            .use(function externalLink(md) {
                const defaultRender = md.renderer.rules.href_open || md.renderer.renderToken.bind(md.renderer);
                md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    const href = token.attrGet("href");
                    if (/^https?:\/\//i.test(href)) {
                        token.attrPush(["target", "_blank"]);
                        token.attrPush(["class", compilerOptions.externalLinkClassPrefix || ""]);
                    } else {
                        const hash = env._tocNames && /^#/.test(href) && env._tocNames[decodeURIComponent(href.substr(1))];
                        if (hash) {
                            token.attrSet("href", "#" + hash);
                        }
                    }
                    return defaultRender(tokens, idx, options, env, self);
                }
            })
            .use(function relativeLink(md) {
                md.inline.ruler.push("relativeLink", (state, silent) => {
                    const match = /^\[\[(.*?)\]\]/.exec(state.src.slice(state.pos));
                    if (!match) return false;
                    state.pos += match[0].length;
                    if (silent) return true;
                    const token = state.push("relativeLink", "", 0)
                    token.content = match[1];
                    return true;
                });
                md.renderer.rules["relativeLink"] = (tokens, idx, options, env) => {
                    const data = compilerOptions.relativeLink && compilerOptions.relativeLink(tokens[idx].content, env);
                    if (data) {
                        return `<a href="${mdc.encodeHTML(data.href)}" title="${mdc.encodeHTML(data.title || "")}">${mdc.encodeHTML(data.content)}</a>`;
                    }
                    return '[[' + tokens[idx].content + ']]';
                };
            })
            .use(function listItem(md) {
                const defaultRender = md.renderer.rules.list_item_open || md.renderer.renderToken.bind(md.renderer);
                md.renderer.rules.list_item_open = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    token.attrPush(["class", compilerOptions.contentClass]);
                    return defaultRender(tokens, idx, options, env, self);
                };
            })
            .use(function paragraph(md) {
                const defaultRender = md.renderer.rules.paragraph_open || md.renderer.renderToken.bind(md.renderer);
                md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    token.attrPush(["class", compilerOptions.contentClass]);
                    return defaultRender(tokens, idx, options, env, self);
                };
            })
            .use(function htmlBlock(md) {
                const defaultRender = md.renderer.rules.html_block || md.renderer.renderToken.bind(md.renderer);
                md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
                    if (compilerOptions.html) {
                        tokens[idx].content = compilerOptions.html(tokens[idx].content, env);
                    }
                    return defaultRender(tokens, idx, options, env, self);
                };
            })
            .use(function codeBlock(md) {
                const defaultRender = md.renderer.rules.fence || md.renderer.renderToken.bind(md.renderer);
                md.renderer.rules.fence = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    const content = token.content;
                    return compilerOptions.code ? compilerOptions.code(token.info, content, env) : `<pre><code>${mdc.highlight(content, token.info)}</code></pre>`;
                };
            })
            .use(function anchorAndToc(md) {
                const defaultRender = md.renderer.render;
                md.renderer.render = function (tokens, options, env) {
                    if (env.toc) {
                        env._tocIds = env._tocIds || { __proto__: null };
                        env._tocNames = env._tocNames || { __proto__: null };

                        const toc = [];
                        let tocIdx = -1;
                        for (let i = 0; i < tokens.length; i++) {
                            const token = tokens[i];
                            if (token.type === "heading_open" && (token.tag === "h1" || token.tag === "h2" || token.tag === "h3")) {

                                if (tocIdx < 0 && token.tag === "h2") {
                                    tocIdx = i;
                                }

                                let endIdx = i + 1;
                                while (tokens[endIdx] && tokens[endIdx].type !== "heading_close") {
                                    endIdx++;
                                }

                                const contentToken = tokens[endIdx - 1];
                                if (contentToken && contentToken.type === "inline") {
                                    const content = contentToken.children.reduce((acc, t) => acc + t.content, "");

                                    // 生成唯一索引 ID。
                                    let anchor = mdc.toAnchor(content);
                                    if (env._tocIds[content]) {
                                        anchor += "-" + ++env._tocIds[content];
                                    } else {
                                        env._tocIds[content] = 1;
                                    }
                                    env._tocNames[content] = anchor;

                                    if (token.tag !== "h1") {
                                        toc.push({
                                            level: token.tag === "h2" ? 1 : 2,
                                            anchor: anchor,
                                            content: content
                                        });
                                    }
                                    token.attrPush(["id", anchor]);
                                    const anchorHtml = compilerOptions.anchor && compilerOptions.anchor(anchor, token, env);
                                    if (anchorHtml) {
                                        tokens.splice(i + 1, 0, Object.assign(new Token("html_block", "", 0), {
                                            block: true,
                                            content: anchorHtml
                                        }));
                                        endIdx++;
                                    }
                                }

                                if (env.appendHeader && token.tag === "h1") {
                                    tokens.splice(endIdx++, 0, Object.assign(new Token("html_block", "", 0), {
                                        block: true,
                                        content: env.appendHeader
                                    }));
                                }

                                i = endIdx;
                            }
                        }
                        if (env.appendToc) {
                            toc.push(...env.appendToc);
                        }
                        if ((toc.length > 2 || toc.length === 2 && toc[1].level === 1) && compilerOptions.toc) {
                            tokens.splice(tocIdx < 0 ? tokens.length : tocIdx, 0, Object.assign(new Token("html_block", "", 0), {
                                block: true,
                                content: compilerOptions.toc(toc, env)
                            }));
                        }
                    }
                    return defaultRender.call(this, tokens, options, env);
                };
            });

        const mdc = {
            transpile(content, options) {
                return content ? md.render(content, options) : "";
            },
            toAnchor: uslug,
            highlight(content, lang) {
                if (lang === "tsx" || lang === "json") lang = "jsx";
                return lang && hljs.getLanguage(lang) ? hljs.highlight(lang, content, true).value : mdc.encodeHTML(content);
            },
            encodeHTML(html) {
                return html.replace(/[&><"]/g, m => ({
                    "&": "&amp;",
                    ">": "&gt;",
                    "<": "&lt;",
                    "\"": "&quot;"
                }[m]));
            }
        };
        return mdc;
    }

}

/**
 * 获取当前仓库地址和分支信息。
 */
function Git() {
    const branch = match(digo.readFileIf(".git/HEAD").toString(), /\/([^\/]*)$/, 1).trim() || "master";
    const url = match(digo.readFileIf(".git/config").toString(), /^\s*url\s*=\s*(.+)$/m, 1) || require("./package.json").repository || "https://github.com/teal/TealUI";
    return {
        branch: branch,
        url: url.replace(/^git@(.*?)[:\/](.*?)$/i, "http://$1/$2").replace("http://github.", "https://github.").replace(/\/$/, "").replace(/\.git$/, "")
    };
}

/**
 * 匹配正则并返回指定匹配项。
 * @param input 输入的文本。
 * @param pattern 正则。
 * @param index 匹配组。
 */
function match(input, pattern, index) {
    const match = pattern.exec(input);
    return match ? match[index] : "";
}

/**
 * 渲染一个模板。
 * @param tpl 模板内容。
 * @param data 模板数据。
 */
function renderTpl(tpl, data) {
    return tpl.replace(/__(\w+)__/g, (all, field) => data[field] || "");
}

/**
 * 替换模板中的通用部分。
 * @param tpl 模板源文件。
 */
function buildTpl(tpl) {
    const package = require("./package.json");

    return tpl
        .replace(/\.\.\/\.\.\//g, "")
        .replace(/\.\.\//g, "assets/")
        .replace(/https:\/\/github.com\/Teal\/TealUI/g, get(Git).url || "$&")
        .replace(/([^\/])(TealUI)\b/g, `$1${package.displayName || package.name || "$2"}`)
        .replace(/打造小而全、精而美的开源组件库/g, package.description || "$&")
        .replace(/4\.0\.0/g, package.version || "$&")
        .replace(/xuld@vip.qq.com/g, package.author || "$&")
        .replace(/HTML5 UI Framework, 前端 UI 组件库/, package.keywords || "$&")
        .replace(/<\/body>/, `    <script>!location.port && /^http/.test(location.protocol) && (document.body.appendChild(document.createElement("script")).src = "//hm.baidu.com/hm.js?9a3cb18d91be19c36c5f9725822b64e8")</script>\n$&`);
}

/**
 * 获取项目中指定文件所在的根文件夹。
 * @param path 文件的绝对路径或相对路径。
 */
function getRootDir(path) {
    return digo.relativePath(path).replace(/\/.*$/, "");
}

/**
 * 获取文件夹的标题。
 * @param rootDir 根文件夹。
 */
function getTitle(rootDir) {
    return {
        "docs": "文档",
        "components": "组件",
        "tools": "工具"
    }[rootDir] || rootDir;
}

/**
 * 解析指定的模块名实际的文档路径。
 * @param rootDir 根文件夹。
 * @param moduleName 模块名。
 */
function resolveModuleName(rootDir, moduleName) {
    moduleName = rootDir + "/" + moduleName;
    return pick([`${moduleName}/${digo.getFileName(moduleName)}.md`, `${moduleName}.md`, `${moduleName}/index.html`]);
}

/**
 * 获取项目中指定文件的模块路径。
 * @param path 文件的绝对路径或相对路径。
 */
function getModuleName(path) {
    let result = digo.relativePath(getRootDir(path), path);
    if (/\/(package\.json|index\.html)$/i.test(result)) {
        result = result.replace(/\/(package\.json|index\.html)$/i, "");
    } else {
        result = digo.setExt(result, "").replace(/\/([^\/]+)\/\1$/i, "/$1");
    }
    return result;
}

/**
 * 获取项目中指定文件的最终文档路径。
 * @param path 文件的绝对路径或相对路径。
 */
function getOutputDocName(path) {
    let result = digo.relativePath(path);
    if (/\/(package\.json|index\.html)$/i.test(result)) {
        result = result.replace(/\/(package\.json|index\.html)$/i, "");
    } else {
        result = digo.setExt(result, ".html").replace(/\/([^\/]+)\/\1\.html$/i, "/$1");
    }
    return result;
}

/**
 * 删除未在列表中的模块名。
 * @param index 索引文件内容。
 * @param moduleNames 模块名。
 */
function cleanIndex(index, moduleNames) {
    index = index.replace(/^\s*- #*(.*)$/gm, (all, moduleName) => {
        if (moduleNames.indexOf(moduleName) < 0) {
            return "";
        }
        return all;
    }).trim();
    moduleNames.forEach(moduleName => {
        if (!inIndex(index, moduleName)) {
            index = addIndex(index, moduleName);
        }
    });
    return index;
}

/**
 * 判断索引文件中是否已包含指定的模块名。
 * @param index 索引文件内容。
 * @param moduleName 模块名。
 */
function inIndex(index, moduleName) {
    return new RegExp("^\\s*- #*" + moduleName.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "$", "m").test(index);
}

/**
 * 添加制定的模块名。
 * @param index 索引文件内容。
 * @param moduleName 要添加的模块名。
 */
function addIndex(index, moduleName) {
    return index + "\n    - " + moduleName;
}

/**
 * 从指定的路径中找到第一个存在的路径。
 * @param paths 搜索的路径列表。
 */
function pick(paths) {
    for (const path of paths) {
        if (digo.existsFile(path)) {
            return path;
        }
    }
}

/**
 * 执行指定的函数并缓存结果。
 * @param factory 要执行的函数。
 * @param options 执行的选项。
 */
function get(factory, options) {
    if (factory._instance && factory._options === options) {
        return factory._instance;
    }
    factory._options = options;
    return factory._instance = factory(options);
}
