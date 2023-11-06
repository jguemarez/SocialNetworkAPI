  const { Schema, Types } = require('mongoose');
//Importing the function that will be used within a getter to format date strings 
const formatDate = require('../utils/formatDate');
//Importing plug-in in order to be able to use the getter when retrieving 'lean' documents
const mongooseLeanGetters = require('mongoose-lean-getters');

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function () {
            return formatDate(this.createdAt);
        }
    }
},
    {
        toJSON: {
            getters: true,
        },
        id: false,
    });
//Attaching the plug-in to the schema.
reactionSchema.plugin(mongooseLeanGetters);
module.exports = reactionSchema;