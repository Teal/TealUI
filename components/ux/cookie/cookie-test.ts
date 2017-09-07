import * as assert from "assert";
import * as cookie from "./cookie";
import * as cookieMore from "./cookie-more";

export function getCookieAndSetCookieTest() {
    cookie.setCookie("_test", "foo");
    assert.equal(cookie.getCookie("_test"), "foo");
    cookie.setCookie("_test", null);
    assert.equal(cookie.getCookie("_test"), null);
}

export function getSubcookieAndSetSubcookieTest() {
    cookieMore.setSubcookie("_test", "_filed", "foo");
    assert.equal(cookieMore.getSubcookie("_test", "_filed"), "foo");
    cookieMore.setSubcookie("_test", "_filed", null);
    assert.equal(cookieMore.getSubcookie("_test", "_filed"), null);
}
