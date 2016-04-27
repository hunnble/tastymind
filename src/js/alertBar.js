/**
 * 弹出层构造函数
 * @param {Object} config
 * @return {Node} virtualDOM
 */
function AlertBar (config) {
    this.className  = config.className || {
        alertWindow: '',
        title: '',
        content: '',
        btns: {}
    };
    this.titleTxt     = config.titleTxt || 'Default title';
    this.contentTxt   = config.contentTxt || 'Default content';
    this.btnsTxt      = config.btns || {};
    this.hasShader    = config.hasShader || false;
    this.isShow       = config.isShow || false;
    this.width        = config.width || 400;
    this.height       = config.height || 300;
    this.drag         = config.drag || false;
    this.flexible     = config.flexible || false;
    this.returnValues = config.returnValues || [];

    this.shader      = document.createElement('div');
    this.alertWindow = document.createElement('div');
    this.title       = document.createElement('h4');
    this.content     = document.createElement('p');
    this.input       = document.createElement('input');
    this.input.type  = 'text';
    this.btnBar      = document.createElement('div');
    this.btns        = [];
    this.startX      = 0;
    this.startY      = 0;
    this.returnValue;

    this.bindEvents();
};

/**
 * 渲染到virtualDOM中
 */
AlertBar.prototype.render = function () {
    var shader      = this.shader,
        alertWindow = this.alertWindow,
        title       = this.title,
        content     = this.content,
        input       = this.input,
        btnBar      = this.btnBar,
        btns        = this.btns,
        virtualDOM  = document.createElement('div');

    shader.className      = this.className['shader'];
    shader.style.width    = '100%';
    shader.style.height   = document.body.offsetHeight + 'px';
    shader.style.position = 'absolute';
    shader.style.top      = 0;
    shader.style.left     = 0;
    shader.style.display  = this.isShow ? 'block' : 'none';

    if(!this.hasShader) {
        shader.style.backgroundColor = 'inherit';
    }

    virtualDOM.appendChild(shader);

    alertWindow.className        = this.className['alertWindow'];
    alertWindow.style.width      = this.width + 'px';
    alertWindow.style.height     = this.height + 'px';
    alertWindow.style.position   = 'fixed';
    alertWindow.style.top        = window.innerHeight / 2 + 'px';
    alertWindow.style.left       = window.innerWidth / 2 + 'px';
    alertWindow.style.marginLeft = this.width / -2 + 'px';
    alertWindow.style.marginTop  = this.height / -2 + 'px';

    title.className = this.className['title'];
    title.innerHTML = this.titleTxt;

    content.className = this.className['content'];
    content.innerHTML = this.contentTxt;

    btnBar.innerHTML = '';
    for(var key in this.btnsTxt) {
        btns[key] = document.createElement('div');
        btns[key].className = this.className['btn'];
        btns[key].innerHTML = this.btnsTxt[key];
        btnBar.appendChild(btns[key]);
    }
    btnBar.style.position = 'absolute';
    btnBar.style.right    = 0;
    btnBar.style.bottom   = 10 + 'px';

    alertWindow.appendChild(title);
    alertWindow.appendChild(content);
    alertWindow.appendChild(btnBar);
    shader.appendChild(alertWindow);

    return shader;
};

/**
 * 控制显示与隐藏的接口
 * @return {Boolean}
 */
AlertBar.prototype.toggle = function () {
    this.isShow = this.isShow ? false : true;
    this.render();
};

/**
 * 绑定有关事件: 点击遮罩层、拖拽
 */
AlertBar.prototype.bindEvents = function () {
    var self = this;

    addHandler(this.shader, 'mousedown', function (e) {
        var target = getTarget(e);

        if(target === self.shader) {
            self.toggle();
        }
    });

    addHandler(this.btnBar, 'click', function (e) {
        var target = getTarget(e),
            index  = -1;

        if(hasClassName(target, self.className['btn'])) {
            index = Array.prototype.indexOf.call(self.btnBar.querySelectorAll('div'), target);
            self.toggle();
            self.returnValue = self.returnValues[index];
        }
    });

    if(this.drag) {
        addHandler(this.title, 'mousedown', function (e) {
            e = e || window.event;
            self.startX = e.clientX - self.alertWindow.offsetLeft;
            self.startY = e.clientY - self.alertWindow.offsetTop;
            addHandler(self.alertWindow, 'mousemove', dragging);
        });
        addHandler(document, 'mouseup', function(e) {
            e = e || window.event;
            removeHandler(self.alertWindow, 'mousemove', dragging);
        });
    }

    function dragging(e) {
        e = e || window.event;

        self.alertWindow.style.left = e.clientX - self.startX + self.alertWindow.offsetWidth / 2 + 'px';
        self.alertWindow.style.top  = e.clientY - self.startY + self.alertWindow.offsetHeight / 2 + 'px';

        var documentElement = document.body || document.documentElement;

        // 边界检查
        if(self.alertWindow.offsetTop > (window.innerHeight - self.alertWindow.offsetHeight)) {
            self.alertWindow.style.top = (window.innerHeight - self.alertWindow.offsetHeight) + self.alertWindow.offsetHeight / 2 + 'px';
        }
        if(self.alertWindow.offsetTop < 0) {
            self.alertWindow.style.top = self.alertWindow.offsetHeight / 2 + 'px';
        }
        if(self.alertWindow.offsetLeft > (documentElement.offsetWidth - self.alertWindow.offsetWidth)) {
            self.alertWindow.style.left = (documentElement.offsetWidth - self.alertWindow.offsetWidth) + self.alertWindow.offsetWidth / 2 + 'px';
        }
        if(self.alertWindow.offsetLeft < 0) {
            self.alertWindow.style.left = self.alertWindow.offsetWidth / 2 + 'px';
        }
    };
};


