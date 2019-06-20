const moment = require('moment');

exports.now = () => moment().format('YY/MM/DD hh:mm:ss');
exports.nano = () => process.hrtime().join('');
exports.ms = () => moment().valueOf();