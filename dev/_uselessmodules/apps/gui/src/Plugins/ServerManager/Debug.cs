using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;

namespace Xuld.XFly {
    static class Debug {

        [Conditional("DEBUG")]
        public static void Write(string message, params object[] args) {
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.WriteLine(message, args);
            Console.ResetColor();
        }

        [Conditional("DEBUG")]
        public static void Info(string message, params object[] args) {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(message, args);
            Console.ResetColor();
        }

        [Conditional("DEBUG")]
        public static void Warning(string message, params object[] args) {
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine(message, args);
            Console.ResetColor();
        }

        [Conditional("DEBUG")]
        public static void Error(string message, params object[] args) {
            Console.ForegroundColor = ConsoleColor.DarkRed;
            Console.WriteLine(message, args);
            Console.ResetColor();
        }

        [Conditional("TRACE")]
        public static void Trace(string message, params object[] args) {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine(message, args);
            Console.ResetColor();
        }

        [Conditional("TRACE")]
        public static void Trace(byte[] buffer, int count) {
            try {
                Trace(Encoding.UTF8.GetString(buffer, 0, count));
            } catch {

            }
        }
    }
}
