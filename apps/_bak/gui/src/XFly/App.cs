using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Windows.Forms;

namespace Xuld.XFly {

    /// <summary>
    /// 管理系统所有资源的类。
    /// </summary>
    public static class App {

        #region 类型操作

        static Dictionary<string, Type> _types = new Dictionary<string, Type>();

        //static Dictionary<string, object> _instances = new Dictionary<string, object>();

        static Type GetType(string type) {
            Type o;
            if (_types.TryGetValue(type, out o)) {
                return o;
            }

            _types[type] = o = Type.GetType(type, true, true);
            return o;
        }

        //static object GetInstance(string type) {
        //    object o;
        //    if (_instances.TryGetValue(type, out o)) {
        //        return o;
        //    }

        //    _instances[type] = o = Activator.CreateInstance(GetType(type));
        //    return o;
        //}

        static void InvokeMethod(string methodAndType) {
            if (methodAndType == null || methodAndType.Length == 0)
                return;

            if (methodAndType.IndexOf(':') > 0) {
                Process.Start(methodAndType);
                return;
            }

            if (methodAndType[0] == '.') {
                Process.Start(Path.Combine(Path.GetDirectoryName(Application.ExecutablePath), methodAndType));
                return;
            }

            int at = methodAndType.IndexOf('@');

            string m;
            Type t;
            if (at < 0) {
                m = methodAndType;
                t = typeof(App);
            } else {
                m = methodAndType.Substring(0, at);
                t = GetType(methodAndType.Substring(at + 1));
            }

            t.InvokeMember(m, BindingFlags.InvokeMethod, null, null, null);
        }

        static void InvokeMethodAndRethrow(string methodAndType) {
            try {
                InvokeMethod(methodAndType);
            } catch (System.Reflection.TargetInvocationException ex) {
                throw new Exception("执行命令 \"" + methodAndType + "\" 出现错误:\r\n\t" + ex.InnerException.Message);
            } catch (Exception e3) {
                throw new Exception("执行命令 \"" + methodAndType + "\" 出现错误:\r\n\t" + e3.Message);
            }
        }

