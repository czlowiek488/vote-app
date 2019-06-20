const { now } = require('core/time');

const color = {
    normal: '\x1b[0m',
    text: {
        red: '\x1b[31m',
        cyan: '\x1b[36m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
    },
    background: {
        white: '\x1b[47m',
        cyan: '\x1b[46m',
        red: '\x1b[41m',
    }
}

const log = (args, message_color, trace = false) => console[trace ? 'trace' : 'log'](message_color, now(), color.normal, ...args);

exports.error = (...args) => log(args, color.text.red);
exports.critError = (...args) => log(args, color.background.red);
exports.dbError = (...args) => log(args, color.text.green);