/**
 * 预加载一个地址的资源。
 * @param url 图片地址。
 * @example preload("../../../assets/resources/200x150.png")
 */
function preload(url: string) {
    new Image().src = url;
}
