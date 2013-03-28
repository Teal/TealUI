using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.IO;

namespace Xuld.XFly.Plugins {

    /// <summary>
    /// 表示一个服务器。
    /// </summary>
    public class NodeServer {

        Process _nodeProcess;

        List<ServerInfo> _servers = new List<ServerInfo>();

        public List<ServerInfo> Servers {
            get {
                return _servers;
            }
        }

        public void Start() {

            if (_nodeProcess == null) {

                string rootPath = Path.GetDirectoryName(typeof(NodeServer).Assembly.Location);
                var startInfo = new ProcessStartInfo();

                startInfo.FileName = Path.GetFullPath(Path.Combine(rootPath, Settings.Default.NodeExe));
                startInfo.Arguments = Path.GetFullPath(Path.Combine(rootPath, Settings.Default.StartJs));
                startInfo.WorkingDirectory = Path.GetFullPath(Path.Combine(rootPath, Settings.Default.Directory));

                startInfo.UseShellExecute = false;
                startInfo.WindowStyle = ProcessWindowStyle.Hidden;
                startInfo.CreateNoWindow = true;
               // startInfo.RedirectStandardOutput = true;

                _nodeProcess = Process.Start(startInfo);

            } else {
                _nodeProcess.Start();
            }
        }

        public bool IsRunning {
            get {
                return _nodeProcess != null && !_nodeProcess.HasExited;
            }
        }

        public void Stop() {
            if(IsRunning)
                _nodeProcess.Kill();
        }

        public void Restart() {
            Stop();
            Start();

        }

        public string ConvertToUrl(string path) {
            foreach(ServerInfo s in _servers){
                if (Utils.PathContains(s.PhysicalPath, path)) {
                    path = path.Substring(s.PhysicalPath.Length);
                    return s.RootUrl + path;
                }
            }

            return null;
        }

        public string ConvertToPath(string url) {
            url = url.Replace(":80", String.Empty);
            foreach (ServerInfo s in _servers) {
                if (Utils.PathContains(s.RootUrl, url)) {
                    url = url.Substring(s.RootUrl.Length);
                    return s.PhysicalPath + url;
                }
            }

            return null;
        }

    }

    public sealed class ServerInfo {

        public string Host {
            get;
            set;
        }

        public int Port {
            get;
            set;
        }

        public string RootUrl {
            get;
            set;
        }

        public string PhysicalPath {
            get;
            set;
        }

    }

}
