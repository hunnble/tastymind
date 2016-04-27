/**
 * tmind
 */

// 菜单
var Nav = function (taskBar) {
    this.nav = document.querySelector('nav');
    this.options = this.nav.querySelectorAll('.options');
    this.bindEvents();
    this.taskBar;
};

Nav.prototype = {
    bindEvents: function () {
        var self = this;

        addHandler(self.nav, 'click', function (e) {
            var target = getTarget(e);

            if(target.tagName.toLowerCase() == 'li') {
                [].forEach.call(self.options, function (option) {
                    option.style.display = 'none';
                });
                target.querySelector('.options').style.display = 'block';
            }
        });

        addHandler(document, 'click', function (e) {
            var target = getTarget(e);

            if(target.tagName.toLowerCase() !== 'li') {
                [].forEach.call(self.options, function (option) {
                    option.style.display = 'none';
                });
            }
        });

        addHandler(self.options[0], 'click', function (e) {
            var target    = getTarget(e),
                funcs     = self.options[0].querySelectorAll('p'),
                taskTree  = self.taskBar.sideBar.sideBar.querySelector('#essential>ul'),
                tmindName = "tmind#name=",
                tasks     = [];

            // 新建导图(清空)
            if(target == funcs[0]) {
                self.taskBar.tasks = [];
                self.taskBar.taskBar.innerHTML = '';
                self.taskBar.canvas.getContext('2d').clearRect(0, 0, self.taskBar.canvas.width, self.taskBar.canvas.height);
                taskTree.innerHTML = '';
                self.taskBar.hasSaved = true;
            }
            // 打开导图
            else if (target == funcs[1]) {
                if(self.taskBar.tasks && !self.taskBar.hasSaved && confirm('当前导图未储存,是否要储存?')) {
                    funcs[2].click();
                }
                tmindName += prompt('请输入导图名称');
                tasks     = JSON.parse(localStorage.getItem(tmindName));
                funcs[0].click();
                if(tasks.length > 0) {
                     self.taskBar.hasSaved = true;
                     tasks.forEach(function (task) {
                        if(task.parentIndex != -1) {
                            self.taskBar.focusTask = self.taskBar.tasks[task.parentIndex].node;
                        }
                        self.taskBar.createTask({
                            clientX: task.pos.left,
                            clientY: task.pos.top
                        });
                        self.taskBar.focusTask = null;
                     });
                }
            }
            // 保存
            else if(target == funcs[2]) {
                // 可以用alertBar,先用prompt和confirm测试
                tmindName += prompt('请输入导图名');
                if(localStorage.getItem(tmindName) && !confirm('已有导图,是否覆盖?')) {
                    return false;
                }
                self.taskBar.hasSaved = true;
                localStorage.setItem(tmindName, JSON.stringify(self.taskBar.tasks));
            }
        });

        addHandler(self.options[1], 'click', function (e) {
            var target = getTarget(e),
                funcs  = self.options[1].querySelectorAll('p');
        });

        addHandler(self.options[2], 'click', function (e) {
            var target = getTarget(e),
                funcs  = self.options[2].querySelectorAll('p');
        });

        addHandler(self.options[3], 'click', function (e) {
            var target = getTarget(e),
                funcs  = self.options[3].querySelectorAll('p');
        });

        addHandler(self.options[4], 'click', function (e) {
            var target = getTarget(e),
                funcs  = self.options[4].querySelectorAll('p'),
                AlertComp;

            var config = {
                titleTxt: '',
                contentTxt: '',
                hasShader: false,
                isShow: true,
                width: 400,
                height: 300,
                drag: false,
                flexible: false,
                btns: {
                    1: '确认',
                    2: '取消'
                },
                returnValues: ['1', '0'],
                className: {
                    alertWindow: 'alertWindow',
                    title: 'alertWindowTitle',
                    content: 'alertWindowContent',
                    shader: 'alertWindowShader',
                    btn: 'alertWindowBtn'
                }
            };

            if(target == funcs[0]) {
                config.titleTxt = 'tmind';
                config.contentTxt = 'tasty mind,js开发的思维导图工具。';
            } else if (target = funcs[1]) {
                config.titleTxt = '帮助';
                config.contentTxt = '1.功能<br />2.技巧';
            } else if (target = funcs[2]) {
                config.titleTxt = '关于';
                config.contentTxt = '作者: hunnble';
            }

            AlertComp = Hum.createClass(AlertBar, config);
            realDOM   = AlertComp.render();

            if(document.body) {
                Hum.render(realDOM, document.body, function () {
                    console.log(AlertComp.returnValue);
                });
            } else {
                Hum.render(realDOM, document.documentElement, function () {
                    console.log(AlertComp.returnValue);
                });
            }

        });
    }
}

