const log = require('core/log');
const error = (log_type, name, message, data) => log[log_type]({ name, message, data }) || ({ error: true, name, message, data });
exports.critError = (name, message, data) => error('critError', name, message, data);
exports.logicError = (name, message, data) => error('error', name, message, data);
exports.connectionError = (name, message, data) => error('error', name, message, data);
exports.dbError = (name, message, data) => error('dbError', name, message, data);
