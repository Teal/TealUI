/**
 * refresh 
 * @author @Ctrip.com
 * @statable
 */

/**
 * refresh 
 * @author @Ctrip.com
 * @statable
 */
.scroll-transition {
    -webkit-transition: .15s ease;
}
.scroll-transition2 {
    -webkit-transition: .35s ease;
}
/**
 * Created by huangjianhua on 2016/7/4.
 */

import './refresh.css';

function refreshPage(obj) {

    var $target = obj.target,
        refreshCallback = obj.refreshCallback,
        startCallback = obj.startCallback,
        moveCallback = obj.moveCallback,
        endCallback = obj.endCallback,
        onShow = obj.onShow,
        scope = obj.scope,
        initAction = obj.init;


    var startY, moveY, moveEndY, firstPos, lastPos, firstTouch_obj, cur_top,
        startTimeStamp, endTimeStamp;

    var $scroll_section = $target;
    var $scroll_loading = $('.refresh-loading');
    var $scroll_title = $('.section-title');
    var init_top = 0;  //初始的top
    var loading_title_height = $scroll_loading.height();


    $target.on('touchstart', function (e) {
        startTimeStamp = e.timeStamp || Date.now();
        //title contain

        //判断是否已经展开， 展开  return
        if($('.flight-info-detail').length > 0)  return;


        //初始触摸的点
        firstTouch_obj = e.touches[0];
        moveY = 0;
        firstPos = {y: firstTouch_obj.clientY};   //第一个开始scroll的坐标
        cur_top = 0;  //当前的scroll区域的top

        //开始拖动时清除动画缓冲效果
        $scroll_section.removeClass('scroll-transition');
        $scroll_section.removeClass('scroll-transition2');


//        console.log('start clientY: ', firstTouch_obj.clientY, 'pageY:', firstTouch_obj.pageY);
    }).on('touchmove', function (e) {
        //e.preventDefault();
        //判断是否已经展开， 展开  return
        if($('.flight-info-detail').length > 0)  return;

        var lastTouch_obj = e.touches[0];
        lastPos = {y: lastTouch_obj.clientY};   //第一个开始scroll的坐标


        //判断是向上滑动还是向下滑动
        moveY = lastPos.y - firstPos.y;

        var scrollTop = $('.viewport-scroll')[0].scrollTop;

        if(moveY > 0 && (scrollTop<=2)) {
            $scroll_loading.css('z-index', 22).show();

            //$scroll_section.css('top', (cur_top + moveY) + 'px');
            $scroll_section.css('transition', 'translateY('+ (cur_top + moveY) +'px)');
            $scroll_section.css('-webkit-transform', 'translateY('+ (cur_top + moveY) +'px) ');

        } else {
            $scroll_loading.hide();
        }



    }).on('touchend', function (e) {
        if($('.flight-info-detail').length > 0)  return;

//            firstPos = null;  //重置第一个开始模拟滚动标记的坐标点
        endTimeStamp = e.timeStamp || Date.now();

        console.log('moveY:--- ' + moveY + ' scrolltop : ' + $target[0].scrollTop);

        var scrollTop = $('.viewport-scroll')[0].scrollTop;

        if(moveY> 0 && (scrollTop<=2) )  {
                //拖动的区里大于设定刷新的距离则刷新，且为正数,
                if ((cur_top + moveY) > 0 && (cur_top + moveY) < 0) {
                    $scroll_section.addClass('scroll-transition');
                    //$scroll_section.css('top', init_top + 'px');
                    $scroll_section.css('transition', 'translateY('+ (init_top) +'px) ');
                    $scroll_section.css('-webkit-transform', 'translateY('+ (init_top) +'px) ');
                    //如果css动画结束 ，还原
                    return;
                }

                //refresh
                else if ((cur_top + moveY) > init_top) {
                    $scroll_section.addClass('scroll-transition2'); // 设置缓冲的class

                    //还原到loading状态
                    //$scroll_section.css('top', (init_top ) + 'px');
                    $scroll_section.css('transition', 'translateY('+ (init_top+loading_title_height) +'px) ');
                    $scroll_section.css('-webkit-transform', 'translateY('+ (init_top+loading_title_height) +'px) ');
                    $target && $target[0] && ($target[0].scrollTop = 0);
                    //$scroll_title.html('正在为你获取最新信息');

                    //刷新后的回调，还原到初始状态
                    function resultCallback() {
                        setTimeout(function () {
                        }, 1500);

                        //$scroll_section.css('top', init_top + 'px');
                        $scroll_section.css('transition', 'translateY('+ (init_top) +'px) ');
                        $scroll_section.css('-webkit-transform', 'translateY('+ (init_top) +'px) ');
                        $target && $target[0] && ($target[0].scrollTop = 0);
                        //$scroll_title.html('下拉获取最新信息');
                        //title contain
                        $scroll_loading.css('z-index', -1).hide();

                    }

                    //刷新页面
                    refreshCallback({
                        noShowLoading: true,
                        noInit: true,
                        onShow:onShow,
                        scope:scope,
                        initAction: initAction,
                        resultCallback: resultCallback
                    });




                }

        }





    });

}


module.exports.refreshPage = refreshPage;