// 侧边栏
var SideBar = function () {
    this.sideBar = document.querySelector('#sideBar');
    this.taskBar;

    this.bindEvents();
};

SideBar.prototype = {
    bindEvents: function () {
        var self = this;

        addHandler(self.sideBar, 'click', function (e) {
            var target = getTarget(e),
                lastChoosed,
                chooseBar,
                titles,
                contents,
                index;

            if(target.tagName.toLowerCase() == 'li') {
                chooseBar   = target.parentNode.parentNode;
                lastChoosed = chooseBar.querySelectorAll('.currentChoose');
                titles      = target.parentNode.querySelectorAll('li');
                contents    = chooseBar.querySelectorAll('div');
                index       = Array.prototype.indexOf.call(titles, target);

                removeClassName(lastChoosed[0], 'currentChoose');
                removeClassName(lastChoosed[1], 'currentChoose');
                addClassName(contents[index], 'currentChoose');
                addClassName(target, 'currentChoose');
            }
        });
    }
};

// 右键菜单
var Contextmenu = function () {
    this.contextmenu = document.querySelector('#contextmenu');
    this.options = this.contextmenu.querySelectorAll('p');

    this.bindEvents();
};

Contextmenu.prototype = {
    bindEvents: function () {
        var self = this;
        addHandler(document, 'contextmenu', function (e) {
            preventDefault(e);
        });
    },
    showContextmenu: function (e) {
        var target  = getTarget(e);
        e = e || window.event;
        this.contextmenu.style.left    = e.clientX + 'px';
        this.contextmenu.style.top     = e.clientY + 'px';
        this.contextmenu.style.display = 'block';
    }
};

// 导图主体
function TaskBar () {
    this.taskBar     = document.querySelector('#taskBar');
    this.canvas      = document.querySelector('#tmindCanvas');
    this.lineColor   = '#82ECA0';
    this.fillColor   = '#000000';
    this.ratio       = 0.8;
    this.contextmenu = new Contextmenu();
    this.sideBar;
    this.tasks       = [];
    this.dragTask;
    this.focusTask;
    this.hasSaved    = true;

    this.init();
    this.bindEvents();
};

