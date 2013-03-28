using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Xuld.XFly {

    /// <summary>
    /// 通知事件类型。
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    public delegate void NotifyEventHandler(object sender, NotifyEventArgs e);

    /// <summary>
    /// 表示通知事件的参数。
    /// </summary>
    public class NotifyEventArgs :EventArgs {

        /// <summary>
        /// 获取通知事件名。
        /// </summary>
        public string Name {
            get;
            private set;
        }

        /// <summary>
        /// 初始化 <see cref="Xuld.XFly.NotifyEventArgs"/> 类的新实例。
        /// </summary>
        /// <param name="name">通知事件名。</param>
        public NotifyEventArgs(string name) {
            Name = name;
        }

    }
}
