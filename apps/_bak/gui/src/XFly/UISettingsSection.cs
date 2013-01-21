using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace Xuld.XFly {

    /// <summary>
    /// 存储系统级别配置的节。
    /// </summary>
    public class UISettingsSection :ConfigurationSection {

        /// <summary>
        /// 获取 app 节。
        /// </summary>
        [ConfigurationProperty("app")]
        public AppConfigurationElement App {
            get {
                return (AppConfigurationElement)this["app"];
            }
        }

        /// <summary>
        /// 获取 menus 节。
        /// </summary>
        [ConfigurationProperty("menus", IsDefaultCollection = false)]
        public MenuConfigurationElementCollection Menus {
            get {
                return (MenuConfigurationElementCollection)this["menus"];
            }
        }

    }

    /// <summary>
    /// 表示存储系统属性的配置节。
    /// </summary>
    public class AppConfigurationElement :ConfigurationElement {

        /// <summary>
        /// 获取或设置启动后的操作。
        /// </summary>
        [ConfigurationProperty("oninit", IsRequired = false)]
        public string OnInit {
            get {
                return (string)this["oninit"];
            }
            set {
                this["oninit"] = value;
            }
        }

        /// <summary>
        /// 获取或设置退出后的操作。
        /// </summary>
        [ConfigurationProperty("onexit", IsRequired = false)]
        public string OnExit {
            get {
                return (string)this["onexit"];
            }
            set {
                this["onexit"] = value;
            }
        }

        /// <summary>
        /// 获取或设置当前菜单点击后的操作。
        /// </summary>
        [ConfigurationProperty("onclick", IsRequired = false)]
        public string OnClick {
            get {
                return (string)this["onclick"];
            }
            set {
                this["onclick"] = value;
            }
        }

        /// <summary>
        /// 获取或设置当前菜单点击后的操作。
        /// </summary>
        [ConfigurationProperty("onwheelclick", IsRequired = false)]
        public string OnWheelClick {
            get {
                return (string)this["onwheelclick"];
            }
            set {
                this["onwheelclick"] = value;
            }
        }

    }

    /// <summary>
    /// 表示存储菜单列表的配置节。
    /// </summary>
    public class MenuConfigurationElementCollection :ConfigurationElementCollection {

        /// <summary>
        /// 当在派生的类中重写时，创建一个新的 <see cref="T:System.Configuration.ConfigurationElement"/>。
        /// </summary>
        /// <returns>
        /// 新的 <see cref="T:System.Configuration.ConfigurationElement"/>。
        /// </returns>
        protected override ConfigurationElement CreateNewElement() {
            return new MenuConfigurationElement();
        }

        /// <summary>
        /// 在派生类中重写时获取指定配置元素的元素键。
        /// </summary>
        /// <param name="element">要为其返回键的 <see cref="T:System.Configuration.ConfigurationElement"/>。</param>
        /// <returns>
        /// 一个 <see cref="T:System.Object"/>，用作指定 <see cref="T:System.Configuration.ConfigurationElement"/> 的键。
        /// </returns>
        protected override object GetElementKey(ConfigurationElement element) {
            return element.ElementInformation;
        }

        /// <summary>
        /// 获取和设置指定位置的 <see cref="Xuld.XFly.Configuration.MenuConfigurationElement"/>。
        /// </summary>
        /// <value></value>
        public MenuConfigurationElement this[int index] {
            get {
                return (MenuConfigurationElement)BaseGet(index);
            }
        }

    }

    /// <summary>
    /// 表示存储菜单的配置节。
    /// </summary>
    public class MenuConfigurationElement :ConfigurationElement {

        /// <summary>
        /// 获取或设置当前菜单的名字。
        /// </summary>
        [ConfigurationProperty("name", IsRequired = false)]
        public string Name {
            get {
                return (string)this["name"];
            }
            set {
                this["name"] = value;
            }
        }

        ///// <summary>
        ///// 获取或设置当前菜单对应的插件。
        ///// </summary>
        //[ConfigurationProperty("plugin", IsRequired = false)]
        //public string Plugin {
        //    get {
        //        return (string)this["plugin"];
        //    }
        //    set {
        //        this["plugin"] = value;
        //    }
        //}

        ///// <summary>
        ///// 获取或设置当前菜单对应的插件。
        ///// </summary>
        //[ConfigurationProperty("type", IsRequired = false)]
        //public string Type {
        //    get {
        //        return (string)this["type"];
        //    }
        //    set {
        //        this["type"] = value;
        //    }
        //}

        /// <summary>
        /// 获取或设置当前菜单的初始化行为。
        /// </summary>
        [ConfigurationProperty("oninit", IsRequired = false)]
        public string OnInit {
            get {
                return (string)this["oninit"];
            }
            set {
                this["oninit"] = value;
            }
        }

        /// <summary>
        /// 获取或设置当前菜单点击后的操作。
        /// </summary>
        [ConfigurationProperty("onclick", IsRequired = false)]
        public string OnClick {
            get {
                return (string)this["onclick"];
            }
            set {
                this["onclick"] = value;
            }
        }

        /// <summary>
        /// 获取或设置当前菜单的快捷键。
        /// </summary>
        [ConfigurationProperty("shortcut", IsRequired = false)]
        public string Shortcut {
            get {
                return (string)this["shortcut"];
            }
            set {
                this["shortcut"] = value;
            }
        }

        /// <summary>
        /// 获取或设置当前菜单是否为默认项。
        /// </summary>
        [ConfigurationProperty("defaultitem", IsRequired = false)]
        public bool DefaultItem {
            get {
                return (bool)this["defaultitem"];
            }
            set {
                this["defaultitem"] = value;
            }
        }

        /// <summary>
        /// 获取或设置当前菜单的标题。
        /// </summary>
        [ConfigurationProperty("title", IsRequired = false)]
        public string Title {
            get {
                return (string)this["title"];
            }
            set {
                this["title"] = value;
            }
        }

        /// <summary>
        /// 指示当前菜单是否隐藏。
        /// </summary>
        [ConfigurationProperty("visible", IsRequired = false, DefaultValue = true)]
        public bool Visible {
            get {
                return (bool)this["visible"];
            }
            set {
                this["visible"] = value;
            }
        }

    }

}
