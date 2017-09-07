import * as assert from "assert";
import * as currency from "./currency";

export function addTest() {
    assert.strictEqual(currency.add(86.24, 0.1), 86.34);
}

export function subTest() {
    assert.strictEqual(currency.sub(7, 0.8), 6.2);
}

export function mulTest() {
    assert.strictEqual(currency.mul(7, 0.8), 5.6);
}

export function divTest() {
    assert.strictEqual(currency.div(7, 0.8), 8.75);
}

export function roundTest() {
    assert.strictEqual(currency.round(86.245), 86.25);
}

export function formatTest() {
    assert.strictEqual(currency.format(86234.245), "86,234.25");
}
