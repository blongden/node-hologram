import * as fs from 'fs';

const Mkdirp = require('mkdirp');
const Handlebars = require('handlebars');

export class View {
    dest: string;

    constructor(dest: string) {
        this.dest = dest;
    }

    compile(context: any, layout: string): string {
        return Handlebars.compile(layout)(context);
    }

    create(name: string, data: any, layout: string): void {
        Mkdirp(this.dest, err => {
            if (err) {
                console.error(err);
            }

            let filename: string = name === 'index' ? 'index.html' : `${name}-example.html`;

            fs.writeFileSync(`${this.dest}/${filename}`, this.compile(data, layout), 'utf8');
        });
    }
}
