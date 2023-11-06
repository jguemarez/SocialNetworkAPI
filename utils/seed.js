const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomUserName, getRandomThought, getRandomReactions, getRandomDomain, getRandomArrItem } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Delete the collections if they exist
  let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
  if (thoughtCheck.length) {
    await connection.dropCollection('thoughts');
  }

  let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
  if (userCheck.length) {
    await connection.dropCollection('users');
  }
//These arrays will hold the POJOs (Plain-Old JavaScript Objects) needed to create the documents for the 'users' and 'thoughts' collections.
  const users = [];
  const allThoughts = [];

//Building 10 user-objects as well as 1 to 3 thought-objects that will be associated to each user.
  for (let i = 0; i < 10; i++) {
    const username = getRandomUserName();
    const email = `${username}@${getRandomDomain()}.com`;
    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
      const thoughtText = getRandomThought(5);
      const thought = {
        thoughtText,
        username,
      };
//Every randomly created thought for every randomly created user gets pushed into the allThoughts array.
      allThoughts.push(thought);
    };
    const user = {
      username,
      email
    };

    users.push(user);
  };
//Using the .insertMany Mongoose method in order to populate the 'thoughts' collection with documents that map in 1-1 fashion to the thought-objects that are the elements of the allThoughts array.
  await Thought.collection.insertMany(allThoughts);
//Adding the 'thoughts' array property to each user: it contains the '_id' of each thought whose 'username' property matches that of the user.
  for (const user of users) {
    user.thoughts = allThoughts.filter(thought => thought.username === user.username).map(({ _id }) => _id);
  };
//Using the .insertMany Mongoose method in order to populate the 'users' collection with documents that map in 1-1 fashion to the user-objects that are the elements of the users array.
  await User.collection.insertMany(users);
//Retieve all the _ids from all of the users documents
  const userData = await User.find().lean();
  const userIds = userData.map(user => user._id);
//Iterate through the userIds array in order to add a new friend (other than him/herself) to each user
  for (const id of userIds) {
    const otherIds = userIds.filter(_id => _id !== id);
    const newFriend = getRandomArrItem(otherIds);
    //The 'friends' array-valued property is created for each user using the following Mongoose method.
    await User.findOneAndUpdate({ _id: id }, { friends: [newFriend] });
  };
//We retrieve all thought-related documents and create an array of all available usernames in the database.
  const thoughtData = await Thought.find().lean();
  const userNames = userData.map(user => user.username);
//We use the previous two arrays in order to give each thought a randomly generated reaction by a user other than the author of the tought.
  for (const thought of thoughtData) {
    const otherUserNames = userNames.filter(name => name !== thought.username);
    await Thought.findOneAndUpdate({ _id: thought._id }, { reactions: getRandomReactions(1, otherUserNames) });
  };
//Informs you that the database has been seeded with sample data.
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
