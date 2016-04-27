var Nav = function (taskBar) {
    this.nav = document.querySelector('nav');
    this.options = this.nav.querySelectorAll('.options');
    this.bindEvents();
    this.taskBar;
};

Nav.prototype.bindEvents = function () {
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
        var target = getTarget(e),
            funcs  = self.options[0].querySelectorAll('p');

        if(target == funcs[0]) {
            self.taskBar.tasks = [];
            self.taskBar.taskBar.innerHTML = '';
            self.taskBar.canvas.getContext('2d').clearRect(0, 0, self.taskBar.canvas.width, self.taskBar.canvas.height);
        } else if (target == funcs[1]) {}
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
            funcs  = self.options[4].querySelectorAll('p');
    });
};
