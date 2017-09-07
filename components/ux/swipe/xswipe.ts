// #todo

/**
 * @author xuld@vip.qq.com
 */

 /**
                     * 将容器直接子节点作为列表进行自动轮播。
                     * @param {Element} elem 滚动的容器节点。一般是 <ul> 元素。
                     * @param {Number} interval=0 自动轮播的间隔时间，如果为 0 则不自动轮播。
                     * @param {Boolean} touchMove=true 是否启用滑动轮播。
                     * @remark 限制：
                     * - 只能在  Webkit 内核的手机浏览器使用。
                     * - 所有子节点必须和容器等宽。
                     * - 一次只能移动一张。
                     */
 function XSwipe(elem, interval, touchMove) {

                        // 全局参数。
                        var indicatorActived = '#ddd';
                        var indicatorInactived = '#000';

                        // 计算布局信息。
                        var childCount = elem.children.length;
                        var containerWidth = elem.offsetWidth;

                        // 不处理只有一张图片的情况。
                        if (childCount < 2 || !containerWidth) {
                            return;
                        }

                        var allWidth = containerWidth * childCount;

                        // 生成容器。
                        var container = elem.ownerDocument.createElement('div');
                        container.style.position = 'relative';
                        container.style.overflow = 'hidden';
                        container.style.width = containerWidth + 'px';

                        // 生成指示器。
                        var html = '';
                        for (var i = 0; i < childCount; i++) {
                            html += '<li style="width:8px;height:8px;display:inline-block;border-radius:100%;background-color:#000; opacity:.2;margin:0 .375em;"></li>';
                        }
                        container.innerHTML = '<ul style="list-style:none;text-align:center;padding:0;position:absolute;bottom:5px;left:0;margin:0;width:100%;">' + html + '</ul>';

                        // 将 elem 替换为 container。
                        elem.parentNode.replaceChild(container, elem);
                        container.insertBefore(elem, container.firstChild);

                        // 复制首尾张。
                        var newFirst = elem.firstElementChild.cloneNode(true);
                        var newLast = elem.lastElementChild.cloneNode(true);
                        elem.insertBefore(newLast, elem.firstChild);
                        elem.appendChild(newFirst);

                        // 设置子元素的宽度。
                        for (var node = elem.firstElementChild; node; node = node.nextElementSibling) {
                            node.style.float = 'left';
                            node.style.width = containerWidth + 'px';
                        }

                        // 设置容器宽度。
                        elem.style.position = 'relative';
                        elem.style.clear = 'left';
                        elem.style.width = '10000px';

                        var currentIndex = 0;
                        var timer;

                        // 绑定滑动事件。
							
						if(touchMove == null){
							touchMove = navigator.userAgent.indexOf('HUAWEI') < 0;
						}
						
						if(touchMove !== false){
							
							var from;
							var delta;
							var fromScroll;
							container.addEventListener('touchstart', function (e) {
								if (elem.style.webkitTransition) return;
								from = e.touches[0].clientX;
								fromScroll = getScroll();
							}, false);

							container.addEventListener('touchmove', function (e) {
								if (elem.style.webkitTransition) return;
								delta = from - e.touches[0].clientX;
								// 忽略小范围点击。
								if (delta < 2 && delta >= -2) {
									delta = 0;
									return;
								}
								setScroll(fromScroll + delta);
							}, false);

							container.addEventListener('touchend', function (e) {
								if (!delta || elem.style.webkitTransition) {
									return;
								}
								animteTo(~~(fromScroll / containerWidth) - 1 + (-40 < delta && delta < 40 ? 0 : delta > 0 ? 1 : -1))
							}, false);

						}
						
                        function getScroll() {
                            return -(/(\-?\d+(\.\d*)?),\s*\-?\d+(\.\d*)?\)$/.exec(getComputedStyle(elem, null).webkitTransform) || [0, 0])[1];
                        }

                        function setScroll(value) {
                            elem.style.webkitTransform = 'translateX(' + -value + 'px) translateZ(0)';
                        }

                        // 设置当前索引。
                        function setIndex(index) {
                            currentIndex = index;
                            var nodes = container.lastChild.childNodes;
                            for (var i = 0; i < nodes.length; i++) {
                                nodes[i].style.backgroundColor = i === index ? indicatorActived : indicatorInactived;
                            }
                        }

                        // 通过渐变方式移到到指定帧。
                        function animteTo(index) {

                            if (timer) {
                                clearTimeout(timer);
                                timer = 0;
                            }

                            // 渐变结束后停止渐变。
                            var transitionEnd = function () {
                                if (!elem.style.webkitTransition) return;
                                elem.removeEventListener('webkitTransitionEnd', transitionEnd, false);
                                elem.style.webkitTransition = '';

                                // 修复帧外为帧内。
                                var scroll = getScroll();
                                if (scroll < containerWidth || scroll >= allWidth + containerWidth) {
                                    setScroll(scroll < containerWidth ? scroll + allWidth : scroll >= allWidth + containerWidth ? scroll - allWidth : scroll);
                                }

                            };

                            elem.addEventListener('webkitTransitionEnd', transitionEnd, false);
                            setTimeout(transitionEnd, 400);

                            // 设置渐变。
                            elem.style.webkitTransition = '-webkit-transform .3s';
                            setScroll((index + 1) * containerWidth);
                            setIndex(index < 0 ? index + childCount : index >= childCount ? index - childCount : index);

                            autoStart();
                        }

                        function autoStart() {
                            if (interval) {
                                timer = setTimeout(function () {
                                    animteTo(currentIndex + 1);
                                }, interval);
                            }
                        }

                        // 默认显示第一张。
                        setScroll(containerWidth);
                        setIndex(0);
                        autoStart();

                    }
