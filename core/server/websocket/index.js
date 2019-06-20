const { server } = require('websocket');
const session_storage = require('core/session');
const { critError, connectionError } = require('core/error');
const storage = {
    connections: new Map(),
}

const handleMessage = (requestLogic, ws) => async message => {
    try {
        if (message.type !== 'utf8') throw Error('WrongMessageType');
        const { endpoint, package_name, data, message_id } = JSON.parse(message.utf8Data);
        if (typeof endpoint === 'undefined' || typeof package_name === 'undefined') throw Error('WrongMessageFormat');
        const session = session_storage.get(ws.remoteAddress);
        let response = await requestLogic(package_name, endpoint.split('/'), { data, session });
        if (typeof message_id === 'undefined') return;
        if (response.constructor.name === 'model') response = response.toObject(); //make sure response is not mongoose model object
        ws.send(JSON.stringify({ ...response, message_id, session }));
    } catch (e) {
        connectionError(e);
    }
};

const handleClose = (requestLogic, ws) => async (reasonCode, description) => {
    storage.connections.delete(ws.remoteAddress);
    console.log(reasonCode, description);
};

const handleConnection = requestLogic => ws => {
    try {
        storage.connections.set(ws.remoteAddress, ws);
        ws.on('close', handleClose(requestLogic, ws));
        ws.on('message', handleMessage(requestLogic, ws));
    } catch (e) {
        critError('ConnectionClosed', e);
        ws.close();
    }
}
exports.createWebsocketServer = (httpServer, requestLogic) => {
    const websocketServer = new server({ httpServer, autoAcceptConnections: true });
    websocketServer.on('connect', handleConnection(requestLogic, websocketServer));
};

exports.notify = (user_id, data) => {
    const ws = storage.connections.get(user_id);
    ws.send(JSON.stringify(data));
};
