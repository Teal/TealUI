/**
 * @author xuld
 */


function formatTime(t) {
	var diff = Math.round((new Date() - t) / 1000),
		mf = Math.floor,
		t;
	return (t = mf(diff / 86400)) !== 0 ? t + '天前' : 
		(t = mf(diff / 3600 % 24)) !== 0 ? t + '小时前' : 
		(t = mf(diff / 60 % 60)) !== 0 ? t + '分前' : 
		(t = mf(diff % 60)) > 5 ? t + '秒前' : '刚刚';
}