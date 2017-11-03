const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},
{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test a todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    })
  })

  it('should not create todo with invalid body data', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    })
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done)
  });

  it ('should return 404 if todo not found', (done) => {
    // make sure you get a 404
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  });

  it('should return a 404 for non-object ids', (done) => {
    // /todos/123
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done)
  })
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err,res) => {
      if (err) {
        return done(err);
      }

      // query db using findById toNotExist.
      Todo.findById(hexId).then((todo) => {
        // expect(null).toNotExist();  // pass todo arg from success handler
        expect(todo).toNotExist();
        // call done
        done();
      }).catch((e) => done(e));
    })
  });

  it('should return 404 if todo not found', (done) => {
    // make sure you get a 404
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
    .get(`/todos/123`)
    .expect(404)
    .end(done)
  });
});

describe('PATCH / todos/:id', () => {
  it('should update the todo', (done) => {
    // grab id of first item
    var hexId = todos[0]._id.toHexString();
    // update text and set completed = true
    request(app)
    .patch(`/todos/${hexId}`)
    .send({text:'new text',completed:true})
    .expect(200)
    .end(done)
    .expect((res) => {
      expect(res.body.todo.text).toBe('new text');
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    // custom assert text body text is changed, completed true, completed At a number (toBeA)
  });

  it('should clear completedAt when todo is not completed', (done)=> {
    // grab id of second todo item
    var hexId = todos[1]._id.toHexString();
    request(app)
    .patch(`/todos/${hexId}`)
    // update text, set completed false
    .send({text:'new text 2',completed:false})
    .expect(200)
    .end(done)
    .expect((res) => {
      expect(res.body.todo.text).toBe('new text 2');
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    // 200
    // text changed, completed false, completedAt is null (.toNotExist)
    });
  });
});
