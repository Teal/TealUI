/**
 * 预加载一个资源。
 * @param url 要加载的地址。
 * @return 返回图片对象。
 * @example preload("../../../assets/resources/200x150.png")
 */
export default function preload(url: string) {
    const r = new Image();
    r.src = url;
    return r;
}
