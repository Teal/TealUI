using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Diagnostics;
using System.IO;

namespace Xuld.XFly.Plugins {

    /// <summary>
    /// 系统辅助函数。
    /// </summary>
    public static class Utils {

        /// <summary>
        /// 获取本地的 IP 地址列表。
        /// </summary>
        /// <returns>IP 地址列表。</returns>
        public static IPAddress[] GetLocalAddresses() {
            string strHostName = Dns.GetHostName();
            IPHostEntry ipEntry = Dns.GetHostEntry(strHostName);
            return ipEntry.AddressList;
        }

        /// <summary>
        /// 获取本地的 IP 地址列表。
        /// </summary>
        /// <returns>IP 地址列表。</returns>
        public static IPAddress GetLocalIPv4Address() {
            IPAddress[] addresses = GetLocalAddresses();
            foreach (IPAddress address in addresses) {
                if (address.AddressFamily == AddressFamily.InterNetwork) {
                    return address;
                }
            }
            return IPAddress.Any;
        }

        /// <summary>
        /// 获取本地的 IP 地址列表。
        /// </summary>
        /// <returns>IP 地址列表。</returns>
        public static IPAddress GetLocalIPv6Address() {
            IPAddress[] addresses = GetLocalAddresses();
            foreach (IPAddress address in addresses) {
                if (address.AddressFamily == AddressFamily.InterNetworkV6) {
                    return address;
                }
            }
            return IPAddress.IPv6Any;
        }

        /// <summary>
        /// 获取当前服务器是否为开机启动的配置。
        /// </summary>
        /// <returns></returns>
        public static bool GetRunOnStart() {
            const string s = @"HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Run";
            const string name = "UedToolkit";
            string filePath = Application.ExecutablePath;
            try {
                return Registry.GetValue(s, name, null) != null;

            } catch (UnauthorizedAccessException) {
                return false;
            }
        }

        /// <summary>
        /// 设置一个软件在 Windows 启动后自动执行。
        /// </summary>
        /// <param name="set">仅当值为true， 设置启动</param>
        public static bool SetRunOnStart(bool set = true) {
            const string s = @"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run";
            const string name = "UedToolkit";
            string filePath = Application.ExecutablePath;
            try {
                if (set)
                    Registry.SetValue(s, name, filePath, RegistryValueKind.String);
                else {
                    using (RegistryKey d = Registry.CurrentUser.OpenSubKey(s, true)) {
                        if (d != null)
                            d.DeleteValue(name, false);
                    }
                }

                return true;
            } catch (UnauthorizedAccessException) {
                if (MessageBox.Show("无法修改开机启动选项，操作被安全软件阻止。是否重试?", "UedTookit", MessageBoxButtons.RetryCancel, MessageBoxIcon.Error, MessageBoxDefaultButton.Button2) == DialogResult.Retry) {
                    SetRunOnStart(set);
                }

                return false;
            }
        }

        public static bool IsUrl(string value) {

            if (value != null && value.StartsWith("http://", StringComparison.OrdinalIgnoreCase)) {
                return true;
            }


            return false;
        }

        public static bool IsPath(string value) {
            if (value != null && value.IndexOf(':') >= 0) {
                return true;
            }


            return false;
        }

        public static void Browser(string url) {
            if (!String.IsNullOrEmpty(url)) {

                if (String.IsNullOrEmpty(Settings.Default.DefaultBrowser)) {
                    Process.Start(url);
                } else {
                    Process.Start(Settings.Default.DefaultBrowser, url);
                }
            }
        }

        public static void Explorer(string value) {
            if (!String.IsNullOrEmpty(value)) {

                if (Directory.Exists(value)) {
                    Process.Start(value);
                } else if (File.Exists(value)) {
                    Process.Start("explorer", "/s " + value);
                }
            }
        }

        public static bool PathContains(string parentPath, string childPath) {
            if (parentPath.Length > childPath.Length) {
                return false;
            }

            for (int i = 0; i < parentPath.Length; i++) {
                if (char.ToLowerInvariant(parentPath[i]) != char.ToLowerInvariant(childPath[i]) && (parentPath[i] != '/' || childPath[i] != '\\') && (parentPath[i] != '\\' || childPath[i] != '/')) {
                    return false;
                }
            }

            return true;
        }
    }
}
