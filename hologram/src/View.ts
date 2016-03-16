import Handlebars = require('handlebars');

export class View {
    static compile(context:Object, layout:String):String {
        return Handlebars.compile(layout)(context);
    }
}