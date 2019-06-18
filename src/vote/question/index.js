const { questionnary, question, vote } = require('../../db');
const { flatten } = require('lodash');

/**
 * @typedef Question
 * @type {Object}
 * @prop {string} text
 * @prop {number} id
 */

exports.vote = async ({ data: { question_id }, session: { id: user_id } }) => {
    const quest = await question.findOne({ _id: question_id });
    if (quest === null) return { error: 'Question not found!' }
    const previous_vote = await vote.findOne({ user_id, question_id })
    if (previous_vote !== null) return { error: 'Already Voted' }
    return vote.create({ user_id, question_id });
}

exports.result = async ({ data: { _id, with_answers = false } }) => {
    const response = {
        questions: await question.find({ questionnary_id: _id })
    };
    if (with_answers) response.answers = flatten(await Promise.all(response.questions.map(({ _id }) => vote.find({ question_id: _id }))))
    return response;
}
exports.revote = async ({ data: { _id, question_id }, session }) => {
    const previous_vote = await vote.findOne({ _id, user_id: session.id });
    if (previous_vote === null) return { error: 'Vote not found!' };
    await vote.deleteOne({ _id });
    return this.vote({ data: { question_id }, session })
}

exports.create = async ({ data }) => question.create(data);
exports.update = async ({ data: { _id, ...quest } }) => {
    await question.updateOne({ _id }, quest)
    return question.findOne({ _id });
};