const mongoose = require('mongoose');
const { urlDb } = require('../config');

mongoose
  .connect(urlDb)
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error));

const db = mongoose.connection;

module.exports = db;
