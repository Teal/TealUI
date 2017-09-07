import { Control, VNode, bind } from "control";
import "./fileUpload.scss";

/**
 * 表示一个文件上传域。
 */
export class FileUpload extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-fileupload"></div>;
    }

}

export default FileUpload;
import { Control, VNode, bind } from "control";
import "./fileUpload.scss";

/**
 * 表示一个文件上传域。
 */
export class FileUpload extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-fileupload"></div>;
    }

}

export default FileUpload;
/**
 * @author xuld@vip.qq.com
 */

typeof include === "function" && include("../form/button");
typeof include === "function" && include("../core/base");

Control.extend({

    role: 'fileupload',

    init: function () {
        var dom = this.dom;
        dom.find('[type=file]').on('change', function () {
            var textBox = dom.next('[type=text]');
            if (!textBox.length) {
                textBox = dom.prev('[type=text]');
            }
            textBox.text(this.value);
        });
    }

});
