function TaskBar () {
    this.taskBar     = document.querySelector('#taskBar');
    this.canvas      = document.querySelector('#tmindCanvas');
    this.lineColor   = '#666666';
    this.fillColor   = '#000000';
    this.ratio       = 0.8;
    this.contextmenu = new Contextmenu();
    this.sideBar;
    this.tasks       = [];
    this.dragTask;
    this.focusTask;

    this.init();
    this.bindEvents();
};

// 初始化canvas
TaskBar.prototype.init = function () {
    this.canvas.width  = this.taskBar.offsetWidth;
    this.canvas.height = this.taskBar.offsetHeight;
};

// 绑定事件
TaskBar.prototype.bindEvents = function () {
    var self = this;
    addHandler(document, 'click', function () {
        self.contextmenu.contextmenu.style.display = 'none';
    });
    addHandler(self.taskBar, 'contextmenu', function (e) {
        self.contextmenu.showContextmenu(e);
    });
    // 创建
    addHandler(self.contextmenu.options[0], 'click', function (e) {
        e = e || window.event;
        self.createTask(e);
    });
    // 删除
    addHandler(self.contextmenu.options[2], 'click', function (e) {
        self.removeTask(e);
    });
    // 单击取消选择
    addHandler(self.taskBar, 'click', function (e) {
        var target = getTarget(e);
        if(self.focusTask && self.focusTask !== target) {
            self.focusTask.contentEditable = false;
            removeClassName(self.focusTask, 'focusTask');
            self.focusTask = null;
        }
    });
    // 双击选中
    addHandler(self.taskBar, 'dblclick', function (e) {
        self.editTask(e);
    });
    // 拖拽开始
    addHandler(self.taskBar, 'dragstart', function (e) {
        var target = getTarget(e);
        e = e || window.event;
        if(hasClassName(target, 'task')) {
            // 必须使用'dataTransfer.setData'来兼容firefox
            e.dataTransfer.setData('Url', '');
            self.dragTask = target;
        }
    });
    // 拖拽过程阻止默认事件
    addHandler(self.taskBar, 'dragover', function (e) {
        preventDefault(e);
    });
    // 拖拽结束
    addHandler(self.taskBar, 'drop', function (e) {
        preventDefault(e);
        e = e || window.event;
        var task       = self.dragTask,
            leftBorder = self.taskBar.offsetLeft + task.offsetWidth / 2,
            topBorder  = self.taskBar.offsetTop + task.offsetHeight / 2,
            len,
            j;

        // 在taskBar范围内
        if(e.clientX > leftBorder
            && e.clientX < window.innerWidth - task.clientWidth / 2
            && e.clientY > topBorder
            && e.clientY < window.innerHeight - task.clientHeight / 2) {
            // 位置改变
            task.style.left = e.clientX - leftBorder + 'px';
            task.style.top  = e.clientY  - topBorder + 'px';
            // 重绘canvas
            self.canvas.getContext('2d').clearRect(0, 0, self.canvas.width, self.canvas.height);
            for(j = 0, len = self.tasks.length; j < len; ++j) {
                if(self.tasks[j].parentIndex != -1) {
                    self.drawBezierCurve({
                        clientX: self.tasks[j].node.offsetLeft + self.tasks[j].node.offsetWidth / 2 + self.taskBar.offsetLeft,
                        clientY: self.tasks[j].node.offsetTop + self.tasks[j].node.offsetHeight / 2 + self.taskBar.offsetTop
                    }, self.ratio, self.tasks[self.tasks[j].parentIndex].node);
                }
            }
        }
    });
    // 编辑
    addHandler(self.taskBar, 'keydown', function (e) {
        e = e || window.event;
        var target = getTarget(e);
        if(target == self.focusTask && e.keyCode == 13) {
            self.focusTask.contentEditable = false;
            removeClassName(self.focusTask, 'focusTask');
            self.focusTask = null;
        }
    });
};

