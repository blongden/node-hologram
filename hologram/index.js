'use strict';

const fs = require('fs');
const marked = require('marked')
const handlebars = require('handlebars');

class Hologram {
    constructor(options) {
        this.dest = options.dest;
        this.ext = options.ext || 'scss';
        this.colors = options.colors || false;
        this.styles = options.styles || false;
        this.scripts = options.scripts || false;

        this.regex = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//;
        this.data = {};
    }

    getData(dir, type) {
        const _this = this;
        this.data[type] = {};
        this.data[type].items = [];

        dir.map(styleDirectory =>
            fs
            .readdirSync(styleDirectory)
            .map(x => {
                if (x.split('.')[1] === this.ext) {
                    let content = fs
                        .readFileSync(`${styleDirectory}/${x}`, 'utf8')
                        .match(_this.regex)[0]
                        .split('\n');

                    if (content[0].match(/doc/)) {
                        content[0] = '';
                        return _this.data[type].items
                            .push({
                                name: x.split('.')[0],
                                content: marked(
                                    content
                                    .join('')
                                    .replace(/([\/\*][*\*\/])/g, ''))
                            });
                    }
                }
            }));

        this.data[type];
    }

    generate() {
        const layout = fs.readFileSync(`${__dirname}/views/layout.html`, 'utf8');
        const template = handlebars.compile(layout);
        const data = this.data;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (this.colors && key === 'styles') {
                    data[key].colors = this.colors;
                }

                fs.writeFileSync(
                    `${this.dest}/${key}.html`,
                    template(data[key]),
                    'utf8'
                );
            }
        }
    }

    init() {
        this.styles ? this.getData(this.styles.dir, 'styles') : false;
        this.scripts ? this.getData(this.scripts.dir, 'scripts') : false;

        this.generate();
    }
}

module.exports = options => new Hologram(options);
