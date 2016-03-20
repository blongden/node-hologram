"use strict";
var fs = require('fs');
var Marked = require('marked');
Marked.setOptions({
    renderer: new Marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});
var Data = (function () {
    function Data(root) {
        this.root = root;
    }
    Data.prototype.exampleTemplate = function (name) {
        return "<iframe class='hologram-styleguide__item-example' src='./" + name + "-example.html' frameborder='0' scrolling='no' onload='resizeIframe(this)'></iframe>";
    };
    Data.prototype.extractContent = function (s) {
        try {
            return s
                .match(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//)[0]
                .replace(/([\/\*][*\/])/g, '')
                .split('\n');
        }
        catch (e) {
            return [];
        }
    };
    Data.prototype.extractExample = function (s) {
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
    Data.prototype.insertExample = function (s, name) {
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
    Data.prototype.get = function (directories, ext) {
        var _this = this;
        var data = [];
        directories.map(function (directory) {
            fs.readdirSync(_this.root + directory).map(function (file) {
                if (ext === file.split('.').pop()) {
                    var content_1 = _this.extractContent(fs.readFileSync((_this.root + directory) + "/" + file, 'utf8'));
                    if (content_1[0].match(/doc/)) {
                        var currentFile = {};
                        var name_1 = file.split('.')[0];
                        var formattedContent = content_1
                            .map(function (x, index) { return index === 0 || index === content_1.length ? '' : x; })
                            .join('\n');
                        currentFile.name = name_1.charAt(0) === '_' ? name_1.substring(1) : name_1;
                        currentFile.content = Marked(_this.insertExample(formattedContent, name_1));
                        currentFile.example = _this.extractExample(formattedContent);
                        data.push(currentFile);
                    }
                }
            });
        });
        return data;
    };
    return Data;
}());
exports.Data = Data;
//# sourceMappingURL=index.js.map