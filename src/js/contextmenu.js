function Contextmenu () {
    this.contextmenu = document.querySelector('#contextmenu');
    this.options = this.contextmenu.querySelectorAll('p');

    this.bindEvents();
};

Contextmenu.prototype.bindEvents = function () {
    var self = this;
    addHandler(document, 'contextmenu', function (e) {
        preventDefault(e);
    });
};

Contextmenu.prototype.showContextmenu = function (e) {
    var target  = getTarget(e);
    e = e || window.event;
    this.contextmenu.style.left    = e.clientX + 'px';
    this.contextmenu.style.top     = e.clientY + 'px';
    this.contextmenu.style.display = 'block';
};
