using System;
using System.Windows.Forms;
using System.Threading;

namespace Xuld.XFly {
    static class Program {
        /// <summary>
        /// 应用程序的主入口点。
        /// </summary>
        [STAThread]
        static void Main(string[] args) {

            if(args.Length == 0) {

                try {

                    Mutex.OpenExisting("XFlyByXULD");

                    return;
                } catch {

                    new Mutex(true, "XFlyByXULD");

                }


            }


            Application.EnableVisualStyles();
            App.Run(args);
        }
    }
}
