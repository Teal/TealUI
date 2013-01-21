var sys = require('sys');
    // 此乃计数器变量，Suspend（中断挂起）期间可以观察该变量的变化。
    var count = 0;
    sys.debug("开始进行调试……");
    debugger;
    function timer_tick() {
        count++;
        sys.debug("计数器：" + count);
        setTimeout(timer_tick, 1000);
    }
    timer_tick();