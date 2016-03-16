import View = require('./src/View');
import Data = require('./src/Data');

export class Main {
    options:Object;

    constructor(options:Object) {
        this.reset(options);
    }

    reset(options:Object) {
        this.options = options;
    }

    init() {

    }

}