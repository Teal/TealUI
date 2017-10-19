/**
 * @fileOverview 预加载一个图片，防止 css 刷新时因为图片加载导致的空白闪动。
 * @author xuld
 */

/**
 * 预加载一个地址的资源。
 * @param {String} [src] 图片地址。
 * @example preload("../../assets/resources/200x150.png")
 */
function preload(src) {
    new Image().src = src;
}

