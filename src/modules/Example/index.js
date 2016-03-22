var Example = (function () {
    function Example() {
    }
    Example.prototype.exampleTemplate = function (name) {
        return "<iframe class='hologram-styleguide__item-example' src='./" + name + "-example.html' frameborder='0' scrolling='no' onload='resizeIframe(this)'></iframe>";
    };
    Example.prototype.extractExample = function (s) {
        var regex = /<example>[^*]+([^*]+)<\/example>/;
        if (s.match(regex)) {
            var temp = s.match(regex)[0].split('\n');
            temp.splice(0, 1);
            temp.pop();
            return temp
                .map(function (x) { return x.trim(); })
                .join('');
        }
        else {
            return '';
        }
    };
    Example.prototype.insertExample = function (s, name) {
        var regex = /<example>[^*]+([^*]+)<\/example>/;
        if (s.match(regex)) {
            var temp = s.match(regex)[0].split('\n');
            temp.splice(0, 1);
            temp.pop();
            var example = temp
                .map(function (x) { return x.trim(); })
                .join('');
            return s.replace(regex, this.exampleTemplate(name));
        }
        else {
            return s;
        }
    };
    return Example;
})();
exports.Example = Example;
//# sourceMappingURL=index.js.map