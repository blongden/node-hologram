import * as fs from 'fs';
import {Example} from '../Example';

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

    get(directories: Array<string>, ext: string): Array<string> {
        let _example: Example = new Example();
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
                        currentFile.content = Marked(_example.insertExample(formattedContent, name));
                        currentFile.example = _example.extractExample(formattedContent);

                        data.push(currentFile);
                    }
                }
            });
        });

        return data;
    }
}
