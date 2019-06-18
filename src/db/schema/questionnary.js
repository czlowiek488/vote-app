const { Schema } = require('mongoose');
module.exports = new Schema({
    created_at: { type: Date, default: Date.now },
    user_id: { type: String },
    title: { type: String },
});