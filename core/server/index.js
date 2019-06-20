
const { critError } = require('core/error');
const { createRestServer } = require('./rest');
const { createWebsocketServer } = require('./websocket');
const server = {
    rest: null,
    ws: null,
    endpoints: {},
    response_content_type: 'application/json',
}

const requestLogic = (package_name, method_path, execution_data) => {
    try {
        let logic = server.endpoints[package_name];
        method_path.forEach(road => logic = logic[road]);
        if (typeof logic !== 'function') throw Error();
        return logic(execution_data);
    } catch (e) {
        return critError('UndefinedEndpoint', e);
    }
}

exports.assignLogic = (package_name, logic) => {
    server.endpoints[package_name] = logic;
}

exports.create = () => {
    try {
        const server = createRestServer(requestLogic);
        createWebsocketServer(server, requestLogic);
    } catch (e) {
        critError('ServerError', e);
    }
}



