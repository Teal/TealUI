var assert = require("assert");
var ts = require("../lib/tscript.js");

describe('文档解析', function () {

    describe('类型解析', function () {
        it('内置类型', function () {
            //assert.equal(compileDocForTypeName("void"), "void");
            //assert.equal(compileDocForTypeName("string"), "string");
            //assert.equal(compileDocForTypeName("number"), "number");
            //assert.equal(compileDocForTypeName("boolean"), "boolean");
            //assert.equal(compileDocForTypeName("any"), "any");
            //assert.equal(compileDocForTypeName("*"), "any");
            assert.equal(compileDocForTypeName("this"), "this");
        });

        function compileDocForTypeName(typeCode) {
            var comment = compileDoc(`/**
                                       * @return {${typeCode}}
                                       */
                                       function main(){ }`);
            return comment.returns.type;
        }

    })

    function compileDoc(code) {
        var r = compile(code);
        return r.jsDocs["test-input.ts"].comments[0];
    }

});

function compile(code) {
    return ts.transpileModuleWithDoc(code, {
        compilerOptions: {
            allowNonTsExtensions: true,
            jsx: 2,
            includedExports: "a,c",
            doc: true,
            noLib: false,
            noImplicitUseStrict: true
        },
        fileName: "test-input.ts",
        reportDiagnostics: true
    });
}
