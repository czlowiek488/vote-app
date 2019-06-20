const storage = new Map();
const sha1 = require('sha1')
const defaultSession = {};
exports.get = id => {
    let session = storage.get(sha1(id));
    if (typeof session === 'undefined') {
        session = defaultSession;
        storage.set(sha1(id), session);
    }
    return { ...session, id };
}