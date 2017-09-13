// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDb server');
  }
  console.log('Connected to MongoDB server');

// db.collection('Todos').findOneAndUpdate({
//   _id: new ObjectID("59b0693c8336b04f5fb335e5")
// }, {
//   $set: {
//     completed: true
//   }
//   }, {
//     returnOriginal: false
//   }).then((result) => {
//     console.log(result);
//   });

db.collection('Users').findOneAndUpdate({
  _id: new ObjectID("59af14c1b65efb1d8c957a0a")
}, {
  $set: {
    name: 'Jen'
  },
  $inc: {age:1}
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  // db.close();
});
