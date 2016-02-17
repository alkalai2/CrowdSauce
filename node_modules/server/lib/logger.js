var logger = require('tracer');
module.exports = logger.colorConsole({
    'format':[
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
        {
            'info':'{{timestamp}} <{{title}}> {{message}} (in {{file}})',
            'error':'{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:{{stacklist}}' // error format
        }
    ],
    'dateformat':'HH:MM:ss.L',
    'preprocess':function (data) {
        if (data.title === 'error') {
            var callstack = '', len = data.stack.length;
            for (var i = 0; i < len; i += 1) {
                callstack += '\n' + data.stack[i];
            }
            data.stacklist = callstack;
        }

        data.title = data.title.toUpperCase();
    }
});