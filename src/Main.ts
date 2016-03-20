/// <reference path="../libs/node.d.ts" />

import * as fs from 'fs';
import {View} from './modules/View';
import {Data} from './modules/Data';

interface Options {
    root: string;
    dest: string;
    styles: any;
    ext?: any;
    title?: string;
    colors?: string;
    scripts?: any;
    customStylesheet?: string;
}

class Main implements Options {
    ext: any;
    data: any;
    styles: any;
    root: string;
    dest: string;
    title: string;
    colors: string;
    scripts: any;
    customStylesheet: string;

    constructor(options: any) {
        this.reset(options);

        // Data to be passed to view
        this.data = {};
        this.data.title = this.title;
        this.data.colors = this.colors;
        this.data.script = this.scripts.main;
        this.data.stylesheet = this.styles.main;
        this.data.customStylesheet = this.customStylesheet;
    }

    reset(options: any): void {
        this.root = options.root;
        this.dest = options.dest;
        this.styles = options.styles;

        // optional
        this.ext = options.ext || '';
        this.title = options.title || '';
        this.colors = options.colors || '';
        this.scripts = options.scripts || '';
        this.customStylesheet = options.customStylesheet || `${__dirname}/styles/main.css`;
    }

    init(): void {
        const _data = new Data(this.root);
        const _view = new View(this.root + this.dest);
        const appLayout = fs.readFileSync(`${__dirname}/templates/layout.hbs`, 'utf8');
        const exampleLayout = fs.readFileSync(`${__dirname}/templates/example.hbs`, 'utf8');


        if (this.styles) {
            this.data.styles = _data.get(this.styles.dir, this.ext.styles);
            this.data.styles
                .filter(x => x.example)
                .map(x => _view.create(x.name, x, exampleLayout));
        }

        if (this.scripts) {
            this.data.scripts = _data.get(this.scripts.dir, this.ext.scripts);
            this.data.scripts
                .filter(x => x.example)
                .map(x => _view.create(x.name, x, exampleLayout));
        }

        if (this.styles || this.scripts) {
            _view.create('index', this.data, appLayout);
        } else {
            console.error('Hologram failed.');
            console.error('Please check you have correctly configured your Hologram options.');
        }
    }
}

module.exports = _ => new Main(_);
