import * as fs from 'fs';

const Marked = require('marked');

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

export class Data {
    root: string;

    constructor(root: string) {
        this.root = root;
    }

    exampleTemplate(name: string): string {
        return `<iframe class='hologram-styleguide__item-example' src='./${name}-example.html' frameborder='0' scrolling='no' onload='resizeIframe(this)'></iframe>`;
    }

    extractContent(s: string): Array<string> {
        try {
            return s
                .match(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//)[0]
                .replace(/([\/\*][*\/])/g, '')
                .split('\n');
        } catch (e) {
            return [];
        }
    }

    extractExample(s: string): string {
        let regex: RegExp = /<example>[^*]+([^*]+)<\/example>/;

        if (s.match(regex)) {
            let temp: Array<string> = s.match(regex)[0].split('\n');

            temp.splice(0, 1);
            temp.pop();

            return temp
                .map(x => x.trim())
                .join('');
        } else {
            return '';
        }
    }

    insertExample(s: string, name: string): string {
        let regex: RegExp = /<example>[^*]+([^*]+)<\/example>/;

        if (s.match(regex)) {
            let temp: Array<string> = s.match(regex)[0].split('\n');

            temp.splice(0, 1);
            temp.pop();

            let example: string = temp
                .map(x => x.trim())
                .join('');

            return s.replace(regex, this.exampleTemplate(name));
        } else {
            return s;
        }
    }

    get(directories: Array<string>, ext: string): Array<string> {
        let data: Array<string> = [];

        directories.map(directory => {
            fs.readdirSync(this.root + directory).map(file => {

                if (ext === file.split('.').pop()) {
                    let content: Array<string> = this.extractContent(
                        fs.readFileSync(`${this.root + directory}/${file}`, 'utf8'));

                    if (content[0].match(/doc/)) {
                        let currentFile: any = {};
                        let name: string = file.split('.')[0];
                        let formattedContent: string = content
                            .map((x, index) => index === 0 || index === content.length ? '' : x)
                            .join('\n');

                        currentFile.name = name.charAt(0) === '_' ? name.substring(1) : name;
                        currentFile.content = Marked(this.insertExample(formattedContent, name));
                        currentFile.example = this.extractExample(formattedContent);

                        data.push(currentFile);
                    }
                }
            });
        });

        return data;
    }
}
