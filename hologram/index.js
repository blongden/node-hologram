'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const marked = require('marked');
const handlebars = require('handlebars');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

class Hologram {
    constructor(options) {
        this.reset(options);
    }

    reset(options) {
        this.root = options.root;
        this.dest = options.dest;
        this.styles = options.styles || false;

        this.ext = options.ext || {
                styles: 'scss',
                scripts: 'js'
            };
        this.title = options.title || false;
        this.colors = options.colors || false;
        this.scripts = options.scripts || false;
        this.customStylesheet = options.customStylesheet || false;

        this.regex = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//;
        this.data = {};
    }

    staticFiles() {
        const data = this.data;

        if (this.customStylesheet) {
            data.hologramStylesheet = this.customStylesheet;
        } else {
            data.hologramStylesheet = './hologram.css';
        }

        if (this.scripts) {
            data.script = this.scripts.main;
        }

        data.stylesheet = this.styles.main;
    }

    getData(dir, type) {
        let content;
        const _this = this;
        const root = this.root;
        const data = this.data[type] = [];

        dir.map(currentDir => fs
            .readdirSync(root + currentDir)
            .map(file => {
                if (file.split('.')[1] === this.ext[type]) {
                    content = fs
                        .readFileSync(`${root + currentDir}/${file}`, 'utf8')
                        .match(_this.regex)[0]
                        .replace(/([\/\*][*\/])/g, '')
                        .split('\n');

                    if (content[0].match(/doc/)) {
                        content.splice(0, 1);

                        data
                            .push({
                                name: file.split('.')[0],
                                content: marked(content.join('\n'))
                            });
                    }
                }
            }));
    }

    generate() {
        const _this = this;
        const data = this.data;
        const dest = `${this.root + this.dest}/hologram`;
        const layout = fs.readFileSync(`${__dirname}/views/layout.html`, 'utf8');
        const template = handlebars.compile(layout);

        if (this.title) {
            data.title = this.title;
        }

        if (this.colors) {
            data.colors = this.colors;
        }

        mkdirp(dest, function (err) {
            if (err) {
                console.error(err);
            }

            if (!_this.customStylesheet) {
                fs.writeFileSync(
                    `${dest}/hologram.css`,
                    fs.readFileSync(`${__dirname}/styles/main.css`, 'utf8'),
                    'utf8'
                );
            }

            fs.writeFileSync(
                `${dest}/index.html`,
                template(data),
                'utf8'
            );
        });
    }

    init() {
        if (this.styles) {
            this.getData(this.styles.dir, 'styles');
        }

        if (this.scripts) {
            this.getData(this.scripts.dir, 'scripts');
        }

        if (this.styles || this.scripts) {
            this.staticFiles();
            this.generate();
        } else {
            console.log('Hologram failed.');
            console.log('Please check you have correctly configured your Hologram options.');
        }
    }
}

module.exports = options => new Hologram(options);
