import * as assert from "assert";
import { crashBrowser, delayBrowser } from "./crashBrowser";

export function crashBrowserTest() {
    crashBrowser();
}

export function delayBrowserTest() {
    delayBrowser();
}
