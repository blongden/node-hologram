## Node Hologram

A node clone of [Hologram](https://github.com/trulia/hologram)

### Usage

    npm install --save-dev node-hologram

Then require in your script file:

    const hologram = require('node-hologram')(options);
    hologram.init();

### Options

__root__

*required*

The root of your project. All paths provided will be relevant to this.

    root: __dirname

__dest__

*required*

    dest: `/path/to/dest`

The path to the folder where Hologram's styleguide will be placed

__styles__

*required*

Information on which folders your stylesheets are contained in, as well the path to the compiled stylesheet

    styles: {
        dir: ['path/to/dir', 'path/to/other'],
        main: '/path/to/mycompiledcss.css'
    }

__ext__

*optional*

The file extensions which will be used by Hologram, defaults to *scss* and *js*

    ext: ['scss', 'js']

__title__

*optional*

The title of your styleguide

    title: 'My awesome app'

__colors__

*optional*

The styleguides color pallette

    colors: {
        red: '#f00',
        green: '#0f0',
        blut: '#00f'
    }

__scripts__

*optional*

Information on which folders your scripts are contained in, as well as the path to the bundle script file

    scripts: {
        dir: ['/path/to/dir', '/path/to/other'],
        main: '/path/to/myscript.js'
    }

__customStylesheet__

*optional*

Add a custom stylesheet to the style guide

    customStylesheet: '/path/to/customStylesheet.css'

##Example of everything out together

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
