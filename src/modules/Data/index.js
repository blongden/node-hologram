"use strict";
var fs = require('fs');
var Example_1 = require('../Example');
var Marked = require('meta-marked');
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
    Data.prototype.extractContent = function (s) {
        try {
            return s
                .match(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//)[0]
                .replace(/\/\*(.*?)\\*\//g, '')
                .split('\n');
        }
        catch (e) {
            return [];
        }
    };
    Data.prototype.getName = function (name) {
        var split = name.split('.');
        split.pop();
        return split.join('-');
    };
    Data.prototype.get = function (directories, ext) {
        var _this = this;
        var _example = new Example_1.Example();
        var data = [];
        directories.map(function (directory) {
            fs.readdirSync(_this.root + directory).map(function (file) {
                if (ext === file.split('.').pop()) {
                    var content = _this.extractContent(fs.readFileSync((_this.root + directory) + "/" + file, 'utf8'));
                    if (content.length) {
                        if (content[0].match(/doc/)) {
                            content.pop();
                            content.splice(0, 1);
                            var currentFile = {};
                            var name_1 = _this.getName(file);
                            var formattedContent = content.join('\n');
                            var markdownData = void 0;
                            if (name_1.charAt(0) === '_') {
                                name_1 = name_1.substring(1);
                            }
                            currentFile.name = name_1;
                            // Data recieved from file
                            markdownData = Marked(_example.insertExample(formattedContent, name_1));
                            console.log(markdownData.meta);
                            currentFile.content = markdownData.html;
                            currentFile.example = _example.extractExample(formattedContent);
                            currentFile.path = (_this.root + directory) + "/" + file;
                            data.push(currentFile);
                        }
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