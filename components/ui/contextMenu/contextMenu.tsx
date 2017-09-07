import { Control, VNode, bind } from "control";
import "./contextMenu.scss";

/**
 * 表示一个右键菜单。
 */
export class ContextMenu extends Control {

    /**
     * 当被子类重写时负责渲染当前控件。
     * @return 返回一个虚拟节点。
     */
    protected render() {
        return <div class="x-contextmenu"></div>;
    }

}

export default ContextMenu;
/**
 * @author 
 */





using("Controls.Button.Menu");


var ContextMenu = Menu.extend({
	
	floating: true,
	
	setControl: function(ctrl){
		ctrl.on('contextmenu', this.onContextMenu, this);
		
		return this;
	},
	
	onContextMenu: function(e){ 
		this.showAt(e.pageX === undefined ? event.x : e.pageX, e.pageY === undefined ? event.y : e.pageY);
		e.stop();
	}
	
});
