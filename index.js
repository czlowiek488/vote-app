const server = require('./src/server');

server.create();
server.assignLogic('vote', require('./src/vote'));