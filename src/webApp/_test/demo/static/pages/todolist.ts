
var TodoList = View.create({

    model: Model.create({

        key: 'ToDoList_List',

        add: function (item) {
            if (!item) {
                return;
            }

            var list = this.get('list') || [];
            list.unshift({
                done: false,
                text: item
            });

            this.set('list', list);

        },

        removeAt: function(index) {
            var list = this.get('list') || [];
            list.splice(index, 1);
            this.set('list', list);
        },

        toggleDone: function (index, value) {
            var item = this.get('list.' + index);
            if (item) {
                item.done = value === undefined ? !item.done : value;
                this.set('list.' + index, item);
            }
        },

        toggleAllDone: function (value) {
            var list = this.get('list') || [];
            list.forEach(function (item) {
                item.done = value === undefined ? !item.done : value;
            });
            this.set('list', list);
        },

        clearDone: function() {
            var list = this.get('list') || [];
            list = list.filter(function(item) {
                return !item.done;
            });
            this.set('list', list);
        }

    }),

    init: function() {
        TodoList.model.on('update', TodoList.render);
        TodoList.render();
    },

    _filter: null,

    setFilter: function (filter) {
        TodoList._filter = filter;
        TodoList.render();
    },

    render: function () {
        var data = TodoList.model.get();
        if (data) {
            data.filter = TodoList._filter;
            TodoList.renderTpl('#contentTpl', '#contentTable', data);
            TodoList.renderTpl('#toolbarTpl', data);
        }
    },

    onNewItemKeyUp: function (e) {
        // 换行。
        if (e.keyCode === 13) {
            TodoList.onAddNewItemClick();
        }
    },

    onAddNewItemClick: function () {
        var input = TodoList.find('#todolist thead .item-label input');
        TodoList.model.add(input.val());
        input.val('');
    }

});

$(TodoList.init);