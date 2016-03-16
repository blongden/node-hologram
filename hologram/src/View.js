var Handlebars = require('handlebars');
var View = (function () {
    function View() {
    }
    View.compile = function (context, layout) {
        return Handlebars.compile(layout)(context);
    };
    return View;
})();
exports.View = View;
//# sourceMappingURL=View.js.map