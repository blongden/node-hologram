import * as fs from 'fs';
import {Example} from '../Example';
const Search = require('recursive-search');
const Marked = require('meta-marked');

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
                .replace(/\/\*(.*?)\\*\//g, '')
                .split('\n');
        } catch (e) {
            return [];
        }
    }

    getName(name: string): string {
        let split = name.split('.');
        split.pop();

        return split.join('-');
    }

    setOrder(data: Array<any>): Array<any> {
        let temp = data.filter(x => x.meta.order);
        temp.map((x, index) => {
            data.splice(index - 1, 1);
            data.splice(x.meta.order - 1, 0, x)
        });

        return data;
    }

    get(directories: Array<string>, ext: string): Array<string> {
        let _example: Example = new Example();
        let data: Array<string> = [];
        let meta: Object = {};


        directories.map(directory => {
            Search.recursiveSearchSync('*', this.root + directory)
                .map(file => {
                    let formattedFile: string = file.split('/').pop();

                    if (ext === formattedFile.split('.').pop()) {
                        let content: Array<string> = this.extractContent(fs.readFileSync(file, 'utf8'));

                        if (content.length) {
                            if (content[0].match(/doc/)) {
                                content.pop();
                                content.splice(0, 1);

                                let currentFile: any = {};
                                let name: string = this.getName(formattedFile);
                                let formattedContent: string = content.join('\n');
                                let markdownData: any;

                                if (name.charAt(0) === '_') {
                                    name = name.substring(1);
                                }

                                currentFile.name = name;

                                // Data recieved from Meta-Marked
                                markdownData = Marked(_example.insertExample(formattedContent, name));

                                currentFile.meta = markdownData.meta;
                                currentFile.content = markdownData.html;
                                currentFile.example = _example.extractExample(formattedContent);
                                currentFile.path = file;

                                data.push(currentFile);
                            }
                        }
                    }
                });
        });

        return this.setOrder(data);;
    }
}
