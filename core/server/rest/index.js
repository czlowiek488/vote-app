const session = require('core/session');
const { createServer } = require('http');

const rest = {
    response_content_type: 'application/json',
    allowedMethods: ['POST', 'OPTIONS'],
    isAllowedMethod: (req, res) => !rest.allowedMethods.includes(req.method)
        ? res.end(JSON.stringify({ error: 'Request method not allowed!', method: req.method }))
        : null
}

const handleRestPost = request => new Promise(resolve => {
    const chunks = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))));
})

const handleRestRequest = (requestLogic) => async (request, response) => {
    response.writeHead(200, { 'Content-Type': rest.response_content_type });
    rest.isAllowedMethod(request, response);
    const [, package_name, ...method_path] = request.url.split('/');
    const id = request.connection.remoteAddress;
    const execution_data = {
        data: await handleRestPost(request),
        session: session.get(id)
    }
    console.log(method_path, execution_data);
    const result = await requestLogic(package_name, method_path, execution_data);
    response.end(JSON.stringify({ result, session: session.get(id) }));
}

exports.createRestServer = requestLogic => {
    const server = createServer(handleRestRequest(requestLogic));
    server.listen(7000);
    return server;
}