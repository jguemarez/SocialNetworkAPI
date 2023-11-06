//Importing the models and the schema
const User = require('./User');
const Thought = require('./Thought');
const reactionSchema = require('./Reaction');
//Exporting them
module.exports = { User, Thought, reactionSchema };
