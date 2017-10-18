const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

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

app.delete('/todos/:id', (req, res) => {
  // get the id

  // validate the id -> not valid return 404

  // remove todo from id
    // success
      // if no doc send 404
      // if doc, send back with 200

    // error
      // 400 with empty body
      var id = req.params.id;
        // validate with isValid (else respond 404 with empty body)
      if (!ObjectID.isValid(id)) {
        console.log('not valid');
        return res.status(404).send();
      }
      else {
        console.log('valid');
        Todo.findByIdAndRemove(id).then((todo) => {
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

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    console.log(e);
    res.status(400).send();
  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
