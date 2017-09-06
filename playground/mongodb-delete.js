// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDb server');
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Users').deleteMany({name: 'Mark Kolenski'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  db.collection('Users').deleteOne({_id:new ObjectID("59b0537007414903104e40cb")}).then((result) => {
    console.log(result);
  });

  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed:false}).then((result) => {
  //   console.log(result);
  // });

  // db.close();
});
