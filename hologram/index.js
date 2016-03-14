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
    sanitize: false,
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

        this.regex = {
            main: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
            example: /<example>[^*]+([^*]+)<\/example>/
        };

        this.iframeTemplate = name =>
            `<iframe
                class='hologram-styleguide__item-example'
                src='./examples/${name}.html'
                frameborder='0' scrolling='no'
                onload='resizeIframe(this)'>
            </iframe>`;

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

        data.stylesheet = fs.readFileSync(this.root + this.styles.main, 'utf8');
    }

    getExample(example) {
        if (example) {
            console.log(example[0]);
            return example[0]
                .split('\n')
                .filter(x =>
                    !x.trim()
                    .match(/(<example>|<\/example>)/)
                )
                .join('');
        }
    }

    getData(dir, type) {
        let content, name, example;
        const _this = this;
        const root = this.root;
        const data = this.data[type] = [];

        dir.map(currentDir => fs
            .readdirSync(root + currentDir)
            .map(file => {
                if (file.split('.')[1] === this.ext[type]) {
                    content = fs
                        .readFileSync(`${root + currentDir}/${file}`, 'utf8')
                        .match(_this.regex.main);

                    if (content) {
                        content = content[0]
                            .replace(/([\/\*][*\/])/g, '')
                            .split('\n');

                        if (content[0].match(/doc/)) {
                            content.splice(0, 1);

                            name = file.split('.')[0];

                            if (name.charAt(0) === '_') {
                                name = name.substring(1);
                            }

                            example = _this
                                .getExample(
                                    content
                                    .join('\n')
                                    .match(_this.regex.example)
                                );

                            data
                                .push({
                                    name: name,
                                    content: marked(content
                                        .join('\n')
                                        .replace(
                                            _this.regex.example,
                                            _this.iframeTemplate(name)
                                        )
                                    ),
                                    example: example
                                });
                        }
                    }
                }
            }));
    }

    compileView(context, layout) {
        return handlebars.compile(layout)(context);
    }

    generateExamples(type) {
        const _this = this;
        const dest = `${this.root + this.dest}/hologram/examples`;
        const layout = fs.readFileSync(
            `${__dirname}/views/example.html`, 'utf8'
        );

        this.data[type].map(
            item => {
                if (item.example) {
                    mkdirp(dest, (err) => {
                        if (err) {
                            console.error(err);
                        }

                        fs.writeFileSync(
                            `${dest}/${item.name}.html`,
                            _this.compileView({
                                title: item.name,
                                script: _this.data.script,
                                stylesheet: _this.data.stylesheet,
                                example: item.example
                            }, layout),
                            'utf8'
                        );
                    });
                }
            }
        );
    }

    generateStyleguide() {
        const _this = this;
        const data = this.data;
        const dest = `${this.root + this.dest}/hologram`;
        const layout = fs.readFileSync(
            `${__dirname}/views/layout.html`, 'utf8'
        );

        if (this.title) {
            data.title = this.title;
        }

        if (this.colors) {
            data.colors = this.colors;
        }

        mkdirp(dest, (err) => {
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
                _this.compileView(data, layout),
                'utf8'
            );

            if (_this.styles) {
                _this.generateExamples('styles');
            }

            if (_this.scripts) {
                _this.generateExamples('scripts');
            }
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
            this.generateStyleguide();
        } else {
            console.log('Hologram failed. Check your config.');
        }
    }
}

module.exports = options => new Hologram(options);
