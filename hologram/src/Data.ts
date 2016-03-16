/// <reference path="../../typings/node.d.ts" />
import * as fs from 'fs';
import Marked = require('marked');

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
    options:Object;

    init(options:Object):any {
        this.options = options;
    }

    static extractContent(s:String):any {
        try {
            return s
                .match(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//)[0]
                .replace(/([\/\*][*\/])/g, '')
                .split('\n');
        } catch (e) {
            return false;
        }
    }

    static extractExample(s:String):String {
        let temp = s[0].split('\n');
        temp.splice(0, 1);
        temp.pop();

        return temp.join('').trim();
    }

    get(directories:Array<String>, type:String):Array<any> {
        let data:Array<String> = [];

        directories.map(directory => {
            fs.readdirSync(this.options.root + directory).map(file => {

                if (file.split('.').pop() === this.options.ext[type]) {
                    let content:String = extractContent(fs.readFileSync(`${root + currentDir}/${file}`, 'utf8'));

                    if (content[0].match(/doc/)) {
                        let currentFile:Object = {};
                        let name:String = file.split('.').unshift();
                        let formattedContent:String = content.join('');

                        currentFile.name = name.charAt(0) === '_' ? name.substring(1) : name;
                        currentFile.content = Marked(formattedContent);
                        currentFile.example = '';

                        data.push(currentFile);
                    }
                }
            });
        });

        return data;
    }
}