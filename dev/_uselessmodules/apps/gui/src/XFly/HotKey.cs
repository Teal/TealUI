/* *****************************************************************************
 *
 * Copyright (c) 2009-2011 Xuld. All rights reserved.
 * 
 * Project Url: http://work.xuld.net/coreplus
 * 
 * This source code is part of the Project CorePlus for .net .
 * 
 * This code is licensed under CorePlus License.
 * See the file License.html for the license details.
 * 
 * 
 * You must not remove this notice, or any other, from this software.
 *
 * 
 * HotKey.cs  by xuld
 * 
 * ******************************************************************************/



using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using BOOL = System.Boolean;
using HWND = System.IntPtr;
using MSG = System.Windows.Forms.Message;

namespace Xuld.XFly {

    /// <summary>
    /// 表示键修饰键。
    /// </summary>
    [Flags]
    public enum Modifiers {

        /// <summary>
        /// 无修饰。
        /// </summary>
        None = 0,

        /// <summary>
        ///  Alt 。
        /// </summary>
        Alt = 0x1,

        /// <summary>
        ///  Ctrl 。
        /// </summary>
        Ctrl = 0x2,

        /// <summary>
        ///  Shift 。
        /// </summary>
        Shift = 0x4,

        /// <summary>
        ///  Win 。
        /// </summary>
        Win = 0x8,

        /// <summary>
        /// Alt， Shift 。
        /// </summary>
        AltShift = Alt | Shift,

        /// <summary>
        /// Ctrl， Shift 。
        /// </summary>
        CtrlShift = Ctrl | Shift,

        /// <summary>
        /// Alt , Ctrl， Shift 。
        /// </summary>
        AltCtrlShift = Alt | Ctrl | Shift



    }


    /// <summary>
    /// 提供设置系统热键功能。
    /// </summary>
    public class Hotkey :IMessageFilter, IDisposable {

        #region 私有

        IntPtr _handle;

        Dictionary<uint, HotKeysInfo> _hotKeys = new Dictionary<uint, HotKeysInfo>(1);

        /// <summary>
        /// 定义一个系统范围的热键。
        /// </summary>
        /// <param name="hWnd">接收热键产生WM_HOTKEY消息的窗口句柄。若该参数NULL，传递给调用线程的WM_HOTKEY消息必须在消息循环中中进行处理。</param>
        /// <param name="id">定义热键的标识符。调用线程中的其他热键不能使用同样的标识符。应用功能程序必须定义一个0X0000-0xBFFF范围的值。一个共享的动态链接库（DLL）必须定义一个0xC000-0xFFFF范围的值伯GlobalAddAtom函数返回该范围）。为了避免与其他动态链接库定义的热键冲突，一个DLL必须使用GlobalAddAtom函数获得热键的标识符。</param>
        /// <param name="fsModifiers">定义为了产生WM_HOTKEY消息而必须与由nVirtKey参数定义的键一起按下的键。</param>
        /// <param name="vk">定义热键的虚拟键码。</param>
        /// <returns></returns>
        /// <remarks>
        /// 当某键被接下时，系统在所有的热键中寻找匹配者。一旦找到一个匹配的热键，系统将把WM_HOTKEY消息传递给登记了该热键的线程的消息队列。该消息被传送到队列头部，因此它将在下一轮消息循环中被移去。该函数不能将热键同其他线程创建的窗口关联起来。
        /// 
        ///  若为一热键定义的击键己被其他热键所定义，则RegisterHotKey函数调用失败。
        /// 
        /// 若hWnd参数标识的窗口已用与id参数定义的相同的标识符登记了一个热键，则参数fsModifiers和vk的新值将替代这些参数先前定义的值。
        /// </remarks>
        [DllImport("user32")]
        public static extern BOOL RegisterHotKey(HWND hWnd, uint id, Modifiers fsModifiers, Keys vk);

        /// <summary>
        /// 释放调用线程先前登记的热键。
        /// </summary>
        /// <param name="hWnd">与被释放的热键相关的窗口句柄。若热键不与窗口相关，则该参数为NULL。</param>
        /// <param name="id">定义被释放的热键的标识符。</param>
        /// <returns></returns>
        [DllImport("user32")]
        public static extern BOOL UnregisterHotKey(IntPtr hWnd, uint id);

        /// <summary>
        /// 在系统原子表中加入字符串。
        /// </summary>
        /// <param name="lpString">字符串。</param>
        /// <returns>唯一序列。</returns>
        [DllImport("kernel32")]
        public static extern uint GlobalAddAtom(String lpString);

