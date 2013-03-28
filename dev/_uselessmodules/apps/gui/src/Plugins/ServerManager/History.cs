//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using Xuld.UedToolkit;
//using System.Windows.Forms;
//using Xuld.UedToolkit.UI;
//using Xuld.UedToolkit.HttpServer;
//using System.Diagnostics;
//using System.IO;

//namespace UedToolkit.Plugin.History {
//    public class Plugin: IPlugin {

//        const int MAX = 20;

//        MenuItem _menu;

//        LinkedList<string> _histroyUrls = new LinkedList<string>();

//        LinkedList<string> _histroyFolders = new LinkedList<string>();

//        public Plugin() {
//            _menu = SystemManager.CreateMenuItem("历史(&H)");
//            _menu.Popup += new EventHandler(_menu_Popup);
//            _menu.MenuItems.Add("(无)");
//        }

//        void _menu_Popup(object sender, EventArgs e) {

//            _menu.MenuItems.Clear();

//            bool hasHistroy = _histroyUrls.First != null;

//            bool hasFolder = _histroyFolders.First != null;

//            if(hasHistroy) {
//                foreach(string url in _histroyUrls) {
//                    _menu.MenuItems.Add(url, OnClick);
//                }
//            }


//            if(hasFolder) {
//                if(hasHistroy) {
//                    _menu.MenuItems.Add("-");
//                }

//                foreach(string url in _histroyFolders) {
//                    _menu.MenuItems.Add(url, OnClick);
//                }
//            }

//            if(hasHistroy || hasFolder) {
//                _menu.MenuItems.Add("-");
//                _menu.MenuItems.Add("清空历史记录(&C)", Clear);
//            } else {
//                _menu.MenuItems.Add("(无)");
//            }

//        }

//        public void OnServerStarted(Xuld.UedToolkit.HttpServer.Server server) {
//            server.RequestRecieved += server_RequestRecieved;
//            AddUrlHistory(server.RootUrl);
//        }

//        public void Clear(object sender, EventArgs e) {
//            _histroyUrls.Clear();
//            _histroyFolders.Clear();
//        }

//        public void AddUrlHistory(string url) {
//            url = System.Web.HttpUtility.UrlDecode(url);

//            url = url.Replace('\\', '/');

//            _histroyUrls.Remove(url);
//            if(_histroyUrls.Count >= MAX) {
//                _histroyUrls.RemoveFirst();
//            }
//            _histroyUrls.AddLast(url);

//        }

//        public void AddFolderHistory(string url) {
//            url = System.Web.HttpUtility.UrlDecode(url);

//            url = url.Replace('/', '\\');

//            _histroyFolders.Remove(url);
//            if(_histroyFolders.Count >= MAX) {
//                _histroyFolders.RemoveFirst();
//            }
//            _histroyFolders.AddLast(url);

//        }

//        void server_RequestRecieved(object sender, RequestEventArgs e) {
//            Server s = (Server)sender;
//            switch(Path.GetExtension(e.PathTranslated)){
//                case ".html":
//                case ".htm":
//                case ".asp":
//                case ".aspx":
//                    AddUrlHistory(s.RootUrl + e.RawUrl.Substring(1));
//                    AddFolderHistory(Path.GetDirectoryName(e.PathTranslated));
//                    break;

//                case "":
//                    AddFolderHistory(e.PathTranslated.TrimEnd('/', '\\'));
//                    break;

//                default:
//                    AddFolderHistory(Path.GetDirectoryName(e.PathTranslated));
//                    break;

//            }
            
//        }

//        void OnClick(object sender, EventArgs e) {
//            try {
//                Process.Start(((MenuItem)sender).Text);
//            } catch {

//            }
//        }

//        public void OnServerStopped(Xuld.UedToolkit.HttpServer.Server server) {
//            server.RequestRecieved -= server_RequestRecieved;

//        }
//    }

//}