// 创建
TaskBar.prototype.createTask = function (e) {
    var self     = this,
        desNode  = {},
        task     = document.createElement('div'),
        taskBarX = self.taskBar.offsetLeft,
        taskBarY = self.taskBar.offsetTop,
        i;

    addClassName(task, 'task');
    task.draggable = true;
    self.taskBar.appendChild(task);
    task.style.left = e.clientX - taskBarX - task.offsetWidth / 2 + 'px';
    task.style.top  = e.clientY - taskBarY - task.offsetHeight / 2 + 'px';
    task.innerHTML  = '主题' + (self.tasks.length + 1);
    if(self.focusTask) {
        for(i = 0; i < self.tasks.length; ++i) {
            if(self.tasks[i].node == self.focusTask) {
                break;
            }
        }
        self.drawBezierCurve(e, self.ratio, self.focusTask);
        desNode = {
            node: task,
            parentIndex: i
        };
        self.tasks.push(desNode);
    } else {
        self.tasks.push({
            node: task,
            parentIndex: -1
        });
    }
};

// 编辑
TaskBar.prototype.editTask = function (e) {
    var self   = this,
        target = getTarget(e);

    if(hasClassName(target, 'task')) {
        self.focusTask = target;
        addClassName(self.focusTask, 'focusTask');
        target.contentEditable = true;
        target.focus();
    }
};

// 删除
TaskBar.prototype.removeTask = function (e) {
    var self   = this,
        target = self.focusTask,
        len,
        i,
        j;

    if(target) {
        // tasks中删除
        for(i = 0, len = self.tasks.length; i < len; ++i) {
            if(self.tasks[i].node == target) {
                self.tasks.splice(i, 1);
                break;
            }
        }
        // 子主题重定向
        for(j = 0, len = self.tasks.length; j < len; ++j) {
            if(self.tasks[j].parentIndex >= i) {
                self.tasks[j].parentIndex -= 1;
            }
        }
        // DOM中删除
        target.parentNode.removeChild(target);
        // 重绘canvas
        self.canvas.getContext('2d').clearRect(0, 0, self.canvas.width, self.canvas.height);
        for(j = 0, len = self.tasks.length; j < len; ++j) {
            if(self.tasks[j].parentIndex != -1) {
                self.drawBezierCurve({
                    clientX: self.tasks[j].node.offsetLeft + self.tasks[j].node.offsetWidth / 2 + self.taskBar.offsetLeft,
                    clientY: self.tasks[j].node.offsetTop + self.tasks[j].node.offsetHeight / 2 + self.taskBar.offsetTop
                }, self.ratio, self.tasks[self.tasks[j].parentIndex].node);
            }
        }
        // focusTask初始化
        self.focusTask = null;
    }
};

// 画贝塞尔曲线
TaskBar.prototype.drawBezierCurve = function (e, ratio, lastTask) {
    var self  = this;
    // if(!self.focusTask) {
    //     return false;
    // }
    var cxt   = self.canvas.getContext('2d'),
        lastX = lastTask.offsetLeft + lastTask.offsetWidth / 2,
        lastY = lastTask.offsetTop + lastTask.offsetHeight / 2,
        newX  = e.clientX - self.taskBar.offsetLeft,
        newY  = e.clientY - self.taskBar.offsetTop,
        diff  = {
            x: newX - lastX,
            y: newY - lastY
        },
        // 起点到终点连线与水平线的夹角(弧度)
        angle = Math.acos(diff.x / (Math.sqrt(Math.pow(diff.x)+Math.pow(diff.y))));

    cxt.strokeStyle = self.lineColor;
    cxt.fillStyle   = self.fillColor;
    cxt.globalCompositeOperation = 'source-over';
    cxt.beginPath();
    cxt.moveTo(lastX, lastY);
    cxt.bezierCurveTo((lastX+(1-ratio)*diff.x), (lastY+ratio*diff.y), (newX-ratio*diff.x), (newY-(1-ratio)*diff.y), newX, newY);
    cxt.stroke();
    // cxt.moveTo(lastX, lastY);
    // cxt.lineTo(lastX+(1-ratio)*diff.x, lastY+ratio*diff.y);
    // cxt.moveTo(newX, newY);
    // cxt.lineTo(newX-ratio*diff.x, newY-(1-ratio)*diff.y);
    // cxt.fillRect(newX-ratio*diff.x, newY-(1-ratio)*diff.y, 5, 5);
    // cxt.stroke();
};
