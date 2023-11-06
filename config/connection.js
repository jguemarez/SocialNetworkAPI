const { connect, connection } = require('mongoose');
//Connecting to the MongoDn 'social_mediadb' database.
connect('mongodb://127.0.0.1:27017/social_mediadb');
//Exporting the connection for use in the seeding file and the file (the main index.js) that initializes the Express server.
module.exports = connection;
