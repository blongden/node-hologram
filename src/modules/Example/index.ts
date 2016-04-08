export class Example {
    exampleTemplate(name: string): string {
        return `<iframe class='hologram-styleguide__item-example' src='./${name}-example.html' frameborder='0' scrolling='no' onload='resizeIframe(this)'></iframe>`;
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
}
