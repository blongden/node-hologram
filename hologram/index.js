'use strict';

const fs = require('fs');
const marked = require('marked')
const handlebars = require('handlebars');

class Hologram {
    constructor(options) {
        this.root = options.root;
        this.dest = options.dest;
        this.styles = options.styles || false;
        this.scripts = options.scripts || false;

        this.regex = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//;
        this.data = {};

        this.init();
    }

    getData(dir, type) {
        const _this = this;
        this.data[type] = {};
        this.data[type].items = [];

        dir.map(styleDirectory =>
            fs
            .readdirSync(styleDirectory)
            .map(x => {
                if (x.split('.')[1] === 'scss') {
                    return _this.data[type].items
                        .push({
                            name: x.split('.')[0],
                            content: _this.convertMarkdown(
                                fs.readFileSync(`${styleDirectory}/${x}`, 'utf8')
                                .match(_this.regex)[0]
                                .replace(/([\/\*][*\*\/])/g, '')
                            )
                        });
                }
            }));

        this.data[type];
    }

    convertMarkdown(md) {
        return marked(md);
    }

    generate() {
        const layout = fs.readFileSync(`${__dirname}/views/layout.html`, 'utf8');
        const template = handlebars.compile(layout);
        const data = this.data;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                fs.writeFileSync(
                    `${this.dest}/${key}.html`,
                    template(data[key]),
                    'utf8'
                );
            }
        }
    }

    init() {
        this.styles ? this.getData(this.styles.paths.dir, 'styles') : false;
        this.scripts ? this.getData(this.scripts.paths.dir, 'scripts') : false;

        this.generate();
    }
}

module.exports = options => new Hologram(options);
