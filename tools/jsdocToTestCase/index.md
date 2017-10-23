# 从 JSDoc 提取测试用例

<textarea id="input" placeholder="输入代码" style="height: 14rem"></textarea>
<button onclick="output.value = jsdocToTestCase(input.value)">提取</button>
<textarea rows="20" id="output" style="height: 14rem"></textarea>
<script>
    function jsdocToTestCase(code, prefix = "") {
        let result = "";

        code.replace(/\/\*\*([\s\S]*?)\*\//g, (all, jsdoc, index) => {
            const nextLine = (/\s*.*/.exec(code.substring(index + all.length)) || [""])[0];
            const funcName = (/(\S*?)[(<]/.exec(nextLine) || ["", ""])[1];

            if (funcName) {
                result += `export function ${funcName}Test() {\n`;
            }

            jsdoc.replace(/@example\s(.*)/g, function (_, example) {
                const p = example.indexOf('//');
                const actual = p >= 0 ? example.substr(0, p).trim() : example.trim();
                const expected = p >= 0 ? example.substr(p + 2).trim() : "";

                result += `\tassert.${/^[[{]/.test(expected) ? "deepEqual" : "strictEqual" }(${prefix}${actual.replace(/;$/, "")}, ${expected});\n`;
            });
            
            if (funcName) {
                result += `}\n\n`;
            }
        });

        return result;
    }
</script>