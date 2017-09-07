//===========================================
//  模拟多线程的任务   taskrunner.js  A
//===========================================

//#include fx/base.js


namespace(".TaskRunner", JPlus.Fx.Base.extend({
	
	tasks: null,
	
	removeQueue: null,
	
	constructor:  function(fps){
	    if(fps)
			this.fps = fps;
	},
	
	removeTask: function(task){
        removeQueue.push(task);
        if(task.onStop){
            task.onStop();
        }
    },
	
	step: function(){
        if(removeQueue.length > 0){
            for(var i = 0, len = removeQueue.length; i < len; i++){
                tasks.remove(removeQueue[i]);
            }
            removeQueue = [];
            if(tasks.length < 1){
                stopThread();
                return;
            }
        }
        var now = new Date().getTime();
        for(var i = 0, len = tasks.length; i < len; ++i){
            var t = tasks[i];
            var itime = now - t.taskRunTime;
            if(t.interval <= itime){
                var rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
                t.taskRunTime = now;
                if(rt === false || t.taskRunCount === t.repeat){
                    removeTask(t);
                    return;
                }
            }
            if(t.duration && t.duration <= (now - t.taskStartTime)){
                removeTask(t);
            }
        }
    },
	
	start: function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    },
	
	stop: function(task){
        removeTask(task);
        return task;
    },
	
	stopAll: function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    }
		
}));






