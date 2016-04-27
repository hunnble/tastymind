var SideBar = function () {
    this.sideBar = document.querySelector('#sideBar');
    this.taskBar;

    this.bindEvents();
};

SideBar.prototype.bindEvents = function () {
    var self = this;

    addHandler(self.sideBar, 'click', function (e) {
        var target = getTarget(e),
            lastChoosed,
            chooseBar,
            titles,
            contents,
            index;

        if(target.tagName.toLowerCase() == 'li') {
            chooseBar                 = target.parentNode.parentNode;
            lastChoosed               = chooseBar.querySelectorAll('.currentChoose');
            titles                    = target.parentNode.querySelectorAll('li');
            contents                  = chooseBar.querySelectorAll('div');
            index                     = Array.prototype.indexOf.call(titles, target);
            removeClassName(lastChoosed[0], 'currentChoose');
            removeClassName(lastChoosed[1], 'currentChoose');
            addClassName(contents[index], 'currentChoose');
            addClassName(target, 'currentChoose');
        }
    });
};
