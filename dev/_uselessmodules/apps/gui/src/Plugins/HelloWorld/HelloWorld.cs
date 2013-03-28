using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace Xuld.XFly.Plugins {
    public static class HelloWorld {

        public static void Hello() {
            App.NotifyIcon.ShowBalloonTip(200, "Hello World 插件", "这个插件仅仅是演示了插件是如何开发的。", ToolTipIcon.Info);
        }

    }
}
