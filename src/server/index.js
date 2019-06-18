const http = require('http');
const session = require('./session')
const server = {
    connection: null,
    endpoints: {},
    response_content_type: 'application/json',
    error: { error: true },
    allowedMethods: ['POST'],
    isAllowedMethod: (req, res) => !server.allowedMethods.includes(req.method)
        ? res.end(JSON.stringify({ error: 'Request method not allowed!' }))
        : null
}

const requestLogic = (package_name, method_path, execution_data) => {
    try {
        let logic = server.endpoints[package_name];
        method_path.forEach(road => logic = logic[road]);
        if (typeof logic === 'function') return logic(execution_data);
        throw Error();
    } catch (e) {
        return () => server.error;
    }
}

const handlePost = request => new Promise(resolve => {
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))))
})

const handleRequest = async (request, response) => {
    response.writeHead(200, { 'Content-Type': server.response_content_type });
    server.isAllowedMethod(request, response);
    const [, package_name, ...method_path] = request.url.split('/');
    const id = request.headers['x-auth-token'] || session.new();
    const execution_data = {
        data: await handlePost(request),
        session: session.get(id)
    }
    const result = await requestLogic(package_name, method_path, execution_data);
    response.end(JSON.stringify({ result, session: session.get(id) }));
}

exports.assignLogic = (package_name, logic) => {
    server.endpoints[package_name] = logic;
}

exports.create = () => {
    server.connection = http.createServer(handleRequest);
    server.connection.listen(7000);
}


