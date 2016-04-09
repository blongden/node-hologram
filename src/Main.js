/// <reference path="../libs/node.d.ts" />
"use strict";
var fs = require('fs');
var View_1 = require('./modules/View');
var Data_1 = require('./modules/Data');
var Main = (function () {
    function Main(options) {
        this.reset(options);
        // Data to be passed to view
        this.data = {};
        this.data.title = this.title;
        this.data.description = this.description;
        this.data.colors = this.colors;
        this.data.webfonts = this.webfonts;
        this.data.script = this.scripts.files;
        this.data.stylesheet = this.styles.files;
        this.data.customStylesheet = this.customStylesheet;
        this.data.highlight = this.highlight;
        this.data.hologramStylesheet = fs.readFileSync(__dirname + "/styles/main.css", 'utf8');
        this.data.idelink = this.idelink;
    }
    Main.prototype.reset = function (options) {
        this.root = options.root;
        this.dest = options.dest;
        this.styles = options.styles;
        // optional
        this.ext = options.ext || { styles: 'scss', scripts: 'js' };
        this.title = options.title || '';
        this.description = options.description || '';
        this.colors = options.colors || '';
        this.webfonts = options.webfonts || '';
        this.scripts = options.scripts || '';
        this.customStylesheet = options.customStylesheet || '';
        this.highlight = options.highlight || true;
        this.idelink = options.idelink || false;
    };
    Main.prototype.init = function () {
        var _this = this;
        var _data = new Data_1.Data(this.root);
        var _view = new View_1.View(this.root + this.dest);
        var appLayout = fs.readFileSync(__dirname + "/templates/layout.hbs", 'utf8');
        var exampleLayout = fs.readFileSync(__dirname + "/templates/example.hbs", 'utf8');
        if (this.styles) {
            this.data.styles = _data.get(this.styles.dir, this.ext.styles);
            // Meta
            this.data.styles
                .filter(function (x) { return x.meta; })
                .map(function (x) {
                var meta = x.meta;
                if (meta.colors) {
                    Object.keys(meta.colors).forEach(function (k) {
                        var v = meta.colors[k];
                        _this.data.colors[k] = v;
                    });
                }
            });
            // Views
            this.data.styles
                .filter(function (x) { return x.example.length > 1; })
                .map(function (x) { return _view.create(x.name, { app: _this.data, data: x }, exampleLayout); });
        }
        if (this.scripts) {
            this.data.scripts = _data.get(this.scripts.dir, this.ext.scripts);
            this.data.scripts
                .filter(function (x) { return x.example.length > 1; })
                .map(function (x) { return _view.create(x.name, { app: _this.data, data: x }, exampleLayout); });
        }
        if (this.styles || this.scripts) {
            _view.create('index', this.data, appLayout);
        }
        else {
            console.error('Hologram failed.');
            console.error('Please check you have correctly configured your Hologram options.');
        }
    };
    return Main;
}());
module.exports = function (_) { return new Main(_); };
//# sourceMappingURL=Main.js.map