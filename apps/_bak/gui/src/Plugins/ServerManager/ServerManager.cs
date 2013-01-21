using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace Xuld.XFly.Plugins {
    public static class ServerManager {

        static NodeServer _instance = new NodeServer();

        public static void Init() {
            MessageBox.Show("Init");
        }

        public static void Start() {
            _instance.Start();
        }

        public static void Restart() {
            _instance.Restart();
        }

        public static void Stop() {
            _instance.Stop();
        }

        public static void Browser() {
            string url = Clipboard.GetText(TextDataFormat.Text);

            Browser(url);
        }

        /// <summary>
        /// 在浏览器中打开指定的 URL 。
        /// </summary>
        /// <param name="url">要打开的地址。</param>
        /// <remarks>
        /// url 空: 打开第一个主服务器。
        /// url http://localhost/: 直接打开。
        /// url E:\Path: 转成服务器路径打开。
        /// </remarks>
        public static void Browser(string url) {

            if (!Utils.IsUrl(url)) {
                if (Utils.IsPath(url)) {
                    url = _instance.ConvertToUrl(url);
                } else if (_instance.Servers.Count > 0) {
                    url = _instance.Servers[0].RootUrl;
                } else {
                    url = null;
                }
            }

            Utils.Browser(url);
        }

        public static void Explorer() {
            string path = Clipboard.GetText(TextDataFormat.Text);

            Explorer(path);
        }

        /// <summary>
        /// 在资源管理器中打开指定的文件 。
        /// </summary>
        /// <param name="path">要打开的地址。</param>
        /// <remarks>
        /// path 空: 打开第一个主服务器跟目录。
        /// path http://localhost/: 打开本地目录。
        /// path E:\Path: 直接打开。
        /// </remarks>
        public static void Explorer(string path) {

            if (!Utils.IsPath(path)) {
                if (Utils.IsUrl(path)) {
                    path = _instance.ConvertToPath(path);
                } else if (_instance.Servers.Count > 0) {
                    path = _instance.Servers[0].PhysicalPath;
                } else {
                    path = null;
                }
            }

            Utils.Explorer(path);
        }

        public static void CopyAddress() {

        }

        /// <summary>
        /// 在资源管理器中打开指定的文件 。
        /// </summary>
        /// <param name="path">要打开的地址。</param>
        /// <remarks>
        /// path 空: 打开第一个主服务器跟目录。
        /// path http://localhost/: 打开本地目录。
        /// path E:\Path: 直接打开。
        /// </remarks>
        public static void CopyAddress(string url) {

            if (!Utils.IsUrl(url)) {
                if (Utils.IsPath(url)) {
                    url = _instance.ConvertToUrl(url);
                } else if (_instance.Servers.Count > 0) {
                    url = _instance.Servers[0].RootUrl;
                } else {
                    url = null;
                }
            }

            url = new System.Text.RegularExpressions.Regex(@"(^(http://)?)[^/\\]*([/\\]|$)").Replace(url, "$1" + Utils.GetLocalIPv4Address().ToString() + "$2");

            Clipboard.SetText(url);
        }

    }
}







///// <summary>
///// 获取当前已加载的插件。如果插件被禁用，则值为 null 。
///// </summary>
//public static List<IPlugin> Plugins {
//    get;
//    private set;
//}

///// <summary>
///// 启动服务器。
///// </summary>
//public static void StartServer() {
//    if(_server == null) {
//        _server = new Server(IPAddress, Settings.Default.Port, Settings.Default.PhysicalPath, Settings.Default.VirtualPath, Settings.Default.HostName, Settings.Default.NtlmAuth, !Settings.Default.EnableDirectoryList);
//        CreateWebConfig(Settings.Default.PhysicalPath);
//    }

//    try {
//        _server.Start(Settings.Default.AutoDetectPort);
//    } catch(SocketException) {
//        MessageBox.Show("无法创建服务器 " + RootUrl + " (端口被占用?)", "UedTookit", MessageBoxButtons.OK, MessageBoxIcon.Error);




//        OpenSettingDialog();
//        return;
//    }

//    _notify.Text = "UedToolkit - " + RootUrl;

//    try {
//        if(Plugins != null) {
//            foreach(IPlugin plugin in Plugins) {
//                plugin.OnServerStarted(_server);
//            }
//        }
//    } catch (Exception e) {

//    }
//}

///// <summary>
///// 关闭服务器。
///// </summary>
//public static void StopServer() {
//    if(_server != null) {
//        _server.Stop();

//        try {
//            if(Plugins != null) {
//                foreach(IPlugin plugin in Plugins) {
//                    plugin.OnServerStopped(_server);
//                }
//            }
//        } catch {

//        }

//        _server = null;
//        GC.Collect();
//    }
//}

///// <summary>
///// 重启服务器。
///// </summary>
//public static void RestartServer() {
//    StopServer();
//    StartServer();
//}

///// <summary>
///// 在浏览器打开跟地址。
///// </summary>
//public static void RunRootUrl() {

//    string url = RootUrl;
//    if(url != null) {
//        try {
//            Process.Start(url);
//        } catch {

//        }
//    }
//}

///// <summary>
///// 在 资源管理器 浏览目录。
///// </summary>
//public static void OpenRootFile() {
//    try {
//        Process.Start(Settings.Default.PhysicalPath);
//    } catch {

//    }
//}

///// <summary>
///// 修改服务器的运行状态。
///// </summary>
//static void ToggleServer() {
//    if(IsRunning) {
//        StopServer();
//    } else {
//        StartServer();
//    }
//}

///// <summary>
///// 打开 配置 对话框。
///// </summary>
//public static void OpenSettingDialog() {
//    if (new SettingsDialog().ShowDialog() == DialogResult.OK) {
//        RestartServer();
//    }
//}
