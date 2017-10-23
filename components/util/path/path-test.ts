import * as assert from "assert";
import * as path from "./path";

export function isAbsoluteTest() {
    assert.equal(path.isAbsolute("/"), true);
    assert.equal(path.isAbsolute("directory/directory"), false);
    assert.equal(path.isAbsolute("directory\directory"), false);
    assert.equal(path.isAbsolute("/home/foo"), true);
    assert.equal(path.isAbsolute("/home/foo/.."), true);
    assert.equal(path.isAbsolute("bar/"), false);
    assert.equal(path.isAbsolute("./baz"), false);
}

export function resolveTest() {
    assert.equal(path.resolve(""), "");
    assert.equal(path.resolve("."), "");
    assert.equal(path.resolve("goo/.."), "");
    assert.equal(path.resolve(".foo"), ".foo");
    assert.equal(path.resolve("foo"), "foo");
    assert.equal(path.resolve("goo/../foo/goo.txt"), "foo/goo.txt");

    assert.equal(path.resolve("./"), "");
    assert.equal(path.resolve("goo/../"), "");
    assert.equal(path.resolve(".foo/"), ".foo");
    assert.equal(path.resolve("foo/"), "foo");
    assert.equal(path.resolve("goo/../foo/goo.txt/"), "foo/goo.txt");

    assert.equal(path.resolve("", ""), "");
    assert.equal(path.resolve("", "."), "");
    assert.equal(path.resolve("", "goo/.."), "");
    assert.equal(path.resolve("", ".foo"), ".foo");
    assert.equal(path.resolve("", "foo"), "foo");
    assert.equal(path.resolve("", "goo/../foo/goo.txt"), "foo/goo.txt");

    assert.equal(path.resolve(".", ""), "");
    assert.equal(path.resolve(".", "."), "");
    assert.equal(path.resolve(".", "goo/.."), "");
    assert.equal(path.resolve(".", ".foo"), ".foo");
    assert.equal(path.resolve(".", "foo"), "foo");
    assert.equal(path.resolve(".", "goo/../foo/goo.txt"), "foo/goo.txt");

    assert.equal(path.resolve("./", ""), "");
    assert.equal(path.resolve("./", "."), "");
    assert.equal(path.resolve("./", "goo/.."), "");
    assert.equal(path.resolve("./", ".foo"), ".foo");
    assert.equal(path.resolve("./", "foo"), "foo");
    assert.equal(path.resolve("./", "goo/../foo/goo.txt"), "foo/goo.txt");

    assert.equal(path.resolve("foo", ""), "foo");
    assert.equal(path.resolve("foo", "."), "foo");
    assert.equal(path.resolve("foo", ".."), "");
    assert.equal(path.resolve("foo", ".goo"), "foo/.goo");
    assert.equal(path.resolve("foo", "goo"), "foo/goo");
    assert.equal(path.resolve("foo", "../goo/hoo.txt"), "goo/hoo.txt");

    assert.equal(path.resolve("foo/", ""), "foo");
    assert.equal(path.resolve("foo/", "."), "foo");
    assert.equal(path.resolve("foo/", ".."), "");
    assert.equal(path.resolve("foo/", ".goo"), "foo/.goo");
    assert.equal(path.resolve("foo/", "goo"), "foo/goo");
    assert.equal(path.resolve("foo/", "../goo/hoo.txt"), "goo/hoo.txt");

    assert.equal(path.resolve("goo/../foo/goo", "../hoo/koo"), "foo/hoo/koo");
    assert.equal(path.resolve("goo/../foo/goo/", "../hoo/koo/"), "foo/hoo/koo");
    assert.equal(path.resolve("goo/../foo/goo.txt", "../hoo/koo.txt"), "foo/hoo/koo.txt");
}

