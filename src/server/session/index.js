const storage = new Map();
const sha1 = require('sha1')
const defaultSession = {};
let counter = 0;
exports.new = () => {
    const id = sha1((new Date()).getTime() + counter++);
    storage.set(id, defaultSession);
    return id;
}
exports.get = id => ({ ...storage.get(id), id })