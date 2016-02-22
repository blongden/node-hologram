## Node Hologram

A node clone of [Hologram](https://github.com/trulia/hologram)

### Usage

    npm install --save-dev node-hologram

Then require in your script file:

    require('hologram')(options)

### Options

    {
        /* root directory */
        root: __dirname,

        /* Destination Directory */
        dest: '/dist',

        /* Styles config */
        styles: {
            /* Directories that will be used */
            dir: ['/scss', '/scss/modules'],
            /* Main styles file */
            main: '/scss/main.scss'
        },

        /* Scripts config */
        scripts: {
            /* Directories that will be used */
            dir: ['/js', '/js/modules'],
            /* Main styles file */
            main: '/js/main.js'
        }
    }

