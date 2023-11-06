const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
//Importing the function that will be used within a getter to format date strings
const formatDate  = require('../utils/formatDate');
//Importing plug-ins in order to be able to compute virtual properties and use getters when retrieving 'lean' documents
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const mongooseLeanGetters = require('mongoose-lean-getters');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            trim: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: function () {
                return formatDate(this.createdAt);
            }
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);
//Defining a getter for the 'reactionCount' virtual property.
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length;
    });
//Attaching the plug-ins to the schema.
thoughtSchema.plugin(mongooseLeanVirtuals);
thoughtSchema.plugin(mongooseLeanGetters);
// Compiling/initializing the Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
