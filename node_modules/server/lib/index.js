var logger = require('./logger.js');

function ex() {
    var config = {};
    var stack = [];
    var out;

    function app(request, response) {
        var index = 0;
        function next_stack(error) {
            if (error) {
                if (out) {
                    return out.call(this, request, response, error);
                }
                return logger.error(error);
            }
            if (index < stack.length) {
                /**TODO: 此处为了性能未做try处理 **/
                stack[index++].handle.call(app, request, response, function (error) {
                    process.nextTick(function () {
                        next_stack(error);
                    });
                });
            } else {
                logger.debug('end');
            }
        }
        next_stack();
    }

    app.error = function (handle) {
        out = handle;
    };
    app.set = function () {
    };
    app.get = function () {
    };
    app.use = function (handle, route) {
        stack.push(
            {'handle':handle, 'route':route}
        );
    };
    app.route = function () {
    };
    return app;
}
module.exports = ex;
