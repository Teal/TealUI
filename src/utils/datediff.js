function formatTime(t) {
		             var nt = (new Date()).getTime(),
		             diff = Math.round((nt-parseInt(t))/1000),
		             mf = Math.floor;
		          var day = mf(diff/60/60/24)==0 ? '' : mf(diff/60/60/24)+'天',
		             hour = mf(diff/60/60%24)==0 ? '' : mf(diff/60/60%24)+'小时',
		             min = mf(diff/60%60)==0 ? '' : mf(diff/60%60)+'分',
		             sec = mf(diff%60)<10?"0"+mf(diff%60)+'秒前':mf(diff%60)+'秒前',
				     res = day+hour+min+sec;
				  return res;
		       }