        static void TryInvokeMethod(string methodAndType) {
            try {
                InvokeMethod(methodAndType);
            } catch (System.Reflection.TargetInvocationException ex) {
                MessageBox.Show("执行命令 \"" + methodAndType + "\" 出现错误:\r\n\t" + ex.InnerException.Message, "执行命令错误 - XFly", MessageBoxButtons.OK, MessageBoxIcon.Error);
            } catch (Exception e) {
                MessageBox.Show("执行命令 \"" + methodAndType + "\" 出现错误:\r\n\t" + e.Message, "执行命令错误 - XFly", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        #endregion

        #region 私有方法

        const string MessageBoxTitle = "初始化 XFly 出现异常";

        static void Init() {
            InitNotifyIcon();
            LoadSettings();

            if (Inited != null) {
                Inited(null, EventArgs.Empty);
            }
        }

        static void InitNotifyIcon() {
            NotifyIcon = new NotifyIcon();
            NotifyIcon.Icon = Properties.Resources.XFly;
            NotifyIcon.Text = "XFly 3.0 by xuld";
            NotifyIcon.Visible = true;
            NotifyIcon.ContextMenu = new ContextMenu();
        }

        /// <summary>
        /// 重新加载当前应用程序的插件。
        /// </summary>
        static void LoadSettings() {

            UISettingsSection setting = (UISettingsSection)System.Configuration.ConfigurationManager.GetSection("uiSettings");

            if (setting != null) {

                if (setting.Menus != null) {

                    string s = null;

                    foreach (MenuConfigurationElement menu in setting.Menus) {
                        try {
                            LoadMenuConfigurationElement(menu);
                        } catch (Exception e) {
                            s += "\t" + (menu.Name ?? menu.OnInit) + ": " + e.Message + "(行 " + menu.ElementInformation.LineNumber + ")\r\n\r\n";
                        }
                    }

                    if (s != null) {
                        MessageBox.Show("无法加载下列插件:\r\n\r\n" + s, MessageBoxTitle, MessageBoxButtons.OK, MessageBoxIcon.Exclamation);
                    }

                }

                if (setting.App != null) {

                    NotifyIcon.Tag = setting.App;

                    NotifyIcon.MouseClick += OnNotifyIconClick;

                    if (setting.App.OnExit.Length > 0) {
                        Exit += OnExit;
                    }

                    InvokeMethodAndRethrow(setting.App.OnInit);

                }

            }
            

        }

        static void LoadMenuConfigurationElement(MenuConfigurationElement menu) {

            // 执行 OnInit 。
            InvokeMethodAndRethrow(menu.OnInit);

            // 如果存在了 Name 属性，则添加默认菜单。
            if (menu.Name.Length > 0) {

                MenuItem o = CreateMenuItem(menu.Name);
                o.Tag = menu;
                o.Visible = menu.Visible;

                // 绑定 OnClick
                if (menu.OnClick.Length > 0) {
                    o.Click += OnMenuClick;
                }

                o.DefaultItem = menu.DefaultItem;
            }
        }

        static void OnNotifyIconClick(object sender, MouseEventArgs e) {

            NotifyIcon icon = (NotifyIcon)sender;
            AppConfigurationElement app = (AppConfigurationElement)icon.Tag;

            switch (e.Button) {
                case MouseButtons.Left:
                    TryInvokeMethod(app.OnClick);
                    break;

                case MouseButtons.Middle:
                    TryInvokeMethod(app.OnWheelClick);
                    break;

            }

        }

        static void OnExit(object sender, EventArgs e) {
            AppConfigurationElement app = (AppConfigurationElement)NotifyIcon.Tag;

            TryInvokeMethod(app.OnExit);
        }

        static void OnMenuClick(object sender, EventArgs e) {
            MenuItem o = (MenuItem)sender;
            MenuConfigurationElement info = (MenuConfigurationElement)o.Tag;

            TryInvokeMethod(info.OnClick);

        }

        #endregion

        #region 接口

        /// <summary>
        /// 获取当前正在使用的 <see cref="NotifyIcon"/> 对象。
        /// </summary>
        public static NotifyIcon NotifyIcon {
            get;
            private set;
        }

        /// <summary>
        /// 用于插件之间互相通信的事件。
        /// </summary>
        public static event NotifyEventHandler Notified;

        /// <summary>
        /// 插件初始化的事件。
        /// </summary>
        public static event EventHandler Inited;

        /// <summary>
        /// 程序退出的事件。
        /// </summary>
        public static event EventHandler Exit {
            add {
                Application.ApplicationExit += value;
            }
            remove {
                Application.ApplicationExit += value;
            }
        }

        /// <summary>
        /// 用于插件通知其它插件信息。
        /// </summary>
        /// <param name="sender">插件源。</param>
        /// <param name="e">事件对象。</param>
        public static void Notify(object sender, NotifyEventArgs e) {
            if (Notified != null) {
                Notified(sender, e);
            }
        }

        /// <summary>
        /// 创建并返回新的菜单。
        /// </summary>
        /// <param name="text">菜单内显示的文字。</param>
        /// <returns>新的 <see cref="MenuItem"/> 实例。</returns>
        public static MenuItem CreateMenuItem(string text) {
            return NotifyIcon.ContextMenu.MenuItems.Add(text);
        }

        /// <summary>
        /// 关闭服务器。
        /// </summary>
        public static void Close() {
            NotifyIcon.Visible = false;
            Application.Exit();
        }

        /// <summary>
        /// 向用户展示帮助内容。
        /// </summary>
        public static void Help() {
            try {
                Process.Start("http://work.xuld.net/xfly");
            } catch {

            }
        }

        #endregion

        /// <summary>
        /// 执行消息循环。
        /// </summary>
        internal static void Run(string[] args) {

            try {
                Init();
            } catch (Exception e) {
                MessageBox.Show(e.Message + "\r\n请检查配置文件是否正确。", MessageBoxTitle, MessageBoxButtons.OK, MessageBoxIcon.Error, MessageBoxDefaultButton.Button1);
                return;
            }
        
            Application.Run();

        }

    }
}
