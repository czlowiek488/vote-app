const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vote-app', { useNewUrlParser: true });
const config = {
    schema_paths: ['question', 'questionnary', 'vote'],
    schema_path: './schema/'
}

const logger = obj => new Proxy(obj, {
    get: (target, key) =>
        typeof target[key] !== 'function'
            ? console.log("\x1b[31m", '-DB', target.modelName, key, 'NOT A FUNCTION', "\x1b[0m")
            || target[key]
            : (...args) =>
                console.log("\x1b[35m", '-DB: ', target.modelName, '.', key, JSON.stringify(args), "\x1b[0m")
                || target[key](...args)

})

const createModel = (model_name) => logger(mongoose.model(model_name, require(config.schema_path + model_name)));
const init = path => exports[path] = createModel(path);
config.schema_paths.forEach(init);

