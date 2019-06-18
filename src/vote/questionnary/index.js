const { questionnary } = require('../../db')
/**
 * @typedef Questionnary
 * @type {Object}
 * @prop {Question[]}
 * @prop {number} id
 * @prop {string} title
 */

exports.create = async ({ data: { title }, session: { id: user_id } }) => questionnary.create({ title, user_id });
exports.update = async ({ data: { _id, ...update }, session: { id: user_id } }) => {
    await questionnary.updateOne({ _id, user_id }, update);
    return questionnary.findOne({ _id, user_id });
}
exports.read = async ({ data: { _id } }) => questionnary.findOne({ _id });