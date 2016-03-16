/// <reference path="../../typings/node.d.ts" />
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
    function Data() {
    }
    Data.prototype.init = function (options) {
        this.options = options;
    };
    Data.extractContent = function (s) {
        try {
            return s
                .match(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//)[0]
                .replace(/([\/\*][*\/])/g, '')
                .split('\n');
        }
        catch (e) {
            return false;
        }
    };
    Data.extractExample = function (s) {
        var temp = s[0].split('\n');
        temp.splice(0, 1);
        temp.pop();
        return temp.join('').trim();
    };
    Data.prototype.get = function (directories, type) {
        var _this = this;
        var data = [];
        directories.map(function (directory) {
            fs.readdirSync(_this.options.root + directory).map(function (file) {
                if (file.split('.').pop() === _this.options.ext[type]) {
                    var content = extractContent(fs.readFileSync((root + currentDir) + "/" + file, 'utf8'));
                    if (content[0].match(/doc/)) {
                        var currentFile = {};
                        var name_1 = file.split('.').unshift();
                        var formattedContent = content.join('');
                        currentFile.name = name_1.charAt(0) === '_' ? name_1.substring(1) : name_1;
                        currentFile.content = Marked(formattedContent);
                        currentFile.example = '';
                        data.push(currentFile);
                    }
                }
            });
        });
        return data;
    };
    return Data;
})();
exports.Data = Data;
//# sourceMappingURL=Data.js.map