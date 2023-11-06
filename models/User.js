const { Schema, model } = require('mongoose');
//Importing plug-ins in order to be able to compute virtual properties and use getters when retrieving 'lean' documents
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const mongooseLeanGetters = require('mongoose-lean-getters');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            //Regular expression to validate a user-entered email address
            match: /^([\w\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        },
        //Array to be populated by ids of the thoughts created by the user
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'thought',
        }],
        //Array to be populated by the auto-generated ids of other users that the user has added as friends
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'user',
        }]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);
//Defining a getter for the 'friendCount' virtual property.
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });
//Attaching the plug-ins to the schema.
userSchema.plugin(mongooseLeanVirtuals);
userSchema.plugin(mongooseLeanGetters);

// Compiling/initializing the User model
const User = model('user', userSchema);

module.exports = User;