export function relativeTest() {
    assert.equal(path.relative("", ""), "");
    assert.equal(path.relative("", "."), "");
    assert.equal(path.relative("", ".."), "..");
    assert.equal(path.relative("", ".foo"), ".foo");
    assert.equal(path.relative("", "foo"), "foo");
    assert.equal(path.relative("", "../foo/goo.txt"), "../foo/goo.txt");

    assert.equal(path.relative(".", ""), "");
    assert.equal(path.relative(".", "."), "");
    assert.equal(path.relative(".", ".."), "..");
    assert.equal(path.relative(".", ".foo"), ".foo");
    assert.equal(path.relative(".", "foo"), "foo");
    assert.equal(path.relative(".", "../foo/goo.txt"), "../foo/goo.txt");

    assert.equal(path.relative(".", ""), "");
    assert.equal(path.relative(".", "./"), "");
    assert.equal(path.relative(".", "../"), "..");
    assert.equal(path.relative(".", ".foo/"), ".foo");
    assert.equal(path.relative(".", "foo/"), "foo");
    assert.equal(path.relative(".", "../foo/goo.txt/"), "../foo/goo.txt");

    assert.equal(path.relative("./", ""), "");
    assert.equal(path.relative("./", "./"), "");
    assert.equal(path.relative("./", "../"), "..");
    assert.equal(path.relative("./", ".foo/"), ".foo");
    assert.equal(path.relative("./", "foo/"), "foo");
    assert.equal(path.relative("./", "../foo/goo.txt/"), "../foo/goo.txt");

    assert.equal(path.relative("foo", "foo"), "");
    assert.equal(path.relative("foo", "foo2"), "../foo2");
    assert.equal(path.relative("foo", "../foo/goo"), "../../foo/goo");
    assert.equal(path.relative("foo/goo", "foo/goo"), "");
    assert.equal(path.relative("foo/goo", "foo/goo/hoo/koo.txt"), "hoo/koo.txt");

    assert.equal(path.relative("foo/", "foo"), "");
    assert.equal(path.relative("foo/", "foo2"), "../foo2");
    assert.equal(path.relative("foo/", "../foo/goo"), "../../foo/goo");
    assert.equal(path.relative("foo/goo/", "foo/goo"), "");
    assert.equal(path.relative("foo/goo/", "foo/goo/hoo/koo.txt"), "hoo/koo.txt");

    assert.equal(path.relative("foo/", "foo/"), "");
    assert.equal(path.relative("foo/", "foo2/"), "../foo2");
    assert.equal(path.relative("foo/", "../foo/goo/"), "../../foo/goo");
    assert.equal(path.relative("foo/goo/", "foo/goo/"), "");
    assert.equal(path.relative("foo/goo/", "foo/goo/hoo/koo.txt/"), "hoo/koo.txt");
}

export function normalizeTest() {
    assert.equal(path.normalize(""), ".");
    assert.equal(path.normalize("."), ".");
    assert.equal(path.normalize("./"), "./");
    assert.equal(path.normalize(".foo"), ".foo");
    assert.equal(path.normalize(".."), "..");
    assert.equal(path.normalize("../"), "../");
    assert.equal(path.normalize("foo.js"), "foo.js");
    assert.equal(path.normalize("./foo.js"), "foo.js");
    assert.equal(path.normalize("/foo.js"), "/foo.js");
    assert.equal(path.normalize("foo/../goo.js"), "goo.js");
    assert.equal(path.normalize("/foo/../goo.js"), "/goo.js");
    assert.equal(path.normalize("**/*.js"), "**/*.js");
    assert.equal(path.normalize("./**/*.js"), "**/*.js");
    assert.equal(path.normalize("./fixtures///d/../b/c.js"), "fixtures/b/c.js");
    assert.equal(path.normalize("/foo/../../../bar"), "/bar");
    assert.equal(path.normalize("foo//goo//../koo"), "foo/koo");
    assert.equal(path.normalize("foo//goo//./koo"), "foo/goo/koo");
    assert.equal(path.normalize("foo//goo//."), "foo/goo");
    assert.equal(path.normalize("foo//goo//.//"), "foo/goo/");
    assert.equal(path.normalize("/a/b/c/../../../x/y/z"), "/x/y/z");
    assert.equal(path.normalize("a/b/c/../../../x/y/z"), "x/y/z");
}

export function dirnameTest() {
    assert.equal(path.dirname("."), ".");
    assert.equal(path.dirname("foo.txt"), ".");
    assert.equal(path.dirname(".foo"), ".");
    assert.equal(path.dirname(".foo/"), ".");
    assert.equal(path.dirname("foo/goo.txt"), "foo");
    assert.equal(path.dirname("../goo.txt"), "..");
    assert.equal(path.dirname("/user/root/foo.txt"), "/user/root");
    assert.equal(path.dirname("/user/root/foo"), "/user/root");
    assert.equal(path.dirname("/user/root/foo/"), "/user/root");
}

export function basenameTest() {
    assert.equal(path.basename("/user/root/foo.txt"), "foo.txt");
    assert.equal(path.basename("/user/root/foo.min.js"), "foo.min.js");
    assert.equal(path.basename("/user/root/foo"), "foo");
    assert.equal(path.basename("/user/root/foo/"), "foo");
    assert.equal(path.basename(""), "");
    assert.equal(path.basename("."), ".");
    assert.equal(path.basename(".."), "..");
    assert.equal(path.basename(".foo"), ".foo");
}

export function extnameTest() {
    assert.equal(path.extname("/user/root/foo"), "");
    assert.equal(path.extname("/user/root/foo.txt"), ".txt");
    assert.equal(path.extname("/user/root/foo.min.js"), ".js");
    assert.equal(path.extname("/user/root/.foo"), "");
    assert.equal(path.extname("/user/root/.foo/"), "");
}
