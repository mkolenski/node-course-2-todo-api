var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.send(400).send(e);
  });
});

// GET /todos/1234324
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
    // validate with isValid (else respond 404 with empty body)
  if (!ObjectID.isValid(id)) {
    console.log('not valid');
    return res.status(404).send();
  }
  else {
    // findById
    console.log('valid');
    Todo.findById(id).then((todo) => {
      // success
      if (todo)// if todo - send back
        res.send({todo});
      else {// if none -- send back 404 empty body
        res.status(404).send();
        }
  }).catch((e) => {// error
    // 400 - no body
    res.status(400).send();
  });
};
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};
