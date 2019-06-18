const { Schema } = require('mongoose');
module.exports = new Schema({
    created_at: { type: Date, default: Date.now },
    user_id: { type: String },
    text: { type: String },
    questionnary_id: { type: String },
});