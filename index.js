const server = require('./core/server');

server.create();
server.assignLogic('vote', require('./src/vote'));