// 绑定事件
TaskBar.prototype = {
    init: function () {
        this.canvas.width  = this.taskBar.offsetWidth;
        this.canvas.height = this.taskBar.offsetHeight;
    },
    bindEvents: function () {
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
            e = e || window.event;
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

            self.hasSaved = false;
            // 在taskBar范围内
            if(e.clientX > leftBorder
                && e.clientX < window.innerWidth - task.clientWidth / 2
                && e.clientY > topBorder
                && e.clientY < window.innerHeight - task.clientHeight / 2) {
                // 位置改变
                task.style.left = e.clientX - leftBorder + 'px';
                task.style.top  = e.clientY - topBorder + 'px';
                // 改变tasks中映射的节点的pos
                for(j = 0, len = self.tasks.length; j < len; ++j) {
                    if(self.tasks[j].node == task) {
                        self.tasks[j].pos.left = e.clientX;
                        self.tasks[j].pos.top = e.clientY;
                        break;
                    }
                }
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
            var target    = getTarget(e),
                taskTree  = self.sideBar.sideBar.querySelector('#essential>ul'),
                treeNodes = taskTree.querySelectorAll('li'),
                lastTxt   = '',
                parentIndex,
                counts,
                len,
                i,
                j;

            if(target == self.focusTask) {
                self.hasSaved = false;
                if(e.keyCode == 13) {
                    self.focusTask.contentEditable = false;
                    removeClassName(self.focusTask, 'focusTask');
                    self.focusTask = null;

                    // sideBar内容相应改变
                    for(i = 0, len = self.tasks.length; i < len; ++i) {
                        if(self.tasks[i].node == target) {
                            counts = 0;
                            parentIndex = self.tasks[i].parentIndex;
                            if(parentIndex != -1) {
                                j = findBasicTask(i, self.tasks);
                                for(len = 0; len < i; ++len) {
                                    if(self.tasks[len].parentIndex != -1) {
                                        k = len;
                                        while(self.tasks[k].parentIndex != -1) {
                                            k = self.tasks[k].parentIndex;
                                        }
                                        if(k == j) {
                                            ++counts;
                                        }
                                    }
                                }
                                k = findBasicTask(i, self.tasks);
                                treeNodes[k].querySelectorAll('p')[counts].innerHTML = target.innerHTML;
                            } else {
                                for(j = 0; j < i; ++j) {
                                    if(self.tasks[j].parentIndex == -1) {
                                        ++counts;
                                    }
                                }
                                lastTxt = '<' + treeNodes[counts].innerHTML.split('<')[1];
                                treeNodes[counts].innerHTML = target.innerHTML + lastTxt;
                            }
                            break;
                        }
                    }
                }
            }
        });
    },
    // 新建主题
    createTask: function (e) {
        var self     = this,
            desNode  = {},
            task     = document.createElement('div'),
            taskBarX = self.taskBar.offsetLeft,
            taskBarY = self.taskBar.offsetTop,
            taskTree = self.sideBar.sideBar.querySelector('#essential>ul'),
            treeNode,
            i,
            j,
            counts;

        self.hasSaved = false;
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
                parentIndex: i,
                pos: {
                    left: e.clientX,
                    top: e.clientY
                }
            };
            self.tasks.push(desNode);

            counts = -1;
            for(j = 0; j <= i; ++j) {
                if(self.tasks[j].parentIndex == -1) {
                    ++counts;
                }
            }

            treeNode = document.createElement('p');
            treeNode.innerHTML = task.innerHTML;
            taskTree.querySelectorAll('li')[counts].appendChild(treeNode);
        } else {
            self.tasks.push({
                node: task,
                parentIndex: -1,
                pos: {
                    left: e.clientX,
                    top: e.clientY
                }
            });
            treeNode = document.createElement('li');
            treeNode.innerHTML = task.innerHTML;
            taskTree.appendChild(treeNode);
        }
    },
    // 编辑主题
    editTask: function (e) {
        var self   = this,
            target = getTarget(e);

        if(hasClassName(target, 'task')) {
            self.focusTask = target;
            addClassName(self.focusTask, 'focusTask');
            target.contentEditable = true;
            target.focus();
        }
    },
    // 删除主题
    removeTask: function (e) {
        var self        = this,
            target      = self.focusTask,
            taskTree    = self.sideBar.sideBar.querySelector('#essential>ul'),
            treeNodes   = taskTree.querySelectorAll('li'),
            sonNodes    = [],
            parentIndex = -1,
            len,
            counts,
            i,
            j,
            k;

        if(target) {
            self.hasSaved = false;
            // tasks中,sideBars中删除
            for(i = 0, len = self.tasks.length; i < len; ++i) {
                if(self.tasks[i].node == target) {
                    counts = 0;
                    parentIndex = self.tasks[i].parentIndex;
                    if(parentIndex != -1) {

                        // j = i;
                        // while(self.tasks[j].parentIndex != -1) {
                        //     j = self.tasks[j].parentIndex;
                        // }
                        j = findBasicTask(i, self.tasks);
                        for(len = 0; len < i; ++len) {
                            if(self.tasks[len].parentIndex != -1) {
                                k = len;
                                while(self.tasks[k].parentIndex != -1) {
                                    k = self.tasks[k].parentIndex;
                                }
                                if(k == j) {
                                    ++counts;
                                }
                            }
                        }
                        for(len = -1, j = 0; j < i; ++j) {
                            if(self.tasks[j].parentIndex == -1) {
                                ++len;
                            }
                        }
                        treeNodes[len].removeChild(treeNodes[len].querySelectorAll('p')[counts]);
                    } else {
                        for(j = 0; j < i; ++j) {
                            if(self.tasks[j].parentIndex == -1) {
                                ++counts;
                            }
                        }

                        taskTree.removeChild(treeNodes[counts]);

                        // 删除taskBar和tasks中被删除节点的所有子节点
                        // for(j = i + 1; j < len; ++j) {
                        //     if(findBasicTask(j, self.tasks) == parentIndex) {
                        //         ++counts;
                        //     }
                        // }
                    }

                    // 子节点从DOM中和tasks中删除
                    // for(j = i + 1; j < self.tasks.length; ++j) {
                    //     if(findBasicTask(j, self.tasks) == findBasicTask(i, self.tasks)) {
                    //         sonNodes.push(self.tasks[j]);
                    //     }
                    // }
                    self.tasks.splice(i, 1);
                    // for(j = 0, len = sonNodes.length; j < sonNodes; ++j) {
                    //     self.taskBar.removeChild(sonNodes[j]);
                    // }
                    break;
                }
            }

            // 子主题重定向
            for(j = 0, len = self.tasks.length; j < len; ++j) {
                if(j >= i && self.tasks[j].parentIndex == parentIndex) {
                    self.tasks[j].parentIndex = -1;
                } else if(self.tasks[j].parentIndex >= i) {
                    self.tasks[j].parentIndex -= 1;
                }
            }
            // DOM中删除
            target.parentNode.removeChild(target);
            // 重绘canvas
            self.canvas.getContext('2d').clearRect(0, 0, self.canvas.width, self.canvas.height);
            for(j = 0, len = self.tasks.length; j < len; ++j) {
                if(self.tasks[j].parentIndex == i - 1) {
                    // 是已经删除的节点的子节点,就把父节点改成被删节点的父节点
                    self.tasks[j].parentIndex = parentIndex;
                }
                // 画线
                if (self.tasks[j].parentIndex != -1) {
                    self.drawBezierCurve({
                        clientX: self.tasks[j].node.offsetLeft + self.tasks[j].node.offsetWidth / 2 + self.taskBar.offsetLeft,
                        clientY: self.tasks[j].node.offsetTop + self.tasks[j].node.offsetHeight / 2 + self.taskBar.offsetTop
                    }, self.ratio, self.tasks[self.tasks[j].parentIndex].node);
                }
            }
            // focusTask初始化
            self.focusTask = null;
        }
    },
    // 绘制主题间的连线
    drawBezierCurve: function (e, ratio, lastTask) {
        var self       = this,
            cxt        = self.canvas.getContext('2d'),
            taskWidth  = lastTask.offsetWidth,
            taskHeight = lastTask.offsetHeight,
            lastX      = lastTask.offsetLeft + taskWidth / 2,
            lastY      = lastTask.offsetTop + taskHeight / 2,
            newX       = e.clientX - self.taskBar.offsetLeft,
            newY       = e.clientY - self.taskBar.offsetTop,
            diffX      = newX - lastX,
            diffY      = newY - lastY;

        if(diffX > -1 * taskWidth && diffX < taskWidth && diffY > -1 * taskHeight && diffY < taskHeight) {
            return;
        }
        if(diffX > taskWidth) {
            newX -= taskWidth / 2;
            lastX += taskWidth / 2;
        } else if (diffX < -1 * taskWidth) {
            newX += taskWidth / 2;
            lastX -= taskWidth / 2;
        }
        if(diffY > taskHeight) {
            newY -= taskHeight / 2;
            lastY += taskHeight / 2;
        } else if (diffY < -1 * taskHeight) {
            newY += taskHeight / 2;
            lastY -= taskHeight / 2;
        }

        var diff  = {
                x: newX - lastX,
                y: newY - lastY
            },
            // 起点到终点连线与水平线的夹角(弧度)
            angle = Math.acos(diff.x / (Math.sqrt(Math.pow(diff.x)+Math.pow(diff.y))));

        cxt.strokeStyle = self.lineColor;
        cxt.fillStyle   = self.fillColor;
        cxt.lineWidth   = 5;
        cxt.globalCompositeOperation = 'source-over';
        cxt.beginPath();
        cxt.moveTo(lastX, lastY);
        cxt.bezierCurveTo((lastX+(1-ratio)*diff.x), (lastY+ratio*diff.y), (newX-ratio*diff.x), (newY-(1-ratio)*diff.y), newX, newY);
        cxt.stroke();
    }
};




(function () {

    var taskBar = new TaskBar();
    var sideBar = new SideBar();
    var nav     = new Nav();

    taskBar.sideBar = sideBar;
    sideBar.taskBar = taskBar;
    nav.taskBar     = taskBar;

})();
