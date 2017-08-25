var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name : { type : String, required : true },
  owner: { type : Number, required : true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', schema);
