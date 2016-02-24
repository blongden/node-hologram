## Node Hologram

A node clone of [Hologram](https://github.com/trulia/hologram)

Allows for the easy generation of styleguides from markdown documentation.

### Usage

```
npm install --save-dev node-hologram
```

Then require in your script file:

```javascript
const hologram = require('node-hologram')(options);
hologram.init();
```

### Options

__root__ `required`

The root of your project. All paths provided will be relevant to this.

```javascript
root: __dirname
```

__dest__ `required`

```javascript
dest: `/path/to/dest`
```

The path to the folder where Hologram's styleguide will be placed

__styles__ `required`

Information on which folders your stylesheets are contained in, as well the path to the compiled stylesheet

```javascript
styles: {
    dir: ['path/to/dir', 'path/to/other'],
    main: '/path/to/mycompiledcss.css'
}
```

__ext__ `optional`

The file extensions which will be used by Hologram, defaults to *scss* and *js*

```javascript
ext: ['scss', 'js']
```

__title__ `optional`

The title of your styleguide

```javascript
title: 'My awesome app'
```

__colors__ `optional`

The styleguides color pallette, will be displayed in styles list

```javascript
colors: {
    red: '#f00',
    green: '#0f0',
    blur: '#00f'
}
```

__scripts__ `optional`

Information on which folders your scripts are contained in, as well as the path to the bundle script file

```javascript
scripts: {
    dir: ['/path/to/dir', '/path/to/other'],
    main: '/path/to/myscript.js'
}
```

__customStylesheet__ `optional`

Add a custom stylesheet to the style guide

```javascript
customStylesheet: '/path/to/customStylesheet.css'
```

##Examples

__Gulp__

```javascript

const options = {
    root: __dirname,
    ext: ['scss', 'js'],
    dest: `/path/to/dest`,
    title: 'My awesome app',
    customStylesheet: '/path/to/customStylesheet.css'
    colors: {
        red: '#f00',
        green: '#0f0',
        blut: '#00f'
    },
    styles: {
        dir: ['path/to/dir', 'path/to/other'],
        main: '/path/to/mycompiledcss.css'
    },
    scripts: {
        dir: ['/path/to/dir', '/path/to/other'],
        main: '/path/to/myscript.js'
    }
};

const hologram = require('node-hologram')(options);

gulp.task('hologram', () => hologram.init());

```
