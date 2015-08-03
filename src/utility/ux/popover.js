/**
 * ���õ�ǰ�ڵ�ĵ��㡣
 * @param {Object} [options] ��������á� 
 * @returns this
 */
        // ���û�ȡ�������ʾ���㣬ȫ�ֳ������Ŀ���ⵥ���رա�
        target.on(triggerEvent, function (e) {

            // ���ظ���ʾ��
            if (me.isHidden()) {

                // ����ȫ�ֵ��֮�����ظ��㡣
                document.on("mousedown", function (e) {

                    // �����������˵������¼���
                    // ������Ŀ�걾����
                    if (!me.elem.contains(e.target) && (!target || !target.contains(e.target))) {

                        // ȷ����ǰ�¼�ִֻ��һ�Ρ�
                        document.off("mousedown", arguments.callee);

                        // ���ظ��㡣
                        me.hide(e);

                    }

                }, this);

                // ��ʾ���㡣
                me.show(e);

            }
        });
    } else if (triggerEvent === "click") {
        // ���õ�����л����ء�
        target.on(triggerEvent, function (e) {

            if (me.isHidden()) {

                // ���������¼���
                document.on("mousedown", function (e) {

                    // �����������˵������¼���
                    if (!me.elem.contains(e.target)) {

                        // �����Ŀ��ڵ�������ֱ����Ŀ��ڵ���� hide()��
                        if (!target || !target.contains(e.target)) {
                            me.hide(e);
                            trace("hided");
                        }

                        // ȷ����ǰ�¼�ִֻ��һ�Ρ�
                        document.off("mousedown", arguments.callee);
                    }

                }, this);

                me.show(e);

            } else {
                me.hide(e);
            }
        });
    } else if (triggerEvent === "active") {
        target.on("focus", this.show, this);
        target.on("blur", this.hide, this);
    }