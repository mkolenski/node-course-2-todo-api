require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

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

// POST /users
// similar to post /todos to create new to do
// use pick instead of pulling individual properties
// pass to constructor
// shut down server??
// wipe DB??
// restart??
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth',token).send(user);
  }).catch((e) => {
    console.log('400 here?', e);
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth',token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

// send back body data

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
