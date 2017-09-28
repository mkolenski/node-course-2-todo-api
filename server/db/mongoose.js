var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_lnhpb44m:esdvndfl1jk6iofov2enmjt1mt@ds131480.mlab.com:31480/heroku_lnhpb44m' || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};

//