        /// <summary>
        /// 在系统原子表中加入字符串。
        /// </summary>
        /// <param name="nAtom">唯一序列。</param>
        /// <returns>唯一序列。</returns>
        [DllImport("kernel32")]
        public static extern BOOL GlobalDeleteAtom(uint nAtom);

	    #endregion

        /// <summary>
        /// 初始化 <see cref="CorePlus.Windows.Hotkey"/> 的新实例。
        /// </summary>
        public Hotkey() {
            Application.AddMessageFilter( this );
        }

        /// <summary>
        /// 初始化 <see cref="CorePlus.Windows.Hotkey"/> 的新实例。
        /// </summary>
        /// <param name="owner">注册窗口。</param>
        public Hotkey(HWND owner)
            :this(){

                _handle = owner;
        }

        /// <summary>
        /// 初始化 <see cref="CorePlus.Windows.Hotkey"/> 的新实例。
        /// </summary>
        /// <param name="owner">注册窗口。</param>
        public Hotkey(Form owner)
            : this() {

            _handle = owner.Handle;
        }

        uint GetNewId() {
            return GlobalAddAtom(Guid.NewGuid().ToString());
        }

        /// <summary>
        /// 注册一个全局热键。
        /// </summary>
        /// <param name="key">键名。</param>
        /// <param name="kf">修饰符。</param>
        /// <param name="action">按键之后的处理函数。</param>
        /// <returns>成功返回 true， 否则返回 false。</returns>
        /// <exception cref="ArgumentNullException"><paramref name="action"/> 为空。</exception>
        public bool RegisterHotKey(Keys key, Modifiers kf, Func<bool> action) {
            uint uid = GetNewId();
            HotKeysInfo hti = new HotKeysInfo {
                Key = key,
                FK = kf,
                Action = action
            };
            _hotKeys[uid] = hti;
            return RegisterHotKey(_handle, uid, hti.FK, hti.Key);
        }

        sealed class HotKeysInfo {

            public Keys Key;

            public Modifiers FK;

            public Func<bool> Action;


        }


        /// <summary>
        /// 取消一个热键。
        /// </summary>
        /// <param name="key">注册的键。</param>
        /// <returns>成功返回 true， 否则返回 false。</returns>
        public bool UnregisterHotKey(Keys key) {
            uint uid = 0;
            foreach (var t in _hotKeys) {
                if (t.Value.Key == key) {
                    uid = t.Key;
                    break;
                }
            }
            if (uid != 0 && UnregisterHotKey(_handle, uid)) {
                _hotKeys.Remove(uid);
                return true;
            }


            return false;
        }

        /// <summary>
        /// 取消一个热键。
        /// </summary>
        /// <param name="key">注册的键。</param>
        /// <param name="kf">修饰符。</param>
        /// <returns>成功返回 true， 否则返回 false。</returns>
        public bool UnregisterHotKey(Keys key, Modifiers kf) {
            uint uid = 0;
            foreach(var t in _hotKeys){
                if (t.Value.Key == key && t.Value.FK == kf){
                    uid = t.Key;
                    break;
                }
            }
            if (uid != 0 && UnregisterHotKey(_handle, uid)) {
                _hotKeys.Remove(uid);
                return true;
            }


            return false;
        }

        /// <summary>
        /// 删除全部注册的热键。
        /// </summary>
        /// <returns>成功返回 true， 否则返回 false。</returns>
        public void UnregisterAllHotKeys() {
            foreach (var a in _hotKeys) {
                UnregisterHotKey(_handle, a.Key);
            }

            _hotKeys.Clear();
        }

        #region IMessageFilter 成员

        /// <summary>
        /// 在调度消息之前将其筛选出来。
        /// </summary>
        /// <param name="m">要调度的消息。无法修改此消息。</param>
        /// <returns>
        /// 如果筛选消息并禁止消息被调度，则为 true；如果允许消息继续到达下一个筛选器或控件，则为 false。
        /// </returns>
        BOOL IMessageFilter.PreFilterMessage(ref MSG m) {
            if (m.Msg == 0x312){
                uint wp = (uint)m.WParam ;
                if (_hotKeys.ContainsKey(wp))
                    return _hotKeys[wp].Action();
                
                return false;
             }

            return false;
        }

        #endregion

        #region IDisposable 成员

        /// <summary>
        /// 执行与释放或重置非托管资源相关的应用程序定义的任务。
        /// </summary>
        public void Dispose() {
            UnregisterAllHotKeys();
            Application.RemoveMessageFilter(this);
        }

        #endregion
    }


}
